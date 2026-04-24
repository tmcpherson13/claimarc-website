/**
 * HeroNetwork — purely decorative animated network background.
 * Sits behind hero text via absolute positioning. pointer-events: none.
 * All node/line positions are hardcoded for stable, non-jittery animation.
 */

interface HeroNetworkProps {
  className?: string;
}

const NODES = [
  { x: 703, y: 184, r: 3, opacity: 0.22, color: "#10B981" },
  { x: 188, y: 126, r: 3, opacity: 0.21, color: "#64748B" },
  { x: 1079, y: 249, r: 2, opacity: 0.16, color: "#64748B" },
  { x: 896, y: 101, r: 2, opacity: 0.16, color: "#10B981" },
  { x: 293, y: 258, r: 4, opacity: 0.21, color: "#64748B" },
  { x: 166, y: 436, r: 2, opacity: 0.25, color: "#64748B" },
  { x: 633, y: 459, r: 2, opacity: 0.2, color: "#10B981" },
  { x: 802, y: 129, r: 3, opacity: 0.22, color: "#64748B" },
  { x: 162, y: 240, r: 3, opacity: 0.22, color: "#64748B" },
  { x: 915, y: 351, r: 3, opacity: 0.21, color: "#10B981" },
  { x: 968, y: 400, r: 3, opacity: 0.17, color: "#64748B" },
  { x: 408, y: 279, r: 2, opacity: 0.21, color: "#64748B" },
  { x: 1115, y: 536, r: 3, opacity: 0.22, color: "#10B981" },
  { x: 629, y: 104, r: 2, opacity: 0.2, color: "#64748B" },
  { x: 377, y: 380, r: 2, opacity: 0.24, color: "#64748B" },
  { x: 198, y: 351, r: 3, opacity: 0.22, color: "#10B981" },
  { x: 750, y: 53, r: 3, opacity: 0.19, color: "#64748B" },
  { x: 279, y: 535, r: 2, opacity: 0.17, color: "#64748B" },
  { x: 547, y: 437, r: 3, opacity: 0.24, color: "#10B981" },
  { x: 1056, y: 112, r: 2, opacity: 0.19, color: "#64748B" },
];

const LINES = [
  { x1: 703, y1: 184, x2: 802, y2: 129 },
  { x1: 703, y1: 184, x2: 629, y2: 104 },
  { x1: 703, y1: 184, x2: 750, y2: 53 },
  { x1: 188, y1: 126, x2: 293, y2: 258 },
  { x1: 188, y1: 126, x2: 162, y2: 240 },
  { x1: 1079, y1: 249, x2: 1056, y2: 112 },
  { x1: 896, y1: 101, x2: 802, y2: 129 },
  { x1: 896, y1: 101, x2: 750, y2: 53 },
  { x1: 896, y1: 101, x2: 1056, y2: 112 },
  { x1: 293, y1: 258, x2: 162, y2: 240 },
  { x1: 293, y1: 258, x2: 408, y2: 279 },
  { x1: 293, y1: 258, x2: 377, y2: 380 },
  { x1: 293, y1: 258, x2: 198, y2: 351 },
  { x1: 166, y1: 436, x2: 198, y2: 351 },
  { x1: 166, y1: 436, x2: 279, y2: 535 },
  { x1: 633, y1: 459, x2: 547, y2: 437 },
  { x1: 802, y1: 129, x2: 629, y2: 104 },
  { x1: 802, y1: 129, x2: 750, y2: 53 },
  { x1: 162, y1: 240, x2: 198, y2: 351 },
  { x1: 915, y1: 351, x2: 968, y2: 400 },
  { x1: 408, y1: 279, x2: 377, y2: 380 },
  { x1: 629, y1: 104, x2: 750, y2: 53 },
  { x1: 377, y1: 380, x2: 547, y2: 437 },
];

// Five pulses: pick distinct lines, vary duration and stagger begin times.
const PULSES = [
  { lineIdx: 0, dur: "5s", begin: "0s" },
  { lineIdx: 4, dur: "7s", begin: "1.2s" },
  { lineIdx: 11, dur: "6s", begin: "2.4s" },
  { lineIdx: 15, dur: "8s", begin: "0.6s" },
  { lineIdx: 19, dur: "4s", begin: "3s" },
];

const HeroNetwork = ({ className = "" }: HeroNetworkProps) => {
  return (
    <svg
      className={`pointer-events-none absolute inset-0 z-0 ${className}`}
      viewBox="0 0 1200 600"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      {/* Connection lines */}
      <g>
        {LINES.map((l, i) => (
          <line
            key={`l-${i}`}
            x1={l.x1}
            y1={l.y1}
            x2={l.x2}
            y2={l.y2}
            stroke="#64748B"
            strokeWidth={0.5}
            opacity={0.08}
          />
        ))}
      </g>

      {/* Nodes */}
      <g>
        {NODES.map((n, i) => (
          <circle
            key={`n-${i}`}
            cx={n.x}
            cy={n.y}
            r={n.r}
            fill={n.color}
            opacity={n.opacity}
          />
        ))}
      </g>

      {/* Data pulses traveling along selected lines */}
      <g>
        {PULSES.map((p, i) => {
          const l = LINES[p.lineIdx];
          const path = `M ${l.x1} ${l.y1} L ${l.x2} ${l.y2}`;
          return (
            <circle key={`p-${i}`} r={1.5} fill="#10B981" opacity={0.4}>
              <animateMotion
                dur={p.dur}
                begin={p.begin}
                repeatCount="indefinite"
                path={path}
              />
            </circle>
          );
        })}
      </g>
    </svg>
  );
};

export default HeroNetwork;
