import { Helmet } from "react-helmet-async";
import { SITE_URL } from "@/config/routes";

interface SeoHeadProps {
  title: string;
  description: string;
  /** Path including leading slash, e.g. "/platform". Use "/" for home. */
  path: string;
  /**
   * Whether to emit `noindex, nofollow`. Defaults to false (indexable).
   * Pass `noindex={true}` explicitly on staging pages or admin routes.
   */
  noindex?: boolean;
}

/**
 * Centralized <head> tags for marketing routes.
 * - Canonical URLs are absolute and point at the staging host today.
 *   When the production domain is live, update SITE_URL in src/config/routes.ts.
 * - Robots noindex defaults OFF (pages are indexable by default).
 *   Pass noindex={true} explicitly for staging or admin routes.
 */
const SeoHead = ({ title, description, path, noindex = false }: SeoHeadProps) => {
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
