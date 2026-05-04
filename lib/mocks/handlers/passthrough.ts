import { http, passthrough } from "msw";

/**
 * Catch-all handler that explicitly tells MSW to let any non-/api/v1 request
 * (Next.js RSC payloads, devtools, static assets, ...) reach the network.
 *
 * Without this, MSW falls into its implicit "bypass" path, which on Next.js
 * App Router intermittently throws `TypeError: Failed to fetch` for RSC
 * prefetch requests during client navigation.
 *
 * This must be registered LAST so concrete /api/v1 handlers match first.
 */
export const passthroughHandlers = [
  http.all("*", ({ request }) => {
    const url = new URL(request.url);
    if (url.pathname.startsWith("/api/v1")) {
      // No response → MSW marks as unhandled; the onUnhandledRequest callback
      // in init.tsx will warn so we notice missing /api/v1 handlers.
      return;
    }
    return passthrough();
  }),
];
