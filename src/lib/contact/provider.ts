const ALLOWED_IP_HEADERS = ["cf-connecting-ip", "x-vercel-forwarded-for"];

export interface ContactProvider {
  workerUrl: string;
  authSecret: string;
  ipHeader: string;
}

/**
 * Server-only: returns the email provider settings when every required
 * variable is present and valid, otherwise null. The submit route and the
 * public config route share this so the form is only offered when a
 * submission could actually be delivered to the provider.
 */
export function readContactProvider(): ContactProvider | null {
  const {
    CF_WORKER_URL: workerUrl,
    CF_WORKER_AUTH_SECRET: authSecret,
    CONTACT_IP_HEADER: ipHeader,
  } = process.env;
  if (
    !workerUrl ||
    !authSecret ||
    !ipHeader ||
    !ALLOWED_IP_HEADERS.includes(ipHeader)
  )
    return null;
  try {
    if (new URL(workerUrl).protocol !== "https:") return null;
  } catch {
    return null;
  }
  return { workerUrl, authSecret, ipHeader };
}
