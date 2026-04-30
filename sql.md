-- ============================================================
-- YAKANGA WEB MÉDIA — Schema complet
-- Supabase / PostgreSQL
-- Version corrigée avec Storage, RLS et policies complètes
-- ============================================================


-- ============================================================
-- 1. PROFILES
-- ============================================================
create table if not exists public.profiles (
  id          uuid references auth.users(id) on delete cascade primary key,
  username    text unique not null,
  full_name   text,
  avatar_url  text,
  role        text default 'reader' check (role in ('reader', 'author', 'editor', 'admin')),
  bio         text,
  created_at  timestamptz default now()
);


-- ============================================================
-- 2. CATEGORIES
-- ============================================================
create table if not exists public.categories (
  id          serial primary key,
  name        text unique not null,
  slug        text unique not null,
  description text,
  color       text,
  cover_url   text,
  position    int default 0,
  is_active   boolean default true,
  created_at  timestamptz default now()
);

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


-- ============================================================
-- 3. ARTICLES
-- ============================================================
create table if not exists public.articles (
  id            uuid primary key default gen_random_uuid(),
  title         text not null,
  slug          text unique not null,
  excerpt       text,
  content       text not null,
  cover_url     text,
  category_id   int references public.categories(id) on delete set null,
  author_id     uuid references public.profiles(id) on delete set null,
  status        text default 'draft' check (status in ('draft', 'published', 'archived')),
  is_featured   boolean default false,
  is_sponsored  boolean default false,
  views_count   int default 0,
  youtube_url   text,
  published_at  timestamptz,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

create index if not exists articles_status_idx       on public.articles(status);
create index if not exists articles_category_idx     on public.articles(category_id);
create index if not exists articles_author_idx       on public.articles(author_id);
create index if not exists articles_published_at_idx on public.articles(published_at desc);
create index if not exists articles_slug_idx         on public.articles(slug);


-- ============================================================
-- 4. TAGS
-- ============================================================
create table if not exists public.tags (
  id    serial primary key,
  name  text unique not null,
  slug  text unique not null
);


-- ============================================================
-- 5. ARTICLE_TAGS (table de jonction)
-- ============================================================
create table if not exists public.article_tags (
  article_id  uuid references public.articles(id) on delete cascade,
  tag_id      int  references public.tags(id)     on delete cascade,
  primary key (article_id, tag_id)
);


-- ============================================================
-- 6. COMMENTS
-- ============================================================
create table if not exists public.comments (
  id          uuid primary key default gen_random_uuid(),
  article_id  uuid references public.articles(id)  on delete cascade,
  author_id   uuid references public.profiles(id)  on delete set null,
  guest_name  text,
  content     text not null,
  is_approved boolean default false,
  parent_id   uuid references public.comments(id)  on delete cascade,
  created_at  timestamptz default now()
);

create index if not exists comments_article_idx on public.comments(article_id);


-- ============================================================
-- 7. ADVERTISEMENTS
-- ============================================================
create table if not exists public.advertisements (
  id                uuid primary key default gen_random_uuid(),
  title             text not null,
  image_url         text not null,
  link_url          text,
  position          text not null check (position in ('header', 'sidebar', 'footer', 'inline', 'popup')),
  is_active         boolean default true,
  starts_at         timestamptz,
  ends_at           timestamptz,
  clicks_count      int default 0,
  impressions_count int default 0,
  created_at        timestamptz default now()
);


-- ============================================================
-- 8. NEWSLETTER_SUBSCRIBERS
-- ============================================================
create table if not exists public.newsletter_subscribers (
  id            uuid primary key default gen_random_uuid(),
  email         text unique not null,
  is_confirmed  boolean default false,
  subscribed_at timestamptz default now()
);


-- ============================================================
-- 9. MEDIA (bibliothèque de fichiers — métadonnées)
-- ============================================================
create table if not exists public.media (
  id           uuid primary key default gen_random_uuid(),
  uploaded_by  uuid references public.profiles(id) on delete set null,
  url          text not null,
  filename     text,
  bucket       text not null default 'covers',
  file_type    text check (file_type in ('image', 'video', 'document')),
  size_bytes   int,
  created_at   timestamptz default now()
);


-- ============================================================
-- TRIGGERS
-- ============================================================

-- Mise à jour automatique de updated_at sur articles
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

-- Création automatique du profil à l'inscription
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


-- ============================================================
-- ACTIVATION RLS
-- ============================================================
alter table public.profiles               enable row level security;
alter table public.categories             enable row level security;
alter table public.articles               enable row level security;
alter table public.tags                   enable row level security;
alter table public.article_tags           enable row level security;
alter table public.comments               enable row level security;
alter table public.advertisements         enable row level security;
alter table public.newsletter_subscribers enable row level security;
alter table public.media                  enable row level security;


-- ============================================================
-- POLICIES — PROFILES
-- ============================================================
create policy "Profils publics visibles"
  on public.profiles for select
  using (true);

create policy "Propriétaire modifie son profil"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Admin gère tous les profils"
  on public.profiles for all
  using (exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  ));


