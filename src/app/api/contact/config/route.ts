export const dynamic = "force-dynamic";

export function GET() {
  return Response.json(
    { siteKey: process.env["NEXT_PUBLIC_TURNSTILE_SITE_KEY"] || null },
    { headers: { "Cache-Control": "no-store" } },
  );
}
