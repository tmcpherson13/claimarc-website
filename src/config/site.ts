// Single source of truth for ClaimARC marketing site navigation + metadata.

export const SITE_URL = "https://www.claimarc.com";

export const COMPANY = {
  name: "ClaimARC",
  legal: "Retrieve Remit, LLC",
  tagline: "Precision valuation. Lightning acceleration.",
  arc: "Acceleration · Receivables · Contracts",
  email: "hello@claimarc.com",
};

export interface NavItem {
  label: string;
  to: string;
}

// Primary services — used by the navbar dropdown, footer, and home page.
export const services: NavItem[] = [
  { label: "EOB Conversion", to: "/eob-conversion" },
  { label: "ERA Processing", to: "/era-processing" },
  { label: "Claims Accelerator", to: "/accelerator" },
];

export const primaryNav: NavItem[] = [
  { label: "Why ClaimARC", to: "/why-claimarc" },
  { label: "Contact", to: "/contact" },
];

export const compliance = [
  "SOC 2 Type II",
  "ISO 27001",
  "HIPAA Compliant",
  "Patent Pending",
];
