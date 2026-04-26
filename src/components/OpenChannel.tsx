import { useEffect, useRef, useState } from "react";

/**
 * OpenChannel — calm decorative SVG visualization of an established
 * communication channel. Two layered breathing waveforms, pulsing
 * transmission/receiver points, and small data packets traveling
 * along the waveform. Pure SVG + React hooks (no chart library).
 */

interface Packet {
  id: number;
  born: number;
  label: string;
}

const PACKET_LABELS = ["SECURE", "HIPAA", "SOC 2"];
const PACKET_DURATION = 3000; // ms to traverse
const PACKET_INTERVAL = 2000; // ms between spawns
const PULSE_DURATION = 2500; // ms for origin/receiver pulse
const PULSE_OFFSET = 1250; // ms offset for receiver

// Waveform sample positions (120 points across 1200 width)
const WAVE_POINTS = 120;
const WAVE_XS: number[] = [];
for (let i = 0; i < WAVE_POINTS; i++) {
  WAVE_XS.push((i / (WAVE_POINTS - 1)) * 1200);
}

// 8 evenly spaced static tick positions along the waveform
const TICK_XS: number[] = [];
for (let i = 0; i < 8; i++) {
  TICK_XS.push(100 + ((1100 - 100) * i) / 7);
}

const waveY = (x: number, amplitude: number, wavelength: number, phase: number) =>
  160 + amplitude * Math.sin(x / wavelength + phase);

const OpenChannel = ({ className }: { className?: string }) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  const startTimeRef = useRef<number | null>(null);
  const rafRef = useRef<number>(0);
  const lastSpawnRef = useRef<number>(0);
  const packetIdRef = useRef<number>(0);

  const [phase1, setPhase1] = useState(0);
  const [phase2, setPhase2] = useState(1.2);
  const [elapsed, setElapsed] = useState(0);
  const [packets, setPackets] = useState<Packet[]>([]);

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
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;

    let p1 = 0;
    let p2 = 1.2;

    const animate = (timestamp: number) => {
      if (startTimeRef.current === null) {
        startTimeRef.current = timestamp;
        lastSpawnRef.current = timestamp;
      }
      const e = timestamp - startTimeRef.current;
      setElapsed(e);

      p1 += 0.008;
      p2 += 0.005;
      setPhase1(p1);
      setPhase2(p2);

      // Spawn packets every PACKET_INTERVAL ms
      if (timestamp - lastSpawnRef.current >= PACKET_INTERVAL) {
        lastSpawnRef.current = timestamp;
        const id = packetIdRef.current++;
        const label = PACKET_LABELS[id % PACKET_LABELS.length];
        setPackets((prev) => [
          ...prev.filter((p) => timestamp - p.born < PACKET_DURATION),
          { id, born: timestamp, label },
        ]);
      } else {
        // Periodically prune expired packets
        setPackets((prev) => {
          const filtered = prev.filter((p) => timestamp - p.born < PACKET_DURATION);
          return filtered.length === prev.length ? prev : filtered;
        });
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [visible]);

  // Build polyline points strings
  const wave1Points = WAVE_XS.map((x) => `${x},${waveY(x, 28, 80, phase1)}`).join(" ");
  const wave2Points = WAVE_XS.map((x) => `${x},${waveY(x, 14, 140, phase2)}`).join(" ");

  // Origin/receiver pulse rings
  const originT = (elapsed % PULSE_DURATION) / PULSE_DURATION;
  const originR = 5 + (40 - 5) * originT;
  const originOpacity = 0.5 * (1 - originT);

  const receiverT = ((elapsed + PULSE_OFFSET) % PULSE_DURATION) / PULSE_DURATION;
  const receiverR = 5 + (40 - 5) * receiverT;
  const receiverOpacity = 0.5 * (1 - receiverT);

  // Glow pulse (5s period between 0.02 and 0.05)
  const glowOpacity = 0.035 + 0.015 * Math.sin((elapsed / 5000) * Math.PI * 2);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={`w-full transition-opacity duration-700 ease-out ${
        visible ? "opacity-100" : "opacity-0"
      } ${className ?? ""}`}
    >
      <svg viewBox="0 0 1200 320" className="w-full h-auto" aria-hidden="true">
        {/* Soft radial glow behind waveform */}
        <ellipse
          cx={600}
          cy={160}
          rx={500}
          ry={60}
          fill="#10B981"
          opacity={glowOpacity}
        />

        {/* Static tick marks */}
        {TICK_XS.map((x) => (
          <line
            key={x}
            x1={x}
            y1={156}
            x2={x}
            y2={164}
            stroke="#1E3A5F"
            strokeWidth={1}
            opacity={0.4}
          />
        ))}

        {/* Cyan secondary waveform (back) */}
        <polyline
          points={wave2Points}
          fill="none"
          stroke="#06B6D4"
          strokeWidth={1}
          opacity={0.3}
        />

        {/* Emerald primary waveform (front) */}
        <polyline
          points={wave1Points}
          fill="none"
          stroke="#10B981"
          strokeWidth={1.5}
          opacity={0.5}
        />

        {/* Origin pulse ring */}
        <circle
          cx={100}
          cy={160}
          r={originR}
          fill="none"
          stroke="#10B981"
          strokeWidth={1}
          opacity={originOpacity}
        />
        {/* Origin point */}
        <circle cx={100} cy={160} r={5} fill="#10B981" opacity={0.8} />

        {/* Receiver pulse ring */}
        <circle
          cx={1100}
          cy={160}
          r={receiverR}
          fill="none"
          stroke="#06B6D4"
          strokeWidth={1}
          opacity={receiverOpacity}
        />
        {/* Receiver point */}
        <circle cx={1100} cy={160} r={5} fill="#06B6D4" opacity={0.8} />

        {/* Data packets traveling along the waveform */}
        {packets.map((p) => {
          const t = (elapsed - (p.born - (startTimeRef.current ?? 0))) / PACKET_DURATION;
          if (t < 0 || t > 1) return null;
          const x = 100 + (1100 - 100) * t;
          const y = waveY(x, 28, 80, phase1);
          return (
            <g key={p.id}>
              <rect
                x={x - 18}
                y={y - 6}
                width={36}
                height={12}
                rx={3}
                fill="#10B981"
                opacity={0.6}
              />
              <text
                x={x}
                y={y + 2.5}
                textAnchor="middle"
                fill="#FFFFFF"
                fontSize={7}
                fontFamily="ui-monospace, SFMono-Regular, monospace"
              >
                {p.label}
              </text>
            </g>
          );
        })}

        {/* Bottom left static label */}
        <text
          x={20}
          y={310}
          fill="#10B981"
          fontSize={8}
          fontFamily="ui-monospace, SFMono-Regular, monospace"
          opacity={0.45}
        >
          CHANNEL OPEN
        </text>

        {/* Bottom right static label */}
        <text
          x={1180}
          y={310}
          textAnchor="end"
          fill="#06B6D4"
          fontSize={8}
          fontFamily="ui-monospace, SFMono-Regular, monospace"
          opacity={0.4}
        >
          END-TO-END SECURE
        </text>
      </svg>
    </div>
  );
};

export default OpenChannel;
