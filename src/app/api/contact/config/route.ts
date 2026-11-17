import { readContactProvider } from "@/lib/contact/provider";

export const dynamic = "force-dynamic";

/**
 * Publishes the Turnstile site key only when the email provider is fully
 * configured. A null key tells the client not to render the contact form.
 */
export function GET() {
  const siteKey = process.env["NEXT_PUBLIC_TURNSTILE_SITE_KEY"] || null;
  return Response.json(
    { siteKey: siteKey && readContactProvider() ? siteKey : null },
    { headers: { "Cache-Control": "no-store" } },
  );
}
