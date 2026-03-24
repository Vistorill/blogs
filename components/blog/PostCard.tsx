import Link from "next/link";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import type { BlogPost } from "@/types";

const postCardVariants = cva(
  "group relative overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm transition-all duration-300 hover:shadow-lg",
  {
    variants: {
      variant: {
        default: "flex flex-col",
        featured: "flex flex-row h-48",
        compact: "flex flex-col p-4",
      },
      size: {
        sm: "min-h-[200px]",
        md: "min-h-[280px]",
        lg: "min-h-[360px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

interface PostCardProps extends VariantProps<typeof postCardVariants> {
  post: BlogPost;
}

function getCategoryColor(name: string): string {
  const colors = [
    "bg-red-500/10 text-red-600 border-red-200",
    "bg-blue-500/10 text-blue-600 border-blue-200",
    "bg-green-500/10 text-green-600 border-green-200",
    "bg-yellow-500/10 text-yellow-600 border-yellow-200",
    "bg-purple-500/10 text-purple-600 border-purple-200",
    "bg-pink-500/10 text-pink-600 border-pink-200",
  ];
  const hash = name.split("").reduce((a, b) => a + b.charCodeAt(0), 0);
  return colors[hash % colors.length];
}

function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

function formatDate(date: string | null | undefined): string {
  if (!date) return "";
  return new Date(date).toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function CategoryBadge({ name }: { name: string }) {
  return (
    <span className={cn("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium", getCategoryColor(name))}>
      {name}
    </span>
  );
}

export default function PostCard({ post, variant = "default", size = "md" }: PostCardProps) {
  const readingTime = calculateReadingTime(post.content);

  if (variant === "featured") {
    return (
      <Link href={`/posts/${post.slug}`} className={cn(postCardVariants({ variant, size }))}>
        {post.coverUrl && (
          <div className="w-1/3 overflow-hidden">
            <img
              src={post.coverUrl}
              alt={post.title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        )}
        <div className="flex flex-1 flex-col justify-between p-6">
          <div>
            <CategoryBadge name={post.category.name} />
            <h3 className="mt-3 text-xl font-serif font-semibold leading-tight text-balance line-clamp-2">
              {post.title}
            </h3>
            <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
              {post.excerpt}
            </p>
          </div>
          <div className="mt-4 flex items-center gap-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <div className="h-6 w-6 rounded-full bg-muted" />
              <span>{post.author.username}</span>
            </div>
            <span>•</span>
            <span>{formatDate(post.publishedAt)}</span>
            <span>•</span>
            <span>{readingTime} min</span>
          </div>
        </div>
      </Link>
    );
  }

  if (variant === "compact") {
    return (
      <Link href={`/posts/${post.slug}`} className={cn(postCardVariants({ variant }))}>
        <div className="flex items-start gap-3">
          {post.coverUrl && (
            <img
              src={post.coverUrl}
              alt={post.title}
              className="h-16 w-16 rounded-lg object-cover transition-transform duration-300 group-hover:scale-105"
            />
          )}
          <div className="flex-1">
            <CategoryBadge name={post.category.name} />
            <h3 className="mt-2 text-sm font-medium leading-tight line-clamp-2">
              {post.title}
            </h3>
            <p className="mt-1 text-xs text-muted-foreground line-clamp-1">
              {post.excerpt}
            </p>
            <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
              <span>{post.author.username}</span>
              <span>•</span>
              <span>{readingTime} min</span>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  // Default variant
  return (
    <Link href={`/posts/${post.slug}`} className={cn(postCardVariants({ variant, size }))}>
      {post.coverUrl && (
        <div className="aspect-[16/9] overflow-hidden">
          <img
            src={post.coverUrl}
            alt={post.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      )}
      <div className="flex flex-1 flex-col justify-between p-6">
        <div>
          <CategoryBadge name={post.category.name} />
          <h3 className="mt-3 text-lg font-serif font-semibold leading-tight text-balance line-clamp-2">
            {post.title}
          </h3>
          <p className="mt-2 text-sm text-muted-foreground line-clamp-3">
            {post.excerpt}
          </p>
        </div>
        <div className="mt-4 flex items-center gap-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <div className="h-6 w-6 rounded-full bg-muted" />
            <span>{post.author.username}</span>
          </div>
          <span>•</span>
          <span>{formatDate(post.publishedAt)}</span>
          <span>•</span>
          <span>{readingTime} min</span>
        </div>
      </div>
    </Link>
  );
}

