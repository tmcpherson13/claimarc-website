import { Link } from "react-router-dom";

const TrialCallout = () => {
  return (
    <div className="border-l-4 border-[var(--emerald)] bg-[var(--lgray)] p-8 rounded-r-xl my-12">
      <p className="text-[var(--emerald)] text-xs font-semibold uppercase tracking-widest">
        30-DAY NO-OBLIGATION EVALUATION
      </p>
      <h3 className="text-[var(--navy)] text-xl font-bold mt-2">
        Start with live payer data. No BAA required.
      </h3>
      <p className="text-slate-600 text-sm mt-3 max-w-2xl">
        ContractIntel, Shield, and Prevent activate with live payer data
        benchmarked to your actual market and payer mix — no Business Associate
        Agreement required, no IT involvement, no legal agreements. You are not
        looking at a demo. You are looking at your revenue cycle, from the
        outside, in real time. Most organizations identify their first contract
        gap within 72 hours of activation.
      </p>
      <p className="text-slate-400 text-xs mt-3">
        Full platform access — including denial triage, appeal automation,
        underpayment detection, and 90-day revenue forecasting — requires BAA
        execution and 835 connection. Most organizations complete integration
        within two weeks. Available for qualifying provider organizations.
      </p>
      <Link
        to="/contact?offer=trial"
        className="plausible-event-name=CTA_Click plausible-event-location=trial_callout plausible-event-cta=start_trial bg-[var(--emerald)] text-white px-6 py-3 rounded mt-4 font-semibold inline-block hover:bg-emerald-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--emerald)] focus-visible:ring-offset-2"
      >
        Start Your 30-Day Evaluation — No BAA Required
      </Link>
    </div>
  );
};

export default TrialCallout;
