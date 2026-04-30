# 🗞️ Yakanga Web Média — Guide complet de configuration Supabase + Next.js

> **Stack** : Next.js 14+ (App Router) · Supabase · TypeScript  
> **Slogan** : *La mémoire des cultures contemporaines*

---

## 📋 TABLE DES MATIÈRES

0. [Charte Graphique Yakanga](#-0-charte-graphique-yakanga)
1. [Prérequis](#1-prérequis)
2. [Créer le projet Supabase](#2-créer-le-projet-supabase)
3. [Créer toutes les tables — 2 méthodes](#3-créer-toutes-les-tables)
   - [Méthode A — SQL Editor (recommandée)](#méthode-a--sql-editor-recommandée-)
   - [Méthode B — Dashboard (Table Editor)](#méthode-b--dashboard-table-editor-)
4. [Script SQL complet](#4-script-sql-complet)
5. [Row Level Security (RLS)](#5-row-level-security-rls)
6. [Storage Bucket (médias)](#6-storage-bucket)
7. [Configurer Next.js](#7-configurer-nextjs)
8. [Architecture des routes](#8-architecture-des-routes)
9. [Récapitulatif des tables](#9-récapitulatif-des-tables)
10. [Checklist finale](#10-checklist-finale)

---

## 🎨 0. Charte Graphique Yakanga

> Cette charte est extraite directement du **logo officiel** et de la **maquette UI** fournis. Elle est la loi — aucun développeur front ne doit s'en écarter.

---

### 0.1 Palette de couleurs

| Rôle | Nom | Code HEX | Usage |
|---|---|---|---|
| **Primaire** | Vert Forêt | `#2D6A2D` | Header, hero, boutons CTA, nav active, liens |
| **Secondaire** | Marron Terre | `#5C3A1E` | Texte du logo "Yaka", sections culturelles, fond de blocs éditoriaux |
| **Accent** | Orange Feu | `#E8440A` | Boutons secondaires, badges, highlights, masque africain |
| **Accent 2** | Rouge Vif | `#CC2200` | Points d'insistance, alertes, notifications |
| **Accent 3** | Turquoise | `#3AADA8` | Tags, liens secondaires, détails décoratifs |
| **Fond Crème** | Ivoire | `#F5F0C8` | Background global du logo — fond de page clair |
| **Fond Blanc** | Blanc pur | `#FFFFFF` | Header, cards, fond du body |
| **Fond Sombre** | Brun Nuit | `#2C1A0E` | Footer, sections premium |
| **Texte principal** | Gris Foncé | `#1A1A1A` | Corps de texte |
| **Texte secondaire** | Gris Moyen | `#666666` | Métadonnées, dates, auteurs |
| **Bordures** | Gris Clair | `#E0E0E0` | Séparateurs, bordures de cards |

```css
/* variables CSS à définir dans globals.css */
:root {
  --color-primary:       #2D6A2D;  /* vert forêt */
  --color-secondary:     #5C3A1E;  /* marron terre */
  --color-accent:        #E8440A;  /* orange feu */
  --color-accent-red:    #CC2200;
  --color-accent-teal:   #3AADA8;
  --color-bg-cream:      #F5F0C8;  /* fond ivoire logo */
  --color-bg-white:      #FFFFFF;
  --color-bg-dark:       #2C1A0E;  /* footer */
  --color-text:          #1A1A1A;
  --color-text-muted:    #666666;
  --color-border:        #E0E0E0;
}
```

---

### 0.2 Typographie

Le logo utilise une police **display africaine bold** à empattements organiques. Le site doit refléter ce caractère **fort, culturel et lisible**.

| Rôle | Police recommandée | Import |
|---|---|---|
| **Titres / Logo** | `Abril Fatface` ou `Playfair Display Black` | Google Fonts |
| **Sous-titres / Rubriques** | `Bebas Neue` (caps) | Google Fonts |
| **Corps de texte** | `Lora` (serif élégant) | Google Fonts |
| **UI / Labels / Méta** | `DM Sans` | Google Fonts |

```html
<!-- Dans <head> du layout.tsx -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Abril+Fatface&family=Bebas+Neue&family=Lora:ital,wght@0,400;0,600;1,400&family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet">
```

```css
:root {
  --font-display:  'Abril Fatface', serif;     /* titres hero, logo texte */
  --font-heading:  'Bebas Neue', sans-serif;   /* rubriques, section headers */
  --font-body:     'Lora', serif;              /* corps des articles */
  --font-ui:       'DM Sans', sans-serif;      /* navigation, boutons, méta */
}
```

---

### 0.3 Structure visuelle de la page (basée sur la maquette)

```
┌─────────────────────────────────────────────────────────────┐
│  HEADER — fond blanc                                        │
│  [Logo Yakanga]          [Nav: Accueil Rubriques Contact]   │
│  [barre de recherche]                                       │
├─────────────────────────────────────────────────────────────┤
│  BANDE PUB — fond neutre ou image                           │
├─────────────────────────────────────────────────────────────┤
│  HERO / À LA UNE — fond VERT FORÊT (#2D6A2D)               │
│  Titre principal (blanc) + 3 vignettes articles featured    │
│  Bouton CTA : ORANGE FEU (#E8440A)                         │
├─────────────────────────────────────────────────────────────┤
│  ACTUALITÉS CULTURELLES — fond MARRON TERRE (#5C3A1E)       │
│  Titre section : blanc bold caps                            │
│  Grille 2 colonnes : cards avec image + titre + date        │
├────────────────────────┬────────────────────────────────────┤
│  PORTRAITS / INTERVIEWS│  SIDEBAR                           │
│  fond blanc            │  Articles populaires               │
│  Cards horizontales    │  Newsletter widget                 │
│                        │  Pub sidebar                       │
├────────────────────────┴────────────────────────────────────┤
│  FOOTER — fond BRUN NUIT (#2C1A0E)                         │
│  Logo + slogan + liens rubriques + réseaux sociaux          │
│  Contact : email / téléphone                               │
└─────────────────────────────────────────────────────────────┘
```

---

### 0.4 Composants UI — Règles précises

#### Cards d'articles
```
- Fond : blanc #FFFFFF
- Bordure : 1px solid #E0E0E0
- Border-radius : 8px
- Image : 16:9, couvre le haut de la card
- Rubrique badge : couleur var(--color-primary), texte blanc, font Bebas Neue
- Titre : font Lora 600, couleur #1A1A1A
- Méta (date, auteur) : DM Sans, #666666, 13px
- Hover : légère élévation (box-shadow) + translateY(-2px)
```

#### Boutons
```
- CTA principal   : bg #E8440A, texte blanc, font DM Sans 600, border-radius 4px
- CTA secondaire  : bg #2D6A2D, texte blanc
- Outline         : border 2px #2D6A2D, texte vert, bg transparent
```

#### Navigation
```
- Fond header : blanc
- Liens nav   : DM Sans 500, #1A1A1A
- Lien actif  : couleur #2D6A2D, underline ou border-bottom
- Menu rubrique hover : bg crème #F5F0C8
```

#### Badges / Tags de rubriques
```
- Couleur unique par rubrique (à définir dans la table categories > colonne `color`)
- Font : Bebas Neue, uppercase, 11px
- Padding : 2px 8px
- Border-radius : 2px
```

#### Bouton WhatsApp flottant
```
- Position : fixed, bottom: 24px, right: 24px
- Fond : #25D366 (vert WhatsApp officiel)
- Icône : blanc, taille 28px
- Border-radius : 50%
- Box-shadow : 0 4px 12px rgba(0,0,0,0.25)
```

---

### 0.5 Couleurs suggérées par rubrique

| Rubrique | Couleur badge |
|---|---|
| Édito | `#2D6A2D` (vert primaire) |
| Actualités | `#5C3A1E` (marron) |
| Opinions | `#E8440A` (orange) |
| Mode | `#9B59B6` (violet) |
| Kalara | `#CC2200` (rouge) |
| Portraits | `#3AADA8` (turquoise) |
| Interviews | `#E67E22` (ambre) |
| Dossiers | `#2C3E50` (bleu nuit) |
| Découverte | `#27AE60` (vert vif) |
| Commentaire d'écoute | `#7F8C8D` (gris ardoise) |

> Ces couleurs sont à stocker dans la colonne `color` de la table `categories` en Supabase.

---

### 0.6 Règles à ne JAMAIS violer

- ❌ Pas de fond violet ou dégradé violet — cela trahit l'identité Yakanga
- ❌ Pas de police Inter, Roboto ou Arial — trop génériques
- ❌ Pas de border-radius > 12px sur les cards (style trop "app", pas assez éditorial)
- ✅ Le vert forêt `#2D6A2D` est la couleur dominante d'autorité
- ✅ Le marron `#5C3A1E` ancre l'identité culturelle africaine
- ✅ L'orange `#E8440A` est réservé aux CTA et éléments d'attention
- ✅ Toute section "featured" ou "hero" doit utiliser le fond vert ou marron, jamais blanc

---

## 1. Prérequis

Avant de commencer, assure-toi d'avoir :

- [ ] Un compte sur [supabase.com](https://supabase.com)
- [ ] Node.js 18+ installé
- [ ] Un projet Next.js créé (`npx create-next-app@latest yakanga`)
- [ ] `@supabase/supabase-js` et `@supabase/ssr` installés

```bash
npm install @supabase/supabase-js @supabase/ssr
```

---

## 2. Créer le projet Supabase

1. Va sur **https://supabase.com/dashboard**
2. Clique **"New Project"**
3. Remplis :
   - **Name** : `yakanga-web-media`
   - **Database Password** : génère un mot de passe fort et **sauvegarde-le**
   - **Region** : choisis la plus proche (ex: `West EU` ou `US East`)
4. Clique **"Create new project"** — attends ~2 minutes

Une fois créé, récupère tes clés dans :  
**Settings → API → Project URL & anon/public key**

---

## 3. Créer toutes les tables

### Méthode A — SQL Editor (recommandée ✅)

C'est la méthode **la plus rapide** : tu colles un seul script et toutes les tables sont créées en une fois.

**Étapes :**
1. Dans ton dashboard Supabase, clique sur **"SQL Editor"** dans la barre gauche
2. Clique **"New query"**
3. Colle le script SQL complet de la section 4 ci-dessous
4. Clique **"Run"** (ou `Ctrl+Enter`)
5. Tu verras `Success. No rows returned` — c'est normal ✅

---

### Méthode B — Dashboard (Table Editor)

Si tu préfères l'interface graphique, voici la procédure pour **chaque table** :

1. Clique sur **"Table Editor"** dans la barre gauche
2. Clique **"New table"**
3. Configure les colonnes une par une selon les specs ci-dessous
4. Active **"Enable Row Level Security (RLS)"** sur chaque table

> ⚠️ **Cette méthode est plus longue** (8 tables × plusieurs colonnes). La méthode A est fortement recommandée.

---

## 4. Script SQL complet

Copie-colle **tout ce bloc** dans le SQL Editor de Supabase :

```sql
-- ============================================================
-- YAKANGA WEB MÉDIA — Script de création des tables
-- Supabase / PostgreSQL
-- ============================================================

-- 1. PROFILES (utilisateurs étendus, liés à auth.users)
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  username text unique not null,
  full_name text,
  avatar_url text,
  role text default 'reader' check (role in ('reader', 'author', 'editor', 'admin')),
  bio text,
  created_at timestamptz default now()
);

-- 2. CATEGORIES (rubriques du journal)
create table if not exists public.categories (
  id serial primary key,
  name text unique not null,
  slug text unique not null,
  description text,
  color text,
  cover_url text,
  position int default 0,
  is_active boolean default true,
  created_at timestamptz default now()
);

-- Insérer les rubriques Yakanga par défaut
insert into public.categories (name, slug, position) values
  ('Édito',                    'edito',              1),
  ('Actualités',               'actualites',         2),
  ('Opinions',                 'opinions',           3),
  ('Le commentaire d''écoute', 'commentaire-ecoute', 4),
  ('Mode',                     'mode',               5),
  ('Kalara',                   'kalara',             6),
  ('Portraits',                'portraits',          7),
  ('Interviews',               'interviews',         8),
  ('Dossiers',                 'dossiers',           9),
  ('Découverte',               'decouverte',        10)
on conflict (slug) do nothing;

-- 3. ARTICLES
create table if not exists public.articles (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  excerpt text,
  content text not null,
  cover_url text,
  category_id int references public.categories(id) on delete set null,
  author_id uuid references public.profiles(id) on delete set null,
  status text default 'draft' check (status in ('draft', 'published', 'archived')),
  is_featured boolean default false,
  is_sponsored boolean default false,
  views_count int default 0,
  youtube_url text,
  published_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Index pour les performances
create index if not exists articles_status_idx on public.articles(status);
create index if not exists articles_category_idx on public.articles(category_id);
create index if not exists articles_published_at_idx on public.articles(published_at desc);
create index if not exists articles_slug_idx on public.articles(slug);

-- 4. TAGS
create table if not exists public.tags (
  id serial primary key,
  name text unique not null,
  slug text unique not null
);

-- 5. ARTICLE_TAGS (table de jonction)
create table if not exists public.article_tags (
  article_id uuid references public.articles(id) on delete cascade,
  tag_id int references public.tags(id) on delete cascade,
  primary key (article_id, tag_id)
);

-- 6. COMMENTS
create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  article_id uuid references public.articles(id) on delete cascade,
  author_id uuid references public.profiles(id) on delete set null,
  guest_name text,
  content text not null,
  is_approved boolean default false,
  parent_id uuid references public.comments(id) on delete cascade,
  created_at timestamptz default now()
);

create index if not exists comments_article_idx on public.comments(article_id);

-- 7. ADVERTISEMENTS (espaces publicitaires)
create table if not exists public.advertisements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  image_url text not null,
  link_url text,
  position text not null check (position in ('header', 'sidebar', 'footer', 'inline', 'popup')),
  is_active boolean default true,
  starts_at timestamptz,
  ends_at timestamptz,
  clicks_count int default 0,
  impressions_count int default 0,
  created_at timestamptz default now()
);

-- 8. NEWSLETTER_SUBSCRIBERS
create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  is_confirmed boolean default false,
  subscribed_at timestamptz default now()
);

-- 9. MEDIA (bibliothèque de fichiers)
create table if not exists public.media (
  id uuid primary key default gen_random_uuid(),
  uploaded_by uuid references public.profiles(id) on delete set null,
  url text not null,
  filename text,
  file_type text check (file_type in ('image', 'video', 'document')),
  size_bytes int,
  created_at timestamptz default now()
);

-- ============================================================
-- TRIGGER : mise à jour automatique de updated_at sur articles
-- ============================================================
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create or replace trigger articles_updated_at
  before update on public.articles
  for each row execute function public.handle_updated_at();

-- ============================================================
-- TRIGGER : création automatique du profil à l'inscription
-- ============================================================
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username, full_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.raw_user_meta_data->>'avatar_url', '')
  );
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
```

---

## 5. Row Level Security (RLS)

Exécute ce second script dans le SQL Editor (nouvelle query) :

```sql
-- ============================================================
-- ACTIVATION RLS SUR TOUTES LES TABLES
-- ============================================================

alter table public.profiles           enable row level security;
alter table public.categories         enable row level security;
alter table public.articles           enable row level security;
alter table public.tags               enable row level security;
alter table public.article_tags       enable row level security;
alter table public.comments           enable row level security;
alter table public.advertisements     enable row level security;
alter table public.newsletter_subscribers enable row level security;
alter table public.media              enable row level security;

-- ============================================================
-- POLICIES — PROFILES
-- ============================================================
create policy "Profils publics visibles"
  on public.profiles for select using (true);

create policy "Propriétaire modifie son profil"
  on public.profiles for update using (auth.uid() = id);

-- ============================================================
-- POLICIES — CATEGORIES
-- ============================================================
create policy "Catégories visibles par tous"
  on public.categories for select using (is_active = true);

create policy "Admin gère les catégories"
  on public.categories for all
  using (exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  ));

-- ============================================================
-- POLICIES — ARTICLES
-- ============================================================
create policy "Articles publiés visibles par tous"
  on public.articles for select using (status = 'published');

create policy "Auteurs voient leurs propres articles"
  on public.articles for select
  using (auth.uid() = author_id);

create policy "Auteurs créent des articles"
  on public.articles for insert
  with check (auth.uid() = author_id);

create policy "Auteurs modifient leurs articles"
  on public.articles for update using (auth.uid() = author_id);

create policy "Admin gère tous les articles"
  on public.articles for all
  using (exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('admin', 'editor')
  ));

-- ============================================================
-- POLICIES — COMMENTS
-- ============================================================
create policy "Commentaires approuvés visibles"
  on public.comments for select using (is_approved = true);

create policy "Tout le monde peut commenter"
  on public.comments for insert with check (true);

create policy "Admin modère les commentaires"
  on public.comments for update
  using (exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('admin', 'editor')
  ));

-- ============================================================
-- POLICIES — TAGS & ARTICLE_TAGS
-- ============================================================
create policy "Tags visibles par tous"
  on public.tags for select using (true);

create policy "Article tags visibles par tous"
  on public.article_tags for select using (true);

-- ============================================================
-- POLICIES — ADVERTISEMENTS
-- ============================================================
create policy "Pubs actives visibles par tous"
  on public.advertisements for select
  using (is_active = true and (starts_at is null or starts_at <= now())
    and (ends_at is null or ends_at >= now()));

create policy "Admin gère les pubs"
  on public.advertisements for all
  using (exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  ));

-- ============================================================
-- POLICIES — NEWSLETTER
-- ============================================================
create policy "Inscription newsletter ouverte"
  on public.newsletter_subscribers for insert with check (true);

create policy "Admin voit les abonnés"
  on public.newsletter_subscribers for select
  using (exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  ));

-- ============================================================
-- POLICIES — MEDIA
-- ============================================================
create policy "Media visible par tous"
  on public.media for select using (true);

create policy "Auteurs uploadent des médias"
  on public.media for insert
  with check (auth.uid() = uploaded_by);

create policy "Admin gère les médias"
  on public.media for all
  using (exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('admin', 'editor')
  ));
```

---

## 6. Storage Bucket

Dans le dashboard Supabase :

1. Clique **"Storage"** dans la barre gauche
2. Clique **"New bucket"**
3. Configure :
   - **Name** : `yakanga-media`
   - **Public bucket** : ✅ activé (les images d'articles doivent être accessibles publiquement)
4. Clique **"Save"**

Puis exécute dans le SQL Editor :

```sql
-- Politique d'upload (utilisateurs connectés seulement)
create policy "Utilisateurs connectés uploadent"
  on storage.objects for insert
  with check (bucket_id = 'yakanga-media' and auth.role() = 'authenticated');

-- Lecture publique
create policy "Lecture publique des médias"
  on storage.objects for select
  using (bucket_id = 'yakanga-media');
```

---

## 7. Configurer Next.js

### Variables d'environnement

Crée un fichier `.env.local` à la racine de ton projet :

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=ta-anon-key-ici
SUPABASE_SERVICE_ROLE_KEY=ta-service-role-key-ici
```

> Ces clés se trouvent dans : **Supabase Dashboard → Settings → API**

---

### Client côté serveur

Crée `lib/supabase/server.ts` :

```typescript
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        },
      },
    }
  )
}
```

---

### Client côté navigateur

Crée `lib/supabase/client.ts` :

```typescript
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

---

### Middleware (protection admin)

Crée `middleware.ts` à la racine :

```typescript
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options))
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  // Rediriger vers login si non connecté sur /admin
  if (request.nextUrl.pathname.startsWith('/admin') && !user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/admin/:path*'],
}
```

---

## 8. Architecture des routes

```
app/
│
├── (public)/
│   ├── page.tsx                          → Accueil (articles récents, à la une)
│   ├── [category]/page.tsx               → Liste articles par rubrique
│   ├── article/[slug]/page.tsx           → Détail article
│   ├── recherche/page.tsx                → Résultats de recherche
│   ├── contact/page.tsx                  → Contact
│   ├── publicite/page.tsx                → Offres publicitaires
│   └── newsletter/confirm/page.tsx       → Confirmation email
│
├── (auth)/
│   ├── login/page.tsx
│   └── register/page.tsx
│
├── (admin)/                              → Protégé par middleware
│   ├── dashboard/page.tsx
│   ├── articles/
│   │   ├── page.tsx                      → Liste des articles
│   │   ├── new/page.tsx                  → Créer un article
│   │   └── [id]/edit/page.tsx            → Modifier un article
│   ├── categories/page.tsx
│   ├── commentaires/page.tsx
│   ├── utilisateurs/page.tsx
│   ├── publicites/page.tsx
│   └── media/page.tsx
│
└── api/
    ├── articles/views/route.ts           → Incrémenter views_count
    ├── newsletter/subscribe/route.ts     → Inscription newsletter
    ├── newsletter/confirm/route.ts       → Confirmation email
    └── ads/click/route.ts               → Tracker les clics pub
```

---

## 9. Récapitulatif des tables

| Table | Description | Clé primaire |
|---|---|---|
| `profiles` | Utilisateurs étendus (admin, auteur, lecteur) | `uuid` (lié à auth.users) |
| `categories` | Rubriques du journal (Édito, Mode, Kalara...) | `serial` |
| `articles` | Contenu principal du journal | `uuid` |
| `tags` | Mots-clés pour les articles | `serial` |
| `article_tags` | Relation articles ↔ tags | composite |
| `comments` | Commentaires (avec modération) | `uuid` |
| `advertisements` | Espaces publicitaires (header, sidebar...) | `uuid` |
| `newsletter_subscribers` | Abonnés à la newsletter | `uuid` |
| `media` | Bibliothèque de fichiers uploadés | `uuid` |

---

## 10. Checklist finale

### Supabase
- [ ] Projet créé sur supabase.com
- [ ] Script SQL complet exécuté (section 4)
- [ ] Script RLS exécuté (section 5)
- [ ] Bucket `yakanga-media` créé (section 6)
- [ ] Policies storage exécutées

### Next.js
- [ ] `.env.local` configuré avec les clés Supabase
- [ ] `lib/supabase/server.ts` créé
- [ ] `lib/supabase/client.ts` créé
- [ ] `middleware.ts` créé à la racine
- [ ] Structure de dossiers `app/` mise en place

### Vérification
- [ ] Tester une insertion d'article dans le dashboard Supabase
- [ ] Vérifier que la table `categories` contient les 10 rubriques
- [ ] Tester la connexion depuis Next.js avec un `console.log`

---

> **Prochaine étape recommandée** : Commencer par la page d'accueil (`app/page.tsx`) avec un Server Component qui récupère les articles publiés via Supabase.

```typescript
// app/page.tsx — exemple de base
import { createClient } from '@/lib/supabase/server'

export default async function HomePage() {
  const supabase = await createClient()
  
  const { data: articles } = await supabase
    .from('articles')
    .select('*, categories(name, slug), profiles(full_name)')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(10)

  return (
    <main>
      {articles?.map(article => (
        <div key={article.id}>{article.title}</div>
      ))}
    </main>
  )
}
```

---

*Document généré pour Yakanga Web Média — Stack : Next.js + Supabase*
