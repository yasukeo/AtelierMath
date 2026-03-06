# AtelierMath

**Plateforme de cours de soutien en mathématiques pour le lycée.**

AtelierMath est une application web complète permettant à une professeure de mathématiques de gérer ses élèves, publier des leçons et devoirs, planifier ses disponibilités, recevoir des réservations de séances et suivre les soumissions de devoirs — le tout depuis un tableau de bord moderne et intuitif.

---

## Aperçu des fonctionnalités

### Espace Professeur (Dashboard)

- **Tableau de bord** — Vue d'ensemble avec statistiques (élèves, leçons, devoirs, réservations), dernières réservations, échéances, remises récentes, derniers élèves inscrits
- **Gestion des élèves** — Créer, modifier, supprimer des comptes élèves avec niveau (2nde, 1ère, Terminale), recherche par nom/email, filtre par niveau
- **Leçons** — Rédaction en Markdown avec aperçu en temps réel, ciblage par niveau, publication/brouillon, recherche et filtres
- **Devoirs** — Assignation par niveau avec deadline, suivi des soumissions, correction avec notes et commentaires
- **Disponibilités** — Créneaux récurrents par jour de la semaine + exceptions ponctuelles (ajout/blocage de créneaux)
- **Réservations** — Consultation et gestion (accepter/refuser) des demandes de séances, emails automatiques de confirmation/refus
- **Statistiques** — KPIs, répartition par niveau, devoirs corrigés, graphiques mensuels
- **Paramètres** — Modification du profil et du mot de passe

### Espace Élève

- **Leçons** — Consultation des leçons publiées pour son niveau (rendu Markdown)
- **Devoirs** — Voir les devoirs assignés, soumettre des fichiers, consulter les corrections et notes

### Pages Publiques

- **Landing page** — Présentation du service avec 8 sections : hero, matières, fonctionnement, à propos, niveaux, témoignages, FAQ, CTA
- **Réservation** — Choix d'un créneau disponible dans le calendrier, formulaire de réservation (nom, email, message)
- **Inscription / Connexion** — Auth par email + mot de passe

### Emails Transactionnels (Resend)

