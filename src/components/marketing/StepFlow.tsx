import Reveal from "./Reveal";

export interface FlowStep {
  title: string;
  lead: string;
  body: string;
  footnote: string;
}

const nodeColors = ["var(--navy)", "var(--cyan)", "var(--lime)", "var(--navy)"];

/**
 * Four-step horizontal process flow with numbered nodes and a connecting rail.
 * Mirrors the "Four steps." layout used across ClaimARC collateral.
 */
const StepFlow = ({ steps }: { steps: FlowStep[] }) => (
  <div className="mt-14">
    {/* Rail + nodes (desktop) */}
    <div className="relative hidden md:block">
      <div className="absolute left-0 right-0 top-6 h-px bg-[var(--line)]" />
      <div
        className="grid"
        style={{ gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))` }}
      >
        {steps.map((_, i) => (
          <div key={i} className="flex justify-start">
            <div
              className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full text-base font-bold text-white ring-4 ring-white"
              style={{ background: nodeColors[i % nodeColors.length] }}
            >
              {i + 1}
            </div>
          </div>
        ))}
      </div>
    </div>

    <div className="mt-0 grid grid-cols-1 gap-10 md:mt-8 md:grid-cols-2 lg:grid-cols-4">
      {steps.map((step, i) => (
        <Reveal key={step.title} delay={i * 80} className="relative">
          <div
            className="mb-4 flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold text-white md:hidden"
            style={{ background: nodeColors[i % nodeColors.length] }}
          >
            {i + 1}
          </div>
          <h3 className="text-base font-bold uppercase tracking-wide text-[var(--navy)]">
            {step.title}
          </h3>
          <p className="mt-1 text-sm font-semibold text-[var(--navy)]/80">{step.lead}</p>
          <p className="mt-3 text-sm leading-relaxed text-[var(--slate)]">{step.body}</p>
          <p className="mt-4 border-t border-[var(--line)] pt-3 text-xs font-semibold text-[var(--cyan)]">
            {step.footnote}
          </p>
        </Reveal>
      ))}
    </div>
  </div>
);

export default StepFlow;
