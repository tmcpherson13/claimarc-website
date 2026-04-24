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

  return (
    <Layout>
      <SeoHead title={seoTitle} description={seoDescription} path={`/blog/${post.slug}`} />

      {previewToken && (
        <div className="bg-amber-100 border-b border-amber-300 text-amber-900 text-sm text-center py-2 px-4">
          Preview mode — viewing <strong className="capitalize">{post.status}</strong> content. Not visible to the public.
        </div>
      )}

      {/* Hero band */}
      <header className="bg-slate-50 border-b border-slate-200 px-6 md:px-12 lg:px-16 py-10 md:py-14">
        <div className="max-w-3xl mx-auto">
          <Link
            to="/blog"
            className="text-sm text-[var(--emerald)] font-medium hover:underline"
          >
            ← Back to blog
          </Link>
          <p className="mt-4 text-xs uppercase tracking-wider text-[var(--emerald)] font-semibold">
            Blog
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

      <article className="px-6 md:px-12 lg:px-16 py-12 md:py-16">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_3fr] gap-10 lg:gap-16">
          <ArticleTOC body={parsed.body} />

          <div className="min-w-0 max-w-[68ch] mx-auto lg:mx-0">
            <KeyTakeaways items={parsed.takeaways} />

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

            <ContentCta type={post.ctaType} />
            <InternalLinkRail />
            <RelatedContent ids={post.relatedIds} />
          </div>
        </div>
      </article>
    </Layout>
  );
};

export default BlogPostPage;
