// Leadership team — single source of truth.
//
// TODO: replace these placeholder bios + photos with content from
// https://www.claimarc.com (the network-blocked fetch couldn't auto-pull them
// in this build). Drop photo URLs straight from claimarc.com — they belong to
// the company, so hot-linking is fine, or copy the images into /public/team/
// and reference them as "/team/<filename>".
//
// Shape:
//   - name:    full display name
//   - role:    job title shown under the name
//   - bio:     1–2 sentences, gets rendered into the bio paragraph
//   - photo:   absolute URL or /public-relative path; falls back to initials
//              if left blank
//   - linkedin (optional): linkedin profile URL — renders a LinkedIn icon link

export type LeaderProfile = {
  name: string;
  role: string;
  bio: string;
  photo?: string;
  linkedin?: string;
};

export const leadership: LeaderProfile[] = [
  {
    name: "Founder & CEO",
    role: "Chief Executive Officer",
    bio: "Two decades in healthcare revenue cycle and capital markets. Pioneered the patent-pending claim valuation methodology that powers the ClaimARC Accelerator.",
    photo: "",
  },
  {
    name: "Chief Operating Officer",
    role: "Operations & Client Success",
    bio: "Brings deep operational expertise scaling revenue cycle services across hospitals, ambulatory groups, and specialty practices nationwide.",
    photo: "",
  },
  {
    name: "Chief Technology Officer",
    role: "AI & Platform Engineering",
    bio: "Leads ClaimARC's AI data-lifting, scoring, and reconciliation engines. Background spans applied machine learning, financial systems, and healthcare interoperability.",
    photo: "",
  },
  {
    name: "Chief Financial Officer",
    role: "Capital & Risk",
    bio: "Architects ClaimARC's acceleration capital structure and risk framework. Career spanning institutional finance, healthcare lending, and fintech treasury.",
    photo: "",
  },
];
