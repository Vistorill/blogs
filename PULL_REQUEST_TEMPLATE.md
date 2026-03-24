# 🚀 Pull Request: Integração Strapi + Home com Posts + Navbar Dinâmica

## 📝 Descrição

Integração completa do Next.js com Strapi CMS, incluindo renderização de posts na home page com grid responsivo, navbar com dropdown dinâmico de posts, e rota API interna para consumo do frontend.

## ✨ O que foi adicionado

### 1. **Integração com Strapi API** (`lib/api/strapi.ts`)
- Cliente HTTP autenticado com Bearer token
- Normalização de posts (suporte v4 nested + v5 flat)
- Tratamento de erros com fallback para mock data
- Cache com 1 hora de revalidação (ISR)

### 2. **Funções de Fetch** (`lib/api/posts.ts`)
- `getHomePosts()`: Retorna featured, mostRead e latestAI
- `getPostBySlug()`: Busca post individual
- Mock data de fallback automático

### 3. **Home Page Redesenhada** (`app/page.tsx`)
- Grid responsivo de posts (sm:2 cols, lg:3 cols)
- Deduplicação de posts por slug
- Seção "Inteligência Artificial" (filtrada por categoria)

### 4. **Página Individual de Post** (`app/posts/[slug]/page.tsx`)
- Renderização completa com hero + sidebar
- Barra de progresso de leitura
- Posts relacionados
- Botão compartilhar

### 5. **Navbar Dinâmica** (`components/Navbar.tsx`)
- Link "Postagens" com dropdown
- Carregamento de posts via `/api/posts`
- Menu responsivo mobile + desktop
- Dark mode integrado

### 6. **Componentes Reutilizáveis**
- `PostCard.tsx`: 3 variantes (featured/default/compact)
- `SectionHeader.tsx`: Cabeçalho de seção
- `AuthorCard.tsx`: Informações do autor
- `ReadingProgress.tsx`: Barra de progresso
- `ShareButton.tsx`: Compartilhamento social
- `RelatedPosts.tsx`: Posts relacionados
- `ScrollToTop.tsx`: Botão scroll-to-top

### 7. **API Route** (`app/api/posts/route.ts`)
- Endpoint `GET /api/posts` que retorna lista deduplicada
- CORS-friendly, consumível pelo frontend

## 🔧 Stack Técnico

- **Next.js 16** com App Router
- **TypeScript** para type-safety
- **Tailwind CSS** com design system
- **Strapi v4** para CMS
- **class-variance-authority** para component variants
- **next-themes** para dark mode
- **framer-motion** para animações
- **lucide-react** para ícones

## 📋 Checklist

- [x] Integração Strapi funcionando
- [x] Home page renderizando posts
- [x] Navbar com dropdown de posts
- [x] Página individual de post
- [x] API interna `/api/posts`
- [x] Type-safety com TypeScript
- [x] Build testado com sucesso
- [x] Mock data como fallback
- [x] README atualizado
- [x] Dark mode funcional

## 🧪 Como Testar

```bash
# 1. Configure .env.local
STRAPI_URL=http://localhost:1337
STRAPI_TOKEN=<seu_token>
STRAPI_POSTS_ENDPOINT=/api/postagens

# 2. Build
npm run build

# 3. Dev
npm run dev

# 4. Acesse
http://localhost:3000 # Home com grid de posts
http://localhost:3000/posts/seu-slug # Post individual
http://localhost:3000/api/posts # API json
```

## 📸 Screenshots

Home page: Grid de 3 colunas com cards de posts
Post page: Hero + conteúdo completo + sidebar
Navbar: Dropdown "Postagens" com lista dinâmica

## 🚀 Próximos Passos (Sugerido)

- [ ] Search/filtro de posts
- [ ] Paginação na home
- [ ] Comentários (Disqus, Giscus)
- [ ] Analytics (Google Analytics, Vercel Analytics)
- [ ] SEO optimizations (Open Graph, sitemap)
- [ ] Feed RSS

## 🔗 Issues Relacionadas

Resolve: Deploy de blog integrado com Strapi

---

**Feito com ❤️ por Marcos**
