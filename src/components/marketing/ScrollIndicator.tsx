import { ChevronDown } from "lucide-react";

const ScrollIndicator = ({ label = "Scroll" }: { label?: string }) => (
  <div className="pointer-events-none mt-12 flex justify-center md:mt-16">
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

export default ScrollIndicator;
