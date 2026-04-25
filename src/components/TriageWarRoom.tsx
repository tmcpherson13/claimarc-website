import { useEffect, useRef, useState } from "react";

/**
 * TriageWarRoom — animated claim cards flowing into three priority columns.
 * Pure SVG + React rAF loop. Decorative; values illustrative.
 */

const STYLES = `
@keyframes cardFadeIn {
  0%   { opacity: 0; transform: translateY(-8px); }
  100% { opacity: 1; transform: translateY(0); }
}
@keyframes cardPulse {
  0%   { opacity: 1; }
  50%  { opacity: 0.4; }
  100% { opacity: 1; }
}
.war-room-card-enter {
  animation: cardFadeIn 400ms ease-out forwards;
}
.war-room-card-pulse {
  animation: cardPulse 600ms ease-in-out forwards;
}
`;

type Priority = "deny" | "appeal" | "approve";

interface ClaimCard {
  id: number;
  code: string;
  amount: string;
  priority: Priority;
  prob: string;
  col: number;
  row: number;
  born: number;
}

const PRIORITY_META: Record<Priority, { label: string; color: string; bg: string; border: string }> = {
  deny:    { label: "DENY",    color: "#EF4444", bg: "#1F0A0A", border: "#7F1D1D" },
  appeal:  { label: "APPEAL",  color: "#F59E0B", bg: "#1C1400", border: "#78350F" },
  approve: { label: "APPROVE", color: "#10B981", bg: "#021A0F", border: "#065F46" },
};

const CODES = ["CO-50", "CO-16", "CO-97", "PR-1", "CO-4", "CO-22", "CO-45", "PR-2"];
const AMOUNTS = ["$1,240", "$890", "$3,410", "$520", "$2,180", "$740", "$1,660", "$430"];
const PROBS = ["94%", "81%", "67%", "88%", "73%", "91%", "58%", "96%"];
const PRIORITIES: Priority[] = ["deny", "appeal", "approve"];

const COL_X = [40, 200, 360];   // x start of each column
const COL_W = 140;
const CARD_H = 52;
const CARD_GAP = 8;
const MAX_ROWS = 4;
const SPAWN_INTERVAL = 1800; // ms between new cards

let idCounter = 0;

const makeCard = (now: number): ClaimCard => {
  const priority = PRIORITIES[Math.floor(Math.random() * PRIORITIES.length)];
  const col = PRIORITIES.indexOf(priority);
  return {
    id: ++idCounter,
    code: CODES[Math.floor(Math.random() * CODES.length)],
    amount: AMOUNTS[Math.floor(Math.random() * AMOUNTS.length)],
    priority,
    prob: PROBS[Math.floor(Math.random() * PROBS.length)],
    col,
    row: 0,
    born: now,
  };
};

