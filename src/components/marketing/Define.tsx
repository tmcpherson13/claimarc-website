import type { ReactNode } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

/**
 * Define
 *
 * Inline jargon helper. Wraps a term with a subtle dotted-underline cue;
 * hover/focus reveals a short definition in a tooltip popover. Used to
 * tame industry jargon ("bi-directional true-up", "propensity to pay",
 * "DSO", "835") without breaking copy flow.
 *
 * Example:
 *   <Define term="bi-directional true-up" definition="If the claim pays
 *     more than ClaimARC priced, the upside is returned to you." />
 */
interface Props {
  term: ReactNode;
  definition: ReactNode;
}

const Define = ({ term, definition }: Props) => (
  <Tooltip delayDuration={150}>
    <TooltipTrigger asChild>
      <span
        tabIndex={0}
        className="cursor-help border-b border-dotted border-[var(--text-lo)] decoration-from-font outline-none transition-colors hover:border-[var(--arc-1)] hover:text-[var(--text-hi)] focus-visible:border-[var(--arc-1)] focus-visible:text-[var(--text-hi)]"
      >
        {term}
      </span>
    </TooltipTrigger>
    <TooltipContent
      sideOffset={6}
      className="max-w-xs border-white/15 bg-[var(--ink-1)] text-[var(--text-hi)]"
    >
      {definition}
    </TooltipContent>
  </Tooltip>
);

export default Define;
