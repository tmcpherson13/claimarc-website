import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Layout from "@/components/Layout";
import SeoHead from "@/components/SeoHead";

const payerList = [
  "UHC (United Health Care)",
  "BCBS (Blue Cross Blue Shield)",
  "Aetna",
  "Cigna",
  "Humana",
  "Medicare (Traditional / Fee-for-Service)",
  "Medicare Advantage",
  "Medicaid (State-administered)",
  "Tricare",
  "Workers Compensation",
  "Molina Healthcare",
  "Centene / WellCare",
  "Other",
];

const fieldClass =
  "w-full border border-slate-300 rounded px-3 py-2 text-sm focus-visible:outline-none focus-visible:border-[var(--emerald)] focus-visible:ring-2 focus-visible:ring-[var(--emerald)] bg-white";
const fieldErrorClass =
  "w-full border border-red-400 rounded px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 bg-white";
const labelClass = "text-slate-700 text-sm font-medium mb-1 block";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const Req = () => (
  <span className="text-[var(--emerald)]" aria-hidden="true">
    *
  </span>
);

const ContactPage = () => {
  const [searchParams] = useSearchParams();
  const formRef = useRef<HTMLDivElement>(null);
  const offersRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    organization: "",
    role: "",
    orgType: "",
    claimVolume: "",
    primaryChallenge: "",
    offerType: "",
    interestedInTrial: true,
    selectedPayers: [] as string[],
    otherPayer: "",
    message: "",
  });
  const [emailTouched, setEmailTouched] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const offer = searchParams.get("offer");
    const role = searchParams.get("role");
    const tier = searchParams.get("tier");
    const intent = searchParams.get("intent");

    setFormData((prev) => {
      const next = { ...prev };
      if (offer === "trial") next.offerType = "trial";
      if (offer === "demo") next.offerType = "demo";
      if (offer === "info") next.offerType = "info";
      if (role === "cfo") next.role = "CFO / Executive";
      if (role === "director") next.role = "Revenue Cycle Director";
      if (role === "manager") next.role = "Revenue Cycle Manager";
      if (role === "specialist") next.role = "Billing Specialist";
      if (role === "compliance") next.role = "Auditor/Compliance Officer";
      if (tier) next.message = `Interested in: ${tier} tier`;
      if (intent === "pricing") next.message = "Requesting pricing information";
      return next;
    });
  }, [searchParams]);

  const togglePayer = (p: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedPayers: prev.selectedPayers.includes(p)
        ? prev.selectedPayers.filter((x) => x !== p)
        : [...prev.selectedPayers, p],
    }));
  };

  const allSelected = formData.selectedPayers.length === payerList.length;
  const isInfo = formData.offerType === "info";
  const showPayers = !isInfo && (formData.offerType === "trial" || formData.interestedInTrial);

  const emailValid = EMAIL_RE.test(formData.email.trim());
  const emailInvalid = emailTouched && !emailValid;

  const requiredValid =
    formData.firstName.trim() &&
    formData.lastName.trim() &&
    emailValid &&
    formData.organization.trim() &&
    formData.role &&
    (isInfo || (formData.orgType && formData.claimVolume));

  const handleSubmit = () => {
    setEmailTouched(true);
    if (!requiredValid) return;
    setSubmitted(true);
  };

  const scrollToForm = (offer: "demo" | "trial" | "info") => {
    setFormData((prev) => ({ ...prev, offerType: offer }));
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const scrollToOffers = () => {
    offersRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const submitLabel =
    formData.offerType === "trial"
      ? "Start My 30-Day Evaluation — We'll Be in Touch Within One Business Day"
      : formData.offerType === "info"
      ? "Send My Request — We'll Respond Within One Business Day"
      : "Request My Demo — We'll Be in Touch Within One Business Day";

  const bannerLabel =
    formData.offerType === "demo"
      ? "You are requesting a personalized demo"
      : formData.offerType === "trial"
      ? "You are starting your 30-day evaluation"
      : formData.offerType === "info"
      ? "You are requesting more information"
      : "";

  return (
    <Layout>
      <SeoHead
        title="Contact ZDefense — Book a Demo or 30-Day Evaluation"
        description="Book a role-specific revenue cycle intelligence demo or start your 30-day evaluation with live payer data — no BAA, no IT involvement."
        path="/contact"
      />

      {/* SECTION 1: HERO */}
      <section className="bg-[var(--navy)] py-20 px-6 md:px-12 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-white text-3xl md:text-4xl font-bold max-w-3xl">
            See ZDefense Through the Lens of Your Team, Your Workflow, and Your
            Payer Mix.
          </h1>
          <p className="text-slate-300 text-lg max-w-2xl mt-4">
            We'll tailor the demo to your role, workflow, payer mix, and
            biggest revenue challenge. CFOs see Forecast. Billing Specialists
            see Triage.
          </p>
          <p className="text-slate-400 text-sm max-w-2xl mt-3">
            Your request will be routed to the modules most relevant to your role and payer mix.
          </p>
        </div>
      </section>

      {/* SECTION 2: TWO-OFFER CARDS */}
      <section ref={offersRef} className="bg-white py-16 px-6 md:px-12 lg:px-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="bg-[var(--lgray)] border-2 border-[var(--navy)] rounded-xl p-8 flex flex-col">
            <h2 className="text-[var(--navy)] font-bold text-2xl">
              Book a Personalized Demo
            </h2>
            <p className="text-slate-600 mt-3">
              A guided walkthrough of the modules that matter to your role,
              your payers, and your biggest revenue challenge.
            </p>
            <ul className="mt-4 space-y-2 text-slate-700 text-sm">
              <li className="flex gap-2"><span className="text-[var(--emerald)] font-bold" aria-hidden="true">✓</span> 30–45 minutes</li>
              <li className="flex gap-2"><span className="text-[var(--emerald)] font-bold" aria-hidden="true">✓</span> Role-specific</li>
              <li className="flex gap-2"><span className="text-[var(--emerald)] font-bold" aria-hidden="true">✓</span> Payer-contextualized</li>
              <li className="flex gap-2"><span className="text-[var(--emerald)] font-bold" aria-hidden="true">✓</span> Includes a custom recovery projection</li>
            </ul>
            <button
              type="button"
              onClick={() => scrollToForm("demo")}
              className="plausible-event-name=CTA_Click plausible-event-location=contact_offer_card plausible-event-cta=book_demo bg-[var(--navy)] text-white w-full py-3 rounded font-semibold mt-auto pt-3 hover:bg-[var(--navy-dk)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--navy)] focus-visible:ring-offset-2"
              style={{ marginTop: "auto" }}
            >
              Book a Demo
            </button>
          </div>

          <div className="bg-[var(--emerald)] rounded-xl p-8 flex flex-col">
            <h2 className="text-[var(--navy)] font-bold text-2xl">
              30-Day No-Obligation Evaluation
            </h2>
            <p className="text-[var(--navy)]/80 mt-3">
              See your revenue cycle from the outside in — using live payer
              data benchmarked to your actual market.
            </p>
            <ul className="mt-4 space-y-2 text-[var(--navy)] text-sm">
              <li className="flex gap-2"><span className="font-bold" aria-hidden="true">✓</span> ContractIntel, Shield, and Prevent activate immediately</li>
              <li className="flex gap-2"><span className="font-bold" aria-hidden="true">✓</span> No BAA required</li>
              <li className="flex gap-2"><span className="font-bold" aria-hidden="true">✓</span> No IT involvement</li>
              <li className="flex gap-2"><span className="font-bold" aria-hidden="true">✓</span> Available for qualifying provider organizations</li>
            </ul>
            <button
              type="button"
              onClick={() => scrollToForm("trial")}
              className="plausible-event-name=CTA_Click plausible-event-location=contact_offer_card plausible-event-cta=start_trial bg-[var(--navy)] text-white w-full py-3 rounded font-semibold mt-auto pt-3 hover:bg-[var(--navy-dk)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--navy)] focus-visible:ring-offset-2"
              style={{ marginTop: "auto" }}
            >
              Start Your 30-Day Evaluation — No BAA Required
            </button>
          </div>

          <div className="bg-[var(--lgray)] border-2 border-slate-300 rounded-xl p-8 flex flex-col">
            <h2 className="text-[var(--navy)] font-bold text-2xl">
              Request More Information
            </h2>
            <p className="text-slate-600 mt-3">
              Not ready for a demo? Send us a question and we will get back
              to you within one business day. No call required.
            </p>
            <ul className="mt-4 space-y-2 text-slate-700 text-sm">
              <li className="flex gap-2"><span className="text-[var(--emerald)] font-bold" aria-hidden="true">✓</span> No commitment</li>
              <li className="flex gap-2"><span className="text-[var(--emerald)] font-bold" aria-hidden="true">✓</span> No call required</li>
              <li className="flex gap-2"><span className="text-[var(--emerald)] font-bold" aria-hidden="true">✓</span> Response within one business day</li>
              <li className="flex gap-2"><span className="text-[var(--emerald)] font-bold" aria-hidden="true">✓</span> We will send relevant resources for your role</li>
            </ul>
            <button
              type="button"
              onClick={() => scrollToForm("info")}
              className="plausible-event-name=CTA_Click plausible-event-location=contact_offer_card plausible-event-cta=request_info bg-[var(--navy)] text-white w-full py-3 rounded font-semibold mt-auto pt-3 hover:bg-[var(--navy-dk)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--navy)] focus-visible:ring-offset-2"
              style={{ marginTop: "auto" }}
            >
              Send Me More Information
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 3: FORM + TRUST BLOCK */}
      <section ref={formRef} className="bg-[var(--lgray)] py-20 px-6 md:px-12 lg:px-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12 max-w-6xl mx-auto">
          {/* LEFT COLUMN: FORM */}
          <div className="md:col-span-3">
            {submitted ? (
              <div
                role="status"
                aria-live="polite"
                className="bg-white border-l-4 border-[var(--emerald)] p-8 rounded-r-xl"
              >
                <h2 className="text-[var(--navy)] font-bold text-2xl">
                  You're on our list.
                </h2>
                <p className="text-slate-600 mt-3">
                  A ZTech team member will reach out within one business day
                  to schedule your personalized demo and recovery projection.
                  If you requested the 30-day no-obligation evaluation, we
                  will confirm your activation details in the same call.
                </p>
                <p className="text-slate-400 text-sm mt-3">
                  If you selected specific payers, we will have your live
                  benchmarking pre-configured before the call.
                </p>
              </div>
            ) : (
              <div>
                {formData.offerType && (
                  <div className="inline-flex items-center gap-3 bg-[var(--emerald)]/10 border border-[var(--emerald)]/30 text-[var(--navy)] text-sm rounded-full px-4 py-2 mb-6">
                    <span className="font-semibold">{bannerLabel}</span>
                    <button
                      type="button"
                      onClick={scrollToOffers}
                      className="text-[var(--emerald)] underline hover:no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--emerald)] rounded"
                    >
                      Change selection
                    </button>
                  </div>
                )}
                <h2 className="text-[var(--navy)] font-bold text-2xl mb-6">
                  Tell Us About Your Organization
                </h2>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="firstName" className={labelClass}>
                      First Name <Req />
                    </label>
                    <input
                      id="firstName"
                      type="text"
                      maxLength={80}
                      autoComplete="given-name"
                      aria-required="true"
                      className={fieldClass}
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className={labelClass}>
                      Last Name <Req />
                    </label>
                    <input
                      id="lastName"
                      type="text"
                      maxLength={80}
                      autoComplete="family-name"
                      aria-required="true"
                      className={fieldClass}
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label htmlFor="email" className={labelClass}>
                    Work Email <Req />
                  </label>
                  <input
                    id="email"
                    type="email"
                    maxLength={255}
                    autoComplete="email"
                    aria-required="true"
                    aria-invalid={emailInvalid}
                    aria-describedby={emailInvalid ? "email-error" : undefined}
                    className={emailInvalid ? fieldErrorClass : fieldClass}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    onBlur={() => setEmailTouched(true)}
                  />
                  {emailInvalid && (
                    <p id="email-error" className="text-red-600 text-xs mt-1">
                      Please enter a valid work email address.
                    </p>
                  )}
                </div>

                <div className="mb-4">
                  <label htmlFor="organization" className={labelClass}>
                    Organization <Req />
                  </label>
                  <input
                    id="organization"
                    type="text"
                    maxLength={120}
                    autoComplete="organization"
                    aria-required="true"
                    className={fieldClass}
                    value={formData.organization}
                    onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="role" className={labelClass}>
                    Title / Role <Req />
                  </label>
                  <select
                    id="role"
                    aria-required="true"
                    className={fieldClass}
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  >
                    <option value="" disabled>Select your role...</option>
                    <option>CFO / Executive</option>
                    <option>Revenue Cycle Director</option>
                    <option>Revenue Cycle Manager</option>
                    <option>Auditor/Compliance Officer</option>
                    <option>Billing Specialist</option>
                    <option>Other</option>
                  </select>
                </div>

                <div className="mb-4">
                  <label htmlFor="orgType" className={labelClass}>
                    Organization Type {!isInfo && <Req />}
                  </label>
                  {isInfo && (
                    <p className="text-slate-400 text-xs mb-1">
                      (optional — helps us send more relevant resources)
                    </p>
                  )}
                  <select
                    id="orgType"
                    aria-required="true"
                    className={fieldClass}
                    value={formData.orgType}
                    onChange={(e) => setFormData({ ...formData, orgType: e.target.value })}
                  >
                    <option value="" disabled>Select org type...</option>
                    <option>Hospital (50–300 beds)</option>
                    <option>Regional Health System (300+ beds)</option>
                    <option>IDN / Clearinghouse</option>
                    <option>Multi-Specialty Clinic</option>
                    <option>Billing Company</option>
                    <option>Other</option>
                  </select>
                </div>

                <div className="mb-4">
                  <label htmlFor="claimVolume" className={labelClass}>
                    Monthly Claim Volume <Req />
                  </label>
                  <select
                    id="claimVolume"
                    aria-required="true"
                    className={fieldClass}
                    value={formData.claimVolume}
                    onChange={(e) => setFormData({ ...formData, claimVolume: e.target.value })}
                  >
                    <option value="" disabled>Select volume...</option>
                    <option>Under 1,000</option>
                    <option>1,000–5,000</option>
                    <option>5,000–15,000</option>
                    <option>15,000+</option>
                    <option>Prefer not to say</option>
                  </select>
                </div>

                <div className="mb-4">
                  <label htmlFor="primaryChallenge" className={labelClass}>
                    Primary Challenge
                  </label>
                  <select
                    id="primaryChallenge"
                    className={fieldClass}
                    value={formData.primaryChallenge}
                    onChange={(e) => setFormData({ ...formData, primaryChallenge: e.target.value })}
                  >
                    <option value="">Select primary challenge (optional)</option>
                    <option>High denial rates</option>
                    <option>Underpayment / contract variance</option>
                    <option>Compliance / overpayment risk</option>
                    <option>Prior authorization burden</option>
                    <option>Revenue forecasting accuracy</option>
                    <option>Other</option>
                  </select>
                </div>

                {showPayers && (
                  <div>
                    <p className="text-[var(--emerald)] text-xs font-semibold uppercase tracking-widest mt-6 mb-1">
                      YOUR PAYER MIX
                    </p>
                    <p className="text-slate-600 text-sm mb-3">
                      Select the payers you work with most. We will
                      pre-configure your live benchmarking before your
                      activation call.
                    </p>
                    <button
                      type="button"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          selectedPayers: allSelected ? [] : [...payerList],
                        })
                      }
                      className="text-[var(--emerald)] text-sm underline cursor-pointer mb-3 inline-block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--emerald)] rounded"
                    >
                      {allSelected ? "Deselect All" : "Select All"}
                    </button>
                    <div className="grid grid-cols-2 gap-2" role="group" aria-label="Payer mix">
                      {payerList.map((p) => {
                        const id = `payer-${p.replace(/\W+/g, "-")}`;
                        return (
                          <div key={p} className="flex items-center gap-2">
                            <input
                              id={id}
                              type="checkbox"
                              className="accent-[var(--emerald)] w-4 h-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--emerald)]"
                              checked={formData.selectedPayers.includes(p)}
                              onChange={() => togglePayer(p)}
                            />
                            <label htmlFor={id} className="text-slate-700 text-sm cursor-pointer">
                              {p}
                            </label>
                          </div>
                        );
                      })}
                      {formData.selectedPayers.includes("Other") && (
                        <input
                          type="text"
                          maxLength={120}
                          aria-label="Specify other payer"
                          placeholder="Please specify your payer"
                          value={formData.otherPayer}
                          onChange={(e) => setFormData({ ...formData, otherPayer: e.target.value })}
                          className={`${fieldClass} mt-2 col-span-2`}
                        />
                      )}
                    </div>
                    <p className="text-slate-400 text-xs mt-2">
                      Select as many as apply. Helps us configure your live
                      benchmarking before your first call.
                    </p>
                  </div>
                )}

                <div className="flex items-center gap-2 mt-4">
                  <input
                    id="interestedInTrial"
                    type="checkbox"
                    className="accent-[var(--emerald)] w-4 h-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--emerald)]"
                    checked={formData.interestedInTrial}
                    onChange={() =>
                      setFormData({
                        ...formData,
                        interestedInTrial: !formData.interestedInTrial,
                      })
                    }
                  />
                  <label htmlFor="interestedInTrial" className="text-slate-700 text-sm cursor-pointer">
                    Yes, I am interested in the 30-day no-obligation
                    evaluation (ContractIntel, Shield, Prevent — live data, no
                    BAA required)
                  </label>
                </div>

                <div className="mt-4">
                  <label htmlFor="message" className={labelClass}>Additional context</label>
                  <textarea
                    id="message"
                    maxLength={1000}
                    className={fieldClass}
                    rows={3}
                    placeholder="What brought you here? What are you trying to solve?"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  />
                </div>

                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!requiredValid}
                  aria-disabled={!requiredValid}
                  className={`w-full bg-[var(--emerald)] text-white py-4 rounded font-semibold text-lg mt-6 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--emerald)] focus-visible:ring-offset-2 ${
                    !requiredValid ? "opacity-50 cursor-not-allowed" : "hover:bg-emerald-600"
                  }`}
                >
                  Request My Demo — We'll Be in Touch Within One Business Day
                </button>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: TRUST BLOCK */}
          <div className="md:col-span-2">
            <h3 className="text-[var(--navy)] font-bold text-xl mb-6">
              What to Expect
            </h3>
            <ul className="space-y-3">
              {[
                "Response within one business day",
                "No commitment required",
                "No IT setup for the 30-day evaluation",
                "Live payer data — not a sandbox",
                "SOC 2 Type II",
                "ISO 27001",
                "HIPAA Compliant",
              ].map((t) => (
                <li key={t} className="flex items-start gap-3">
                  <span className="text-[var(--emerald)] font-bold text-lg mt-0.5" aria-hidden="true">✓</span>
                  <span className="text-slate-700 text-sm">{t}</span>
                </li>
              ))}
            </ul>
            <div className="mt-10 border-l-4 border-[var(--emerald)] pl-4">
              <p className="text-slate-600 italic text-sm">
                "Denial management companies fight denials. ZDefense
                understands payers."
              </p>
              <p className="text-slate-400 text-xs mt-2">
                ZDefense AI³ — Revenue Cycle Intelligence Platform
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: LIVE DEMO LINK */}
      <section className="bg-[var(--navy)] py-12 px-6 md:px-12 lg:px-16 text-center">
        <p className="text-slate-400">Want to explore the platform right now?</p>
        <a
          href="https://zdefense.lovable.app/?demo=true"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[var(--emerald)] font-semibold hover:underline text-lg block mt-2"
        >
          Explore the Live Demo ↗ — No login required
        </a>
      </section>
    </Layout>
  );
};

export default ContactPage;
