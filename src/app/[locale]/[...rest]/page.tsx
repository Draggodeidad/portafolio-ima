import { notFound } from "next/navigation";

// Use the router's explicit 404 path in both Next and vinext. vinext 1.4.4's
// unmatched-route fallback can return a "Not Found" body with HTTP 200.
export default function UnknownPage() {
  notFound();
}
