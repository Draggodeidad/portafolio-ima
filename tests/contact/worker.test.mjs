import { test, afterEach } from "node:test";
import assert from "node:assert/strict";
import { timingSafeEqual } from "node:crypto";
import worker, {
  ContactRateLimit,
} from "../../workers/portfolio-contact-email/src/index.mjs";

crypto.subtle.timingSafeEqual = timingSafeEqual;
const originalFetch = globalThis.fetch;
afterEach(() => {
  globalThis.fetch = originalFetch;
});

function storage() {
  const values = new Map();
  const api = {
    get: async (key) => values.get(key),
    put: async (key, value) => values.set(key, value),
    setAlarm: async () => {},
    delete: async (key) => values.delete(key),
  };
  return { ...api, transaction: async (fn) => fn(api) };
}
function fixture({
  verification = { success: true, hostname: "localhost", action: "contact" },
  resendStatus = 200,
  resendError = false,
} = {}) {
  const requests = [];
  const limiters = new Map();
  const env = {
    AUTH_SECRET: "local-secret",
    TURNSTILE_SECRET: "test",
    TURNSTILE_HOSTNAME: "localhost",
    CONTACT_FROM: "contact@example.org",
    CONTACT_TO: "owner@example.org",
    RESEND_API_KEY: "test-key",
    RATE_LIMIT: {
      idFromName: (key) => key,
      get: (key) => {
        if (!limiters.has(key))
          limiters.set(key, new ContactRateLimit({ storage: storage() }));
        return { fetch: () => limiters.get(key).fetch() };
      },
    },
  };
  const input = {
    ip: "127.0.0.1",
    token: "test",
    name: "Visitor",
    email: "visitor@example.org",
    message: "A valid test message",
  };
  const request = (body = input, auth = "Bearer local-secret") =>
    new Request("https://worker.test", {
      method: "POST",
      headers: { authorization: auth, "content-type": "application/json" },
      body: JSON.stringify(body),
    });
  globalThis.fetch = async (url, options) => {
    if (url === "https://challenges.cloudflare.com/turnstile/v0/siteverify")
      return Response.json(verification);
    if (url === "https://api.resend.com/emails") {
      requests.push(options);
      if (resendError) throw new Error("network error");
      return Response.json(
        resendStatus === 200 ? { id: "test-id" } : { error: "rejected" },
        { status: resendStatus },
      );
    }
    throw new Error(`Unexpected external request: ${url}`);
  };
  return { env, input, request, requests };
}

test("authenticated verified requests send via Resend and rate limit after five", async () => {
  const f = fixture();
  assert.equal(
    (await worker.fetch(f.request(f.input, "wrong"), f.env)).status,
    401,
  );
  for (let i = 0; i < 5; i++)
    assert.equal((await worker.fetch(f.request(), f.env)).status, 200);
  assert.equal((await worker.fetch(f.request(), f.env)).status, 429);
  assert.equal(f.requests.length, 5);
  const sent = f.requests[0];
  assert.equal(sent.method, "POST");
  assert.equal(sent.headers.Authorization, "Bearer test-key");
  assert.deepEqual(JSON.parse(sent.body), {
    from: "Portafolio <contact@example.org>",
    to: ["owner@example.org"],
    reply_to: "visitor@example.org",
    subject: "Portafolio: mensaje de Visitor",
    text: "Nombre: Visitor\nCorreo: visitor@example.org\n\nA valid test message",
  });
});
test("failed Turnstile validation never calls Resend", async () => {
  const f = fixture({
    verification: { success: true, hostname: "wrong", action: "contact" },
  });
  assert.equal((await worker.fetch(f.request(), f.env)).status, 403);
  assert.equal(f.requests.length, 0);
});
test("invalid Turnstile attempts are limited per IP without calling Resend", async () => {
  const f = fixture({ verification: { success: false } });
  for (let i = 0; i < 5; i++)
    assert.equal((await worker.fetch(f.request(), f.env)).status, 403);
  assert.equal((await worker.fetch(f.request(), f.env)).status, 429);
  assert.equal(
    (await worker.fetch(f.request({ ...f.input, ip: "127.0.0.2" }), f.env))
      .status,
    403,
  );
  assert.equal(f.requests.length, 0);
});
test("missing API key fails closed", async () => {
  const f = fixture();
  assert.equal(
    (await worker.fetch(f.request(), { ...f.env, RESEND_API_KEY: "" })).status,
    503,
  );
  assert.equal(f.requests.length, 0);
});
for (const config of [
  { resendStatus: 429 },
  { resendStatus: 500 },
  { resendError: true },
]) {
  test(`Resend failure ${JSON.stringify(config)} never reports success`, async () => {
    const f = fixture(config);
    assert.equal((await worker.fetch(f.request(), f.env)).status, 503);
    assert.equal(f.requests.length, 1);
  });
}
