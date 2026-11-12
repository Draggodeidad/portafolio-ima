import { CloudflareEmailAdapter } from "@/lib/contact/adapters/cloudflare";
import { validateContact } from "@/lib/contact/validation";

const MAX_BYTES = 16 * 1024;

export async function POST(request: Request) {
  const {
    CF_WORKER_URL: url,
    CF_WORKER_AUTH_SECRET: secret,
    CONTACT_IP_HEADER: ipHeader,
  } = process.env;
  if (
    !url ||
    !secret ||
    !ipHeader ||
    !["cf-connecting-ip", "x-vercel-forwarded-for"].includes(ipHeader)
  )
    return Response.json({ error: "unavailable" }, { status: 503 });
  try {
    if (new URL(url).protocol !== "https:") throw new Error();
  } catch {
    return Response.json({ error: "unavailable" }, { status: 503 });
  }
  const ip = request.headers.get(ipHeader)?.trim();
  if (!ip || ip.length > 64 || !/^[0-9a-fA-F:.]+$/.test(ip))
    return Response.json({ error: "unavailable" }, { status: 503 });
  if (
    !/^application\/json(?:\s*;|\s*$)/i.test(
      request.headers.get("content-type") ?? "",
    )
  )
    return Response.json({ error: "content_type" }, { status: 415 });
  if (Number(request.headers.get("content-length")) > MAX_BYTES)
    return Response.json({ error: "too_large" }, { status: 413 });
  if (!request.body)
    return Response.json({ error: "invalid_json" }, { status: 400 });
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > MAX_BYTES) {
        await reader.cancel();
        return Response.json({ error: "too_large" }, { status: 413 });
      }
      chunks.push(value);
    }
    const bytes = new Uint8Array(size);
    let offset = 0;
    for (const chunk of chunks) {
      bytes.set(chunk, offset);
      offset += chunk.length;
    }
    const body: unknown = JSON.parse(new TextDecoder().decode(bytes));
    if (!body || typeof body !== "object" || Array.isArray(body))
      return Response.json({ error: "validation" }, { status: 422 });
    const { token, ...contact } = body as Record<string, unknown>;
    const parsed = validateContact(contact);
    if (!parsed.success) {
      const fields: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const field = issue.path[0];
        if (typeof field === "string" && !fields[field])
          fields[field] = ["required", "email", "tooShort", "tooLong"].includes(
            issue.message,
          )
            ? issue.message
            : "required";
      }
      return Response.json({ error: "validation", fields }, { status: 422 });
    }
    if (typeof token !== "string" || !token || token.length > 2048)
      return Response.json({ error: "verification" }, { status: 403 });
    const result = await new CloudflareEmailAdapter({
      workerUrl: url,
      authSecret: secret,
    }).send(parsed.data, token, ip);
    if (result.success) return Response.json({ ok: true });
    const status =
      result.error === "rate_limit"
        ? 429
        : result.error === "verification"
          ? 403
          : 502;
    return Response.json({ error: result.error }, { status });
  } catch {
    return Response.json({ error: "invalid_json" }, { status: 400 });
  }
}
