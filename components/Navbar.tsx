"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Search, Sun, Moon, Menu, X, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/posts", label: "Postagens" },
  { href: "/contact", label: "Contato" },
];

type NavPost = {
  title: string;
  slug: string;
};

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [posts, setPosts] = useState<NavPost[]>([]);
  const [postMenuOpen, setPostMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    async function loadPosts() {
      try {
        const res = await fetch("/api/posts");
        if (!res.ok) return;
        const data = (await res.json()) as NavPost[];
        setPosts(data.slice(0, 8));
      } catch {
        // fallback silencioso
      }
    }
    loadPosts();
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-background/80 backdrop-blur-md border-b border-border"
          : "bg-background/0"
      )}
    >
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-serif font-bold text-xl">
            <span className="text-accent">Blog</span>
            <span className="text-foreground">Moderno</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent transition-all group-hover:w-full" />
              </Link>
            ))}

            <div className="relative">
              <button
                onClick={() => setPostMenuOpen((v) => !v)}
                className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                aria-expanded={postMenuOpen}
                type="button"
              >
                Postagens <ChevronDown className="h-3 w-3" />
              </button>

              {postMenuOpen && posts.length > 0 && (
                <div className="absolute right-0 mt-2 w-64 overflow-hidden rounded-lg border border-border bg-background shadow-lg">
                  {posts.map((post) => (
                    <Link
                      key={post.slug}
                      href={`/posts/${post.slug}`}
                      onClick={() => setPostMenuOpen(false)}
                      className="block px-4 py-2 text-sm text-foreground hover:bg-accent/10"
                    >
                      {post.title}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <div className="relative">
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 rounded-full hover:bg-accent/10 transition-colors"
                aria-label="Buscar"
              >
                <Search className="h-4 w-4" />
              </button>

              {searchOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-background border border-border rounded-lg shadow-lg p-4">
                  <input
                    type="search"
                    placeholder="Buscar posts..."
                    className="w-full px-3 py-2 bg-muted rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                    autoFocus
                  />
                </div>
              )}
            </div>

            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-full hover:bg-accent/10 transition-colors"
              aria-label="Alternar tema"
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </button>

            {/* Mobile Menu */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-full hover:bg-accent/10 transition-colors md:hidden"
              aria-label="Menu"
            >
              {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileOpen && (
          <div className="md:hidden border-t border-border">
            <nav className="py-4 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/5 rounded-md transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              ))}

              <div className="border-t border-border pt-3">
                <p className="px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Postagens</p>
                {posts.slice(0, 6).map((post) => (
                  <Link
                    key={post.slug}
                    href={`/posts/${post.slug}`}
                    className="block px-4 py-2 text-sm text-foreground hover:bg-accent/5 rounded-md"
                    onClick={() => setMobileOpen(false)}
                  >
                    {post.title}
                  </Link>
                ))}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

