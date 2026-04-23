import { Helmet } from "react-helmet-async";
import { SITE_URL } from "@/config/routes";

interface SeoHeadProps {
  title: string;
  description: string;
  /** Path including leading slash, e.g. "/platform". Use "/" for home. */
  path: string;
  /**
   * Whether to emit `noindex, nofollow`. Defaults to true for this staging
   * deployment so it does not compete with the future production domain.
   * Remove the default (or pass false) once zdefense.ai is live.
   */
  noindex?: boolean;
}

/**
 * Centralized <head> tags for marketing routes.
 * - Canonical URLs are absolute and point at the staging host today.
 *   When the production domain is live, update SITE_URL in src/config/routes.ts.
 * - Robots noindex defaults ON for the staging domain.
 */
const SeoHead = ({ title, description, path, noindex = true }: SeoHeadProps) => {
  const canonical = `${SITE_URL}${path === "/" ? "/" : path.replace(/\/$/, "")}`;
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}
    </Helmet>
  );
};

export default SeoHead;
