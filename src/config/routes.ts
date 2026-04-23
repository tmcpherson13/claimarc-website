// Single source of truth for primary marketing routes.
// Consumed by Navbar and Footer so labels can be updated in one place.
// NOTE: We intentionally keep the existing /solutions path while displaying
// the public label "Who It's For" to avoid breaking inbound links.
// When the production domain (https://zdefense.ai) is live, update SITE_URL
// below and remove the noindex robots meta on each page.

export const SITE_URL = "https://z-defense-website.lovable.app";

export interface MarketingRoute {
  label: string;
  to: string;
}

export const marketingRoutes: MarketingRoute[] = [
  { label: "Home", to: "/" },
  { label: "Platform", to: "/platform" },
  { label: "Why ZDefense", to: "/why-zdefense" },
  { label: "Who It's For", to: "/solutions" },
  { label: "Pricing", to: "/pricing" },
  { label: "Contact", to: "/contact" },
];

// Footer "Platform" column — excludes Home + Contact (Contact lives in the
// Company column).
export const footerPlatformRoutes: MarketingRoute[] = marketingRoutes.filter(
  (r) => r.to !== "/" && r.to !== "/contact",
);
