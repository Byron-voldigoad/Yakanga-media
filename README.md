# Yakanga Web Média

> **La mémoire des cultures contemporaines**  
> Journal culturel en ligne dédié aux cultures contemporaines africaines.

---

## 🚀 Stack technique

| Technologie | Usage |
|---|---|
| Next.js 15.2.4 (App Router) | Framework frontend |
| Supabase (PostgreSQL + RLS + Storage) | Base de données & Auth |
| @supabase/ssr | Authentification SSR |
| TailwindCSS v4 + Shadcn UI | Interface utilisateur |
| TypeScript | Langage |

---

## ⚙️ Installation

### Prérequis
- Node.js 18+
- Compte Supabase
- Windows (PowerShell recommandé)

### Étapes

1. Cloner le projet
```powershell
git clone <repo-url>
cd yakanga-media
```

2. Installer les dépendances
```powershell
npm install --legacy-peer-deps
```

3. Configurer les variables d'environnement
Créer un fichier .env à la racine avec :
```env
NEXT_PUBLIC_SUPABASE_URL=votre_url_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_clé_anon
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

4. Initialiser la base de données
Exécuter db/schema.sql puis db/seed.sql dans Supabase SQL Editor

5. Lancer le serveur
```powershell
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000)

---

## 📁 Structure du projet
```
yakanga-media/
├── app/
│   ├── layout.tsx              # Layout racine + métadonnées SEO
│   ├── page.tsx                # Page d'accueil
│   ├── auth/actions.ts         # Actions auth (email, Google, GitHub)
│   ├── sitemap.ts              # Sitemap dynamique
│   └── admin/                  # Back-office CMS (protégé)
│       ├── layout.tsx          # Layout admin + vérification rôle
│       ├── page.tsx            # Tableau de bord
│       ├── AdminSidebar.tsx    # Sidebar navigation (Client Component)
│       └── articles/
│           ├── page.tsx        # Liste des articles (vue tableau/grille)
│           └── new/
│               ├── page.tsx    # Page création
│               └── NewArticleForm.tsx  # Formulaire éditeur
├── components/
│   ├── HomeScreen.tsx          # Page d'accueil (Server Component)
│   ├── home/
│   │   ├── Hero.tsx            # Section À LA UNE
│   │   ├── CulturalNews.tsx    # Actualités culturelles
│   │   └── Navbar.tsx          # Barre de navigation
│   ├── modals/
│   │   └── CreatePostModal.tsx # Création rapide d'article
│   ├── login-form.tsx          # Formulaire connexion
│   └── signup-form.tsx         # Formulaire inscription
├── lib/
│   ├── client.ts               # Client Supabase (navigateur)
│   ├── server.ts               # Client Supabase (serveur)
│   └── queries/articles.ts     # Requêtes articles
├── db/
│   ├── schema.sql              # Schéma complet avec RLS
│   └── seed.sql                # Données de test
├── public/
│   ├── logo.png                # Logo Yakanga
│   └── robots.txt              # Directives SEO
├── middleware.ts               # Protection des routes
└── .env                        # Variables d'environnement (non versionné)
```

---

## 🔐 Accès & Rôles

| Rôle | Accès |
|---|---|
| `admin` | Back-office complet `/admin` |
| `editor` | Back-office articles `/admin` |
| Utilisateur connecté | Création rapide via modal |
| Visiteur | Lecture des articles publiés |

---

## 🌐 Routes principales

| Route | Description |
|---|---|
| `/` | Page d'accueil |
| `/auth/login` | Connexion |
| `/auth/signup` | Inscription |
| `/articles/[slug]` | Article détaillé |
| `/admin` | Tableau de bord (admin/editor) |
| `/admin/articles` | Gestion des articles |
| `/admin/articles/new` | Création d'article |
| `/sitemap.xml` | Sitemap dynamique |
| `/robots.txt` | Directives robots |

---

## 📊 Avancement

| Module | Statut | Progression |
|---|---|---|
| Maquette UI | ✅ Terminé | 90% |
| Base de données | ✅ Terminé | 95% |
| Middleware / Auth | ✅ Terminé | 90% |
| Intégration front | ✅ Terminé | 90% |
| Back-office CMS | 🔄 En cours | 80% |
| SEO | ✅ Terminé | 80% |
| Qualité / Tests | 🔄 En cours | 40% |

**Score global : ~85%**

---


