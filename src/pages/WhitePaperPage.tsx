import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Layout from "@/components/Layout";
import SeoHead from "@/components/SeoHead";
import { contentApi, ContentItem, estimateReadTime } from "@/lib/contentApi";
import { assetsApi, Asset } from "@/lib/assetsApi";
import ContentCta from "@/components/ContentCta";
import RelatedContent from "@/components/RelatedContent";

const WhitePaperPage = () => {
  const { slug = "" } = useParams();
  const [post, setPost] = useState<ContentItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [pdf, setPdf] = useState<Asset | null>(null);

  useEffect(() => {
    contentApi
      .getBySlug("white_paper", slug)
      .then(setPost)
      .finally(() => setLoading(false));
  }, [slug]);

  useEffect(() => {
    if (!post?.pdfAssetId) {
      setPdf(null);
      return;
    }
    assetsApi.getMany([post.pdfAssetId]).then((m) => setPdf(m[post.pdfAssetId!] ?? null));
  }, [post?.pdfAssetId]);

  if (loading) {
    return (
      <Layout>
        <div className="max-w-3xl mx-auto px-6 py-20 text-slate-500">Loading…</div>
      </Layout>
    );
  }

  if (!post || post.status !== "published") {
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

  return (
    <Layout>
      <SeoHead title={seoTitle} description={seoDescription} path={`/white-papers/${post.slug}`} />

      <article className="px-6 md:px-12 lg:px-16 py-16">
        <div className="max-w-3xl mx-auto">
          <Link
            to="/white-papers"
            className="text-sm text-[var(--emerald)] font-medium hover:underline"
          >
            ← Back to white papers
          </Link>
          <h1 className="mt-6 text-4xl md:text-5xl font-bold text-[var(--navy)] leading-tight">
            {post.title}
          </h1>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-slate-500">
            {post.publishedAt && (
              <time dateTime={post.publishedAt}>
                {new Date(post.publishedAt).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
            )}
            <span>·</span>
            <span>{estimateReadTime(post.body)}</span>
          </div>

          {pdf && (
            <a
              href={pdf.publicUrl}
              download={pdf.originalName}
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex items-center gap-2 bg-[var(--emerald)] text-white px-5 py-3 rounded font-semibold hover:bg-emerald-600 transition-colors"
            >
              ⬇ Download PDF ({(pdf.sizeBytes / 1024 / 1024).toFixed(1)} MB)
            </a>
          )}

          <div
            className="prose prose-slate max-w-none mt-10
            prose-headings:text-[var(--navy)]
            prose-a:text-[var(--emerald)] prose-a:no-underline hover:prose-a:underline
            prose-strong:text-[var(--navy)]"
          >
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.body}</ReactMarkdown>
          </div>

          <ContentCta type={post.ctaType} />
          <RelatedContent ids={post.relatedIds} />
        </div>
      </article>
    </Layout>
  );
};

export default WhitePaperPage;
