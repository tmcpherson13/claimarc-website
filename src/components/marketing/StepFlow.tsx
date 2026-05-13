import Reveal from "./Reveal";

export interface FlowStep {
  title: string;
  lead: string;
  body: string;
  footnote: string;
}

const nodeColors = ["var(--arc-1)", "var(--arc-2)", "var(--arc-3)", "var(--lime)"];

/**
 * Four-step horizontal process flow with numbered nodes and a connecting rail.
 */
const StepFlow = ({ steps }: { steps: FlowStep[] }) => (
  <div className="mt-14">
    {/* Rail + nodes (desktop) */}
    <div className="relative hidden md:block">
      <div
        className="absolute left-0 right-0 top-6 h-px"
        style={{
          background:
            "linear-gradient(90deg, var(--arc-1), var(--arc-2), var(--arc-3), var(--lime))",
          opacity: 0.5,
        }}
      />
      <div
        className="grid"
        style={{ gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))` }}
      >
        {steps.map((_, i) => {
          const color = nodeColors[i % nodeColors.length];
          return (
            <div key={i} className="flex justify-start">
              <div
                className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full text-base font-bold text-white"
                style={{
                  background: "var(--ink-0)",
                  border: `1.5px solid ${color}`,
                  boxShadow: `0 0 0 4px var(--ink-0), 0 0 24px -2px ${color}`,
                }}
              >
                {i + 1}
              </div>
            </div>
          );
        })}
      </div>
    </div>

    <div className="mt-0 grid grid-cols-1 gap-10 md:mt-8 md:grid-cols-2 lg:grid-cols-4">
      {steps.map((step, i) => {
        const color = nodeColors[i % nodeColors.length];
        return (
          <Reveal key={step.title} delay={i * 80} className="relative">
            <div
              className="mb-4 flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold text-white md:hidden"
              style={{
                background: "var(--ink-0)",
                border: `1.5px solid ${color}`,
              }}
            >
              {i + 1}
            </div>
            <h3 className="text-base font-bold uppercase tracking-wide text-[var(--text-hi)]">
              {step.title}
            </h3>
            <p className="mt-1 text-sm font-semibold text-[var(--text-mid)]">
              {step.lead}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-[var(--text-lo)]">
              {step.body}
            </p>
            <p
              className="mt-4 border-t border-white/[0.08] pt-3 text-xs font-semibold"
              style={{ color }}
            >
              {step.footnote}
            </p>
          </Reveal>
        );
      })}
    </div>
  </div>
);

export default StepFlow;
