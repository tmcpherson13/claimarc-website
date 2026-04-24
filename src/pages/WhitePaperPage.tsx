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
import PdfViewer from "@/components/public/PdfViewer";

const WhitePaperPage = () => {
  const { slug = "" } = useParams();
  const [params] = useSearchParams();
  const previewToken = params.get("preview");
  const [post, setPost] = useState<ContentItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [pdf, setPdf] = useState<Asset | null>(null);
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
        setPost(item && item.contentType === "white_paper" && item.slug === slug ? item : null);
      } else {
        const item = await contentApi.getBySlug("white_paper", slug);
        setPost(item);
      }
      setLoading(false);
    };
    load();
  }, [slug, previewToken]);

  useEffect(() => {
    const ids = [post?.pdfAssetId, post?.heroAssetId].filter(Boolean) as string[];
    if (ids.length === 0) {
      setPdf(null);
      setHero(null);
      return;
    }
    assetsApi.getMany(ids).then((m) => {
      setPdf(post?.pdfAssetId ? m[post.pdfAssetId] ?? null : null);
      setHero(post?.heroAssetId ? m[post.heroAssetId] ?? null : null);
    });
  }, [post?.pdfAssetId, post?.heroAssetId]);

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
          title="White paper not found — ZDefense"
          description="This white paper is unavailable."
          path={`/white-papers/${slug}`}
        />
        <div className="max-w-3xl mx-auto px-6 py-20 text-center">
          <h1 className="text-3xl font-bold text-[var(--navy)]">White paper not found</h1>
          <Link
            to="/white-papers"
            className="mt-6 inline-block text-[var(--emerald)] font-semibold hover:underline"
          >
            ← Back to white papers
          </Link>
        </div>
      </Layout>
    );
  }

  const seoTitle = post.seoTitle?.trim() || `${post.title} – ZDefense White Paper`;
  const seoDescription = post.seoDescription?.trim() || post.summary;

  const visibleTags = (post.tags ?? []).filter((t) => !t.startsWith("audience:"));
  const sizeMb = pdf ? (pdf.sizeBytes / 1024 / 1024).toFixed(1) : null;
  const readTime = estimateReadTime(post.body);
  const publishedFmt = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "ZDefense";

  return (
    <Layout>
      <div
        className="fixed top-0 left-0 z-50 h-0.5 bg-[var(--emerald)] transition-all duration-75"
        style={{ width: `${progress}%` }}
      />
      <SeoHead title={seoTitle} description={seoDescription} path={`/white-papers/${post.slug}`} />

      {previewToken && (
        <div className="bg-amber-100 border-b border-amber-300 text-amber-900 text-sm text-center py-2 px-4">
          Preview mode — viewing <strong className="capitalize">{post.status}</strong> content. Not visible to the public.
        </div>
      )}

      {/* Hero — navy editorial */}
      <header className="bg-[var(--navy)] px-6 md:px-12 lg:px-16 py-16 md:py-24">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 text-sm text-white/50">
            <Link to="/blog" className="hover:text-white transition-colors">
              Insights
            </Link>
            <span>/</span>
            <span className="text-white/70">White Paper</span>
          </div>

          <div className="mt-6 inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-white/80 text-xs font-semibold uppercase tracking-wider">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--emerald)]" />
            Research · White Paper
          </div>

          <h1 className="text-white text-3xl md:text-5xl lg:text-[52px] font-bold leading-tight mt-5 max-w-3xl">
            {post.title}
          </h1>

          {post.summary && (
            <p className="text-slate-300 text-lg md:text-xl mt-5 leading-relaxed max-w-2xl">
              {post.summary}
            </p>
          )}

          <div className="border-t border-white/10 mt-8 pt-8">
            <BylineRow
              authorId={post.authorId}
              publishedAt={post.publishedAt}
              updatedAt={post.updatedAt}
              readTime={readTime}
              nameClassName="text-white"
              metaClassName="text-slate-400"
              titleClassName="text-slate-400"
            />
          </div>

          {pdf && (
            <div className="mt-8 flex flex-wrap gap-4 items-center">
              <a
                href={pdf.publicUrl}
                download={pdf.originalName}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 bg-[var(--emerald)] hover:bg-emerald-500 text-white px-6 py-3 rounded-lg font-semibold transition-colors shadow-lg"
              >
                ↓ Download PDF
                <span className="text-xs opacity-75 font-normal">{sizeMb} MB</span>
              </a>
              <span className="text-white/40 text-sm">or read below</span>
            </div>
          )}
        </div>
      </header>

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

      <article className="px-6 md:px-12 lg:px-16 py-12 md:py-16 pb-32 md:pb-16">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,3fr)] gap-10 lg:gap-16">
          <ArticleTOC body={parsed.body} />

          <div className="min-w-0 max-w-[68ch] mx-auto lg:mx-0 lg:col-start-2">
            <KeyTakeaways items={parsed.takeaways} />

            {!parsed.body.trim() && !pdf && (
              <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
                <p className="font-semibold text-[var(--navy)]">No content yet</p>
                <p className="mt-1 text-sm text-slate-600">
                  This white paper has no body text and no PDF attached. Open it in the admin
                  editor and either write the body or pick a PDF asset under
                  “Downloadable PDF”.
                </p>
              </div>
            )}

            {pdf && (
              <aside className="mb-10 bg-[var(--lgray)] rounded-xl p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-xs uppercase tracking-widest text-slate-400 font-semibold">
                    Document type
                  </p>
                  <p className="mt-1 text-sm font-semibold text-[var(--navy)]">White Paper</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-slate-400 font-semibold">
                    Published
                  </p>
                  <p className="mt-1 text-sm font-semibold text-[var(--navy)]">{publishedFmt}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-slate-400 font-semibold">
                    Read time
                  </p>
                  <p className="mt-1 text-sm font-semibold text-[var(--navy)]">
                    {post.body?.trim() ? readTime : "PDF only"}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-slate-400 font-semibold">
                    Format
                  </p>
                  <p className="mt-1 text-sm font-semibold text-[var(--navy)]">
                    {pdf ? "PDF + Web" : "Web only"}
                  </p>
                </div>
              </aside>
            )}

            {pdf && (
              <div className="not-prose mb-10 rounded-xl overflow-hidden border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between bg-[var(--navy)] px-5 py-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="h-2 w-2 rounded-full bg-[var(--emerald)] shrink-0" />
                    <p className="text-white text-sm font-medium truncate">{post.title}</p>
                  </div>
                  <a
                    href={pdf.publicUrl}
                    download={pdf.originalName}
                    target="_blank"
                    rel="noreferrer"
                    className="text-white/60 hover:text-white text-xs flex items-center gap-1 transition-colors shrink-0"
                  >
                    ↓ Download
                  </a>
                </div>
                <PdfViewer
                  url={pdf.publicUrl}
                  fileName={pdf.originalName}
                  sizeBytes={pdf.sizeBytes}
                  title={post.title}
                  storageKey={pdf.id}
                />
              </div>
            )}

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

            {pdf && (
              <div className="not-prose mt-16 rounded-xl bg-[var(--navy)] p-8 md:p-10 text-center">
                <p className="text-[var(--emerald)] text-xs uppercase tracking-widest font-semibold">
                  Full Research Document
                </p>
                <p className="text-white text-2xl font-bold mt-2">
                  Take this white paper with you
                </p>
                <p className="text-slate-400 text-sm mt-2">
                  Download the complete PDF to share with your team or read offline.
                </p>
                <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
                  <a
                    href={pdf.publicUrl}
                    download={pdf.originalName}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-2 bg-[var(--emerald)] hover:bg-emerald-500 text-white px-7 py-3 rounded-lg font-semibold transition-colors"
                  >
                    ↓ Download PDF ({sizeMb} MB)
                  </a>
                  <Link
                    to="/contact"
                    className="inline-flex items-center justify-center gap-2 border border-white/20 text-white/80 hover:text-white hover:border-white/40 px-7 py-3 rounded-lg font-semibold transition-colors"
                  >
                    Discuss with ZTech →
                  </Link>
                </div>
              </div>
            )}

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

      {/* Mobile sticky download CTA */}
      {pdf && (
        <div className="lg:hidden fixed bottom-0 inset-x-0 z-30 bg-[var(--navy)] border-t border-white/10 px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-white text-xs font-semibold truncate">{post.title}</p>
              <p className="text-white/40 text-[10px]">White Paper · PDF available</p>
            </div>
            <a
              href={pdf.publicUrl}
              download={pdf.originalName}
              target="_blank"
              rel="noreferrer"
              className="shrink-0 bg-[var(--emerald)] text-white px-5 py-2.5 rounded-lg text-sm font-semibold whitespace-nowrap"
            >
              ↓ Download
            </a>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default WhitePaperPage;
