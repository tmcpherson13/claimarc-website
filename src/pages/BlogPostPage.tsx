import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Layout from "@/components/Layout";
import SeoHead from "@/components/SeoHead";
import { contentApi, ContentItem, estimateReadTime } from "@/lib/contentApi";
import ContentCta from "@/components/ContentCta";
import RelatedContent from "@/components/RelatedContent";

const BlogPostPage = () => {
  const { slug = "" } = useParams();
  const [params] = useSearchParams();
  const previewToken = params.get("preview");
  const [post, setPost] = useState<ContentItem | null>(null);
  const [loading, setLoading] = useState(true);

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

  return (
    <Layout>
      <SeoHead title={seoTitle} description={seoDescription} path={`/blog/${post.slug}`} />

      {previewToken && (
        <div className="bg-amber-100 border-b border-amber-300 text-amber-900 text-sm text-center py-2 px-4">
          Preview mode — viewing <strong className="capitalize">{post.status}</strong> content. Not visible to the public.
        </div>
      )}

      <article className="px-6 md:px-12 lg:px-16 py-16">
        <div className="max-w-3xl mx-auto">
          <Link
            to="/blog"
            className="text-sm text-[var(--emerald)] font-medium hover:underline"
          >
            ← Back to blog
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
            {post.tags.length > 0 && (
              <span className="flex flex-wrap gap-2 ml-2">
                {post.tags.map((t) => (
                  <span
                    key={t}
                    className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-xs"
                  >
                    {t}
                  </span>
                ))}
              </span>
            )}
          </div>

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

export default BlogPostPage;
