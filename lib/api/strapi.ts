import type { BlogPost } from "@/types";

type StrapiV4Response<T> = {
  data: T;
  meta?: unknown;
  error?: { message?: string };
};

type StrapiEntity<TAttributes> = {
  id: number;
  documentId?: string;
  title?: string;
  slug?: string;
  content?: string;
  description?: string;
  feature?: unknown;
  views?: number;
  category?: unknown;
  author?: unknown;
  coverImage?: unknown;
  publishedAt?: string | null;
  attributes: TAttributes;
};

type StrapiRelation<T> = {
  data: T | null;
};

type StrapiMedia = {
  data: StrapiEntity<{
    url?: string | null;
    alternativeText?: string | null;
    formats?: Record<string, { url?: string | null }>;
  }> | null;
};

type StrapiFlatMedia = {
  url?: string | null;
  formats?: Record<string, { url?: string | null }>;
};

type PostAttributes = {
  // EN fields
  title?: string;
  slug?: string;
  content?: string;
  excerpt?: string;
  featured?: boolean;
  views?: number;
  category?: StrapiRelation<StrapiEntity<{ name?: string }>>;
  author?: StrapiRelation<StrapiEntity<{ username?: string }>>;
  cover?: StrapiMedia;
  // PT fields
  titulo?: string;
  lesma?: string;
  contente?: string;
  descricao?: string;
  recurso?: boolean;
  visualizacoes?: number;
  categoria?: StrapiRelation<StrapiEntity<{ name?: string; nome?: string }>>;
  autor?: StrapiRelation<StrapiEntity<{ username?: string; nome?: string }>>;
  imagem_de_capa?: StrapiMedia;
  publishedAt?: string | null;
};

function joinUrl(base: string, path: string) {
  const a = base.replace(/\/+$/, "");
  const b = path.replace(/^\/+/, "");
  return `${a}/${b}`;
}

function buildQuery(params: Record<string, unknown>) {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null) continue;
    if (Array.isArray(value)) {
      value.forEach((v) => search.append(key, String(v)));
      continue;
    }
    search.set(key, String(value));
  }
  const qs = search.toString();
  return qs ? `?${qs}` : "";
}

function strapiConfig() {
  const baseUrl = process.env.STRAPI_URL;
  const token = process.env.STRAPI_TOKEN;
  const postsEndpoint = process.env.STRAPI_POSTS_ENDPOINT ?? "/api/postagens";
  return { baseUrl, token, postsEndpoint };
}