const TriageWarRoom = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [cards, setCards] = useState<ClaimCard[]>([]);
  const lastSpawnRef = useRef<number>(0);
  const rafRef = useRef<number>(0);
  const colRowRef = useRef<number[]>([0, 0, 0]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;

    const tick = (ts: number) => {
      if (ts - lastSpawnRef.current > SPAWN_INTERVAL) {
        lastSpawnRef.current = ts;
        setCards((prev) => {
          const card = makeCard(ts);
          const colRows = colRowRef.current;
          const row = colRows[card.col];
          if (row >= MAX_ROWS) {
            // Evict oldest card in that column and shift others up
            const colCards = prev
              .filter((c) => c.col === card.col)
              .sort((a, b) => a.born - b.born);
            const toRemove = colCards[0]?.id;
            const shifted = prev
              .filter((c) => c.id !== toRemove)
              .map((c) =>
                c.col === card.col && c.row > 0 ? { ...c, row: c.row - 1 } : c
              );
            colRowRef.current = [...colRows];
            colRowRef.current[card.col] = MAX_ROWS - 1;
            card.row = MAX_ROWS - 1;
            return [...shifted, card];
          }
          colRowRef.current = [...colRows];
          colRowRef.current[card.col] = row + 1;
          card.row = row;
          return [...prev, card];
        });
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [visible]);

  return (
    <div
      ref={ref}
      className={`w-full transition-all duration-700 ease-out ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      }`}
      aria-hidden="true"
    >
      <style>{STYLES}</style>
      <svg viewBox="0 0 540 300" className="w-full h-auto" aria-hidden="true">

        {/* Column headers */}
        {PRIORITIES.map((p, i) => {
          const meta = PRIORITY_META[p];
          return (
            <g key={p}>
              <rect
                x={COL_X[i]}
                y={4}
                width={COL_W}
                height={22}
                rx={4}
                fill={meta.bg}
                stroke={meta.border}
                strokeWidth={1}
              />
              <text
                x={COL_X[i] + COL_W / 2}
                y={19}
                textAnchor="middle"
                fill={meta.color}
                fontSize={9}
                fontFamily="ui-monospace, SFMono-Regular, monospace"
                fontWeight="bold"
                letterSpacing="1.5"
              >
                {meta.label}
              </text>
            </g>
          );
        })}

        {/* Vertical lane dividers */}
        {[185, 345].map((x) => (
          <line
            key={x}
            x1={x} y1={30} x2={x} y2={295}
            stroke="#1E3A5F"
            strokeWidth={1}
            strokeDasharray="4 4"
            opacity={0.5}
          />
        ))}

        {/* Claim cards */}
        {cards.map((card) => {
          const meta = PRIORITY_META[card.priority];
          const cx = COL_X[card.col];
          const cy = 34 + card.row * (CARD_H + CARD_GAP);
          return (
            <g
              key={card.id}
              className="war-room-card-enter"
              style={{ transformOrigin: `${cx + COL_W / 2}px ${cy + CARD_H / 2}px` }}
            >
              <rect
                x={cx}
                y={cy}
                width={COL_W}
                height={CARD_H}
                rx={5}
                fill={meta.bg}
                stroke={meta.border}
                strokeWidth={1}
              />
              {/* CARC code */}
              <text
                x={cx + 8}
                y={cy + 14}
                fill={meta.color}
                fontSize={9}
                fontFamily="ui-monospace, SFMono-Regular, monospace"
                fontWeight="bold"
              >
                {card.code}
              </text>
              {/* Amount */}
              <text
                x={cx + COL_W - 8}
                y={cy + 14}
                textAnchor="end"
                fill="#CBD5E1"
                fontSize={9}
                fontFamily="ui-monospace, SFMono-Regular, monospace"
              >
                {card.amount}
              </text>
              {/* Divider */}
              <line
                x1={cx + 8} y1={cy + 20}
                x2={cx + COL_W - 8} y2={cy + 20}
                stroke={meta.border}
                strokeWidth={0.5}
              />
              {/* Recovery probability label */}
              <text
                x={cx + 8}
                y={cy + 34}
                fill="#64748B"
                fontSize={8}
              >
                Recovery prob.
              </text>
              {/* Recovery probability value */}
              <text
                x={cx + COL_W - 8}
                y={cy + 34}
                textAnchor="end"
                fill={meta.color}
                fontSize={9}
                fontFamily="ui-monospace, SFMono-Regular, monospace"
                fontWeight="bold"
              >
                {card.prob}
              </text>
              {/* Status dot */}
              <circle
                cx={cx + 8}
                cy={cy + 44}
                r={3}
                fill={meta.color}
                opacity={0.8}
              />
              <text
                x={cx + 16}
                y={cy + 47}
                fill="#475569"
                fontSize={7}
              >
                CARC/RARC matched · ZDefense Triage
              </text>
            </g>
          );
        })}

        {/* Live indicator */}
        <circle cx={516} cy={12} r={4} fill="#10B981" opacity={0.9}>
          <animate attributeName="opacity" values="0.9;0.3;0.9" dur="1.5s" repeatCount="indefinite" />
        </circle>
        <text x={508} y={10} textAnchor="end" fill="#475569" fontSize={8} fontFamily="ui-monospace, SFMono-Regular, monospace">
          LIVE
        </text>
      </svg>
    </div>
  );
};

export default TriageWarRoom;
