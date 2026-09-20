import { useState } from 'react';
import type { Bottleneck, BottleneckStatus } from '../types';
import { InfoTip } from './InfoTip';
import { BottleneckModal } from './BottleneckModal';

const STATUSES: BottleneckStatus[] = ['fluide', 'sous tension', 'bloquant'];

const STATUS_CLASS: Record<BottleneckStatus, string> = {
  fluide: 'status-fluide',
  'sous tension': 'status-sous-tension',
  bloquant: 'status-bloquant',
};

interface Props {
  bottlenecks: Bottleneck[];
  bindingId: number | null;
  /** Projet nom+but renseignés → section mise en avant */
  ready?: boolean;
  onChange: (b: Bottleneck[]) => void;
  onBinding: (id: number | null) => void;
}

export function BottlenecksGrid({
  bottlenecks,
  bindingId,
  ready = true,
  onChange,
  onBinding,
}: Props) {
  const [analyzingId, setAnalyzingId] = useState<number | null>(null);

  const patch = (id: number, partial: Partial<Bottleneck>) => {
    onChange(bottlenecks.map((b) => (b.id === id ? { ...b, ...partial } : b)));
  };

  const tense = bottlenecks.filter((b) => b.status !== 'fluide').length;
  const blocking = bottlenecks.filter((b) => b.status === 'bloquant').length;
  const binding = bottlenecks.find((b) => b.id === bindingId);
  const analyzing = bottlenecks.find((b) => b.id === analyzingId) ?? null;

  return (
    <section
      className={`panel ${ready ? 'section-ready' : 'section-locked'}`}
      id="goulots"
    >
      <div className="panel-head">
        <h2>Suivi des 14 goulots</h2>
        <span className="section-tag">§2 · §2.1</span>
        {!ready && (
          <span className="badge badge-sample">En attente du brief projet</span>
        )}
        {ready && <span className="badge badge-ok">Projet cadré</span>}
      </div>
      <p className="muted">
        Diagnostic type Goldratt : améliorer un composant non contraignant n’améliore pas
        nécessairement le flux global. Statut = fluide / sous tension / bloquant. Utilisez{' '}
        <strong>Analyser</strong> pour un questionnaire opérationnel par goulot (scoring →
        statut). Marquez le <strong>goulot actif / contraignant</strong> (binding). Mécanisme
        et conséquence du document apparaissent en info-bulle (?).
        {!ready && (
          <>
            {' '}
            <em>
              Renseignez le nom et le but du projet ci-dessus pour débloquer pleinement cette
              étape.
            </em>
          </>
        )}
      </p>
      <div className="bn-summary">
        <span>
          Sous tension / bloquant : <strong>{tense}</strong>
        </span>
        <span>
          Bloquants : <strong>{blocking}</strong>
        </span>
        <span>
          Contraignant :{' '}
          <strong>{binding ? `${binding.id}. ${binding.nom}` : 'non défini'}</strong>
        </span>
      </div>
      <div className="bottleneck-grid">
        {bottlenecks.map((b) => {
          const diagnosed =
            b.questionnaireAnswers != null &&
            Object.keys(b.questionnaireAnswers).length > 0;
          return (
            <article
              key={b.id}
              className={`bn-card ${STATUS_CLASS[b.status]} ${bindingId === b.id ? 'binding' : ''}`}
            >
              <header>
                <span className="bn-id">{b.id}</span>
                <h3>{b.nom}</h3>
                <InfoTip text={`Mécanisme : ${b.mecanisme} Conséquence : ${b.consequence}`} />
                {bindingId === b.id && <span className="badge badge-breach">Contraignant</span>}
                {diagnosed && (
                  <span className="badge badge-diagnosed" title="Questionnaire appliqué">
                    diagnostiqué
                  </span>
                )}
              </header>
              <div className="bn-actions">
                <select
                  value={b.status}
                  onChange={(e) => patch(b.id, { status: e.target.value as BottleneckStatus })}
                  aria-label={`Statut ${b.nom}`}
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  className="btn btn-sm btn-accent"
                  onClick={() => setAnalyzingId(b.id)}
                >
                  Analyser
                </button>
                <button
                  type="button"
                  className="btn btn-sm"
                  onClick={() => onBinding(bindingId === b.id ? null : b.id)}
                >
                  {bindingId === b.id ? 'Retirer binding' : 'Marquer binding'}
                </button>
              </div>
              <label className="bn-note">
                Note
                <input
                  type="text"
                  value={b.note}
                  placeholder="Observation optionnelle…"
                  onChange={(e) => patch(b.id, { note: e.target.value })}
                />
              </label>
            </article>
          );
        })}
      </div>

      {analyzing && (
        <BottleneckModal
          bottleneck={analyzing}
          open={analyzingId !== null}
          onClose={() => setAnalyzingId(null)}
          onApply={(partial) => {
            patch(analyzing.id, partial);
          }}
        />
      )}
    </section>
  );
}
