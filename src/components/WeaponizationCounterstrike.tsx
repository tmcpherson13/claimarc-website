import { useEffect, useRef, useState } from "react";

/**
 * WeaponizationCounterstrike — full-width animated SVG background for the
 * Why ZDefense hero. Visualizes payer aggression (red threats + WI numbers)
 * being intercepted at a cyan defense barrier, producing emerald victory
 * particles. Pure SVG + React hooks; decorative.
 */

const DEFENSE_X = 500;
const SHIELD_PERIOD_MS = 5000;

interface Threat {
  id: number;
  startY: number;
  endY: number;
  speed: number; // 1 / duration in ms
  offset: number; // phase 0..1
  intercepted: boolean;
  lap: number; // increments each loop
}

interface WiLabel {
  id: number;
  text: string;
  x: number;
  y: number;
  born: number;
  strikethrough: boolean;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  born: number;
}

interface Beam {
  id: number;
  y1: number;
  y2: number;
  born: number;
}

const WI_VALUES = ["1.8x", "2.1x", "2.4x"];

const rand = (a: number, b: number) => a + Math.random() * (b - a);

const initialThreats = (): Threat[] =>
  Array.from({ length: 6 }, (_, i) => {
    const startY = rand(40, 320);
    return {
      id: i,
      startY,
      endY: Math.min(340, startY + rand(40, 100)),
      speed: 1 / rand(2500, 4000),
      offset: Math.random(),
      intercepted: Math.random() < 0.7,
      lap: 0,
    };
  });

const WI_SPAWN_MS = 2500;
const WI_FADE_IN = 400;
const WI_HOLD = 1000;
const WI_FADE_OUT = 400;
const WI_STRIKE_MS = 300;
const WI_TOTAL = WI_FADE_IN + WI_HOLD + WI_FADE_OUT;

const PARTICLE_LIFE = 600;
const BEAM_LIFE = 200;

