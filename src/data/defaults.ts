import type {
  BeforeTaskAnswers,
  DashboardState,
  OrchestrationRole,
  ProjectBrief,
} from '../types';
import { sampleEpisodes } from './sampleEpisodes';
import { defaultBottlenecks } from './bottlenecks';

/** Clé v2 — accueil générique (projet + goulots), sans defaults CCL imposés */
export const STORAGE_KEY = 'cooperation-dashboard-v2';
export const LEGACY_STORAGE_KEY = 'ccl-dashboard-cooperation-v1';

export const DIMENSION_META: Record<
  keyof import('../types').DimensionScores,
  { label: string; definition: string; unit: string; higherIsBetter: boolean; section: string }
> = {
  qualiteExterne: {
    label: 'Qualité externe',
    definition:
      'Score aveugle, test, résultat observable ou source primaire. Évite l’auto-évaluation complaisante (§6.3).',
    unit: 'score 0–100',
    higherIsBetter: true,
    section: '§6.3',
  },
  attentionHumaine: {
    label: 'Attention humaine',
    definition:
      'Minutes de lecture, correction, comparaison et arbitrage. Mesure la ressource rare (§6.3).',
    unit: 'min',
    higherIsBetter: false,
    section: '§6.3',
  },
  erreursEchappees: {
    label: 'Erreurs échappées',
    definition:
      'Pertes découvertes après validation, pondérées par gravité. Mesure le risque réel du contrôle (§6.3).',
    unit: 'perte pondérée',
    higherIsBetter: false,
    section: '§6.3',
  },
  coutReprise: {
    label: 'Coût de reprise',
    definition:
      'Temps et ressources nécessaires pour corriger tardivement. Rend visible la dette différée (§6.3).',
    unit: 'min',
    higherIsBetter: false,
    section: '§6.3',
  },
  calibration: {
    label: 'Calibration',
    definition:
      'Écart entre confiance déclarée et fréquence de validité. Détecte surconfiance et sous-confiance (§6.3). Stocké ici comme score de calibration (100 − |écart|×100).',
    unit: 'score 0–100',
    higherIsBetter: true,
    section: '§6.3',
  },
  rendementDesaccord: {
    label: 'Rendement du désaccord',
    definition:
      'R_désaccord = désaccords ayant produit test, correction ou révision / occasions pertinentes d’audit (éq. 11, §8.2).',
    unit: 'ratio 0–1',
    higherIsBetter: true,
    section: '§8.2 / éq. 11',
  },
  competenceHumaine: {
    label: 'Compétence humaine',
    definition:
      'Performance périodique sans assistance sur tâches comparables. Détecte la déqualification / ironies de l’automatisation (§6.3, Bainbridge).',
    unit: 'score 0–100',
    higherIsBetter: true,
    section: '§6.3',
  },
  portabilite: {
    label: 'Portabilité',
    definition:
      'Capacité à reprendre le projet dans un autre outil (score inverse du temps de reprise hors fournisseur). Mesure la dépendance infrastructurelle (§6.3, §7.3).',
    unit: 'score 0–100',
    higherIsBetter: true,
    section: '§6.3 / §7.3',
  },
};

export const defaultProject: ProjectBrief = {
  name: '',
  code: '',
  but: '',
  destinataire: '',
  perimetre: '',
  contraintes: '',
  horizon: '',
  enjeu: '',
};

export const defaultOrchestrationRoles: OrchestrationRole[] = [
  {
    id: 'humain',
    role: 'Humain',
    autorite: 'Finalité, arbitrage normatif, décisions irréversibles, responsabilité.',
    artefact: 'Décision motivée, critères d’acceptation, journal d’arbitrage.',
  },
  {
    id: 'ia-cadrage',
    role: 'IA de cadrage',
    autorite: 'Clarifier but, exclusions, hypothèses et plan de vérification.',
    artefact: 'Brief / contrat de tâche, checklist de preuves.',
  },
  {
    id: 'ia-production',
    role: 'IA de production',
    autorite: 'Proposer des livrables sous les contraintes du brief.',
    artefact: 'Brouillon / livrable candidat avec sources et incertitudes.',
  },
  {
    id: 'ia-controle',
    role: 'IA de contrôle',
    autorite: 'Contrôle croisé indépendant (sans historique partagé quand possible).',
    artefact: 'Rapport d’écarts, tests, points de divergence.',
  },
  {
    id: 'environnement',
    role: 'Environnement',
    autorite: 'Contraintes externes : outils, quotas, versions, règles, export.',
    artefact: 'Trace d’exécution, versions, exports portables.',
  },
];

export const defaultBeforeTask: BeforeTaskAnswers = {
  resultat: '',
  benchmark: '',
  risque: '',
  preuve: '',
  allocation: '',
  competence: '',
};

