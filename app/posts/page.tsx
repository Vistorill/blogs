import PostCard from "@/components/blog/PostCard";
import SectionHeader from "@/components/blog/SectionHeader";
import { getHomePosts } from "@/lib/api/posts";

export default async function PostsPage() {
  const { featured, mostRead, latestAI } = await getHomePosts();

  const allPosts = [...featured, ...mostRead, ...latestAI].reduce((acc, post) => {
    if (!acc.some((x) => x.slug === post.slug)) acc.push(post);
    return acc;
  }, [] as typeof featured);

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-6">
        <section className="mb-10">
          <SectionHeader title="Postagens" />
          <p className="mt-3 text-muted-foreground">Todas as postagens disponíveis via API do Strapi.</p>
        </section>

        <section>
          {allPosts.length === 0 ? (
            <p className="text-center text-muted-foreground">Nenhum post encontrado.</p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {allPosts.map((post) => (
                <PostCard key={post.slug} post={post} variant="default" size="md" />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
