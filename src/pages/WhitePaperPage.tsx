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

const WhitePaperPage = () => {
  const { slug = "" } = useParams();
  const [params] = useSearchParams();
  const previewToken = params.get("preview");
  const [post, setPost] = useState<ContentItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [pdf, setPdf] = useState<Asset | null>(null);
  const [hero, setHero] = useState<Asset | null>(null);

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

  const downloadButton = pdf && (
    <a
      href={pdf.publicUrl}
      download={pdf.originalName}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-2 bg-[var(--emerald)] text-white px-5 py-3 rounded font-semibold hover:bg-emerald-600 transition-colors shadow-sm"
    >
      ⬇ Download PDF
      <span className="text-xs opacity-80 font-normal">
        ({(pdf.sizeBytes / 1024 / 1024).toFixed(1)} MB)
      </span>
    </a>
  );

  return (
    <Layout>
      <SeoHead title={seoTitle} description={seoDescription} path={`/white-papers/${post.slug}`} />

      {previewToken && (
        <div className="bg-amber-100 border-b border-amber-300 text-amber-900 text-sm text-center py-2 px-4">
          Preview mode — viewing <strong className="capitalize">{post.status}</strong> content. Not visible to the public.
        </div>
      )}

      {/* Hero band */}
      <header className="bg-slate-50 border-b border-slate-200 px-6 md:px-12 lg:px-16 py-10 md:py-14">
        <div className="max-w-3xl mx-auto">
          <Link
            to="/white-papers"
            className="text-sm text-[var(--emerald)] font-medium hover:underline"
          >
            ← Back to white papers
          </Link>
          <p className="mt-4 text-xs uppercase tracking-wider text-[var(--emerald)] font-semibold">
            White paper
          </p>
          <h1 className="mt-2 text-3xl md:text-5xl font-bold text-[var(--navy)] leading-tight">
            {post.title}
          </h1>
          {post.summary && (
            <p className="mt-4 text-lg md:text-xl text-slate-600 leading-relaxed">
              {post.summary}
            </p>
          )}
          <div className="mt-6">
            <BylineRow
              authorId={post.authorId}
              publishedAt={post.publishedAt}
              updatedAt={post.updatedAt}
              readTime={estimateReadTime(post.body)}
            />
          </div>
          {downloadButton && <div className="mt-6">{downloadButton}</div>}
        </div>
      </header>

      {hero && (
        <div className="px-6 md:px-12 lg:px-16 -mt-px">
          <div className="max-w-5xl mx-auto">
            <img
              src={hero.publicUrl}
              alt={post.title}
              className="w-full max-h-[28rem] object-cover rounded-b-lg"
            />
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
              <div className="mb-10 rounded-lg border border-slate-200 overflow-hidden bg-slate-50 shadow-sm">
                <div className="flex items-center justify-between px-4 py-2 border-b border-slate-200 bg-white">
                  <p className="text-sm font-semibold text-[var(--navy)] truncate">
                    {pdf.originalName}
                  </p>
                  <a
                    href={pdf.publicUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-[var(--emerald)] font-semibold hover:underline shrink-0 ml-3"
                  >
                    Open in new tab ↗
                  </a>
                </div>
                <object
                  data={`${pdf.publicUrl}#view=FitH`}
                  type="application/pdf"
                  className="w-full h-[80vh] min-h-[600px] bg-white"
                  aria-label={`${post.title} PDF preview`}
                >
                  <iframe
                    src={`${pdf.publicUrl}#view=FitH`}
                    title={`${post.title} PDF preview`}
                    className="w-full h-[80vh] min-h-[600px] bg-white"
                  />
                  <div className="p-6 text-center text-sm text-slate-600">
                    Your browser can't display this PDF inline.{" "}
                    <a
                      href={pdf.publicUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[var(--emerald)] font-semibold hover:underline"
                    >
                      Open the PDF
                    </a>{" "}
                    in a new tab instead.
                  </div>
                </object>
              </div>
            )}

            <div
              className="article-prose prose prose-slate max-w-none
              prose-headings:text-[var(--navy)] prose-headings:scroll-mt-24
              prose-a:text-[var(--emerald)] prose-a:no-underline hover:prose-a:underline
              prose-strong:text-[var(--navy)]
              prose-img:rounded-lg"
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

            {downloadButton && (
              <div className="mt-12 p-6 border border-emerald-200 bg-emerald-50/40 rounded-lg text-center">
                <p className="font-semibold text-[var(--navy)]">
                  Take this research with you
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  Download the full PDF to share with your team.
                </p>
                <div className="mt-4">{downloadButton}</div>
              </div>
            )}

            <ContentCta type={post.ctaType} />
            <InternalLinkRail />
            <RelatedContent ids={post.relatedIds} />
          </div>
        </div>
      </article>

      {/* Mobile sticky download CTA */}
      {pdf && (
        <div className="lg:hidden fixed bottom-0 inset-x-0 z-30 bg-white border-t border-slate-200 px-4 py-3 shadow-lg">
          <a
            href={pdf.publicUrl}
            download={pdf.originalName}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 w-full bg-[var(--emerald)] text-white py-3 rounded font-semibold"
          >
            ⬇ Download PDF ({(pdf.sizeBytes / 1024 / 1024).toFixed(1)} MB)
          </a>
        </div>
      )}
    </Layout>
  );
};

export default WhitePaperPage;
