import type { EmailAdapter, EmailPayload, EmailResult } from "../types";

type CloudflareConfig = { workerUrl: string; authSecret: string };

export class CloudflareEmailAdapter implements EmailAdapter {
  constructor(private readonly config: CloudflareConfig) {}

  async send(
    payload: EmailPayload,
    token: string,
    ip: string,
  ): Promise<EmailResult> {
    try {
      const response = await fetch(this.config.workerUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.config.authSecret}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...payload, token, ip }),
        signal: AbortSignal.timeout(12000),
      });
      if (response.ok) return { success: true };
      if (response.status === 429)
        return { success: false, error: "rate_limit" };
      if (response.status === 403)
        return { success: false, error: "verification" };
      return { success: false, error: "send_failed" };
    } catch {
      return { success: false, error: "send_failed" };
    }
  }
}
