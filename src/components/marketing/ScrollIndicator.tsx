import { ChevronDown } from "lucide-react";

interface Props {
  label?: string;
  /** When true, position absolutely at the bottom-center of the parent
   * (parent must be `position: relative`). Use on tall heroes where a
   * normal-flow placement would push the cue below the fold. */
  absolute?: boolean;
}

const ScrollIndicator = ({ label = "Scroll", absolute = false }: Props) => {
  const wrapper = absolute
    ? "pointer-events-none absolute inset-x-0 bottom-6 z-10 flex justify-center md:bottom-8"
    : "pointer-events-none mt-12 flex justify-center md:mt-16";
  return (
    <div className={wrapper}>
      <span className="inline-flex flex-col items-center gap-1.5 text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-[var(--text-lo)]">
        {label}
        <ChevronDown
          size={16}
          className="scroll-indicator-arrow text-[var(--arc-1)]"
          strokeWidth={2.5}
        />
      </span>
    </div>
  );
};

export default ScrollIndicator;
