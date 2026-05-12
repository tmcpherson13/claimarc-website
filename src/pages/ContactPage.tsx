import { FormEvent, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { CalendarClock, CheckCircle2, Mail } from "lucide-react";
import Layout from "@/components/Layout";
import SeoHead from "@/components/SeoHead";
import Reveal from "@/components/marketing/Reveal";
import { Eyebrow } from "@/components/marketing/primitives";
import { COMPANY, services } from "@/config/site";

const roles = [
  "CFO / Finance executive",
  "VP / Director, Revenue Cycle",
  "Revenue Cycle Manager",
  "Controller / Treasury",
  "Patient Financial Services",
  "Other",
];

const volumes = [
  "Under 25k claims / month",
  "25k–100k claims / month",
  "100k–500k claims / month",
  "500k+ claims / month",
  "Not sure",
];

const serviceOptions = [
  "Claims Accelerator — payment in 1–2 days",
  "EOB Conversion — paper to 835",
  "ERA Processing — 835 normalization & posting",
  "The full platform",
  "Not sure yet — let's talk",
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const labelCls = "mb-1.5 block text-sm font-medium text-[var(--navy)]";
const inputCls =
  "w-full rounded-md border border-[var(--line)] bg-white px-3.5 py-2.5 text-sm text-[var(--navy)] outline-none transition-colors focus:border-[var(--cyan)] focus:ring-2 focus:ring-[var(--cyan)]/30";

const ContactPage = () => {
  const [params] = useSearchParams();
  const initialService = useMemo(() => {
    const s = params.get("service");
    if (s === "accelerator") return serviceOptions[0];
    if (s === "eob") return serviceOptions[1];
    if (s === "era") return serviceOptions[2];
    return "";
  }, [params]);

  const [form, setForm] = useState({
    name: "",
    email: "",
    organization: "",
    role: "",
    volume: "",
    service: initialService,
    message: "",
  });
  const [emailTouched, setEmailTouched] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const emailInvalid = emailTouched && form.email.length > 0 && !EMAIL_RE.test(form.email);
  const canSubmit = form.name.trim() && EMAIL_RE.test(form.email) && form.organization.trim();

  const set = (key: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    // No backend is wired yet — hand the request to the visitor's mail client
    // so the inquiry still reaches the team, then show a confirmation.
    const lines = [
      `Name: ${form.name}`,
      `Organization: ${form.organization}`,
      form.role && `Role: ${form.role}`,
      form.volume && `Claim volume: ${form.volume}`,
      form.service && `Interested in: ${form.service}`,
      "",
      form.message || "(no additional details)",
    ].filter(Boolean);
    const subject = encodeURIComponent(`Demo request — ${form.organization}`);
    const body = encodeURIComponent(lines.join("\n"));
    window.location.href = `mailto:${COMPANY.email}?subject=${subject}&body=${body}`;
    setSubmitted(true);
  };

  return (
    <Layout>
      <SeoHead
        title="Book a Demo — ClaimARC"
        description="Talk to the ClaimARC team about EOB conversion, ERA processing, and AI-powered claim payment acceleration. Book a 30-minute working session and see the model against your own numbers."
        path="/contact"
      />

      <section className="relative overflow-hidden bg-[var(--navy)]">
        <div
          className="pointer-events-none absolute inset-0 opacity-60"
          aria-hidden="true"
          style={{
            backgroundImage:
              "radial-gradient(55% 70% at 85% 0%, rgba(26,167,208,0.18), transparent 60%), radial-gradient(45% 60% at 0% 100%, rgba(132,189,0,0.12), transparent 60%)",
          }}
        />
        <div className="shell relative grid gap-12 py-20 md:py-24 lg:grid-cols-[1fr_1.1fr]">
          <Reveal>
            <Eyebrow tone="cyan" className="mb-5">Talk to ClaimARC</Eyebrow>
            <h1 className="text-balance text-4xl font-extrabold leading-[1.1] tracking-tight text-white md:text-5xl">
              Book a working session.
            </h1>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-white/70">
              Thirty minutes with our team — bring a recent claims or remittance file and
              we'll run it through the model with you. No slide deck, no obligation.
            </p>
            <ul className="mt-8 space-y-4 text-sm text-white/75">
              <li className="flex items-start gap-3">
                <CalendarClock size={18} className="mt-0.5 shrink-0 text-[var(--cyan)]" />
                <span>See payment acceleration timing and pricing against your own data.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-[var(--lime)]" />
                <span>Walk away with a sample 835 and a clear picture of the workflow fit.</span>
              </li>
              <li className="flex items-start gap-3">
                <Mail size={18} className="mt-0.5 shrink-0 text-[var(--cyan)]" />
                <span>
                  Prefer email?{" "}
                  <a href={`mailto:${COMPANY.email}`} className="font-semibold text-white underline underline-offset-4">
                    {COMPANY.email}
                  </a>
                </span>
              </li>
            </ul>
          </Reveal>

          <Reveal delay={120}>
            <div className="rounded-2xl bg-white p-7 shadow-[0_20px_60px_rgba(0,0,0,0.25)] md:p-8">
              {submitted ? (
                <div className="py-10 text-center">
                  <CheckCircle2 size={44} className="mx-auto text-[var(--lime)]" />
                  <h2 className="mt-4 text-2xl font-bold text-[var(--navy)]">Thanks — we're on it.</h2>
                  <p className="mt-3 text-sm leading-relaxed text-[var(--slate)]">
                    Your email client should have opened with the details prefilled. If it
                    didn't, just send a note to{" "}
                    <a href={`mailto:${COMPANY.email}`} className="font-semibold text-[var(--cyan)]">
                      {COMPANY.email}
                    </a>{" "}
                    and we'll get back to you within one business day.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label htmlFor="name" className={labelCls}>Name *</label>
                      <input id="name" required value={form.name} onChange={set("name")} className={inputCls} autoComplete="name" />
                    </div>
                    <div>
                      <label htmlFor="email" className={labelCls}>Work email *</label>
                      <input
                        id="email"
                        type="email"
                        required
                        value={form.email}
                        onChange={set("email")}
                        onBlur={() => setEmailTouched(true)}
                        className={`${inputCls} ${emailInvalid ? "border-red-400 focus:border-red-400 focus:ring-red-400/30" : ""}`}
                        autoComplete="email"
                      />
                      {emailInvalid && <p className="mt-1 text-xs text-red-500">Enter a valid email address.</p>}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="organization" className={labelCls}>Organization *</label>
                    <input id="organization" required value={form.organization} onChange={set("organization")} className={inputCls} autoComplete="organization" />
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label htmlFor="role" className={labelCls}>Your role</label>
                      <select id="role" value={form.role} onChange={set("role")} className={inputCls}>
                        <option value="">Select…</option>
                        {roles.map((r) => <option key={r} value={r}>{r}</option>)}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="volume" className={labelCls}>Monthly claim volume</label>
                      <select id="volume" value={form.volume} onChange={set("volume")} className={inputCls}>
                        <option value="">Select…</option>
                        {volumes.map((v) => <option key={v} value={v}>{v}</option>)}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="service" className={labelCls}>What are you most interested in?</label>
                    <select id="service" value={form.service} onChange={set("service")} className={inputCls}>
                      <option value="">Select…</option>
                      {serviceOptions.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className={labelCls}>Anything else we should know?</label>
                    <textarea id="message" rows={4} value={form.message} onChange={set("message")} className={`${inputCls} resize-none`} />
                  </div>

                  <button
                    type="submit"
                    disabled={!canSubmit}
                    className="w-full rounded-md bg-[var(--cyan)] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[var(--cyan-dk)] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Request a demo
                  </button>
                  <p className="text-center text-xs text-[var(--slate)]">
                    We'll only use your details to follow up about ClaimARC. No spam.
                  </p>
                </form>
              )}
            </div>
          </Reveal>
        </div>
      </section>

      {/* tiny service quick-links */}
      <div className="border-t border-[var(--line)] bg-[var(--mist)]">
        <div className="shell flex flex-wrap items-center gap-x-6 gap-y-2 py-5 text-sm">
          <span className="font-semibold text-[var(--navy)]">Exploring a specific service?</span>
          {services.map((s) => (
            <a key={s.to} href={s.to} className="text-[var(--cyan)] hover:text-[var(--cyan-dk)] hover:underline">
              {s.label}
            </a>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default ContactPage;
