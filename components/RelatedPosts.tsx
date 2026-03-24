import Link from "next/link";
import PostCard from "@/components/blog/PostCard";
import type { BlogPost } from "@/types";

interface RelatedPostsProps {
  currentPost: BlogPost;
}

// Mock related posts - in real app, fetch from API
const mockRelatedPosts: BlogPost[] = [
  {
    title: "Inteligência Artificial no Mercado de Trabalho",
    slug: "ia-mercado-trabalho",
    content: "Conteúdo sobre IA...",
    excerpt: "Como a IA está transformando o mercado de trabalho moderno.",
    featured: false,
    views: 850,
    category: { name: "IA" },
    author: { username: "marcos" },
    coverUrl: null,
    publishedAt: "2024-01-15T00:00:00.000Z",
  },
  {
    title: "Tendências de Desenvolvimento Web 2024",
    slug: "tendencias-web-2024",
    content: "Conteúdo sobre web...",
    excerpt: "As principais tendências que vão dominar o desenvolvimento web.",
    featured: false,
    views: 620,
    category: { name: "Programação" },
    author: { username: "marcos" },
    coverUrl: null,
    publishedAt: "2024-01-10T00:00:00.000Z",
  },
];

export function RelatedPosts({ currentPost }: RelatedPostsProps) {
  // Filter posts from same category, excluding current
  const related = mockRelatedPosts.filter(
    (post) => post.category.name === currentPost.category.name && post.slug !== currentPost.slug
  );

  if (related.length === 0) return null;

  return (
    <section className="mt-16">
      <h2 className="text-2xl font-serif font-bold mb-8">Posts Relacionados</h2>
      <div className="grid gap-6 md:grid-cols-2">
        {related.map((post) => (
          <PostCard key={post.slug} post={post} variant="default" size="md" />
        ))}
      </div>
    </section>
  );
}