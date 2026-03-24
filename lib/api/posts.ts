import type { BlogPost } from "@/types";
import { getPostBySlug as strapiGetPostBySlug, getPosts as strapiGetPosts } from "@/lib/api/strapi";

const mockPosts: BlogPost[] = [
  {
    title: "Robôs domésticos começam a ser adotados",
    slug: "robos-domesticos-comecam-a-ser-adotados",
    content: "Texto completo...",
    excerpt:
      "Robôs domésticos começam a ser adotados para tarefas diárias, prometendo mais conforto e eficiência nas residências.",
    featured: true,
    views: 1240,
    category: { name: "Robótica" },
    author: { username: "marcos" },
    coverUrl: null,
    publishedAt: null,
  },
  {
    title: "Novo Smartphone Projetor 3D chega ao mercado",
    slug: "novo-smartphone-projetor-3d",
    content: "Texto completo...",
    excerpt:
      "Inovação transforma a forma como vemos nossas telas e abre espaço para novas experiências.",
    featured: true,
    views: 980,
    category: { name: "Hologramas" },
    author: { username: "marcos" },
    coverUrl: null,
    publishedAt: null,
  },
  {
    title: "Tecnologia 6G chega às metrópoles brasileiras",
    slug: "tecnologia-6g-chega-as-metropoles-brasileiras",
    content: "Texto completo...",
    excerpt:
      "A promessa de velocidade e baixa latência pode revolucionar a forma como vivemos nos grandes centros.",
    featured: true,
    views: 1520,
    category: { name: "Internet" },
    author: { username: "marcos" },
    coverUrl: null,
    publishedAt: null,
  },
  {
    title: "Protótipo de veículo voador é apresentado",
    slug: "prototipo-de-veiculo-voador-e-apresentado",
    content: "Texto completo...",
    excerpt:
      "Novo conceito marca o início de uma era de transportes aéreos pessoais e mobilidade urbana.",
    featured: false,
    views: 2100,
    category: { name: "Veículos" },
    author: { username: "marcos" },
    coverUrl: null,
    publishedAt: null,
  },
  {
    title: "Nova geração de consoles de videogame é lançada",
    slug: "nova-geracao-de-consoles-e-lancada",
    content: "Texto completo...",
    excerpt:
      "Gráficos ultra-realistas e novas tecnologias prometem elevar o padrão de imersão e performance.",
    featured: false,
    views: 1870,
    category: { name: "Realidade Virtual" },
    author: { username: "marcos" },
    coverUrl: null,
    publishedAt: null,
  },
  {
    title: "Projeto busca oferecer internet de alta velocidade via satélite",
    slug: "projeto-busca-oferecer-internet-de-alta-velocidade-via-satelite",
    content: "Texto completo...",
    excerpt:
      "Satélites prometem cobertura em áreas remotas e acesso confiável com baixa instabilidade.",
    featured: false,
    views: 1330,
    category: { name: "Internet" },
    author: { username: "marcos" },
    coverUrl: null,
    publishedAt: null,
  },
];

function shouldUseMock() {
  return process.env.STRAPI_USE_MOCK === "true";
}

export async function getHomePosts(): Promise<{
  featured: BlogPost[];
  mostRead: BlogPost[];
  latestAI: BlogPost[];
}> {
  if (shouldUseMock()) {
    const allPosts = mockPosts;
    const featured = allPosts.slice(0, 6);
    const mostRead = [...allPosts].sort((a, b) => b.views - a.views).slice(0, 8);
    const latestAI = allPosts
      .filter((p) => /inteligência|ai|ia/i.test(p.category.name))
      .slice(0, 6);
    return { featured, mostRead, latestAI: latestAI.length ? latestAI : allPosts.slice(0, 6) };
  }

  try {
    const allPosts = await strapiGetPosts({ limit: 50, sort: "publishedAt:desc" });
    const featured = allPosts.slice(0, 6); // Primeiros 6 como "featured"
    const mostRead = allPosts.slice(0, 8); // Mesmo que all, mas limitado
    const latestAI = allPosts.filter(p => /inteligência|ai|ia/i.test(p.category.name)).slice(0, 6);

    console.log('All posts:', allPosts.length);
    console.log('Featured posts:', featured.length);
    console.log('Most read posts:', mostRead.length);
    console.log('Latest AI posts:', latestAI.length);

    // Evita sections vazias
    const safeFeatured = featured.length ? featured : allPosts.slice(0, 6);
    const safeMostRead = mostRead.length ? mostRead : safeFeatured;
    const safeLatest = latestAI.length ? latestAI : safeMostRead.slice(0, 6);

    return { featured: safeFeatured, mostRead: safeMostRead, latestAI: safeLatest };
  } catch (error) {
    console.log('API error, using mock:', error);
    const allPosts = mockPosts;
    const featured = allPosts.slice(0, 6);
    const mostRead = [...allPosts].sort((a, b) => b.views - a.views).slice(0, 8);
    const latestAI = allPosts.slice(0, 6);
    return { featured, mostRead, latestAI };
  }
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  if (shouldUseMock()) return mockPosts.find((p) => p.slug === slug) ?? null;
  try {
    return await strapiGetPostBySlug(slug);
  } catch {
    return mockPosts.find((p) => p.slug === slug) ?? null;
  }
}

