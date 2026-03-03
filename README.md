# AtelierMath — Plateforme de cours de soutien en mathématiques

Plateforme web pour une professeure de maths (lycée) : gestion des élèves, leçons, devoirs et réservations via calendrier.

## Stack technique

| Technologie | Version | Usage |
|-------------|---------|-------|
| **Next.js** | 16.x | App Router, Server Actions, API Routes |
| **TypeScript** | 5.x | Typage |
| **Supabase** | 2.98.x | Auth, Postgres, RLS, Storage |
| **Resend** | 6.x | Emails transactionnels |
| **Tailwind CSS** | 4.x | UI |
| **date-fns** | 4.x | Gestion dates |
| **Lucide React** | 0.576.x | Icônes |

## Prérequis

- Node.js 18+
- Un projet Supabase (gratuit sur [supabase.com](https://supabase.com))
- Un compte Resend (gratuit sur [resend.com](https://resend.com))

## Installation

```bash
# Cloner le repo
git clone <url> && cd ateliermath

# Installer les dépendances
npm install

# Copier le fichier d'environnement
cp .env.local.example .env.local
# Remplir les variables dans .env.local
```

## Variables d'environnement

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
RESEND_API_KEY=re_...
EMAIL_FROM=AtelierMath <noreply@votredomaine.com>
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_TIMEZONE=Africa/Casablanca
```

## Configuration Supabase

1. Créer un projet sur [supabase.com](https://supabase.com)
2. Aller dans **SQL Editor** et exécuter le fichier `supabase/schema.sql`
3. Créer les buckets Storage :
   - `documents` (privé) — pour les leçons en PDF
   - `submissions` (privé) — pour les remises d'élèves
4. Créer le premier compte professeur via Supabase Auth Dashboard :
   - Email + password
   - User metadata : `{"full_name": "Prof Nom", "role": "teacher"}`

## Lancer le projet

```bash
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000)

## Structure du projet

```
src/
├── app/
│   ├── api/reminders/     # Rappels deadline (cron)
│   ├── auth/              # Callback OAuth + signout
│   ├── book/              # Page publique réservation
│   ├── dashboard/         # Espace professeur
│   │   ├── availability/  # Gestion disponibilités
│   │   ├── bookings/      # Gestion réservations
│   │   ├── homework/      # Gestion devoirs
│   │   ├── lessons/       # Gestion leçons
│   │   └── students/      # Gestion élèves
│   ├── login/             # Page connexion
│   └── student/           # Espace élève
│       ├── homework/      # Devoirs élève
│       └── lessons/       # Leçons élève
├── lib/
│   ├── email.ts           # Service Resend + templates
│   ├── types.ts           # Types TypeScript
│   └── supabase/
│       ├── admin.ts       # Client service role
│       ├── client.ts      # Client navigateur
│       ├── middleware.ts   # Refresh session + guards
│       └── server.ts      # Client serveur
├── middleware.ts           # Next.js middleware (auth)
supabase/
└── schema.sql             # Schéma DB + RLS complet
```

## Rappels automatiques (deadline 24h)

Endpoint : `GET /api/reminders?secret=<16_premiers_chars_service_role_key>`

Configurer un cron job quotidien (ex: Vercel Cron, GitHub Actions) :
```json
// vercel.json
{
  "crons": [{
    "path": "/api/reminders?secret=VOTRE_SECRET",
    "schedule": "0 8 * * *"
  }]
}
```

## Commandes utiles

```bash
npm run dev      # Développement
npm run build    # Build production
npm run start    # Serveur production
npm run lint     # Lint
```

## Fonctionnalités MVP

- [x] Auth email/password avec rôles (teacher/student)
- [x] Dashboard professeur avec stats
- [x] CRUD élèves (créer/modifier/supprimer)
- [x] Leçons (markdown + ciblage par niveau)
- [x] Devoirs (assignation + remise + correction + notes)
- [x] Calendrier de disponibilités (récurrents + exceptions)
- [x] Page publique de réservation
- [x] Gestion réservations (accepter/refuser)
- [x] Emails transactionnels (Resend)
- [x] Rappels deadline automatiques
- [x] RLS strict Supabase
- [x] Espace élève (leçons + devoirs)
