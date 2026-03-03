# AtelierMath — Mini-PRD (MVP)

## Vision
Plateforme web pour une professeure de mathématiques proposant des cours de soutien lycée. Elle gère ses élèves, publie leçons et devoirs, et permet la réservation de séances via un calendrier public.

## Utilisateurs
| Rôle | Description |
|------|-------------|
| **TEACHER** | Professeure — accès admin complet |
| **STUDENT** | Élève inscrit — accès à son espace |
| **Visiteur** | Non connecté — page de réservation publique |

## User Stories

### Auth & Rôles
- US-01 : En tant que prof, je me connecte avec email/password et j'accède à mon dashboard admin.
- US-02 : En tant qu'élève, je me connecte et j'accède uniquement à mon espace élève.
- US-03 : Les routes sont protégées par rôle (middleware + RLS).

### Gestion Élèves (Prof)
- US-10 : En tant que prof, je crée un élève (nom, email, niveau, notes internes).
- US-11 : En tant que prof, je modifie ou supprime un élève.
- US-12 : En tant que prof, je vois la liste de mes élèves avec filtres par niveau.

### Leçons
- US-20 : En tant que prof, je publie une leçon (titre, contenu markdown, fichier PDF optionnel, ciblage par niveau ou "tous").
- US-21 : En tant qu'élève, je vois les leçons publiées pour mon niveau.
- US-22 : En tant que prof, je modifie ou archive une leçon.

### Devoirs
- US-30 : En tant que prof, je crée un devoir (titre, description, PJ, deadline, ciblage : élève / niveau / tous).
- US-31 : En tant qu'élève, je vois mes devoirs assignés et je rends un fichier + commentaire.
- US-32 : En tant que prof, je corrige un devoir (feedback texte + note optionnelle) et le marque "reviewed".
- US-33 : L'élève reçoit un email quand un devoir est assigné.
- US-34 : L'élève reçoit un email quand un feedback est envoyé.
- US-35 : Un rappel email est envoyé 24h avant la deadline.

### Réservation / Calendrier
- US-40 : En tant que prof, je définis mes disponibilités récurrentes (jour + plage horaire).
- US-41 : En tant que prof, je crée des exceptions / indisponibilités.
- US-42 : Un visiteur voit le calendrier avec les créneaux disponibles (vert).
- US-43 : Un visiteur réserve un créneau (nom, email, niveau, message) → statut "pending".
- US-44 : La prof reçoit un email de nouvelle réservation.
- US-45 : La prof accepte ou refuse → l'élève reçoit un email de confirmation/refus.

### Emails (Resend)
- US-50 : Emails transactionnels : devoir assigné, feedback envoyé, rappel deadline, nouvelle réservation, confirmation/refus réservation.

## Architecture Technique
- **Frontend + API** : Next.js 14+ App Router, TypeScript, Server Actions
- **Base de données** : Supabase Postgres + RLS
- **Auth** : Supabase Auth (email/password)
- **Storage** : Supabase Storage (PDFs, images)
- **Emails** : Resend
- **UI** : Tailwind CSS
- **Timezone** : Africa/Casablanca

## Décisions par défaut
- Durée séance : 150 minutes
- Statuts booking : pending → accepted | declined | cancelled
- Statuts homework : assigned → submitted → reviewed
- Niveaux : 2nde, 1ère, Terminale, Autre
