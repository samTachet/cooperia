import {
  SCORE_THRESHOLDS,
  statusFromMean,
  type BottleneckQuestionnaire,
  type QuestionnaireQuestion,
} from '../data/bottleneckQuestionnaires';
import type { BottleneckStatus } from '../types';

/** Seuil sous lequel une réponse compte comme « signal de tension » */
export const TENSION_SIGNAL_THRESHOLD = 0.5;

export interface ScoreResult {
  /** Moyenne des réponses sur 0–1 ; null si aucune réponse */
  mean: number | null;
  answered: number;
  total: number;
  proposedStatus: BottleneckStatus | null;
  /** Questions avec score < 0.5 (signaux de tension / blocage) */
  tensionSignals: { id: string; label: string; score: number }[];
  /** Justification courte pour l’UI */
  justification: string;
}

export function scoreBottleneck(
  questionnaire: BottleneckQuestionnaire,
  answers: Record<string, number>
): ScoreResult {
  const values: { q: QuestionnaireQuestion; score: number }[] = [];
  for (const question of questionnaire.questions) {
    const raw = answers[question.id];
    if (typeof raw === 'number' && Number.isFinite(raw)) {
      values.push({ q: question, score: clamp01(raw) });
    }
  }

  const answered = values.length;
  const total = questionnaire.questions.length;

  if (answered === 0) {
    return {
      mean: null,
      answered: 0,
      total,
      proposedStatus: null,
      tensionSignals: [],
      justification: 'Répondez à au moins une question pour obtenir un diagnostic.',
    };
  }

  const mean = values.reduce((s, v) => s + v.score, 0) / answered;
  const proposedStatus = statusFromMean(mean);
  const tensionSignals = values
    .filter((v) => v.score < TENSION_SIGNAL_THRESHOLD)
    .sort((a, b) => a.score - b.score)
    .map((v) => ({ id: v.q.id, label: v.q.signalLabel, score: v.score }));

  const justification = buildJustification(mean, proposedStatus, tensionSignals, answered, total);

  return { mean, answered, total, proposedStatus, tensionSignals, justification };
}

function clamp01(n: number): number {
  return Math.min(1, Math.max(0, n));
}

function buildJustification(
  mean: number,
  status: BottleneckStatus,
  signals: { label: string }[],
  answered: number,
  total: number
): string {
  const meanPct = Math.round(mean * 100);
  const coverage =
    answered < total ? ` (${answered}/${total} réponses)` : ` (${answered} réponses)`;

  if (signals.length === 0) {
    return `Moyenne ${(meanPct / 100).toFixed(2)} → ${status}${coverage}. Aucun signal de tension fort.`;
  }

  const n = signals.length;
  const list = signals
    .slice(0, 4)
    .map((s) => s.label)
    .join(', ');
  const more = signals.length > 4 ? '…' : '';
  const noun = n === 1 ? 'signal de tension' : 'signaux de tension';
  return `Moyenne ${(meanPct / 100).toFixed(2)} → ${status}${coverage}. ${n} ${noun} : ${list}${more}.`;
}

/** Texte d’aide affiché dans le modal (règle transparente) */
export const SCORING_RULE_HELP =
  `Règle : moyenne des réponses sur une échelle 0–1. ` +
  `fluide ≥ ${SCORE_THRESHOLDS.fluide.toFixed(2)} · ` +
  `sous tension ≥ ${SCORE_THRESHOLDS.sousTension.toFixed(2)} · ` +
  `sinon bloquant. Likert 1–4 → 0 / ⅓ / ⅔ / 1 ; Oui / Partiel / Non → 1 / 0,5 / 0.`;
