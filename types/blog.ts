export type BlogCategory = {
  name: string;
};

export type BlogAuthor = {
  username: string;
};

export type BlogPost = {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featured: boolean;
  views: number;
  category: BlogCategory;
  author: BlogAuthor;
  coverUrl?: string | null;
  publishedAt?: string | null;
};

