import type { BottleneckStatus } from '../types';

/** Options Likert 1–4 mappées sur 0–1 */
export const LIKERT4 = [
  { value: 0, label: '1 — Pas du tout' },
  { value: 1 / 3, label: '2 — Peu / rarement' },
  { value: 2 / 3, label: '3 — Assez / souvent' },
  { value: 1, label: '4 — Oui clairement' },
] as const;

/** Oui / Partiel / Non mappés sur 0–1 */
export const TRI = [
  { value: 1, label: 'Oui' },
  { value: 0.5, label: 'Partiel' },
  { value: 0, label: 'Non' },
] as const;

export type QuestionKind = 'likert4' | 'tri';

export interface QuestionnaireOption {
  value: number;
  label: string;
}

export interface QuestionnaireQuestion {
  id: string;
  prompt: string;
  kind: QuestionKind;
  /** Libellé court pour la justification (« signaux de tension ») */
  signalLabel: string;
  options: readonly QuestionnaireOption[];
}

export interface BottleneckQuestionnaire {
  bottleneckId: number;
  intro: string;
  questions: QuestionnaireQuestion[];
}

/** Seuils documentés (moyenne 0–1) */
export const SCORE_THRESHOLDS = {
  fluide: 0.75,
  sousTension: 0.4,
} as const;

export function statusFromMean(mean: number): BottleneckStatus {
  if (mean >= SCORE_THRESHOLDS.fluide) return 'fluide';
  if (mean >= SCORE_THRESHOLDS.sousTension) return 'sous tension';
  return 'bloquant';
}

function q(
  id: string,
  prompt: string,
  signalLabel: string,
  kind: QuestionKind
): QuestionnaireQuestion {
  return {
    id,
    prompt,
    kind,
    signalLabel,
    options: kind === 'likert4' ? LIKERT4 : TRI,
  };
}

/**
 * Questionnaires opérationnels par goulot (§2).
 * Chaque item vise le mécanisme / la conséquence du document.
 */
