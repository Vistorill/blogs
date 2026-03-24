# Documentação do Sistema de Blog Next.js + Strapi

## Visão Geral
Este é um sistema de blog desenvolvido com Next.js (frontend) integrado ao Strapi (backend headless CMS). O blog permite criar, gerenciar e exibir posts com categorias, autores, imagens de capa e outras funcionalidades.

## Arquitetura
- **Frontend**: Next.js 16 com App Router, TypeScript, Tailwind CSS
- **Backend**: Strapi v4 (CMS headless)
- **Banco de Dados**: SQLite (padrão do Strapi em desenvolvimento)
- **Deploy**: Próprio para Vercel/Netlify (frontend) e serviços como Railway/Heroku (Strapi)

## Estrutura de Pastas
```
blog-v2/
├── app/                    # App Router do Next.js
│   ├── layout.tsx         # Layout raiz
│   ├── page.tsx           # Página inicial
│   ├── posts/[slug]/      # Páginas dinâmicas de posts
│   └── globals.css        # Estilos globais
├── components/            # Componentes React
│   ├── Navbar.tsx         # Barra de navegação
│   └── blog/              # Componentes específicos do blog
│       ├── PostCard.tsx   # Card de post
│       ├── PostList.tsx   # Lista de posts
│       └── SectionHeader.tsx # Cabeçalhos de seção
├── lib/                   # Utilitários e APIs
│   └── api/
│       ├── posts.ts       # Funções de API para posts
│       └── strapi.ts      # Cliente e funções para Strapi
├── types/                 # Definições TypeScript
│   ├── blog.ts            # Tipos relacionados ao blog
│   └── index.ts           # Exportações de tipos
├── public/                # Arquivos estáticos
├── doc/                   # Documentação
└── Configurações: next.config.ts, tsconfig.json, etc.
```

## Funcionalidades Principais

### 1. Exibição de Posts
- **Página Inicial**: Lista posts em destaque e recentes
- **Página de Post**: Exibe conteúdo completo com imagem de capa
- **Navegação**: Links para posts individuais via slug

### 2. Integração com Strapi
- Busca posts via REST API
- População de relações (autor, categoria, imagem)
- Suporte a campos multilíngue (EN/PT)

### 3. Componentes
- **PostCard**: Exibe preview do post com título, excerpt, categoria
- **Navbar**: Navegação do site
- **Layout**: Estrutura comum das páginas

## Fluxo de Dados

### Busca de Posts
1. `getPosts()` em `lib/api/posts.ts` chama `strapiGetPosts()` em `strapi.ts`
2. `strapiGetPosts()` faz requisição para `/api/postagens` com parâmetros de paginação e populate
3. Resposta é normalizada para o tipo `BlogPost`
4. Posts são filtrados e ordenados conforme necessário

### Busca de Post por Slug
1. `getPostBySlug(slug)` busca todos os posts e filtra pelo slug decodificado
2. Slug da URL é decodificado com `decodeURIComponent()` para comparação correta

### Normalização de Dados
- `normalizePost()` converte resposta Strapi para `BlogPost`
- Trata campos multilíngue (EN: title/slug, PT: titulo/lesma)
- Resolve URLs de mídia juntando com `STRAPI_URL`

## Configurações

### Variáveis de Ambiente (.env.local)
```
STRAPI_URL=http://localhost:1337
STRAPI_POSTS_ENDPOINT=/api/postagens
STRAPI_TOKEN=<token-de-autenticação>
```

### Next.js Config (next.config.ts)
- Configuração de imagens remotas para Strapi
- Permite carregamento de imagens de localhost:1337 e domínios HTTPS

## Tipos de Dados

### BlogPost
```typescript
interface BlogPost {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featured: boolean;
  views: number;
  category: { name: string };
  author: { username: string };
  coverUrl: string | null;
  publishedAt: string | null;
}
```

### Estrutura Strapi
- **Content Type**: Postagens (api::postagen.postagen)
- **Campos**: título, lesma (slug), conteúdo, descrição, recurso (featured), visualizações, categoria, autor, imagem_de_capa, publishedAt
- **Relações**: Categoria e Autor como entidades separadas

## API Endpoints

### Strapi
- `GET /api/postagens` - Lista posts com filtros e paginação
- `GET /admin/*` - Painel administrativo

### Next.js
- `GET /` - Página inicial
- `GET /posts/[slug]` - Página de post individual

## Desenvolvimento

### Pré-requisitos
- Node.js 18+
- npm ou yarn
- Strapi CLI (opcional)

### Instalação
1. `npm install`
2. Configurar `.env.local` com URLs do Strapi
3. `npm run dev` para desenvolvimento
4. `npm run build` para produção

### Strapi
1. Instalar Strapi globalmente: `npm install -g @strapi/strapi`
2. Criar projeto: `strapi new meu-blog`
3. Configurar content types conforme tipos acima
4. `npm run develop` para iniciar em localhost:1337

## Deploy

### Frontend (Next.js)
- Vercel: Conectar repositório Git
- Netlify: Build command `npm run build`, publish directory `.next`
- Configurar variáveis de ambiente

### Backend (Strapi)
- Railway, Heroku ou similar
- Configurar banco PostgreSQL/MySQL em produção
- Migrar dados do SQLite local

## Problemas Conhecidos e Soluções

### 1. Populate Parameter Error
- **Erro**: "Invalid populate parameter"
- **Causa**: Uso incorreto de `populate[0]="*"`
- **Solução**: Usar `populate="*"` diretamente

### 2. Slug URL-encoded
- **Erro**: Comparação falha entre slug codificado e decodificado
- **Causa**: Next.js não decodifica params automaticamente em alguns casos
- **Solução**: Usar `decodeURIComponent(slug)` antes da busca

### 3. Imagem não Carrega
- **Erro**: 400 Bad Request no /_next/image
- **Causa**: Next.js Image não consegue buscar imagem externa
- **Solução**: Usar `<img>` em vez de `<Image>` para imagens locais

### 4. Erro SES Removing unpermitted intrinsics
- **Causa**: Segurança do Strapi (não afeta funcionalidade)
- **Solução**: Ignorar, é normal no admin do Strapi

## Melhorias Futuras
- Implementar ISR/SSG para melhor performance
- Adicionar sistema de comentários
- Implementar busca e filtros avançados
- Suporte a markdown no conteúdo
- Otimização de imagens com Cloudinary
- Autenticação de usuários
- Dashboard administrativo no Next.js

## Contribuição
1. Seguir convenções de código (ESLint, Prettier)
2. Adicionar testes para novas funcionalidades
3. Atualizar documentação conforme mudanças
4. Usar commits descritivos

## Suporte
Para dúvidas ou problemas, verificar:
- Logs do Next.js (`npm run dev`)
- Logs do Strapi
- Documentação oficial do Next.js e Strapi
- Issues no repositório