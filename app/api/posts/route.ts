import { NextResponse } from "next/server";
import { getHomePosts } from "@/lib/api/posts";

export async function GET() {
  try {
    const { featured, mostRead, latestAI } = await getHomePosts();
    const merged = [...featured, ...mostRead, ...latestAI].reduce((acc, post) => {
      if (!acc.some((x) => x.slug === post.slug)) acc.push(post);
      return acc;
    }, [] as Array<{ title: string; slug: string }>);

    return NextResponse.json(merged);
  } catch (error) {
    return NextResponse.json(
      { error: "Não foi possível carregar posts" },
      { status: 500 },
    );
  }
}