export const bottleneckQuestionnaires: BottleneckQuestionnaire[] = [
  {
    bottleneckId: 1,
    intro:
      'Intention : le but, les exclusions et les préférences restent-ils partiellement tacites ?',
    questions: [
      q(
        'i1',
        'Le but du projet (ou de la tâche) est-il écrit de façon récupérable (brief, ticket, contrat) ?',
        'but écrit',
        'tri'
      ),
      q(
        'i2',
        'Les exclusions explicites (ce qui est hors périmètre) sont-elles listées ?',
        'exclusions explicites',
        'tri'
      ),
      q(
        'i3',
        'Disposez-vous de critères de succès observables (tests, livrable, seuil) avant de produire ?',
        'critères de succès',
        'likert4'
      ),
      q(
        'i4',
        'Les préférences encore tacites (style, priorités, arbitrages) ont-elles été confrontées à un exemple concret ?',
        'préférences tacites',
        'likert4'
      ),
      q(
        'i5',
        'Une personne non initiée pourrait-elle relire le brief et produire sans demander le « vrai » objectif ?',
        'brief autonome',
        'tri'
      ),
    ],
  },
  {
    bottleneckId: 2,
    intro:
      'Grounding : les partenaires partagent-ils le même référentiel et les mêmes critères d’acceptation ?',
    questions: [
      q(
        'g1',
        'Existe-t-il un glossaire partagé (termes métier, acronymes, unités) tenu à jour ?',
        'glossaire partagé',
        'tri'
      ),
      q(
        'g2',
        'Les critères d’acceptation sont-ils les mêmes pour l’humain et pour l’IA (pas seulement « ça a l’air bon ») ?',
        'critères d’acceptation communs',
        'likert4'
      ),
      q(
        'g3',
        'Sur les derniers échanges, le taux de réparations / clarifications reste-t-il faible ?',
        'taux de réparations',
        'likert4'
      ),
      q(
        'g4',
        'Les « faux accords » (mêmes mots, sens différents) sont-ils rare et rapidement corrigés quand ils surviennent ?',
        'faux accords maîtrisés',
        'likert4'
      ),
      q(
        'g5',
        'Les exemples positifs et négatifs (cas acceptés / refusés) sont-ils disponibles pour ancrer le sens ?',
        'exemples d’ancrage',
        'tri'
      ),
    ],
  },
  {
    bottleneckId: 3,
    intro:
      'Mémoire : décisions, hypothèses et versions sont-elles séparées et retrouvées au bon moment ?',
    questions: [
      q(
        'm1',
        'Les décisions structurantes sont-elles consignées dans un registre (journal, ADR, ticket) ?',
        'registre de décisions',
        'tri'
      ),
      q(
        'm2',
        'Les versions (brouillons, modèles, livrables) sont-elles séparées et étiquetées clairement ?',
        'versions séparées',
        'likert4'
      ),
      q(
        'm3',
        'Pouvez-vous récupérer une hypothèse ou une preuve au moment où elle sert (sans fouiller le chat) ?',
        'récupération au bon moment',
        'likert4'
      ),
      q(
        'm4',
        'Les contradictions entre sessions (IA qui « oublie » ou réécrit) sont-elles détectées rapidement ?',
        'contradictions détectées',
        'tri'
      ),
      q(
        'm5',
        'La mémoire fournisseur (historique chat) est-elle complétée par un export indépendant ?',
        'export indépendant',
        'tri'
      ),
    ],
  },
  {
    bottleneckId: 4,
    intro:
      'Modèle mutuel : capacités IA et attentes humaines sont-elles calibrées sur cette classe de tâches ?',
    questions: [
      q(
        'mm1',
        'Les capacités de l’IA ont-elles été testées sur cette classe de tâches (pas seulement en démo) ?',
        'capacités testées',
        'tri'
      ),
      q(
        'mm2',
        'Les attentes humaines (niveau de détail, format, incertitudes) sont-elles explicitées à l’IA ?',
        'attentes explicitées',
        'likert4'
      ),
      q(
        'mm3',
        'Le niveau d’autonomie accordé correspond-il à la performance observée (ni trop, ni trop peu) ?',
        'autonomie calibrée',
        'likert4'
      ),
      q(
        'mm4',
        'Les limites connues du modèle (hallucinations, horizons, outils) sont-elles rappelées avant délégation ?',
        'limites rappelées',
        'tri'
      ),
      q(
        'mm5',
        'L’humain sait-il ce que l’IA croit savoir sur le projet (état partagé vs fantasme) ?',
        'état mutuel clair',
        'likert4'
      ),
    ],
  },
  {
    bottleneckId: 5,
    intro:
      'Vérification : la génération est-elle moins coûteuse que l’établissement de la validité ?',
    questions: [
      q(
        'v1',
        'Disposez-vous d’une preuve indépendante (test, source primaire, second calcul) pour les livrables critiques ?',
        'preuve indépendante',
        'tri'
      ),
      q(
        'v2',
        'Le volume généré reste-t-il dans votre capacité réelle de revue (pas de dette de lecture) ?',
        'génération ≤ revue',
        'likert4'
      ),
      q(
        'v3',
        'Les erreurs plausibles (vraies en apparence) sont-elles ciblées par des tests ou des sondes ?',
        'erreurs plausibles testées',
        'likert4'
      ),
      q(
        'v4',
        'Le contrôle croisé (autre méthode / autre modèle sans historique) est-il utilisé quand l’enjeu le justifie ?',
        'contrôle croisé',
        'tri'
      ),
      q(
        'v5',
        'La dette de contrôle (éléments non vérifiés mais « validés ») est-elle suivie explicitement ?',
        'dette de contrôle',
        'tri'
      ),
    ],
  },
  {
    bottleneckId: 6,
    intro:
      'Confiance : la confiance est-elle globale alors que la fiabilité est locale à une tâche / version / contrôle ?',
    questions: [
      q(
        'c1',
        'Distinguez-vous confiance globale (« l’IA est bonne ») et confiance locale (tâche × version × contrôle) ?',
        'confiance locale vs globale',
        'tri'
      ),
      q(
        'c2',
        'La délégation est-elle calibrée — ni sous-usage (éviter l’IA utile) ni sur-délégation (laisser passer sans preuve) ?',
        'délégation calibrée',
        'likert4'
      ),
      q(
        'c3',
        'La confiance déclarée est-elle recalibrée après erreurs échappées ou succès surprenants ?',
        'recalibration',
        'likert4'
      ),
      q(
        'c4',
        'Les zones où l’IA est fiable et celles où elle ne l’est pas sont-elles cartographiées ?',
        'carte de fiabilité',
        'tri'
      ),
      q(
        'c5',
        'Une délégation excessive a-t-elle été évitée sur les décisions irréversibles ou à fort enjeu ?',
        'délégation bornée',
        'tri'
      ),
    ],
  },
  {
    bottleneckId: 7,
    intro:
      'Compétence : la délégation laisse-t-elle intacte la pratique nécessaire à la supervision et à la reprise ?',
    questions: [
      q(
        'cp1',
        'Maintenez-vous une pratique sans IA sur des tâches comparables (pas seulement la revue) ?',
        'pratique sans IA',
        'tri'
      ),
      q(
        'cp2',
        'Des sondes périodiques de compétence (score sans assistance) sont-elles planifiées ?',
        'sondes périodiques',
        'tri'
      ),
      q(
        'cp3',
        'En cas de panne ou de rejet IA, une reprise humaine est-elle encore possible sans délai critique ?',
        'reprise possible',
        'likert4'
      ),
      q(
        'cp4',
        'Le contrôle reste-t-il substantiel (hypothèses, cas limites) plutôt que rituel (lecture en diagonale) ?',
        'contrôle non rituel',
        'likert4'
      ),
      q(
        'cp5',
        'La déqualification perçue (perte de situation) a-t-elle été mesurée ou discutée récemment ?',
        'déqualification suivie',
        'tri'
      ),
    ],
  },
  {
    bottleneckId: 8,
    intro:
      'Multi-IA : les modèles partagent-ils état et autorité, ou l’humain devient-il routeur / traducteur ?',
    questions: [
      q(
        'mi1',
        'Un état partagé (brief, artefacts, décisions) est-il transmis explicitement entre modèles ?',
        'état partagé',
        'tri'
      ),
      q(
        'mi2',
        'L’humain a-t-il cessé d’être le routeur/traducteur ad hoc (contrats et état partagés en place) ?',
        'humain non-routeur ad hoc',
        'likert4'
      ),
      q(
        'mi3',
        'Des contrats de transmission (quoi passer, quoi ne pas passer, format) existent-ils entre étapes IA ?',
        'contrats de transmission',
        'tri'
      ),
      q(
        'mi4',
        'L’autorité (qui tranche en cas de divergence multi-IA) est-elle attribuée à l’humain nommément ?',
        'autorité de divergence',
        'tri'
      ),
      q(
        'mi5',
        'Les historiques partagés entre modèles sont-ils évités quand un contrôle croisé est requis ?',
        'indépendance des contrôles',
        'likert4'
      ),
    ],
  },
  {
    bottleneckId: 9,
    intro:
      'Outils : code, fichiers, navigateur, messages et preuves restent-ils fragmentés ?',
    questions: [
      q(
        'o1',
        'Les artefacts (code, docs, preuves) sont-ils regroupés plutôt que dispersés entre chat, disque et outils ?',
        'artefacts non fragmentés',
        'likert4'
      ),
      q(
        'o2',
        'Les traces d’exécution (commandes, versions, exports) sont-elles conservées et retrouvables ?',
        'traces conservées',
        'tri'
      ),
      q(
        'o3',
        'Une reprise après interruption (changement d’outil, crash, nouvel agent) reste-t-elle peu coûteuse ?',
        'reprises peu coûteuses',
        'likert4'
      ),
      q(
        'o4',
        'Les liens entre livrable et preuve (test, source) sont-ils explicites dans l’espace de travail ?',
        'liens livrable–preuve',
        'tri'
      ),
      q(
        'o5',
        'Les transferts manuels répétés (copier-coller entre outils) ont-ils été réduits ou automatisés ?',
        'transferts réduits',
        'tri'
      ),
    ],
  },
  {
    bottleneckId: 10,
    intro:
      'Allocation : les tâches sont-elles distribuées selon performance relative, risque et vérifiabilité ?',
    questions: [
      q(
        'a1',
        'Le mode d’allocation (IA dominante, humain, hybride…) est-il choisi selon perf / risque / vérifiabilité ?',
        'mode selon critères',
        'likert4'
      ),
      q(
        'a2',
        'Avez-vous évité qu’un composant peu adapté décide ou contrôle (mauvais décideur) ?',
        'décideur adapté',
        'tri'
      ),
      q(
        'a3',
        'Les six critères (spécifiabilité, vérifiabilité, réversibilité, gravité, avantage, entretien) sont-ils passés en revue ?',
        'checklist allocation',
        'tri'
      ),
      q(
        'a4',
        'Les tâches irréversibles ou à forte gravité restent-elles sous autorité humaine explicite ?',
        'autorité sur irréversible',
        'tri'
      ),
      q(
        'a5',
        'L’allocation est-elle revue après mesure (pas figée sur l’intuition initiale) ?',
        'allocation revue',
        'likert4'
      ),
    ],
  },
  {
    bottleneckId: 11,
    intro:
      'Bande passante : lire, comparer, décider et arbitrer restent-ils dans la capacité d’absorption ?',
    questions: [
      q(
        'bp1',
        'Le volume produit (textes, variantes, diffs) reste-t-il absorbable sans file d’attente mentale ?',
        'volume ≤ absorption',
        'likert4'
      ),
      q(
        'bp2',
        'Les variantes sont-elles générées avec des critères de sélection (sinon : bruit) ?',
        'variantes avec critères',
        'tri'
      ),
      q(
        'bp3',
        'Le temps d’attention humaine est-il budgété avant de lancer une production massive ?',
        'budget d’attention',
        'tri'
      ),
      q(
        'bp4',
        'Les décisions d’arbitrage sont-elles regroupées (lots) plutôt que saupoudrées en continu ?',
        'arbitrage groupé',
        'likert4'
      ),
      q(
        'bp5',
        'Des filtres automatiques (tests, schémas) réduisent-ils ce qui doit être lu par un humain ?',
        'filtres avant lecture',
        'tri'
      ),
    ],
  },
  {
    bottleneckId: 12,
    intro:
      'Responsabilité : l’autorité humaine et l’imputabilité des conséquences sont-elles claires ?',
    questions: [
      q(
        'r1',
        'Une autorité humaine nommément responsable est-elle désignée pour les décisions structurantes ?',
        'autorité humaine claire',
        'tri'
      ),
      q(
        'r2',
        'L’imputabilité des conséquences (qui assume l’erreur échappée) est-elle documentée ?',
        'imputabilité',
        'tri'
      ),
      q(
        'r3',
        'L’IA est-elle limitée à proposer lorsque les conséquences ne peuvent pas lui être imputées ?',
        'IA propose sans imputer',
        'likert4'
      ),
      q(
        'r4',
        'Les décisions irréversibles nécessitent-elles une validation humaine tracée ?',
        'validation irréversible',
        'tri'
      ),
      q(
        'r5',
        'Le décalage capacité d’action / imputabilité a-t-il été discuté dans l’équipe ?',
        'décalage discuté',
        'likert4'
      ),
    ],
  },
  {
    bottleneckId: 13,
    intro:
      'Continuité et pouvoir : export, portabilité et dépendance fournisseur sont-ils maîtrisés ?',
    questions: [
      q(
        'co1',
        'Un export des actifs de coordination (décisions, glossaire, preuves) est-il possible hors plateforme ?',
        'export possible',
        'tri'
      ),
      q(
        'co2',
        'Un test de portabilité (reprise dans un autre outil) a-t-il été fait récemment ?',
        'test portabilité',
        'tri'
      ),
      q(
        'co3',
        'La dépendance fournisseur (mémoire, versions, accès, prix, règles) est-elle cartographiée ?',
        'dépendance cartographiée',
        'likert4'
      ),
      q(
        'co4',
        'Une solution de reprise (plan B) existe-t-elle si l’accès ou le prix change brutalement ?',
        'plan de reprise',
        'tri'
      ),
      q(
        'co5',
        'Les normes du fournisseur sont-elles séparées des normes du projet (documentées) ?',
        'normes séparées',
        'likert4'
      ),
    ],
  },
  {
    bottleneckId: 14,
    intro:
      'Valeurs : les conflits normatifs sont-ils explicites, et l’optimisation locale reste-t-elle alignée sur la finalité ?',
    questions: [
      q(
        'va1',
        'Les conflits normatifs (vitesse vs rigueur, exhaustivité vs lisibilité…) sont-ils rendus explicites ?',
        'conflits normatifs explicites',
        'tri'
      ),
      q(
        'va2',
        'L’optimisation locale (métrique, prompt, KPI) a-t-elle été confrontée à la finalité du projet ?',
        'locale vs finalité',
        'likert4'
      ),
      q(
        'va3',
        'Les préférences complexes non spécifiables entièrement sont-elles gérées par arbitrage humain ?',
        'arbitrage sur non-spécifié',
        'tri'
      ),
      q(
        'va4',
        'Des exemples de « succès métrique / échec finalité » ont-ils été listés pour éviter Goodhart ?',
        'garde Goodhart',
        'tri'
      ),
      q(
        'va5',
        'Les exclusions éthiques ou organisationnelles sont-elles écrites (pas seulement « on verra ») ?',
        'exclusions éthiques écrites',
        'likert4'
      ),
    ],
  },
];

export function getQuestionnaire(bottleneckId: number): BottleneckQuestionnaire | undefined {
  return bottleneckQuestionnaires.find((q) => q.bottleneckId === bottleneckId);
}