const WeaponizationCounterstrike = () => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);
  const [, setTick] = useState(0);
  const startRef = useRef<number | null>(null);
  const rafRef = useRef<number>(0);

  const threatsRef = useRef<Threat[]>(initialThreats());
  const wiRef = useRef<WiLabel[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const beamsRef = useRef<Beam[]>([]);
  const lastWiSpawnRef = useRef<number>(0);
  const idCounterRef = useRef<number>(1000);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.05 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;

    const spawnParticles = (x: number, y: number, now: number) => {
      const count = 5 + Math.floor(Math.random() * 3);
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = rand(0.04, 0.12);
        particlesRef.current.push({
          id: idCounterRef.current++,
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          r: rand(2, 4),
          born: now,
        });
      }
    };

    const spawnBeam = (y: number, now: number) => {
      beamsRef.current.push({
        id: idCounterRef.current++,
        y1: y,
        y2: y,
        born: now,
      });
    };

    const animate = (timestamp: number) => {
      if (startRef.current === null) startRef.current = timestamp;
      const elapsed = timestamp - startRef.current;

      // Threats: detect interception transitions per lap
      threatsRef.current = threatsRef.current.map((th) => {
        const phase = ((elapsed * th.speed) + th.offset) % 1;
        const lap = Math.floor((elapsed * th.speed) + th.offset);
        if (lap !== th.lap) {
          // Reset for new lap: pick new params
          const startY = rand(40, 320);
          return {
            ...th,
            startY,
            endY: Math.min(340, startY + rand(40, 100)),
            speed: 1 / rand(2500, 4000),
            intercepted: Math.random() < 0.7,
            lap,
          };
        }
        // Detect crossing the defense line this frame
        const x = 1250 - phase * 1370;
        // Compute previous x using small step
        const prevPhase = phase - 0.0001;
        const prevX = 1250 - prevPhase * 1370;
        if (th.intercepted && prevX > DEFENSE_X && x <= DEFENSE_X) {
          const t = (1250 - DEFENSE_X) / 1370;
          const y = th.startY + (th.endY - th.startY) * t;
          spawnParticles(DEFENSE_X, y, elapsed);
          spawnBeam(y, elapsed);
        }
        return th;
      });

      // WI labels lifecycle
      if (elapsed - lastWiSpawnRef.current > WI_SPAWN_MS) {
        lastWiSpawnRef.current = elapsed;
        wiRef.current.push({
          id: idCounterRef.current++,
          text: WI_VALUES[Math.floor(Math.random() * WI_VALUES.length)],
          x: rand(650, 1100),
          y: rand(60, 300),
          born: elapsed,
          strikethrough: Math.random() < 0.7,
        });
      }
      wiRef.current = wiRef.current.filter((w) => elapsed - w.born < WI_TOTAL);

      // Particles
      particlesRef.current = particlesRef.current.filter(
        (p) => elapsed - p.born < PARTICLE_LIFE
      );

      // Beams
      beamsRef.current = beamsRef.current.filter(
        (b) => elapsed - b.born < BEAM_LIFE
      );

      setTick((n) => (n + 1) % 1000000);
      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [visible]);

  const elapsed =
    startRef.current === null ? 0 : performance.now() - startRef.current;
  const shieldPulse =
    0.03 +
    ((Math.sin((elapsed / 1000) * ((2 * Math.PI) / (SHIELD_PERIOD_MS / 1000))) + 1) /
      2) *
      0.05;

  return (
    <div
      ref={ref}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.85 }}
    >
      <svg
        viewBox="0 0 1200 360"
        className="w-full h-full"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <rect x={0} y={0} width={1200} height={360} fill="#0B1628" />

        {/* Left zone — provider glow */}
        <defs>
          <radialGradient id="providerGlow" cx="0%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#10B981" stopOpacity={0.05} />
            <stop offset="100%" stopColor="#10B981" stopOpacity={0} />
          </radialGradient>
          <radialGradient id="shieldGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#06B6D4" stopOpacity={shieldPulse} />
            <stop offset="100%" stopColor="#06B6D4" stopOpacity={0} />
          </radialGradient>
        </defs>
        <rect x={0} y={0} width={300} height={360} fill="url(#providerGlow)" />

        {/* Left zone labels */}
        <text
          x={30}
          y={30}
          fill="#10B981"
          fontSize={9}
          opacity={0.4}
          letterSpacing={2}
          fontFamily="ui-monospace, SFMono-Regular, monospace"
        >
          PROVIDER
        </text>
        <text
          x={30}
          y={44}
          fill="#06B6D4"
          fontSize={8}
          opacity={0.5}
          letterSpacing={1.5}
          fontFamily="ui-monospace, SFMono-Regular, monospace"
        >
          ZDEFENSE ACTIVE
        </text>

        {/* Right zone label */}
        <text
          x={950}
          y={30}
          fill="#EF4444"
          fontSize={9}
          opacity={0.4}
          letterSpacing={2}
          fontFamily="ui-monospace, SFMono-Regular, monospace"
        >
          PAYER NETWORK
        </text>

        {/* Defense shield glow */}
        <circle cx={DEFENSE_X} cy={180} r={180} fill="url(#shieldGlow)" />

        {/* Threats */}
        {threatsRef.current.map((th) => {
          const phase = ((elapsed * th.speed) + th.offset) % 1;
          const x = 1250 - phase * 1370;
          const t = phase;
          const y = th.startY + (th.endY - th.startY) * t;
          const dx = (th.endY - th.startY) / 1370;
          // segment endpoint
          const x2 = x + 120;
          const y2 = y - 120 * dx;
          const intercepted = th.intercepted && x <= DEFENSE_X;
          if (intercepted) return null;
          const passedThrough = !th.intercepted && x < DEFENSE_X;
          const opacity = passedThrough ? 0.18 : 0.5;
          return (
            <line
              key={`th-${th.id}-${th.lap}`}
              x1={x}
              y1={y}
              x2={x2}
              y2={y2}
              stroke="#EF4444"
              strokeWidth={1.5}
              opacity={opacity}
              strokeLinecap="round"
            />
          );
        })}

        {/* Defense barrier */}
        <line
          x1={DEFENSE_X}
          y1={20}
          x2={DEFENSE_X}
          y2={340}
          stroke="#06B6D4"
          strokeWidth={2}
          opacity={0.7}
        />

        {/* Counter beams */}
        {beamsRef.current.map((b) => {
          const age = elapsed - b.born;
          const progress = Math.min(1, age / BEAM_LIFE);
          const length = 200 * progress;
          const opacity = 0.8 * (1 - progress);
          return (
            <line
              key={`bm-${b.id}`}
              x1={DEFENSE_X}
              y1={b.y1}
              x2={DEFENSE_X + length}
              y2={b.y1}
              stroke="#06B6D4"
              strokeWidth={1.5}
              opacity={opacity}
              strokeLinecap="round"
            />
          );
        })}

        {/* Victory particles */}
        {particlesRef.current.map((p) => {
          const age = elapsed - p.born;
          const progress = Math.min(1, age / PARTICLE_LIFE);
          const x = p.x + p.vx * age;
          const y = p.y + p.vy * age;
          const opacity = 0.9 * (1 - progress);
          return (
            <circle
              key={`pt-${p.id}`}
              cx={x}
              cy={y}
              r={p.r * (1 - progress * 0.4)}
              fill="#10B981"
              opacity={opacity}
            />
          );
        })}

        {/* WI labels */}
        {wiRef.current.map((w) => {
          const age = elapsed - w.born;
          let opacity = 0;
          if (age < WI_FADE_IN) opacity = age / WI_FADE_IN;
          else if (age < WI_FADE_IN + WI_HOLD) opacity = 1;
          else opacity = Math.max(0, 1 - (age - WI_FADE_IN - WI_HOLD) / WI_FADE_OUT);

          // strikethrough fires near end of hold
          const strikeStart = WI_FADE_IN + WI_HOLD - WI_STRIKE_MS;
          const strikeProgress = w.strikethrough
            ? Math.max(0, Math.min(1, (age - strikeStart) / WI_STRIKE_MS))
            : 0;

          // approx text width
          const textW = w.text.length * 7;
          return (
            <g key={`wi-${w.id}`} opacity={opacity}>
              <text
                x={w.x}
                y={w.y}
                fill="#EF4444"
                fontSize={11}
                fontFamily="ui-monospace, SFMono-Regular, monospace"
              >
                {w.text}
              </text>
              {w.strikethrough && strikeProgress > 0 && (
                <line
                  x1={w.x - 2}
                  y1={w.y - 4}
                  x2={w.x - 2 + (textW + 4) * strikeProgress}
                  y2={w.y - 4}
                  stroke="#06B6D4"
                  strokeWidth={1.5}
                  opacity={0.9}
                />
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default WeaponizationCounterstrike;
