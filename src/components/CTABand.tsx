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
    <section className="bg-[var(--emerald)] py-20 text-center px-6 md:px-12 lg:px-16">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-[var(--navy)] text-3xl md:text-4xl font-bold">{headline}</h2>
        <p className="text-[var(--navy)]/80 text-lg mt-3 max-w-2xl mx-auto">
          {subhead}
        </p>
        <div className="mt-8 flex gap-4 justify-center flex-wrap">
          <Link
            to={primaryHref}
            className="plausible-event-name=CTA_Click plausible-event-location=cta_band plausible-event-variant=primary bg-[var(--navy)] text-white px-6 py-3 rounded font-semibold hover:bg-[var(--navy-dk)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--navy)] focus-visible:ring-offset-2"
          >
            {primaryText}
          </Link>
          <Link
            to={secondaryHref}
            className="plausible-event-name=CTA_Click plausible-event-location=cta_band plausible-event-variant=secondary border-2 border-[var(--navy)] text-[var(--navy)] px-6 py-3 rounded font-semibold hover:bg-[var(--navy)] hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--navy)] focus-visible:ring-offset-2"
          >
            {secondaryText}
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CTABand;
