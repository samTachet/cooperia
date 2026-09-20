/** Types alignés sur Optimiser la coopération humain-IA (Tachet, sept. 2026) */

export type Strate = 'théorie' | 'code' | 'documentation' | 'revue';
export type Condition = 'A' | 'B' | 'C' | 'D';
export type Difficulte = 1 | 2 | 3 | 4 | 5;

export type AllocationMode =
  | 'IA dominante'
  | 'Humain dominant'
  | 'Hybride séquentiel'
  | 'Double contrôle'
  | 'Expérimental';

/** Statuts diagnostiques des 14 goulots (§2) */
export type BottleneckStatus = 'fluide' | 'sous tension' | 'bloquant';

export type AppTab =
  | 'accueil'
  | 'cas-ccl'
  | 'dimensions'
  | 'efficience'
  | 'episodes'
  | 'controles'
  | 'competence'
  | 'pouvoir';

export type EnjeuNiveau = '' | 'faible' | 'moyen' | 'élevé';

export interface DimensionScores {
  qualiteExterne: number; // 0–100
  attentionHumaine: number; // minutes
  erreursEchappees: number; // perte pondérée
  coutReprise: number; // minutes
  calibration: number; // score %
  rendementDesaccord: number; // 0–1 (eq. 11)
  competenceHumaine: number; // 0–100 sans assistance
  portabilite: number; // score 0–100
}

export interface Episode {
  id: string;
  tache: string;
  strate: Strate;
  difficulte: Difficulte;
  condition: Condition;
  dureeMin: number;
  critereValidation: string;
  scores: DimensionScores;
}

export interface Guardrails {
  r0: number;
  k0: number;
  p0: number;
}

export interface EfficiencyInputs {
  uValidee: number;
  attentionHumaine: number;
  rErreur: number;
  kH: number;
  portabilite: number;
}

export interface CompositeSInputs {
  uValidee: number;
  dUtile: number;
  cCoord: number;
  cVerif: number;
  cReprise: number;
  lEchappee: number;
  beta: number;
  lambda: number;
}

export interface Bottleneck {
  id: number;
  nom: string;
  mecanisme: string;
  consequence: string;
  status: BottleneckStatus;
  note: string;
  /** Réponses du questionnaire (id question → score 0–1) */
  questionnaireAnswers?: Record<string, number>;
  /** Statut proposé au moment de l’application (avant override éventuel) */
  proposedStatus?: BottleneckStatus;
  /** Horodatage ISO de la dernière application du diagnostic */
  diagnosedAt?: string;
}

export interface ControlLevel {
  niveau: 0 | 1 | 2 | 3 | 4;
  label: string;
  moyens: string;
  risque: string;
  count: number;
}

export interface PowerLever {
  id: string;
  label: string;
  pouvoir: string;
  gouvernance: string;
  score: number;
}

export interface CompetencePoint {
  date: string;
  score: number;
  tache: string;
}

export interface DeltaInputs {
  pH: number;
  pIA: number;
  pHIA: number;
}

export interface AllocationCriteria {
  id: string;
  label: string;
  question: string;
  checked: boolean;
}

/** Brief du projet courant (accueil générique — formulaire Créer un projet) */
export interface ProjectBrief {
  name: string;
  /** Référence / code court optionnel */
  code: string;
  but: string;
  destinataire: string;
  perimetre: string;
  /** Contraintes opérationnelles (optionnel) */
  contraintes: string;
  /** Horizon / échéance (optionnel) */
  horizon: string;
  /** Niveau d'enjeu */
  enjeu: EnjeuNiveau;
}

/** Rôles d'orchestration génériques (§5.3) */
export interface OrchestrationRole {
  id: string;
  role: string;
  autorite: string;
  artefact: string;
}

/** Questions avant tâche (§11.2) */
export interface BeforeTaskAnswers {
  resultat: string;
  benchmark: string;
  risque: string;
  preuve: string;
  allocation: string;
  competence: string;
}

export interface DashboardState {
  project: ProjectBrief;
  dimensions: DimensionScores;
  dimensionThresholds: Partial<Record<keyof DimensionScores, { min?: number; max?: number }>>;
  efficiency: EfficiencyInputs;
  guardrails: Guardrails;
  compositeS: CompositeSInputs;
  episodes: Episode[];
  bottlenecks: Bottleneck[];
  bindingBottleneckId: number | null;
  controlLevels: ControlLevel[];
  competenceTrend: CompetencePoint[];
  powerLevers: PowerLever[];
  deltas: DeltaInputs;
  allocationMode: AllocationMode;
  allocationCriteria: AllocationCriteria[];
  orchestrationRoles: OrchestrationRole[];
  beforeTask: BeforeTaskAnswers;
  stopCriteria: {
    twoSeriousEscaped: boolean;
    unassistedBelow: boolean;
    notReconstructible: boolean;
  };
  theme: 'light' | 'dark';
}
