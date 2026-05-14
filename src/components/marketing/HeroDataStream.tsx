import { useEffect, useRef } from "react";

/**
 * HeroDataStream
 *
 * Animated background for the hero: horizontal "remittance signal" lines
 * drift right-to-left across a <canvas>, layered with a giant infinity-
 * loop watermark. ClaimARC's bespoke-motion answer to the generic
 * gradient-blob hero — same level of effort as a particle/star field,
 * but the metaphor is data flowing into the acceleration engine.
 *
 * - Lines: thin cyan/lime traces at varying y positions, opacity, speed,
 *   with subtle vertical sine wobble.
 * - Watermark: the infinity ribbon SVG, scaled large at ~3% opacity,
 *   breathes gently via CSS.
 *
 * Respects prefers-reduced-motion (falls back to a static frame).
 */
const HeroDataStream = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    type Stream = {
      y: number;       // 0–1, vertical position
      len: number;     // 0–1, length as fraction of width
      speed: number;   // px/frame at current size
      x: number;       // current head x (px)
      hue: "cyan" | "lime" | "blue";
      alpha: number;
      wobble: number;  // phase for vertical sine
      wobbleAmp: number;
    };

    const streams: Stream[] = Array.from({ length: 16 }, () => ({
      y: Math.random(),
      len: 0.18 + Math.random() * 0.34,
      speed: 0.4 + Math.random() * 1.1,
      x: -Math.random() * 600,
      hue:
        Math.random() < 0.55
          ? "cyan"
          : Math.random() < 0.5
            ? "blue"
            : "lime",
      alpha: 0.12 + Math.random() * 0.28,
      wobble: Math.random() * Math.PI * 2,
      wobbleAmp: 4 + Math.random() * 8,
    }));

    const colorFor = (s: Stream) =>
      s.hue === "cyan"
        ? `rgba(0, 200, 230, ${s.alpha})`
        : s.hue === "lime"
          ? `rgba(126, 217, 87, ${s.alpha * 0.7})`
          : `rgba(20, 116, 180, ${s.alpha})`;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let raf = 0;

    const resize = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const draw = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);

      for (const s of streams) {
        const yBase = s.y * h;
        const wobble = Math.sin(s.wobble) * s.wobbleAmp;
        const y = yBase + wobble;
        const lenPx = s.len * w;
        const x1 = s.x;
        const x0 = x1 - lenPx;

        // Trail gradient — opaque head fading to transparent tail
        const grad = ctx.createLinearGradient(x0, y, x1, y);
        grad.addColorStop(0, "transparent");
        grad.addColorStop(1, colorFor(s));
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.25;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(x0, y);
        ctx.lineTo(x1, y);
        ctx.stroke();

        // Glowing head dot
        ctx.fillStyle = colorFor({ ...s, alpha: Math.min(0.9, s.alpha * 2.4) });
        ctx.beginPath();
        ctx.arc(x1, y, 1.5, 0, Math.PI * 2);
        ctx.fill();

        if (!reduced) {
          s.x += s.speed;
          s.wobble += 0.012;
          if (s.x - lenPx > w + 40) {
            s.x = -lenPx - Math.random() * 200;
            s.y = Math.random();
          }
        }
      }

      if (!reduced) raf = requestAnimationFrame(draw);
    };

    draw();

    const onResize = () => {
      resize();
      if (reduced) draw();
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <>
      <canvas ref={canvasRef} className="data-stream-canvas" aria-hidden="true" />

      {/* Giant infinity-loop watermark behind the hero copy. */}
      <svg
        className="hero-infinity-watermark"
        viewBox="0 0 500 200"
        aria-hidden="true"
        fill="none"
      >
        <path
          d="M 80 100 C 80 30, 200 30, 250 100 C 300 170, 420 170, 420 100 C 420 30, 300 30, 250 100 C 200 170, 80 170, 80 100 Z"
          stroke="#00C8E6"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </>
  );
};

export default HeroDataStream;
