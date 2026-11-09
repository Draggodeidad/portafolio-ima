import { ResendEmailAdapter } from "./adapters/resend.mjs";

const WINDOW = 60 * 60 * 1000;
const LIMIT = 5;

// A single object per hashed IP serializes updates across Cloudflare locations.
export class ContactRateLimit {
  constructor(state) {
    this.state = state;
  }
  async fetch() {
    const now = Date.now();
    const allowed = await this.state.storage.transaction(async (txn) => {
      const entries = ((await txn.get("attempts")) ?? []).filter(
        (time) => time > now - WINDOW,
      );
      if (entries.length >= LIMIT) return false;
      entries.push(now);
      await txn.put("attempts", entries);
      await txn.setAlarm(now + WINDOW);
      return true;
    });
    return new Response(null, { status: allowed ? 204 : 429 });
  }
  async alarm() {
    await this.state.storage.transaction(async (txn) => {
      const entries = ((await txn.get("attempts")) ?? []).filter(
        (time) => time > Date.now() - WINDOW,
      );
      if (entries.length) {
        await txn.put("attempts", entries);
        await txn.setAlarm(entries[entries.length - 1] + WINDOW);
      } else {
        await txn.delete("attempts");
      }
    });
  }
}

async function authorized(header, secret) {
  if (!secret) return false;
  const encoder = new TextEncoder();
  const supplied = new Uint8Array(
    await crypto.subtle.digest("SHA-256", encoder.encode(header ?? "")),
  );
  const expected = new Uint8Array(
    await crypto.subtle.digest("SHA-256", encoder.encode(`Bearer ${secret}`)),
  );
  return crypto.subtle.timingSafeEqual(supplied, expected);
}

const worker = {
  async fetch(request, env) {
    if (request.method !== "POST") return new Response(null, { status: 405 });
    if (
      !(await authorized(request.headers.get("authorization"), env.AUTH_SECRET))
    )
      return new Response(null, { status: 401 });
    if (
      !env.TURNSTILE_SECRET ||
      !env.TURNSTILE_HOSTNAME ||
      !env.CONTACT_FROM ||
      !env.CONTACT_TO ||
      !env.RESEND_API_KEY ||
      !env.RATE_LIMIT
    )
      return new Response(null, { status: 503 });
    if (Number(request.headers.get("content-length")) > 16384)
      return new Response(null, { status: 413 });
    try {
      if (!request.body) return new Response(null, { status: 400 });
      const reader = request.body.getReader();
      const chunks = [];
      let size = 0;
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        size += value.byteLength;
        if (size > 16384) {
          await reader.cancel();
          return new Response(null, { status: 413 });
        }
        chunks.push(value);
      }
      const bytes = new Uint8Array(size);
      let offset = 0;
      for (const chunk of chunks) {
        bytes.set(chunk, offset);
        offset += chunk.length;
      }
      const data = JSON.parse(new TextDecoder().decode(bytes));
      if (
        typeof data.ip !== "string" ||
        !/^[0-9a-fA-F:.]{2,64}$/.test(data.ip) ||
        typeof data.token !== "string" ||
        data.token.length < 1 ||
        data.token.length > 2048 ||
        typeof data.name !== "string" ||
        data.name.length < 1 ||
        data.name.length > 100 ||
        /[\r\n]/.test(data.name) ||
        typeof data.email !== "string" ||
        data.email.length > 254 ||
        /[\r\n]/.test(data.email) ||
        typeof data.message !== "string" ||
        data.message.length < 10 ||
        data.message.length > 5000
      )
        return new Response(null, { status: 400 });
      const hash = await crypto.subtle.digest(
        "SHA-256",
        new TextEncoder().encode(data.ip),
      );
      const key = Array.from(new Uint8Array(hash), (byte) =>
        byte.toString(16).padStart(2, "0"),
      ).join("");
      const limit = await env.RATE_LIMIT.get(
        env.RATE_LIMIT.idFromName(key),
      ).fetch("https://rate-limit.internal/");
      if (!limit.ok) return new Response(null, { status: 429 });
      const verify = await fetch(
        "https://challenges.cloudflare.com/turnstile/v0/siteverify",
        {
          method: "POST",
          body: new URLSearchParams({
            secret: env.TURNSTILE_SECRET,
            response: data.token,
            remoteip: data.ip,
          }),
          signal: AbortSignal.timeout(5000),
        },
      );
      if (!verify.ok) return new Response(null, { status: 503 });
      const result = await verify.json();
      if (
        result.success !== true ||
        result.hostname !== env.TURNSTILE_HOSTNAME ||
        result.action !== "contact"
      )
        return new Response(null, { status: 403 });
      const accepted = await new ResendEmailAdapter({
        apiKey: env.RESEND_API_KEY,
        from: env.CONTACT_FROM,
        to: env.CONTACT_TO,
      }).send(data);
      if (!accepted) return new Response(null, { status: 503 });
      return Response.json({ ok: true });
    } catch {
      return new Response(null, { status: 503 });
    }
  },
};

export default worker;
