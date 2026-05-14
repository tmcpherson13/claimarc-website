import { Fragment } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

/**
 * PipelineStrip
 *
 * Full-width "process pipeline" sitting directly under the hero. Three
 * numbered nodes — Conversion → Intelligence → Acceleration — joined by
 * tick arrows that read left-to-right as a flow, not a menu. This is
 * ClaimARC's structural answer to a generic product chip strip: the
 * services are reframed as stages in one engine.
 *
 * Each node is keyed to its accent color (cyan / mid-blue / lime) which
 * is also reused on the matching service card's top bar elsewhere on the
 * page, so the color identity carries through.
 */
const NODES = [
  {
    ix: "01",
    name: "Claim to Cash Conversion",
    tag: "Paper, EOBs & correspondence → 835",
    color: "#00C8E6",
    to: "/eob-conversion",
  },
  {
    ix: "02",
    name: "AI Scoring",
    tag: "Propensity to pay, per claim",
    color: "#1474B4",
    to: "/why-claimarc",
  },
  {
    ix: "03",
    name: "Claims Accelerator",
    tag: "Funded in 1–2 days",
    color: "#7ED957",
    to: "/accelerator",
  },
];

const PipelineStrip = () => (
  <section aria-label="Platform pipeline">
    <div className="shell-wide">
      <div className="pipeline-strip">
        {NODES.map((n, i) => (
          <Fragment key={n.ix}>
            <Link to={n.to} className="pipeline-node" style={{ color: n.color }}>
              <span className="pn-index">{n.ix}</span>
              <span className="flex flex-col">
                <span className="pn-name">{n.name}</span>
                <span className="pn-tag">{n.tag}</span>
              </span>
            </Link>
            {i < NODES.length - 1 && (
              <span className="pipeline-arrow" aria-hidden="true">
                <ArrowRight size={16} />
              </span>
            )}
          </Fragment>
        ))}
      </div>
    </div>
  </section>
);

export default PipelineStrip;
