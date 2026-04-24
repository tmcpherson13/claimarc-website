import { useEffect, useMemo, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Layout from "@/components/Layout";
import SeoHead from "@/components/SeoHead";
import { contentApi, ContentItem, estimateReadTime } from "@/lib/contentApi";
import { assetsApi, Asset } from "@/lib/assetsApi";
import ContentCta from "@/components/ContentCta";
import RelatedContent from "@/components/RelatedContent";
import BylineRow from "@/components/public/BylineRow";
import ArticleTOC, { headingId } from "@/components/public/ArticleTOC";
import KeyTakeaways from "@/components/public/KeyTakeaways";
import InternalLinkRail from "@/components/public/InternalLinkRail";
import { parseTakeaways } from "@/lib/markdownExtras";

const BlogPostPage = () => {
  const { slug = "" } = useParams();
  const [params] = useSearchParams();
  const previewToken = params.get("preview");
  const [post, setPost] = useState<ContentItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [hero, setHero] = useState<Asset | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const max = document.body.scrollHeight - window.innerHeight;
      const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
      setProgress(Math.min(100, Math.max(0, pct)));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const load = async () => {
      if (previewToken) {
        const item = await contentApi.fetchByPreviewToken(previewToken);
        setPost(item && item.contentType === "blog" && item.slug === slug ? item : null);
      } else {
        const item = await contentApi.getBySlug("blog", slug);
        setPost(item);
      }
      setLoading(false);
    };
    load();
  }, [slug, previewToken]);

  useEffect(() => {
    if (!post?.heroAssetId) {
      setHero(null);
      return;
    }
    assetsApi.getMany([post.heroAssetId]).then((m) => setHero(m[post.heroAssetId!] ?? null));
  }, [post?.heroAssetId]);

  const parsed = useMemo(() => parseTakeaways(post?.body ?? ""), [post?.body]);

  if (loading) {
    return (
      <Layout>
        <div className="max-w-3xl mx-auto px-6 py-20 text-slate-500">Loading…</div>
      </Layout>
    );
  }

  const isPreviewable = !!previewToken && !!post;
  if (!post || (!isPreviewable && post.status !== "published")) {
    return (
      <Layout>
        <SeoHead
          title="Post not found — ZDefense Blog"
          description="This post is unavailable."
          path={`/blog/${slug}`}
        />
        <div className="max-w-3xl mx-auto px-6 py-20 text-center">
          <h1 className="text-3xl font-bold text-[var(--navy)]">Post not found</h1>
          <p className="mt-3 text-slate-600">This post may have been unpublished or moved.</p>
          <Link
            to="/blog"
            className="mt-6 inline-block text-[var(--emerald)] font-semibold hover:underline"
          >
            ← Back to blog
          </Link>
        </div>
      </Layout>
    );
  }

  const seoTitle = post.seoTitle?.trim() || `${post.title} – ZDefense AI³ Blog`;
  const seoDescription = post.seoDescription?.trim() || post.summary;

  const visibleTags = (post.tags ?? []).filter((t) => !t.startsWith("audience:"));

  return (
    <Layout>
      <div
        className="fixed top-0 left-0 z-50 h-0.5 bg-[var(--emerald)] transition-all duration-75"
        style={{ width: `${progress}%` }}
      />
      <SeoHead title={seoTitle} description={seoDescription} path={`/blog/${post.slug}`} />

      {previewToken && (
        <div className="bg-amber-100 border-b border-amber-300 text-amber-900 text-sm text-center py-2 px-4">
          Preview mode — viewing <strong className="capitalize">{post.status}</strong> content. Not visible to the public.
        </div>
      )}

      {/* Hero */}
      {hero ? (
        <header className="relative overflow-hidden min-h-[44vh] flex items-end">
          <img
            src={hero.publicUrl}
            alt={post.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--navy)] via-[var(--navy)]/60 to-transparent" />
          <div className="relative z-10 max-w-3xl mx-auto w-full px-6 md:px-12 lg:px-16 pb-10 md:pb-14">
            <Link
              to="/blog"
              className="text-white/70 hover:text-white text-sm transition-colors"
            >
              ← All Insights
            </Link>
            <p className="mt-4 text-[var(--emerald)] text-xs uppercase tracking-widest font-semibold">
              Blog
            </p>
            <h1 className="mt-2 text-white text-3xl md:text-5xl font-bold leading-tight">
              {post.title}
            </h1>
            {post.summary && (
              <p className="mt-3 text-white/80 text-lg leading-relaxed">
                {post.summary}
              </p>
            )}
            <div className="mt-5">
              <BylineRow
                authorId={post.authorId}
                publishedAt={post.publishedAt}
                updatedAt={post.updatedAt}
                readTime={estimateReadTime(post.body)}
                nameClassName="text-white"
                metaClassName="text-white/70"
                titleClassName="text-white/70"
              />
            </div>
          </div>
        </header>
      ) : (
        <header className="bg-[var(--navy)] px-6 md:px-12 lg:px-16 py-14 md:py-20">
          <div className="max-w-3xl mx-auto">
            <Link
              to="/blog"
              className="text-[var(--emerald)]/80 hover:text-[var(--emerald)] text-sm transition-colors"
            >
              ← All Insights
            </Link>
            <p className="mt-5 text-[var(--emerald)] text-xs uppercase tracking-widest font-semibold">
              Blog
            </p>
            <h1 className="mt-2 text-white text-3xl md:text-5xl lg:text-6xl font-bold leading-tight">
              {post.title}
            </h1>
            {post.summary && (
              <p className="mt-4 text-slate-300 text-lg md:text-xl leading-relaxed">
                {post.summary}
              </p>
            )}
            <div className="border-t border-white/10 mt-8 pt-8">
              <BylineRow
                authorId={post.authorId}
                publishedAt={post.publishedAt}
                updatedAt={post.updatedAt}
                readTime={estimateReadTime(post.body)}
                nameClassName="text-white"
                metaClassName="text-slate-400"
                titleClassName="text-slate-400"
              />
            </div>
          </div>
        </header>
      )}

      {/* Tags strip */}
      {visibleTags.length > 0 && (
        <div className="bg-white border-b border-slate-100 px-6 md:px-12 lg:px-16 py-3">
          <div className="max-w-3xl mx-auto flex gap-2 flex-wrap items-center">
            <span className="text-xs text-slate-400 font-medium">Topics:</span>
            {visibleTags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-[var(--lgray)] text-slate-600 text-xs rounded-full font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      <article className="px-6 md:px-12 lg:px-16 py-12 md:py-16">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_3fr] gap-10 lg:gap-16">
          <ArticleTOC body={parsed.body} />

          <div className="min-w-0 max-w-[68ch] mx-auto lg:mx-0">
            <KeyTakeaways items={parsed.takeaways} />

            <div
              className="article-prose prose max-w-none
                prose-headings:text-[var(--navy)]
                prose-headings:font-bold
                prose-headings:scroll-mt-24
                prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-4
                prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
                prose-p:text-slate-700 prose-p:leading-[1.85]
                prose-p:text-[17px]
                prose-a:text-[var(--emerald)]
                prose-a:no-underline hover:prose-a:underline
                prose-strong:text-[var(--navy)]
                prose-blockquote:border-l-4
                prose-blockquote:border-[var(--emerald)]
                prose-blockquote:bg-emerald-50/40
                prose-blockquote:rounded-r-lg
                prose-blockquote:py-1
                prose-blockquote:not-italic
                prose-blockquote:text-[var(--navy)]
                prose-img:rounded-xl prose-img:shadow-md
                prose-li:text-slate-700 prose-li:leading-relaxed
                prose-hr:border-slate-200"
            >
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h2: ({ children, ...props }) => {
                    const text = String(children);
                    return (
                      <h2 id={headingId(text)} {...props}>
                        {children}
                      </h2>
                    );
                  },
                }}
              >
                {parsed.body}
              </ReactMarkdown>
            </div>

            <ContentCta type={post.ctaType} />

            <div className="mt-12 pt-8 border-t border-slate-100">
              <p className="text-sm font-semibold text-[var(--navy)] mb-4">
                Share this article
              </p>
              <div className="flex gap-3 flex-wrap">
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  className="flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200 text-sm text-slate-600 hover:border-[var(--emerald)] hover:text-[var(--emerald)] transition-colors"
                >
                  {copied ? "✓ Copied" : "🔗 Copy link"}
                </button>
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200 text-sm text-slate-600 hover:border-[var(--emerald)] hover:text-[var(--emerald)] transition-colors"
                >
                  LinkedIn
                </a>
                <a
                  href={`mailto:?subject=${encodeURIComponent(post.title)}&body=${encodeURIComponent(window.location.href)}`}
                  className="flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200 text-sm text-slate-600 hover:border-[var(--emerald)] hover:text-[var(--emerald)] transition-colors"
                >
                  ✉ Email
                </a>
              </div>
            </div>

            <InternalLinkRail />
            <RelatedContent ids={post.relatedIds} />
          </div>
        </div>
      </article>
    </Layout>
  );
};

export default BlogPostPage;
