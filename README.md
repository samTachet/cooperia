# Coopéria — Tableau de bord de coopération humain–IA

Outil de recherche opérationnel (**Coopéria**) fondé sur :

> Samirah Tachet, *Optimiser la coopération humain-IA* (septembre 2026).

Préférence explicite pour un **tableau de bord multidimensionnel** plutôt qu’un score unique (§6.3). Les équations du document sont des **définitions opérationnelles**, non des lois validées.

L’**accueil** est générique (créer un projet + 14 goulots + allocation/orchestration). Le **cas CCL** (Capital Conversion Lab) est un exemple secondaire, accessible via l’onglet « Cas CCL ».

## Démarrage

```bash
cd /workspace/dashboard-cooperation-humain-ia
npm install
npm run dev
```

Build de production :

```bash
npm run build
npm run preview
```

Stack : Vite · React · TypeScript · Recharts. Entièrement côté client ; les modifications sont persistées dans `localStorage` (`cooperation-dashboard-v2`). Une migration légère depuis `ccl-dashboard-cooperation-v1` est appliquée si présent (sans forcer le framing CCL sur l’accueil).

## Page d’accueil (générique)

| Bloc | Contenu | Sections |
|---|---|---|
| **Créer un projet** | Formulaire guidé (sections) : **Identité** (nom*, code/réf.) · **Brief** (but*, destinataire, périmètre, contraintes, horizon/échéance, enjeu faible/moyen/élevé) · **Point d’entrée** (§11.2 : résultat, benchmark, risque, preuve, allocation, compétence) · actions Enregistrer / Réinitialiser / CTA vers goulots & allocation · bandeau résumé + déblocage des goulots dès nom+but | §11.2 |
| **14 goulots** | Grille diagnostique : fluide / sous tension / bloquant ; bouton **Analyser** → modal questionnaire (4–6 questions/goulot) ; scoring moyen 0–1 (fluide ≥ 0,75 · sous tension ≥ 0,40 · sinon bloquant) ; override manuel ; persistance des réponses ; badge « diagnostiqué » ; note ; binding Goldratt ; info-bulles mécanisme/conséquence | §2 · §2.1 |
| **Allocation & orchestration** | 5 modes ; 6 critères ; rôles génériques (Humain / IA cadrage / production / contrôle / Environnement) ; mêmes questions avant tâche (affinage) | §4 · §4.1 · §5.3 · §11.2 |

Champs `ProjectBrief` persistés : `name`, `code`, `but`, `destinataire`, `perimetre`, `contraintes`, `horizon`, `enjeu`. Les réponses §11.2 vivent dans `beforeTask` (partagées entre le formulaire projet et Allocation).

## Navigation (onglets)

| Onglet | Contenu |
|---|---|
| **Accueil** | Créer un projet + goulots + allocation/orchestration |
| **Cas CCL** | Exemple CCL : critères d’arrêt, Δaugmentation/Δsynergie, épisodes pilote |
| **Dimensions** | Huit dimensions KPI (§6.3) |
| **Efficience** | Objectif d’efficience + garde-fous + indicateur S (§6.2–6.3) |
| **Épisodes** | Table d’épisodes (données d’exemple) |
| **Contrôles** | Hiérarchie de contrôles 0–4 (§6.4) |
| **Compétence** | Tendance sondes / ironies (§3 · §6.3) |
| **Pouvoir** | Leviers de portabilité (§7.3) |

## Correspondance panneaux ↔ sections du PDF

| Panneau UI | Sections du document |
|---|---|
| **Critères d’arrêt** (Cas CCL) | §10.2 |
| **Huit dimensions** | §6.3 |
| **Objectif d’efficience + garde-fous** | §6.3 / éq. 9 |
| **Indicateur composite S** | §6.2 / éq. 8 — secondaire ; Goodhart §6.1 |
| **Comparaison Δaugmentation / Δsynergie** | §1.2 / éq. 1–2 |
| **Épisodes** | §10.2 · §9.3 |
| **Allocation** (5 modes + checklist + rôles + avant tâche) | §4 · §4.1 · §5.3 · §11.2 |
| **Goulots** (grille 14 + binding) | §2 · §2.1 |
| **Hiérarchie de contrôles** | §6.4 |
| **Compétence & ironies** | §3 · §6.3 · Bainbridge |
| **Pouvoir / portabilité** | §7.3 · éq. 10 |

## Diagnostic par goulot (questionnaire)

Chaque carte de goulot propose **Analyser** : un modal accessible (Esc, overlay, focus trap) avec un questionnaire opérationnel spécifique (§2).

- Fichiers : `src/data/bottleneckQuestionnaires.ts`, `src/utils/scoreBottleneck.ts`, `src/components/BottleneckModal.tsx`
- **Règle** : moyenne des réponses sur 0–1 → `fluide` ≥ 0,75 · `sous tension` ≥ 0,40 · sinon `bloquant` (Likert 1–4 → 0/⅓/⅔/1 ; Oui/Partiel/Non → 1/0,5/0). Justification avec « signaux de tension » (score < 0,5).
- **Appliquer le diagnostic** écrit `status`, `questionnaireAnswers`, `proposedStatus`, `diagnosedAt` (localStorage via `cooperation-dashboard-v2`).

## Exports

Dans le panneau **Épisodes** :

- **Export CSV** — colonnes d’épisode + scores des 8 dimensions
- **Export JSON** — même contenu structuré

## Thème

Bouton *Mode sombre / Mode clair* dans la barre supérieure.

## Notes méthodologiques

- Ne pas collapser le tableau de bord en un « vanity metric ».
- S (éq. 8) est affiché avec un avertissement explicite : il ne doit pas être l’unique objectif.
- Les données d’épisodes sont marquées **données d’exemple** (pilote CCL fictif pour démonstration UI).
- Vocabulaire français aligné sur le document source.

## Licence d’usage

Usage recherche / opérationnel. Contenu conceptuel © Samirah Tachet, 2026.
