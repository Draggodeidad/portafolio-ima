/**
 * Development-only stand-in for the contact service, to replay the send
 * animation without sending email or solving Turnstile:
 *
 *   ?mockContact=success   answers in 0.6 s, before the plane is folded
 *   ?mockContact=error     fails after 1.5 s, once the plane is folded
 *   ?mockContact=slow      answers after 3 s, so the plane waits
 *   &mockSpeed=0.25        plays the animation four times slower
 *
 * The form imports this module only behind a NODE_ENV check, so production
 * builds drop it.
 */

const MODES = ["success", "error", "slow"] as const;
type MockMode = (typeof MODES)[number];

const LATENCY: Record<MockMode, number> = {
  success: 600,
  error: 1500,
  slow: 3000,
};

export type ContactMock = {
  mode: MockMode;
  /** Animation time scale, 0.1 to 1. */
  speed: number;
  /** Resolves like `fetch("/api/contact")` would. */
  send: () => Promise<Response>;
};

export function createContactMock(params: URLSearchParams): ContactMock | null {
  const mode = params.get("mockContact");
  if (!MODES.includes(mode as MockMode)) return null;
  const requested = Number(params.get("mockSpeed"));
  const speed = requested >= 0.1 && requested <= 1 ? requested : 1;
  return {
    mode: mode as MockMode,
    speed,
    send: () =>
      new Promise((resolve) =>
        setTimeout(
          () =>
            resolve(
              mode === "error"
                ? Response.json({ error: "provider" }, { status: 502 })
                : Response.json({ ok: true }),
            ),
          LATENCY[mode as MockMode] / speed,
        ),
      ),
  };
}
