import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";

/**
 * Floating "more below" indicator. Fades out once the user scrolls past
 * a small threshold, and hides entirely if the page isn't scrollable.
 *
 * Auto-adapts color to the background underneath it: samples the element
 * directly below the indicator and switches between light/dark variants
 * based on perceived luminance.
 */
const ScrollIndicator = () => {
  const [visible, setVisible] = useState(false);
  const [onDark, setOnDark] = useState(true);

  useEffect(() => {
    const parseRgb = (s: string): [number, number, number] | null => {
      const m = s.match(/rgba?\(([^)]+)\)/);
      if (!m) return null;
      const parts = m[1].split(",").map((p) => parseFloat(p.trim()));
      if (parts.length < 3) return null;
      return [parts[0], parts[1], parts[2]];
    };

    const luminance = ([r, g, b]: [number, number, number]) =>
      (0.299 * r + 0.587 * g + 0.114 * b) / 255;

    const detectBg = () => {
      const x = window.innerWidth / 2;
      const y = window.innerHeight - 40;
      const stack = document.elementsFromPoint(x, y);
      for (const el of stack) {
        if (el.id === "scroll-indicator-root") continue;
        const bg = getComputedStyle(el as Element).backgroundColor;
        const rgb = parseRgb(bg);
        if (rgb && bg !== "rgba(0, 0, 0, 0)" && bg !== "transparent") {
          setOnDark(luminance(rgb) < 0.5);
          return;
        }
      }
      setOnDark(false);
    };

    const check = () => {
      const scrollable =
        document.documentElement.scrollHeight - window.innerHeight > 80;
      const nearTop = window.scrollY < 120;
      setVisible(scrollable && nearTop);
      if (scrollable && nearTop) detectBg();
    };

    check();
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    return () => {
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
    };
  }, []);

  const colorClass = onDark ? "text-white/80" : "text-slate-600";

  return (
    <div
      id="scroll-indicator-root"
      aria-hidden="true"
      className={`pointer-events-none fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center gap-1 transition-opacity duration-500 ${
        visible ? "opacity-100" : "opacity-0"
      } ${colorClass}`}
    >
      <span className="text-[10px] font-semibold uppercase tracking-[0.2em]">
        Scroll
      </span>
      <ChevronDown className="h-5 w-5 animate-bounce" strokeWidth={2.5} />
    </div>
  );
};

export default ScrollIndicator;