async function strapiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const { baseUrl, token } = strapiConfig();
  if (!baseUrl) {
    throw new Error("STRAPI_URL não configurada");
  }

  const url = joinUrl(baseUrl, path);
  const res = await fetch(url, {
    ...init,
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init?.headers ?? {}),
    },
    next: { revalidate: 3600 }, // Revalidate every hour
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Erro ao buscar Strapi (${res.status}): ${text || res.statusText}`);
  }

  const contentType = res.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    const text = await res.text().catch(() => "");
    throw new Error(
      `Resposta inválida do Strapi (esperado JSON). Verifique se está usando /api e não /admin. Trecho: ${text.slice(0, 120)}`,
    );
  }

  return (await res.json()) as T;
}

async function fetchPostsData(postsEndpoint: string, queryCandidates: string[]) {
  let lastError: unknown = null;
  for (const query of queryCandidates) {
    try {
      const json = await strapiFetch<StrapiV4Response<Array<StrapiEntity<PostAttributes>>>>(
        `${postsEndpoint}${query}`,
      );
      return json?.data ?? [];
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError instanceof Error ? lastError : new Error("Falha ao carregar posts da Strapi");
}

function resolveMediaUrl(cover: StrapiMedia | undefined, baseUrl: string): string | null {
  const data = cover?.data;
  const url =
    data?.attributes?.formats?.large?.url ??
    data?.attributes?.formats?.medium?.url ??
    data?.attributes?.formats?.small?.url ??
    data?.attributes?.url ??
    null;
  if (!url) return null;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return joinUrl(baseUrl, url);
}

function resolveFlatMediaUrl(cover: unknown, baseUrl: string): string | null {
  if (!Array.isArray(cover) || cover.length === 0) return null;
  const first = cover[0] as StrapiFlatMedia;
  const url =
    first?.formats?.large?.url ??
    first?.formats?.medium?.url ??
    first?.formats?.small?.url ??
    first?.url ??
    null;
  if (!url) return null;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return joinUrl(baseUrl, url);
}

function parseFeatured(value: unknown): boolean {
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value > 0;
  if (typeof value === "string") {
    const v = value.trim().toLowerCase();
    if (!v) return false;
    if (v === "false" || v === "0" || v === "nao" || v === "não" || v === "no") return false;
    // Seu payload traz "feature" como string textual.
    // Consideramos texto não vazio como destaque.
    return true;
  }
  return false;
}

function normalizePost(entity: StrapiEntity<PostAttributes>): BlogPost {
  const { baseUrl } = strapiConfig();
  const a = entity.attributes ?? ({} as PostAttributes);

  // v4-like nested relation/media format
  const nestedCategoryName =
    a.category?.data?.attributes?.name ??
    a.categoria?.data?.attributes?.name ??
    a.categoria?.data?.attributes?.nome;
  const nestedAuthorUsername =
    a.author?.data?.attributes?.username ??
    a.autor?.data?.attributes?.username ??
    a.autor?.data?.attributes?.nome;
  const nestedCover = a.cover ?? a.imagem_de_capa;

  // v5/flat format from your payload
  const flatCategoryName =
    typeof entity.category === "string"
      ? entity.category
      : typeof entity.category === "object" && entity.category !== null
        ? ((entity.category as { name?: string; nome?: string }).name ??
          (entity.category as { name?: string; nome?: string }).nome)
        : undefined;
  const flatAuthorUsername =
    typeof entity.author === "string"
      ? entity.author
      : typeof entity.author === "object" && entity.author !== null
        ? ((entity.author as { username?: string; nome?: string }).username ??
          (entity.author as { username?: string; nome?: string }).nome)
        : undefined;

  const title = a.title ?? a.titulo ?? entity.title ?? "Sem título";
  const slug = (a.slug ?? a.lesma ?? entity.slug ?? "").trim();
  const content = a.content ?? a.contente ?? entity.content ?? "";
  const excerpt = a.excerpt ?? a.descricao ?? entity.description ?? "";
  const featured = parseFeatured(a.featured ?? a.recurso ?? entity.feature);
  const views = Number(a.views ?? a.visualizacoes ?? entity.views ?? 0);
  const categoryName = nestedCategoryName ?? flatCategoryName ?? "Geral";
  const authorUsername = nestedAuthorUsername ?? flatAuthorUsername ?? "unknown";
  const coverUrl = baseUrl
    ? resolveMediaUrl(nestedCover, baseUrl) ?? resolveFlatMediaUrl(entity.coverImage, baseUrl)
    : null;

  return {
    title,
    slug,
    content,
    excerpt,
    featured,
    views,
    category: { name: categoryName },
    author: { username: authorUsername },
    publishedAt: a.publishedAt ?? entity.publishedAt ?? null,
    coverUrl,
  };
}

export async function getPosts(params?: {
  featured?: boolean;
  limit?: number;
  sort?: string;
}): Promise<BlogPost[]> {
  const { featured, limit = 20, sort = "publishedAt:desc" } = params ?? {};
  const { postsEndpoint } = strapiConfig();
  const queryCandidates = [
    buildQuery({
      "pagination[page]": 1,
      "pagination[pageSize]": Math.max(limit, 50),
      populate: "*",
    }),
    buildQuery({
      "pagination[page]": 1,
      "pagination[pageSize]": Math.max(limit, 50),
    }),
    "",
  ];

  let data = (await fetchPostsData(postsEndpoint, queryCandidates)).map(normalizePost);

  if (sort) {
    const [field, direction] = sort.split(":");
    const dir = direction === "asc" ? 1 : -1;
    if (field === "views") {
      data = [...data].sort((a, b) => (a.views - b.views) * dir);
    } else if (field === "publishedAt") {
      data = [...data].sort((a, b) => {
        const aTime = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
        const bTime = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
        return (aTime - bTime) * dir;
      });
    }
  }

  if (featured !== undefined) {
    data = data.filter((post) => post.featured === featured);
  }

  return data.slice(0, limit);
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const { postsEndpoint } = strapiConfig();
  const queryCandidates = [
    buildQuery({
      "pagination[page]": 1,
      "pagination[pageSize]": 100,
      populate: "*",
    }),
    buildQuery({
      "pagination[page]": 1,
      "pagination[pageSize]": 100,
    }),
    "",
  ];
  const posts = (await fetchPostsData(postsEndpoint, queryCandidates)).map(normalizePost);
  return posts.find((post) => post.slug === slug) ?? null;
}

