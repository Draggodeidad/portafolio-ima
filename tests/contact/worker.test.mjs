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
    deleteAll: async () => values.clear(),
  };
  return { ...api, transaction: async (fn) => fn(api) };
}
function fixture() {
  let sent = 0;
  const limiter = new ContactRateLimit({ storage: storage() });
  const env = {
    AUTH_SECRET: "local-secret",
    TURNSTILE_SECRET: "test",
    TURNSTILE_HOSTNAME: "localhost",
    CONTACT_FROM: "contact@example.org",
    CONTACT_TO: "owner@example.org",
    EMAIL: {
      send: async () => {
        sent++;
      },
    },
    RATE_LIMIT: {
      idFromName: (key) => key,
      get: () => ({ fetch: () => limiter.fetch() }),
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
  return { env, input, request, sent: () => sent };
}
test("auth, verification and the distributed limit gate email", async () => {
  const f = fixture();
  globalThis.fetch = async () =>
    Response.json({ success: true, hostname: "localhost", action: "contact" });
  assert.equal(
    (await worker.fetch(f.request(f.input, "wrong"), f.env)).status,
    401,
  );
  for (let i = 0; i < 5; i++)
    assert.equal((await worker.fetch(f.request(), f.env)).status, 200);
  assert.equal((await worker.fetch(f.request(), f.env)).status, 429);
  assert.equal(f.sent(), 5);
});
test("failed verification never sends", async () => {
  const f = fixture();
  globalThis.fetch = async () =>
    Response.json({ success: true, hostname: "wrong", action: "contact" });
  assert.equal((await worker.fetch(f.request(), f.env)).status, 403);
  assert.equal(f.sent(), 0);
});
test("missing configuration and provider failure fail closed", async () => {
  const f = fixture();
  assert.equal(
    (await worker.fetch(f.request(), { ...f.env, TURNSTILE_SECRET: "" }))
      .status,
    503,
  );
  globalThis.fetch = async () =>
    Response.json({ success: true, hostname: "localhost", action: "contact" });
  f.env.EMAIL.send = async () => {
    throw new Error("unavailable");
  };
  assert.equal((await worker.fetch(f.request(), f.env)).status, 503);
});
