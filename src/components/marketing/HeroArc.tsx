/**
 * Animated data-flow visualization for the hero.
 *
 * Tells the ClaimARC story visually:
 *   inbound documents (EOB / ERA / 835) flow into the AI scoring core, get
 *   priced, then accelerate along a gradient arc to a "Funded" terminal.
 *
 * Pure SVG + CSS animation. No deps. Respects prefers-reduced-motion.
 */
const HeroArc = ({ className = "" }: { className?: string }) => (
  <div className={`relative ${className}`} aria-hidden="true">
    {/* Ambient haloed glow behind the SVG */}
    <div
      className="pointer-events-none absolute inset-0 -z-10"
      style={{
        background:
          "radial-gradient(45% 45% at 32% 60%, rgba(0,200,230,0.32), transparent 60%), radial-gradient(40% 40% at 80% 30%, rgba(20,116,180,0.28), transparent 60%), radial-gradient(35% 35% at 70% 85%, rgba(126,217,87,0.18), transparent 60%)",
        filter: "blur(8px)",
      }}
    />

    <svg viewBox="0 0 520 440" className="h-auto w-full" fill="none">
      <defs>
        {/* Signature ARC gradient */}
        <linearGradient id="arcGrad" x1="0" y1="440" x2="520" y2="0">
          <stop offset="0" stopColor="#052A48" />
          <stop offset="0.5" stopColor="#00C8E6" />
          <stop offset="1" stopColor="#7ED957" />
        </linearGradient>
        <linearGradient id="arcGradSoft" x1="0" y1="0" x2="520" y2="440">
          <stop offset="0" stopColor="#00C8E6" stopOpacity="0.5" />
          <stop offset="1" stopColor="#7ED957" stopOpacity="0.25" />
        </linearGradient>
        <radialGradient id="coreGlow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#00C8E6" stopOpacity="0.55" />
          <stop offset="0.5" stopColor="#1474B4" stopOpacity="0.25" />
          <stop offset="1" stopColor="#052A48" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="terminalGlow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#7ED957" stopOpacity="0.55" />
          <stop offset="1" stopColor="#7ED957" stopOpacity="0" />
        </radialGradient>
        <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2.5" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Background grid for scale & precision */}
      <g opacity="0.06" stroke="#FFFFFF" strokeWidth="0.5">
        <path d="M0 110 H520 M0 220 H520 M0 330 H520" />
        <path d="M130 0 V440 M260 0 V440 M390 0 V440" />
      </g>

      {/* Core ambient glow */}
      <circle cx="200" cy="260" r="170" fill="url(#coreGlow)" />
      <circle cx="430" cy="120" r="110" fill="url(#terminalGlow)" />

      {/* Inbound document nodes — EOB / ERA / 835 */}
      <g>
        {/* EOB */}
        <g className="arc-float" style={{ animationDelay: "0s" }}>
          <rect x="20" y="200" width="62" height="36" rx="6" fill="#0B1020" stroke="#00C8E6" strokeOpacity="0.6" strokeWidth="1.25" />
          <text x="51" y="223" textAnchor="middle" fontSize="11" fontWeight="700" letterSpacing="1" fill="#00C8E6">EOB</text>
        </g>
        {/* ERA */}
        <g className="arc-float" style={{ animationDelay: "1.6s" }}>
          <rect x="20" y="250" width="62" height="36" rx="6" fill="#0B1020" stroke="#1474B4" strokeOpacity="0.65" strokeWidth="1.25" />
          <text x="51" y="273" textAnchor="middle" fontSize="11" fontWeight="700" letterSpacing="1" fill="#5BA9D8">ERA</text>
        </g>
        {/* 835 */}
        <g className="arc-float" style={{ animationDelay: "3.2s" }}>
          <rect x="20" y="300" width="62" height="36" rx="6" fill="#0B1020" stroke="#7ED957" strokeOpacity="0.6" strokeWidth="1.25" />
          <text x="51" y="323" textAnchor="middle" fontSize="11" fontWeight="700" letterSpacing="1" fill="#A6E883">835</text>
        </g>
      </g>

      {/* Inbound connector lines */}
      <g stroke="url(#arcGradSoft)" strokeWidth="1.25" strokeLinecap="round" fill="none">
        <path d="M82 218 C 130 218, 150 245, 195 255" />
        <path d="M82 268 C 130 268, 155 265, 195 262" />
        <path d="M82 318 C 130 318, 155 285, 195 270" />
      </g>
      {/* Animated dashes traveling inbound */}
      <g stroke="#FFFFFF" strokeWidth="1.25" strokeLinecap="round" fill="none" opacity="0.65">
        <path className="arc-dash-fast" d="M82 218 C 130 218, 150 245, 195 255" />
        <path className="arc-dash-fast" style={{ animationDelay: "1.5s" }} d="M82 268 C 130 268, 155 265, 195 262" />
        <path className="arc-dash-fast" style={{ animationDelay: "3s" }} d="M82 318 C 130 318, 155 285, 195 270" />
      </g>

      {/* Concentric scoring rings around the AI core */}
      <g>
        <circle cx="210" cy="260" r="118" stroke="#FFFFFF" strokeOpacity="0.07" strokeWidth="1" />
        <circle cx="210" cy="260" r="86" stroke="#FFFFFF" strokeOpacity="0.10" strokeWidth="1" />
        <circle cx="210" cy="260" r="56" stroke="#FFFFFF" strokeOpacity="0.14" strokeWidth="1" />
      </g>

      {/* Orbiting score markers on outer ring */}
      <g className="arc-orbit" style={{ transformOrigin: "210px 260px" }}>
        <circle cx="328" cy="260" r="3.5" fill="#00C8E6" filter="url(#softGlow)" />
        <circle cx="92" cy="260" r="3" fill="#1474B4" />
      </g>
      <g className="arc-orbit-rev" style={{ transformOrigin: "210px 260px" }}>
        <circle cx="210" cy="174" r="3" fill="#7ED957" filter="url(#softGlow)" />
        <circle cx="210" cy="346" r="2.5" fill="#FFFFFF" opacity="0.6" />
      </g>

      {/* Core node — the claim being scored */}
      <circle cx="210" cy="260" r="36" fill="#070A13" stroke="url(#arcGrad)" strokeWidth="1.5" />
      <circle className="arc-pulse" cx="210" cy="260" r="44" stroke="#00C8E6" strokeOpacity="0.55" strokeWidth="1.25" />
      <text x="210" y="257" textAnchor="middle" fontSize="9.5" fontWeight="700" fill="#00C8E6" letterSpacing="1">SCORING</text>
      <text x="210" y="270" textAnchor="middle" fontSize="11" fontWeight="800" fill="#FFFFFF">AI</text>

      {/* Trajectory arcs from core to terminal */}
      <g fill="none" strokeLinecap="round">
        <path d="M246 260 C 320 200, 360 160, 430 130" stroke="url(#arcGrad)" strokeWidth="2.5" strokeOpacity="0.95" />
        <path d="M246 260 C 320 230, 370 200, 430 150" stroke="url(#arcGrad)" strokeWidth="1.5" strokeOpacity="0.45" />
        <path d="M246 260 C 320 170, 360 130, 430 110" stroke="url(#arcGrad)" strokeWidth="1.5" strokeOpacity="0.45" />
      </g>

      {/* Animated white pulses traveling along main arc */}
      <path className="arc-dash" d="M246 260 C 320 200, 360 160, 430 130" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" fill="none" />

      {/* Terminal node — FUNDED */}
      <circle cx="430" cy="130" r="28" fill="#070A13" stroke="#7ED957" strokeWidth="1.5" />
      <circle className="arc-pulse" cx="430" cy="130" r="40" stroke="#7ED957" strokeOpacity="0.5" strokeWidth="1.25" />
      <text x="430" y="128" textAnchor="middle" fontSize="9" fontWeight="700" fill="#A6E883" letterSpacing="1.2">1–2 DAYS</text>
      <text x="430" y="140" textAnchor="middle" fontSize="9" fontWeight="800" fill="#FFFFFF" letterSpacing="1.2">FUNDED</text>

      {/* Score tag floating near core */}
      <g transform="translate(296 196)" filter="url(#softGlow)">
        <rect x="0" y="0" width="78" height="26" rx="13" fill="#070A13" stroke="#00C8E6" strokeOpacity="0.6" />
        <circle cx="13" cy="13" r="4" fill="#7ED957" />
        <text x="24" y="17" fontSize="10" fontWeight="700" fill="#FFFFFF">P-PAY 94%</text>
      </g>

      {/* Faint axis labels */}
      <g fill="#FFFFFF" opacity="0.32" fontSize="8.5" fontWeight="600" letterSpacing="1.5">
        <text x="20" y="184">INBOUND</text>
        <text x="180" y="412" textAnchor="middle">PRECISION VALUATION</text>
        <text x="500" y="92" textAnchor="end">ACCELERATION</text>
      </g>
    </svg>
  </div>
);

export default HeroArc;