-- ============================================================
-- POLICIES — CATEGORIES
-- ============================================================
create policy "Catégories actives visibles par tous"
  on public.categories for select
  using (is_active = true);

create policy "Admin gère les catégories"
  on public.categories for all
  using (exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  ));


-- ============================================================
-- POLICIES — ARTICLES
-- ============================================================

-- Les articles publiés sont visibles par tout le monde
create policy "Articles publiés visibles par tous"
  on public.articles for select
  using (status = 'published');

-- Un auteur peut voir ses propres brouillons et archives
create policy "Auteurs voient leurs propres articles non publiés"
  on public.articles for select
  using (auth.uid() = author_id and status in ('draft', 'archived'));

-- Un auteur peut créer un article (uniquement en son nom)
create policy "Auteurs créent des articles"
  on public.articles for insert
  with check (auth.uid() = author_id);

-- Un auteur peut modifier ses propres articles
create policy "Auteurs modifient leurs articles"
  on public.articles for update
  using (auth.uid() = author_id);

-- Un auteur peut supprimer ses propres brouillons uniquement
create policy "Auteurs suppriment leurs brouillons"
  on public.articles for delete
  using (auth.uid() = author_id and status = 'draft');

-- Admin et éditeur ont accès total
create policy "Admin et éditeur gèrent tous les articles"
  on public.articles for all
  using (exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('admin', 'editor')
  ));


-- ============================================================
-- POLICIES — TAGS & ARTICLE_TAGS
-- ============================================================
create policy "Tags visibles par tous"
  on public.tags for select
  using (true);

create policy "Admin gère les tags"
  on public.tags for all
  using (exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('admin', 'editor')
  ));

create policy "Article tags visibles par tous"
  on public.article_tags for select
  using (true);

create policy "Auteurs gèrent leurs article_tags"
  on public.article_tags for all
  using (exists (
    select 1 from public.articles
    where id = article_id and author_id = auth.uid()
  ));

create policy "Admin gère tous les article_tags"
  on public.article_tags for all
  using (exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('admin', 'editor')
  ));


-- ============================================================
-- POLICIES — COMMENTS
-- ============================================================
create policy "Commentaires approuvés visibles par tous"
  on public.comments for select
  using (is_approved = true);

create policy "Auteur voit ses propres commentaires non approuvés"
  on public.comments for select
  using (auth.uid() = author_id);

create policy "Tout le monde peut poster un commentaire"
  on public.comments for insert
  with check (true);

create policy "Admin modère les commentaires"
  on public.comments for update
  using (exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('admin', 'editor')
  ));

create policy "Admin supprime les commentaires"
  on public.comments for delete
  using (exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('admin', 'editor')
  ));


-- ============================================================
-- POLICIES — ADVERTISEMENTS
-- ============================================================
create policy "Pubs actives visibles par tous"
  on public.advertisements for select
  using (
    is_active = true
    and (starts_at is null or starts_at <= now())
    and (ends_at   is null or ends_at   >= now())
  );

create policy "Admin gère les publicités"
  on public.advertisements for all
  using (exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  ));


-- ============================================================
-- POLICIES — NEWSLETTER
-- ============================================================
create policy "Inscription newsletter ouverte"
  on public.newsletter_subscribers for insert
  with check (true);

create policy "Admin voit les abonnés newsletter"
  on public.newsletter_subscribers for select
  using (exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  ));

create policy "Admin gère les abonnés newsletter"
  on public.newsletter_subscribers for all
  using (exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  ));


-- ============================================================
-- POLICIES — MEDIA (table)
-- ============================================================
create policy "Media visible par tous"
  on public.media for select
  using (true);

create policy "Utilisateurs authentifiés uploadent des médias"
  on public.media for insert
  with check (auth.uid() = uploaded_by);

create policy "Propriétaire modifie ses médias"
  on public.media for update
  using (auth.uid() = uploaded_by);

create policy "Admin gère tous les médias"
  on public.media for all
  using (exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('admin', 'editor')
  ));


-- ============================================================
-- STORAGE — Buckets
-- ============================================================
-- covers    : images de couverture des articles (public)
-- avatars   : photos de profil des utilisateurs (public)
-- documents : fichiers privés / pièces jointes (privé)

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('covers',    'covers',    true,  5242880,  array['image/jpeg','image/png','image/webp','image/gif']),
  ('avatars',   'avatars',   true,  2097152,  array['image/jpeg','image/png','image/webp']),
  ('documents', 'documents', false, 10485760, array['application/pdf','image/jpeg','image/png','image/webp','video/mp4'])
