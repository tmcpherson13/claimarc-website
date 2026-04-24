import { Link } from "react-router-dom";
import { CtaType } from "@/lib/contentApi";

const ContentCta = ({ type }: { type: CtaType }) => {
  if (type === "none") return null;

  if (type === "trial") {
    return (
      <div className="mt-16 bg-[var(--navy)] text-white rounded-lg p-8 text-center">
        <p className="text-2xl font-semibold">Start your 30-day evaluation</p>
        <p className="mt-2 text-white/80">No BAA required. See ZDefense on your own data.</p>
        <Link
          to="/contact?offer=trial"
          className="mt-6 inline-block bg-[var(--emerald)] text-white px-6 py-3 rounded font-semibold hover:bg-emerald-600 transition-colors"
        >
          Start 30-Day Evaluation
        </Link>
      </div>
    );
  }

  // demo (default)
  return (
    <div className="mt-16 bg-[var(--navy)] text-white rounded-lg p-8 text-center">
      <p className="text-2xl font-semibold">Ready to see this in your own revenue cycle?</p>
      <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          to="/contact"
          className="bg-[var(--emerald)] text-white px-6 py-3 rounded font-semibold hover:bg-emerald-600 transition-colors"
        >
          Book a Demo
        </Link>
        <Link
          to="/contact?offer=trial"
          className="border border-[var(--emerald)] text-[var(--emerald)] px-6 py-3 rounded font-semibold hover:bg-[var(--emerald)]/10 transition-colors"
        >
          Start Your 30-Day Evaluation — No BAA Required
        </Link>
      </div>
    </div>
  );
};

export default ContentCta;
