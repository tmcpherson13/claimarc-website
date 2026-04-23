import { Link } from "react-router-dom";

interface CTABandProps {
  headline: string;
  subhead: string;
  primaryText: string;
  primaryHref: string;
  secondaryText: string;
  secondaryHref: string;
}

const CTABand = ({
  headline,
  subhead,
  primaryText,
  primaryHref,
  secondaryText,
  secondaryHref,
}: CTABandProps) => {
  return (
    <section className="bg-[var(--emerald)] py-20 text-center px-8">
      <h2 className="text-[var(--navy)] text-4xl font-bold">{headline}</h2>
      <p className="text-[var(--navy)]/80 text-lg mt-3 max-w-2xl mx-auto">
        {subhead}
      </p>
      <div className="mt-8 flex gap-4 justify-center flex-wrap">
        <Link
          to={primaryHref}
          className="bg-[var(--navy)] text-white px-6 py-3 rounded font-semibold"
        >
          {primaryText}
        </Link>
        <Link
          to={secondaryHref}
          className="border-2 border-[var(--navy)] text-[var(--navy)] px-6 py-3 rounded font-semibold"
        >
          {secondaryText}
        </Link>
      </div>
    </section>
  );
};

export default CTABand;