on conflict (id) do nothing;
-- file_size_limit en octets : 5 Mo pour covers, 2 Mo pour avatars, 10 Mo pour documents


-- ============================================================
-- STORAGE — Policies bucket COVERS
-- ============================================================
create policy "covers: lecture publique"
  on storage.objects for select
  using (bucket_id = 'covers');

create policy "covers: upload par utilisateurs authentifiés"
  on storage.objects for insert
  with check (
    bucket_id = 'covers'
    and auth.role() = 'authenticated'
  );

create policy "covers: modification par propriétaire ou admin"
  on storage.objects for update
  using (
    bucket_id = 'covers'
    and (
      auth.uid()::text = (storage.foldername(name))[1]
      or exists (
        select 1 from public.profiles
        where id = auth.uid() and role in ('admin', 'editor')
      )
    )
  );

create policy "covers: suppression par propriétaire ou admin"
  on storage.objects for delete
  using (
    bucket_id = 'covers'
    and (
      auth.uid()::text = (storage.foldername(name))[1]
      or exists (
        select 1 from public.profiles
        where id = auth.uid() and role in ('admin', 'editor')
      )
    )
  );


-- ============================================================
-- STORAGE — Policies bucket AVATARS
-- Structure attendue : avatars/{user_id}/avatar.webp
-- ============================================================
create policy "avatars: lecture publique"
  on storage.objects for select
  using (bucket_id = 'avatars');

create policy "avatars: upload dans son propre dossier"
  on storage.objects for insert
  with check (
    bucket_id = 'avatars'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "avatars: modification de son propre avatar"
  on storage.objects for update
  using (
    bucket_id = 'avatars'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "avatars: suppression de son propre avatar"
  on storage.objects for delete
  using (
    bucket_id = 'avatars'
    and auth.uid()::text = (storage.foldername(name))[1]
  );


-- ============================================================
-- STORAGE — Policies bucket DOCUMENTS (privé)
-- Structure attendue : documents/{user_id}/{filename}
-- ============================================================
create policy "documents: lecture par propriétaire ou admin"
  on storage.objects for select
  using (
    bucket_id = 'documents'
    and (
      auth.uid()::text = (storage.foldername(name))[1]
      or exists (
        select 1 from public.profiles
        where id = auth.uid() and role in ('admin', 'editor')
      )
    )
  );

create policy "documents: upload dans son propre dossier"
  on storage.objects for insert
  with check (
    bucket_id = 'documents'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "documents: modification de ses propres fichiers"
  on storage.objects for update
  using (
    bucket_id = 'documents'
    and (
      auth.uid()::text = (storage.foldername(name))[1]
      or exists (
        select 1 from public.profiles
        where id = auth.uid() and role in ('admin', 'editor')
      )
    )
  );

create policy "documents: suppression par propriétaire ou admin"
  on storage.objects for delete
  using (
    bucket_id = 'documents'
    and (
      auth.uid()::text = (storage.foldername(name))[1]
      or exists (
        select 1 from public.profiles
        where id = auth.uid() and role in ('admin', 'editor')
      )
    )
  );


-- ============================================================
-- USAGE DEPUIS NEXT.JS
-- ============================================================
--
-- 1. UPLOAD d'une cover d'article
-- -------------------------------------------------------
-- const filePath = `articles/${articleId}.webp`
-- const { error } = await supabase.storage
--   .from('covers')
--   .upload(filePath, file, { upsert: true })
--
-- const { data: { publicUrl } } = supabase.storage
--   .from('covers')
--   .getPublicUrl(filePath)
--
-- await supabase.from('articles').update({ cover_url: publicUrl }).eq('id', articleId)
--
--
-- 2. UPLOAD d'un avatar
-- -------------------------------------------------------
-- // Le chemin DOIT commencer par {user.id}/ pour que la policy fonctionne
-- const filePath = `${user.id}/avatar.webp`
-- const { error } = await supabase.storage
--   .from('avatars')
--   .upload(filePath, file, { upsert: true })
--
-- const { data: { publicUrl } } = supabase.storage
--   .from('avatars')
--   .getPublicUrl(filePath)
--
-- await supabase.from('profiles').update({ avatar_url: publicUrl }).eq('id', user.id)
--
--
-- 3. UPLOAD d'un document privé
-- -------------------------------------------------------
-- const filePath = `${user.id}/${fileName}`
-- const { error } = await supabase.storage
--   .from('documents')
--   .upload(filePath, file)
--
-- // URL signée valable 60 secondes (bucket privé → pas d'URL publique)
-- const { data: { signedUrl } } = await supabase.storage
--   .from('documents')
--   .createSignedUrl(filePath, 60)
--
--
-- 4. SUPPRIMER un fichier
-- -------------------------------------------------------
-- await supabase.storage.from('covers').remove([filePath])
-- ============================================================