- Bienvenue à l'inscription
- Identifiants élève à la création de compte
- Notification de nouvelle réservation (au prof)
- Confirmation / refus de réservation (au visiteur)
- Rappel de deadline (24h avant l'échéance, via cron)

---

## Stack Technique

| Technologie | Version | Usage |
|---|---|---|
| **Next.js** | 16.1.6 | App Router, Server Components, Server Actions, API Routes |
| **React** | 19.2.3 | UI |
| **TypeScript** | 5.x | Typage strict |
| **Supabase** | 2.98.0 | Auth, PostgreSQL, Row Level Security (RLS) |
| **Resend** | 6.9.3 | Emails transactionnels |
| **Tailwind CSS** | 4.x | Styles utilitaires, design system avec CSS custom properties |
| **date-fns** | 4.x | Manipulation de dates |
| **react-markdown** | 10.x | Rendu Markdown dans les leçons |
| **Lucide React** | 0.576.x | Icônes SVG |

---

## Prérequis

- **Node.js** 18+
- Un projet **Supabase** (gratuit sur [supabase.com](https://supabase.com))
- Un compte **Resend** (gratuit sur [resend.com](https://resend.com))

---

## Installation

```bash
# 1. Cloner le repo
git clone https://github.com/yasukeo/AtelierMath.git
cd AtelierMath

# 2. Installer les dépendances
npm install

# 3. Copier le fichier d'environnement
cp .env.local.example .env.local
# Puis remplir les variables (voir section ci-dessous)
```

## Variables d'environnement

Créer un fichier `.env.local` à la racine :

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

RESEND_API_KEY=re_...
EMAIL_FROM="AtelierMath <noreply@votredomaine.com>"

NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_TIMEZONE=Africa/Casablanca

CRON_SECRET=une-chaine-secrete-pour-le-cron
```

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | URL du projet Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clé publique (anon) Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Clé admin Supabase (ne jamais exposer côté client) |
| `RESEND_API_KEY` | Clé API Resend pour l'envoi d'emails |
| `EMAIL_FROM` | Adresse d'expédition des emails |
| `NEXT_PUBLIC_SITE_URL` | URL du site (localhost en dev, URL Vercel en prod) |
| `NEXT_PUBLIC_TIMEZONE` | Fuseau horaire pour les dates |
| `CRON_SECRET` | Secret pour sécuriser l'endpoint de rappels |

---

## Configuration Supabase

1. Créer un projet sur [supabase.com](https://supabase.com)
2. Aller dans **SQL Editor** et exécuter le fichier `supabase/schema.sql`
3. Créer les **buckets Storage** :
   - `documents` (privé) — pour les leçons en PDF
   - `submissions` (privé) — pour les remises d'élèves
4. Créer le premier compte professeur via **Supabase Auth Dashboard** :
   - Méthode : Email + password
   - User metadata : `{"full_name": "Nom du Prof", "role": "teacher"}`
5. En production, ajouter l'URL du site dans **Authentication → URL Configuration → Redirect URLs**

### Schéma de la base de données

```
profiles        — Utilisateurs (teacher / student) avec niveaux
lessons         — Leçons en Markdown, ciblées par niveau
homework        — Devoirs avec deadline et niveau cible
submissions     — Remises d'élèves avec fichier, note et commentaire
availability    — Créneaux récurrents (jour + heure)
exceptions      — Exceptions ponctuelles (ajout/blocage)
bookings        — Réservations de séances (pending/accepted/declined/cancelled)
```

Toutes les tables sont protégées par **Row Level Security (RLS)**.

---

## Lancer le projet

```bash
# Développement (avec Turbopack)
npm run dev

# Build production
npm run build

# Démarrer en production
npm run start
```

Ouvrir [http://localhost:3000](http://localhost:3000)

---

## Déploiement sur Vercel

1. Importer le repo GitHub sur [vercel.com](https://vercel.com)
2. Ajouter toutes les **variables d'environnement** (voir tableau ci-dessus)
   - Mettre `NEXT_PUBLIC_SITE_URL` = URL Vercel (ex: `https://ateliermath.vercel.app`)
3. Cliquer **Deploy**
4. Ajouter l'URL Vercel dans les **Redirect URLs** de Supabase Auth

### Rappels automatiques (cron)

Pour envoyer les rappels de deadline 24h avant l'échéance, ajouter dans `vercel.json` :

```json
{
  "crons": [
    {
      "path": "/api/reminders?secret=VOTRE_CRON_SECRET",
      "schedule": "0 8 * * *"
    }
  ]
}
```

---

## Structure du projet

```
src/
├── app/
│   ├── page.tsx               # Landing page (8 sections)
│   ├── login/                 # Page de connexion
│   ├── signup/                # Page d'inscription
│   ├── book/                  # Page publique de réservation
│   ├── api/reminders/         # Endpoint cron rappels deadline
│   ├── auth/                  # Callback OAuth + signout
│   ├── dashboard/             # ── Espace Professeur ──
│   │   ├── page.tsx           # Tableau de bord (stats, widgets)
│   │   ├── layout.tsx         # Layout avec sidebar dark
│   │   ├── sidebar-nav.tsx    # Navigation sidebar (client)
│   │   ├── analytics/         # Page statistiques & KPIs
│   │   ├── settings/          # Profil & mot de passe
│   │   ├── students/          # CRUD élèves + recherche/filtre
│   │   ├── lessons/           # CRUD leçons + Markdown
│   │   ├── homework/          # CRUD devoirs + corrections
│   │   ├── availability/      # Gestion disponibilités
│   │   └── bookings/          # Gestion réservations
│   └── student/               # ── Espace Élève ──
│       ├── layout.tsx         # Layout élève
│       ├── page.tsx           # Accueil élève
│       ├── lessons/           # Consultation leçons
│       └── homework/          # Consultation & soumission devoirs
├── lib/
│   ├── email.ts               # Service Resend (6 templates)
│   ├── types.ts               # Types TypeScript
│   └── supabase/
│       ├── admin.ts           # Client service_role
│       ├── client.ts          # Client navigateur
│       ├── middleware.ts       # Refresh session + guards
│       └── server.ts          # Client serveur (cookies)
├── middleware.ts               # Next.js middleware (auth)
├── globals.css                 # Design system (CSS custom props)
public/
├── logo.svg                   # Logo vectoriel
├── logo-512.png               # Logo PNG 512×512
├── logo-256.png               # Logo PNG 256×256
├── logo-128.png               # Logo PNG 128×128
├── logo-64.png                # Logo PNG 64×64
├── favicon.ico                # Favicon multi-tailles
supabase/
└── schema.sql                 # Schéma DB complet + RLS
```

---

## Routes de l'application (27 routes)

| Route | Type | Description |
|---|---|---|
| `/` | Publique | Landing page |
| `/login` | Publique | Connexion |
| `/signup` | Publique | Inscription |
| `/book` | Publique | Réservation d'une séance |
| `/api/reminders` | API | Cron rappels deadline |
| `/auth/callback` | API | Callback auth Supabase |
| `/auth/signout` | API | Déconnexion |
| `/dashboard` | Prof | Tableau de bord |
| `/dashboard/students` | Prof | Liste des élèves |
| `/dashboard/students/new` | Prof | Ajouter un élève |
| `/dashboard/students/[id]/edit` | Prof | Modifier un élève |
| `/dashboard/lessons` | Prof | Liste des leçons |
| `/dashboard/lessons/new` | Prof | Nouvelle leçon |
| `/dashboard/lessons/[id]/edit` | Prof | Modifier une leçon |
| `/dashboard/homework` | Prof | Liste des devoirs |
| `/dashboard/homework/new` | Prof | Nouveau devoir |
| `/dashboard/homework/[id]` | Prof | Détail devoir + soumissions |
| `/dashboard/homework/[id]/edit` | Prof | Modifier un devoir |
| `/dashboard/availability` | Prof | Gestion des disponibilités |
| `/dashboard/bookings` | Prof | Gestion des réservations |
| `/dashboard/analytics` | Prof | Statistiques |
| `/dashboard/settings` | Prof | Paramètres du profil |
| `/student` | Élève | Accueil élève |
| `/student/lessons` | Élève | Leçons disponibles |
| `/student/homework` | Élève | Devoirs assignés |

---

## Checklist des fonctionnalités

- [x] Auth email/password avec rôles (teacher / student)
- [x] Middleware de protection des routes par rôle
- [x] Dashboard professeur moderne (gradient banner, stat cards, widgets)
- [x] CRUD complet élèves avec recherche et filtre par niveau
- [x] Leçons en Markdown avec prévisualisation, ciblage par niveau, publication
- [x] Devoirs avec deadline, assignation par niveau, correction avec notes
- [x] Soumission de devoirs par les élèves (upload fichier)
- [x] Calendrier de disponibilités (récurrents + exceptions)
- [x] Page publique de réservation avec sélection de créneau
- [x] Gestion des réservations (accepter / refuser / annuler)
- [x] 6 templates d'emails transactionnels (Resend)
- [x] Rappels automatiques de deadline (endpoint cron)
- [x] Row Level Security (RLS) strict sur toutes les tables
- [x] Espace élève (leçons + devoirs)
- [x] Page statistiques avec KPIs et graphiques
- [x] Page paramètres (profil + mot de passe)
- [x] Landing page responsive (8 sections)
- [x] Sidebar dark avec navigation active et badge notifications
- [x] Logo et favicon personnalisés
- [x] Design system avec CSS custom properties (Tailwind 4)

---

## Licence

Projet privé — tous droits réservés.
