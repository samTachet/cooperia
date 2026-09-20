import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { getQuestionnaire, SCORE_THRESHOLDS } from '../data/bottleneckQuestionnaires';
import { SCORING_RULE_HELP, scoreBottleneck } from '../utils/scoreBottleneck';
import type { Bottleneck, BottleneckStatus } from '../types';

const STATUSES: BottleneckStatus[] = ['fluide', 'sous tension', 'bloquant'];

interface Props {
  bottleneck: Bottleneck;
  open: boolean;
  onClose: () => void;
  onApply: (patch: Partial<Bottleneck>) => void;
}

export function BottleneckModal({ bottleneck, open, onClose, onApply }: Props) {
  const titleId = useId();
  const descId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  const questionnaire = getQuestionnaire(bottleneck.id);

  const [answers, setAnswers] = useState<Record<string, number>>(
    () => ({ ...(bottleneck.questionnaireAnswers ?? {}) })
  );
  const [overrideStatus, setOverrideStatus] = useState<BottleneckStatus | ''>('');
  const [noteSummary, setNoteSummary] = useState('');

  // Reset local state when opening another goulot / reopening
  useEffect(() => {
    if (!open) return;
    setAnswers({ ...(bottleneck.questionnaireAnswers ?? {}) });
    setOverrideStatus('');
    setNoteSummary('');
  }, [open, bottleneck.id, bottleneck.questionnaireAnswers]);

  const scored = useMemo(() => {
    if (!questionnaire) {
      return null;
    }
    return scoreBottleneck(questionnaire, answers);
  }, [questionnaire, answers]);

  const effectiveStatus: BottleneckStatus | null =
    overrideStatus || scored?.proposedStatus || null;

  // Focus trap + Esc + restore focus
  useEffect(() => {
    if (!open) return;
    previouslyFocused.current = document.activeElement as HTMLElement | null;
    const node = dialogRef.current;
    const focusable = () =>
      node
        ? Array.from(
            node.querySelectorAll<HTMLElement>(
              'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            )
          ).filter((el) => !el.hasAttribute('disabled') && el.tabIndex !== -1)
        : [];

    const first = focusable()[0];
    first?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== 'Tab' || !node) return;
      const list = focusable();
      if (list.length === 0) return;
      const firstEl = list[0];
      const lastEl = list[list.length - 1];
      if (e.shiftKey && document.activeElement === firstEl) {
        e.preventDefault();
        lastEl.focus();
      } else if (!e.shiftKey && document.activeElement === lastEl) {
        e.preventDefault();
        firstEl.focus();
      }
    };

    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
      previouslyFocused.current?.focus?.();
    };
  }, [open, onClose]);

  if (!open || !questionnaire) return null;

  const setAnswer = (qid: string, value: number) => {
    setAnswers((prev) => ({ ...prev, [qid]: value }));
  };

  const handleApply = () => {
    if (!scored?.proposedStatus || !effectiveStatus) return;
    const patch: Partial<Bottleneck> = {
      status: effectiveStatus,
      questionnaireAnswers: { ...answers },
      proposedStatus: scored.proposedStatus,
      diagnosedAt: new Date().toISOString(),
    };
    if (noteSummary.trim()) {
      patch.note = noteSummary.trim();
    }
    onApply(patch);
    onClose();
  };

  const meanLabel =
    scored?.mean == null ? '—' : scored.mean.toFixed(2);

  return (
    <div
      className="bn-modal-overlay"
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        className="bn-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descId}
      >
        <header className="bn-modal-head">
          <div>
            <p className="bn-modal-kicker">
              Diagnostic · goulot {bottleneck.id}
            </p>
            <h2 id={titleId}>{bottleneck.nom}</h2>
            <p id={descId} className="muted bn-modal-intro">
              {questionnaire.intro}
            </p>
          </div>
          <button type="button" className="btn btn-ghost" onClick={onClose} aria-label="Fermer">
            ✕
          </button>
        </header>

        <div className="bn-modal-rule" role="note">
          <strong>Règle de scoring</strong>
          <p>{SCORING_RULE_HELP}</p>
          <p className="bn-modal-thresholds">
            Seuils : fluide ≥ {SCORE_THRESHOLDS.fluide.toFixed(2)} · sous tension ≥{' '}
            {SCORE_THRESHOLDS.sousTension.toFixed(2)} · sinon bloquant.
          </p>
        </div>

        <div className="bn-modal-body">
          <ol className="bn-questionnaire">
            {questionnaire.questions.map((question, idx) => (
              <li key={question.id} className="bn-q">
                <p className="bn-q-prompt">
                  <span className="bn-q-num">{idx + 1}.</span> {question.prompt}
                </p>
                <div
                  className="bn-q-options"
                  role="radiogroup"
                  aria-label={question.prompt}
                >
                  {question.options.map((opt) => {
                    const selected = answers[question.id] === opt.value;
                    return (
                      <label
                        key={`${question.id}-${opt.value}`}
                        className={`bn-q-option ${selected ? 'selected' : ''}`}
                      >
                        <input
                          type="radio"
                          name={`bn-q-${bottleneck.id}-${question.id}`}
                          value={opt.value}
                          checked={selected}
                          onChange={() => setAnswer(question.id, opt.value)}
                        />
                        <span>{opt.label}</span>
                      </label>
                    );
                  })}
                </div>
              </li>
            ))}
          </ol>
        </div>

        <aside className="bn-modal-score" aria-live="polite">
          <div className="bn-score-row">
            <span>
              Score moyen : <strong>{meanLabel}</strong>
              {scored && scored.answered > 0 && (
                <span className="muted">
                  {' '}
                  ({scored.answered}/{scored.total})
                </span>
              )}
            </span>
            <span>
              Statut proposé :{' '}
              <strong className={statusClass(scored?.proposedStatus)}>
                {scored?.proposedStatus ?? '—'}
              </strong>
            </span>
          </div>
          <p className="bn-justification">{scored?.justification}</p>

          <label className="bn-override">
            Forcer le statut (optionnel)
            <select
              value={overrideStatus}
              onChange={(e) =>
                setOverrideStatus((e.target.value as BottleneckStatus | '') || '')
              }
              aria-label="Forcer le statut"
            >
              <option value="">Utiliser le statut proposé</option>
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>

          {overrideStatus && scored?.proposedStatus && overrideStatus !== scored.proposedStatus && (
            <p className="bn-override-hint">
              Override : <strong>{overrideStatus}</strong> (proposé : {scored.proposedStatus})
            </p>
          )}

          <label className="bn-note-summary">
            Note / résumé (optionnel)
            <input
              type="text"
              value={noteSummary}
              placeholder="Résumé court du diagnostic…"
              onChange={(e) => setNoteSummary(e.target.value)}
            />
          </label>
        </aside>

        <footer className="bn-modal-foot">
          <button type="button" className="btn" onClick={onClose}>
            Annuler
          </button>
          <button
            type="button"
            className="btn btn-primary"
            disabled={!effectiveStatus || !scored || scored.answered === 0}
            onClick={handleApply}
          >
            Appliquer le diagnostic
          </button>
        </footer>
      </div>
    </div>
  );
}

function statusClass(status: BottleneckStatus | null | undefined): string {
  if (!status) return '';
  if (status === 'fluide') return 'status-fluide-text';
  if (status === 'sous tension') return 'status-sous-tension-text';
  return 'status-bloquant-text';
}
