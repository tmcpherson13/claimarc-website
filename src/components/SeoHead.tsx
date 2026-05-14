import { Helmet } from "react-helmet-async";
import { SITE_URL } from "@/config/routes";

interface SeoHeadProps {
  title: string;
  description: string;
  /** Path including leading slash, e.g. "/platform". Use "/" for home. */
  path: string;
  /**
   * Path or absolute URL of the Open Graph / Twitter card image. Falls
   * back to the brand stacked logo when not specified.
   */
  image?: string;
  /**
   * Whether to emit `noindex, nofollow`. Defaults to false (indexable).
   * Pass `noindex={true}` explicitly on staging pages or admin routes.
   */
  noindex?: boolean;
  /**
   * Open Graph type — e.g. "website" (default) or "article" for blog/
   * insight pages. Drives the Twitter card and og:type tags.
   */
  ogType?: "website" | "article";
}

const DEFAULT_OG_IMAGE = "/brand/claimarc-stacked-color.png";

/**
 * Centralized <head> tags for marketing routes. Emits canonical URL,
 * description, robots directives, and a complete Open Graph + Twitter
 * card set. Pass `image` and `ogType="article"` for insight/blog pages so
 * each PDF whitepaper gets its own shareable card.
 */
const SeoHead = ({
  title,
  description,
  path,
  image = DEFAULT_OG_IMAGE,
  noindex = false,
  ogType = "website",
}: SeoHeadProps) => {
  const canonical = `${SITE_URL}${path === "/" ? "/" : path.replace(/\/$/, "")}`;
  const absoluteImage = image.startsWith("http") ? image : `${SITE_URL}${image}`;
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}

      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonical} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={absoluteImage} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={absoluteImage} />
    </Helmet>
  );
};

export default SeoHead;
