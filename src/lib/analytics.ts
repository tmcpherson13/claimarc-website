// Plausible analytics helper.
// The `tagged-events` script is loaded in index.html and exposes window.plausible
// once it has finished loading. This helper is safe to call before that happens
// (it simply no-ops) and safe in non-browser/SSR contexts.

declare global {
  interface Window {
    plausible?: (
      eventName: string,
      options?: { props?: Record<string, string | number | boolean> }
    ) => void;
  }
}

export type EventProps = Record<string, string | number | boolean>;

/**
 * Track a custom Plausible event.
 *
 * @example
 *   trackEvent("CTA_Click", { location: "navbar", cta: "book_demo" });
 */
export const trackEvent = (eventName: string, props?: EventProps): void => {
  if (typeof window === "undefined") return;
  try {
    window.plausible?.(eventName, props ? { props } : undefined);
  } catch {
    // Never let analytics break the app.
  }
};

export {};
