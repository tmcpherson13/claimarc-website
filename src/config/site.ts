// Single source of truth for ClaimARC marketing site navigation + metadata.

export const SITE_URL = "https://www.claimarc.com";

export const COMPANY = {
  name: "ClaimARC",
  legal: "Retrieve Remit, LLC",
  tagline: "Precision valuation. Lightning acceleration.",
  arc: "Acceleration · Receivables · Contracts",
  email: "info@claimarc.com",
};

export interface NavItem {
  label: string;
  to: string;
}

// Primary services — Acceleration leads; the others feed it.
// URL path /eob-conversion preserved to avoid breaking inbound links and SEO.
export const services: NavItem[] = [
  { label: "Claims Accelerator", to: "/accelerator" },
  { label: "Claim to Cash Conversion", to: "/eob-conversion" },
  { label: "ERA Processing", to: "/era-processing" },
];

export const primaryNav: NavItem[] = [
  { label: "Why ClaimARC", to: "/why-claimarc" },
  { label: "Leadership", to: "/leadership" },
  { label: "Contact", to: "/contact" },
];

export const compliance = [
  "SOC 2 Type II",
  "HIPAA Compliant",
  "Patent Pending",
];
