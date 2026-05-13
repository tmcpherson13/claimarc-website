import { Linkedin } from "lucide-react";
import { leadership } from "@/config/leadership";
import Reveal from "./Reveal";

/** Renders the leadership grid. Initials avatar fallback when photo missing. */
const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");

const LeadershipGrid = () => (
  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
    {leadership.map((p, i) => (
      <Reveal key={p.name} delay={i * 90}>
        <article className="glass group relative h-full p-6 transition-all duration-300 hover:border-white/20">
          {/* Photo / initials */}
          <div className="relative mx-auto mb-5 h-28 w-28">
            <div
              aria-hidden="true"
              className="absolute -inset-1 rounded-full opacity-50 blur-md transition-opacity duration-300 group-hover:opacity-90"
              style={{
                background:
                  "conic-gradient(from 120deg, var(--arc-1), var(--arc-2), var(--arc-3), var(--arc-1))",
              }}
            />
            <div className="relative h-28 w-28 overflow-hidden rounded-full border border-white/10 bg-[var(--ink-2)]">
              {p.photo ? (
                <img
                  src={p.photo}
                  alt={p.name}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              ) : (
                <div
                  className="flex h-full w-full items-center justify-center text-2xl font-bold tracking-wide text-white/80"
                  style={{
                    background:
                      "radial-gradient(circle at 30% 30%, rgba(0,200,255,0.18), transparent 70%), radial-gradient(circle at 75% 80%, rgba(255,79,163,0.18), transparent 70%)",
                  }}
                >
                  {initials(p.name)}
                </div>
              )}
            </div>
          </div>

          <h3 className="text-center text-base font-bold text-[var(--text-hi)]">
            {p.name}
          </h3>
          <p className="mt-1 text-center text-xs font-semibold uppercase tracking-[0.14em] text-[var(--arc-1)]">
            {p.role}
          </p>
          <p className="mt-4 text-center text-sm leading-relaxed text-[var(--text-mid)]">
            {p.bio}
          </p>

          {p.linkedin && (
            <div className="mt-5 flex justify-center">
              <a
                href={p.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${p.name} on LinkedIn`}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-[var(--text-mid)] transition-colors hover:border-white/25 hover:text-white"
              >
                <Linkedin size={15} />
              </a>
            </div>
          )}
        </article>
      </Reveal>
    ))}
  </div>
);

export default LeadershipGrid;
