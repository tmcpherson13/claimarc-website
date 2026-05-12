/**
 * Abstract "acceleration arc" hero visual: a claim moves through scoring rings
 * and is launched along an arc toward funded. Pure SVG, no dependencies.
 */
const HeroArc = ({ className = "" }: { className?: string }) => (
  <div className={`relative ${className}`} aria-hidden="true">
    <svg viewBox="0 0 460 380" className="h-auto w-full" fill="none">
      <defs>
        <linearGradient id="arcGrad" x1="0" y1="380" x2="460" y2="0">
          <stop offset="0" stopColor="#00A0C8" />
          <stop offset="0.6" stopColor="#00A0C8" />
          <stop offset="1" stopColor="#68B840" />
        </linearGradient>
        <radialGradient id="glowGrad" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#00A0C8" stopOpacity="0.35" />
          <stop offset="1" stopColor="#00A0C8" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* ambient glow */}
      <circle cx="150" cy="240" r="150" fill="url(#glowGrad)" />

      {/* concentric scoring rings */}
      <circle cx="150" cy="240" r="110" stroke="#FFFFFF" strokeOpacity="0.10" strokeWidth="1.5" />
      <circle cx="150" cy="240" r="78" stroke="#FFFFFF" strokeOpacity="0.14" strokeWidth="1.5" />
      <circle cx="150" cy="240" r="46" stroke="#FFFFFF" strokeOpacity="0.18" strokeWidth="1.5" />

      {/* the three trajectory arcs */}
      <path d="M150 240 C 230 140, 330 110, 430 150" stroke="url(#arcGrad)" strokeWidth="2.5" strokeLinecap="round" strokeOpacity="0.85" />
      <path d="M150 240 C 250 175, 340 165, 432 195" stroke="url(#arcGrad)" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.5" />
      <path d="M150 240 C 240 110, 320 70, 420 95" stroke="url(#arcGrad)" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.5" />

      {/* animated data pulses traveling the main arc */}
      <path className="arc-dash" d="M150 240 C 230 140, 330 110, 430 150" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />

      {/* core node — the claim */}
      <circle cx="150" cy="240" r="22" fill="#0E5288" stroke="#00A0C8" strokeWidth="2" />
      <circle className="arc-pulse" cx="150" cy="240" r="34" stroke="#00A0C8" strokeWidth="1.5" />
      <text x="150" y="245" textAnchor="middle" fontSize="11" fontWeight="700" fill="#FFFFFF">
        CLAIM
      </text>

      {/* destination node — funded */}
      <circle cx="430" cy="150" r="20" fill="#0E5288" stroke="#68B840" strokeWidth="2" />
      <circle className="arc-pulse" cx="430" cy="150" r="30" stroke="#68B840" strokeWidth="1.5" />
      <text x="430" y="123" textAnchor="middle" fontSize="10" fontWeight="700" fill="#68B840">
        FUNDED
      </text>

      {/* small score markers along the rings */}
      <circle cx="228" cy="240" r="4" fill="#00A0C8" />
      <circle cx="150" cy="130" r="4" fill="#00A0C8" />
      <circle cx="196" cy="194" r="3.5" fill="#68B840" />
      <circle cx="150" cy="162" r="3.5" fill="#68B840" />
    </svg>
  </div>
);

export default HeroArc;
