import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getPostBySlug } from "@/lib/api/posts";
import { ReadingProgress } from "@/components/ReadingProgress";
import { ShareButton } from "@/components/ShareButton";
import { AuthorCard } from "@/components/AuthorCard";
import { RelatedPosts } from "@/components/RelatedPosts";
import { formatContent } from "@/lib/utils";
import type { BlogPost } from "@/types";

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug).trim();
  const post = await getPostBySlug(decodedSlug);

  if (!post) {
    return {
      title: "Post não encontrado",
    };
  }

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: post.coverUrl ? [{ url: post.coverUrl }] : [],
    },
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug).trim();
  const post = await getPostBySlug(decodedSlug);

  if (!post) notFound();

  const readingTime = Math.ceil(post.content.split(/\s+/).length / 200);

  return (
    <div className="min-h-screen bg-background">
      <ReadingProgress />

      {/* Hero Section */}
      <section className="relative h-[60vh] overflow-hidden">
        {post.coverUrl && (
          <img
            src={post.coverUrl}
            alt={post.title}
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
          <div className="mx-auto max-w-4xl">
            <div className="mb-4">
              <span className="inline-flex items-center rounded-full bg-accent/10 px-3 py-1 text-sm font-medium text-accent">
                {post.category.name}
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-serif font-bold text-foreground leading-tight mb-4">
              {post.title}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mb-6">
              {post.excerpt}
            </p>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <span>{post.author.username}</span>
              <span>•</span>
              <span>{new Date(post.publishedAt || "").toLocaleDateString("pt-BR")}</span>
              <span>•</span>
              <span>{readingTime} min de leitura</span>
              <span>•</span>
              <span>{post.views} visualizações</span>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="mx-auto max-w-4xl px-4 py-12 md:px-6">
        <div className="grid gap-8 lg:grid-cols-12">
          {/* Main Content */}
          <article className="lg:col-span-8">
            <div
              className="prose prose-lg dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: formatContent(post.content) }}
            />
          </article>

          {/* Sidebar */}
          <aside className="lg:col-span-4">
            <div className="sticky top-24 space-y-8">
              {/* Reading Info */}
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="font-semibold mb-4">Sobre este post</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Tempo de leitura</span>
                    <span>{readingTime} min</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Visualizações</span>
                    <span>{post.views}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Publicado em</span>
                    <span>{new Date(post.publishedAt || "").toLocaleDateString("pt-BR")}</span>
                  </div>
                </div>
                <div className="mt-6">
                  <ShareButton
                    title={post.title}
                    slug={post.slug}
                  />
                </div>
              </div>

              {/* Author */}
              <AuthorCard post={post} />
            </div>
          </aside>
        </div>

        {/* Related Posts */}
        <RelatedPosts currentPost={post} />
      </div>
    </div>
  );
}

