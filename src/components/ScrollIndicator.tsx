import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";

interface ScrollIndicatorProps {
  /** Tailwind text color class. Defaults to white for dark hero backgrounds. */
  colorClass?: string;
  /** Optional label shown above the arrow. */
  label?: string;
}

/**
 * Floating "more below" indicator. Fades out once the user scrolls past
 * a small threshold, and hides entirely if the page isn't scrollable.
 */
const ScrollIndicator = ({
  colorClass = "text-white/80",
  label = "Scroll",
}: ScrollIndicatorProps) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const check = () => {
      const scrollable =
        document.documentElement.scrollHeight - window.innerHeight > 80;
      const nearTop = window.scrollY < 120;
      setVisible(scrollable && nearTop);
    };
    check();
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    return () => {
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center gap-1 transition-opacity duration-500 ${
        visible ? "opacity-100" : "opacity-0"
      } ${colorClass}`}
    >
      <span className="text-[10px] font-semibold uppercase tracking-[0.2em]">
        {label}
      </span>
      <ChevronDown className="h-5 w-5 animate-bounce" strokeWidth={2.5} />
    </div>
  );
};

export default ScrollIndicator;