export function createDefaultState(): DashboardState {
  return {
    project: { ...defaultProject },
    dimensions: {
      qualiteExterne: 78,
      attentionHumaine: 42,
      erreursEchappees: 1.4,
      coutReprise: 28,
      calibration: 82,
      rendementDesaccord: 0.55,
      competenceHumaine: 71,
      portabilite: 68,
    },
    dimensionThresholds: {
      qualiteExterne: { min: 70 },
      attentionHumaine: { max: 60 },
      erreursEchappees: { max: 2 },
      coutReprise: { max: 45 },
      calibration: { min: 70 },
      rendementDesaccord: { min: 0.3 },
      competenceHumaine: { min: 65 },
      portabilite: { min: 60 },
    },
    efficiency: {
      uValidee: 78,
      attentionHumaine: 42,
      rErreur: 1.4,
      kH: 71,
      portabilite: 68,
    },
    guardrails: {
      r0: 2.0,
      k0: 65,
      p0: 60,
    },
    compositeS: {
      uValidee: 78,
      dUtile: 12,
      cCoord: 18,
      cVerif: 24,
      cReprise: 14,
      lEchappee: 1.4,
      beta: 0.8,
      lambda: 2.5,
    },
    episodes: sampleEpisodes,
    bottlenecks: defaultBottlenecks.map((b) => ({ ...b })),
    bindingBottleneckId: null,
    controlLevels: [
      {
        niveau: 0,
        label: 'Forme',
        moyens: 'Schéma, format, champs, encodage.',
        risque: 'Erreur réversible et faible.',
        count: 48,
      },
      {
        niveau: 1,
        label: 'Automatique',
        moyens: 'Tests, contraintes, calcul indépendant, analyse statique.',
        risque: 'Faible à moyen.',
        count: 31,
      },
      {
        niveau: 2,
        label: 'Croisé',
        moyens: 'Seconde méthode, source primaire, autre modèle sans historique partagé.',
        risque: 'Moyen.',
        count: 14,
      },
      {
        niveau: 3,
        label: 'Humain ciblé',
        moyens: 'Hypothèses, exceptions, causalité, effets et cas limites.',
        risque: 'Élevé.',
        count: 22,
      },
      {
        niveau: 4,
        label: 'Expert et autorisation',
        moyens: 'Responsabilité professionnelle et décision irréversible.',
        risque: 'Critique.',
        count: 6,
      },
    ],
    competenceTrend: [
      { date: '2026-07-01', score: 78, tache: 'Sonde théorie' },
      { date: '2026-07-15', score: 76, tache: 'Sonde code' },
      { date: '2026-08-01', score: 74, tache: 'Sonde documentation' },
      { date: '2026-08-15', score: 72, tache: 'Sonde revue' },
      { date: '2026-09-01', score: 71, tache: 'Sonde théorie' },
      { date: '2026-09-15', score: 69, tache: 'Sonde code' },
    ],
    powerLevers: [
      {
        id: 'memoire',
        label: 'Mémoire',
        pouvoir: 'Ce qui est conservé, résumé, oublié ou rendu récupérable.',
        gouvernance: 'Exporter décisions, glossaire et preuves dans un format indépendant.',
        score: 72,
      },
      {
        id: 'version',
        label: 'Version',
        pouvoir: 'Comportement du modèle, compétences, style et politiques.',
        gouvernance: 'Journaliser la version et retester les tâches critiques après changement.',
        score: 65,
      },
      {
        id: 'acces',
        label: 'Accès',
        pouvoir: 'Disponibilité, quotas, prix et authentification.',
        gouvernance: 'Prévoir une solution de reprise et des artefacts lisibles hors plateforme.',
        score: 58,
      },
      {
        id: 'regles',
        label: 'Règles',
        pouvoir: 'Actions autorisées, catégories de contenu et formes de recours.',
        gouvernance:
          'Documenter les dépendances et séparer les normes du fournisseur de celles du projet.',
        score: 70,
      },
      {
        id: 'sortie',
        label: 'Sortie',
        pouvoir: 'Export, interopérabilité, effacement et migration.',
        gouvernance: 'Tester régulièrement la portabilité au lieu de la supposer.',
        score: 61,
      },
    ],
    deltas: {
      pH: 62,
      pIA: 74,
      pHIA: 80,
    },
    allocationMode: 'Hybride séquentiel',
    allocationCriteria: [
      {
        id: 'specifiabilite',
        label: 'Spécifiabilité',
        question: 'Le résultat attendu et les exclusions peuvent-ils être décrits avant la production ?',
        checked: false,
      },
      {
        id: 'verifiabilite',
        label: 'Vérifiabilité',
        question: 'Existe-t-il une preuve indépendante, un test ou une source primaire ?',
        checked: false,
      },
      {
        id: 'reversibilite',
        label: 'Réversibilité',
        question: 'L’action peut-elle être annulée sans dommage disproportionné ?',
        checked: false,
      },
      {
        id: 'gravite',
        label: 'Gravité',
        question: 'Quel est le coût maximal d’une erreur échappée, pas seulement son taux moyen ?',
        checked: false,
      },
      {
        id: 'avantage',
        label: 'Avantage relatif',
        question: 'Qui obtient effectivement la meilleure performance sur cette classe de tâches ?',
        checked: false,
      },
      {
        id: 'entretien',
        label: 'Entretien des capacités',
        question: 'La délégation compromet-elle la compétence nécessaire au contrôle futur ?',
        checked: false,
      },
    ],
    orchestrationRoles: defaultOrchestrationRoles.map((r) => ({ ...r })),
    beforeTask: { ...defaultBeforeTask },
    stopCriteria: {
      twoSeriousEscaped: false,
      unassistedBelow: false,
      notReconstructible: false,
    },
    theme: 'light',
  };
}
