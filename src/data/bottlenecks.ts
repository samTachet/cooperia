import type { Bottleneck } from '../types';

/** 14 goulots d'étranglement — §2 (defaults neutres pour un nouveau projet) */
export const defaultBottlenecks: Bottleneck[] = [
  {
    id: 1,
    nom: 'Intention',
    mecanisme: 'Le but, les exclusions et les préférences restent partiellement tacites.',
    consequence: 'Optimisation d’une représentation imparfaite.',
    status: 'fluide',
    note: '',
  },
  {
    id: 2,
    nom: 'Grounding',
    mecanisme:
      'Les partenaires ne disposent pas du même référentiel ni des mêmes critères d’acceptation.',
    consequence: 'Réparations, malentendus et faux accords.',
    status: 'fluide',
    note: '',
  },
  {
    id: 3,
    nom: 'Mémoire',
    mecanisme: 'Décisions, hypothèses et versions ne sont pas séparées ni retrouvées au bon moment.',
    consequence: 'Répétitions, contradictions et dérive.',
    status: 'fluide',
    note: '',
  },
  {
    id: 4,
    nom: 'Modèle mutuel',
    mecanisme:
      'L’humain estime mal les capacités de l’IA ; l’IA infère imparfaitement les attentes humaines.',
    consequence: 'Allocation et niveau d’autonomie mal calibrés.',
    status: 'fluide',
    note: '',
  },
  {
    id: 5,
    nom: 'Vérification',
    mecanisme: 'La génération devient moins coûteuse que l’établissement de la validité.',
    consequence: 'Dette de contrôle et erreurs plausibles.',
    status: 'fluide',
    note: '',
  },
  {
    id: 6,
    nom: 'Confiance',
    mecanisme:
      'La confiance est globale alors que la fiabilité est locale à une tâche, une version et un contrôle.',
    consequence: 'Sous-usage ou délégation excessive.',
    status: 'fluide',
    note: '',
  },
  {
    id: 7,
    nom: 'Compétence',
    mecanisme:
      'La délégation supprime la pratique nécessaire à la supervision et à la reprise en main.',
    consequence: 'Déqualification, perte de situation et contrôle rituel.',
    status: 'fluide',
    note: '',
  },
  {
    id: 8,
    nom: 'Multi-IA',
    mecanisme: 'Les modèles ne partagent ni état ni autorité de manière native.',
    consequence: 'L’humain devient routeur et traducteur.',
    status: 'fluide',
    note: '',
  },
  {
    id: 9,
    nom: 'Outils',
    mecanisme: 'Code, fichiers, navigateur, messages et preuves restent fragmentés.',
    consequence: 'Transferts, pertes de trace et coûts de reprise.',
    status: 'fluide',
    note: '',
  },
  {
    id: 10,
    nom: 'Allocation',
    mecanisme:
      'Les tâches ne sont pas distribuées selon la performance relative, le risque et la vérifiabilité.',
    consequence: 'Le composant le moins adapté décide ou contrôle.',
    status: 'fluide',
    note: '',
  },
  {
    id: 11,
    nom: 'Bande passante',
    mecanisme: 'Lire, comparer, décider et arbitrer demeurent coûteux.',
    consequence: 'La production excède la capacité d’absorption.',
    status: 'fluide',
    note: '',
  },
  {
    id: 12,
    nom: 'Responsabilité',
    mecanisme: 'L’IA peut proposer sans supporter directement les conséquences.',
    consequence: 'Décalage entre capacité d’action et imputabilité.',
    status: 'fluide',
    note: '',
  },
  {
    id: 13,
    nom: 'Continuité et pouvoir',
    mecanisme: 'Le fournisseur contrôle mémoire, versions, accès, prix, règles et export.',
    consequence: 'Dépréciation ou captation de l’actif de coordination.',
    status: 'fluide',
    note: '',
  },
  {
    id: 14,
    nom: 'Valeurs',
    mecanisme:
      'Les préférences complexes et les conflits normatifs ne sont jamais entièrement spécifiés.',
    consequence: 'Optimisation locale divergente de la finalité.',
    status: 'fluide',
    note: '',
  },
];
