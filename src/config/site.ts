// Single source of truth for ClaimARC marketing site navigation + metadata.

import { Banknote, FileStack, RefreshCw, Scale, type LucideIcon } from "lucide-react";

export const SITE_URL = "https://www.claimarc.com";

export const COMPANY = {
  name: "ClaimARC",
  legal: "Retrieve Remit, LLC",
  tagline: "Get paid in 1 business day.",
  arc: "Acceleration · Receivables · Contracts",
  email: "info@claimarc.com",
};

export interface NavItem {
  label: string;
  to: string;
}

export interface ServiceNavItem extends NavItem {
  /** Short benefit line shown under the service name in the mega-menu. */
  blurb: string;
  /** Color token used for the icon background and accent stripe. */
  accent: string;
  icon: LucideIcon;
}

// Primary services — Acceleration leads; the others feed it.
// URL path /eob-conversion preserved to avoid breaking inbound links and SEO.
export const services: ServiceNavItem[] = [
  {
    label: "Claims Accelerator",
    to: "/accelerator",
    blurb: "Get paid in 1 business day, priced by AI per claim.",
    accent: "var(--lime)",
    icon: Banknote,
  },
  {
    label: "Claim to Cash Conversion",
    to: "/eob-conversion",
    blurb: "Paper EOBs become clean 835s — 99.7% accuracy.",
    accent: "var(--arc-2)",
    icon: FileStack,
  },
  {
    label: "ERA Processing",
    to: "/era-processing",
    blurb: "Electronic remittance normalized across every payer.",
    accent: "var(--arc-3)",
    icon: RefreshCw,
  },
  {
    label: "Contract Intelligence",
    to: "/contract-intelligence",
    blurb: "Benchmark payer contracts against real market rates.",
    accent: "var(--arc-1)",
    icon: Scale,
  },
];

export const primaryNav: NavItem[] = [
  { label: "Why ClaimARC", to: "/why-claimarc" },
  { label: "Insights", to: "/insights" },
  { label: "Our Story", to: "/our-story" },
];

export const compliance = [
  "SOC 2 Type II",
  "HIPAA Compliant",
  "Patent Pending",
];
