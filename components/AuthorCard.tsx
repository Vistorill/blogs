import type { BlogPost } from "@/types";

interface AuthorCardProps {
  post: BlogPost;
}

export function AuthorCard({ post }: AuthorCardProps) {
  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
          <span className="text-lg font-semibold text-muted-foreground">
            {post.author.username.charAt(0).toUpperCase()}
          </span>
        </div>
        <div>
          <h3 className="font-semibold">{post.author.username}</h3>
          <p className="text-sm text-muted-foreground">Autor</p>
        </div>
      </div>
      <p className="text-sm text-muted-foreground">
        Especialista em tecnologia e inovação, compartilhando insights sobre o futuro digital.
      </p>
    </div>
  );
}