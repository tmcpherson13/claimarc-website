import { TrendingUp } from "lucide-react";

const tileOpacities: number[][] = [
  [0.32, 0.55, 0.72, 0.41],
  [0.58, 0.24, 0.48, 0.78],
  [0.42, 0.69, 0.31, 0.52],
  [0.51, 0.38, 0.61, 0.28],
];

const HeroDataViz = () => (
  <div className="relative hidden md:block" aria-hidden="true">
    <svg
      viewBox="0 0 480 320"
      className="h-auto w-full"
      role="presentation"
      fill="none"
    >
      <defs>
        <filter
          id="heroDataVizGlow"
          x="-20%"
          y="-20%"
          width="140%"
          height="140%"
        >
          <feGaussianBlur stdDeviation="3" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Claims tile grid — sits behind the chart, top-right quadrant */}
      <g transform="translate(330, 70)">
        {tileOpacities.flatMap((row, y) =>
          row.map((opacity, x) => (
            <rect
              key={`tile-${y}-${x}`}
              x={x * 20}
              y={y * 20}
              width={8}
              height={8}
              rx={1.5}
              fill="#00A0C8"
              fillOpacity={opacity}
            />
          ))
        )}
      </g>

      {/* Recovery curve — smooth bezier with draw-in animation */}
      <path
        className="hero-chart-line"
        d="M 40 280 C 130 270, 210 220, 270 170 S 380 90, 440 60"
        stroke="#00A0C8"
        strokeWidth={2.5}
        strokeLinecap="round"
        filter="url(#heroDataVizGlow)"
      />

      {/* Animated data flow lines emerging from the chart's right edge */}
      <line
        x1="440"
        y1="60"
        x2="476"
        y2="36"
        stroke="#68B840"
        strokeOpacity={0.6}
        strokeWidth={1}
        className="hero-flow-line"
      />
      <line
        x1="440"
        y1="60"
        x2="476"
        y2="84"
        stroke="#68B840"
        strokeOpacity={0.6}
        strokeWidth={1}
        className="hero-flow-line"
        style={{ animationDelay: "0.75s" }}
      />
    </svg>

    {/* Floating metric annotation */}
    <div className="absolute right-3 top-3 flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 backdrop-blur-md">
      <TrendingUp size={12} className="text-brand-primary" />
      <span className="text-xs font-semibold text-white">+247% YoY</span>
    </div>
  </div>
);

export default HeroDataViz;
