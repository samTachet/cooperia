import type { DashboardState } from '../types';

interface Props {
  stop: DashboardState['stopCriteria'];
  onChange: (stop: DashboardState['stopCriteria']) => void;
}

export function StopCriteriaBanner({ stop, onChange }: Props) {
  const triggered = stop.twoSeriousEscaped || stop.unassistedBelow || stop.notReconstructible;
  return (
    <section className={`banner stop-banner ${triggered ? 'breach' : ''}`} id="criteres-arret">
      <div className="banner-head">
        <h2>Critères d’arrêt</h2>
        <span className="section-tag">§10.2</span>
        {triggered ? (
          <span className="badge badge-breach">Suspension recommandée</span>
        ) : (
          <span className="badge badge-ok">Aucun critère déclenché</span>
        )}
      </div>
      <p className="muted">
        Suspendre une automatisation si l’un de ces critères est rempli (pilote CCL).
      </p>
      <div className="stop-grid">
        <label className={stop.twoSeriousEscaped ? 'stop-item breach' : 'stop-item'}>
          <input
            type="checkbox"
            checked={stop.twoSeriousEscaped}
            onChange={(e) => onChange({ ...stop, twoSeriousEscaped: e.target.checked })}
          />
          <span>
            Deux audits successifs révèlent une <strong>erreur grave échappée</strong>
          </span>
        </label>
        <label className={stop.unassistedBelow ? 'stop-item breach' : 'stop-item'}>
          <input
            type="checkbox"
            checked={stop.unassistedBelow}
            onChange={(e) => onChange({ ...stop, unassistedBelow: e.target.checked })}
          />
          <span>
            Performance humaine <strong>sans assistance</strong> sous le seuil fixé
          </span>
        </label>
        <label className={stop.notReconstructible ? 'stop-item breach' : 'stop-item'}>
          <input
            type="checkbox"
            checked={stop.notReconstructible}
            onChange={(e) => onChange({ ...stop, notReconstructible: e.target.checked })}
          />
          <span>
            État du projet <strong>non reconstructible</strong> hors du fournisseur principal
          </span>
        </label>
      </div>
    </section>
  );
}
