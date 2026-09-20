import type { EfficiencyInputs, Guardrails } from '../types';
import { efficiencyRatio, guardrailBreaches } from '../utils/metrics';
import { InfoTip } from './InfoTip';

interface Props {
  efficiency: EfficiencyInputs;
  guardrails: Guardrails;
  onEfficiency: (e: EfficiencyInputs) => void;
  onGuardrails: (g: Guardrails) => void;
}

export function EfficiencyPanel({ efficiency, guardrails, onEfficiency, onGuardrails }: Props) {
  const ratio = efficiencyRatio(efficiency);
  const breaches = guardrailBreaches(efficiency, guardrails);
  const anyBreach = breaches.rErreur || breaches.kH || breaches.portabilite;

  return (
    <section className="panel" id="efficience">
      <div className="panel-head">
        <h2>Objectif d’efficience</h2>
        <span className="section-tag">éq. 9 · §6.3</span>
      </div>
      <p className="muted">
        Maximiser U<sub>validée</sub> / Attention<sub>humaine</sub>, sous garde-fous de risque, compétence et
        souveraineté.
        <InfoTip text="Équation 9 : objectif d’efficience soumis à R_erreur ≤ r₀, K_H ≥ k₀ et Portabilité ≥ p₀. Définition opérationnelle, non loi validée." />
      </p>

      <div className={`efficiency-readout ${anyBreach ? 'breach' : ''}`}>
        <div className="big-metric">
          <span className="label">U<sub>validée</sub> / Attention<sub>humaine</sub></span>
          <span className="value">{ratio.toFixed(3)}</span>
          <span className="unit">utilité / min</span>
        </div>
        {anyBreach && (
          <p className="breach-msg">Au moins un garde-fou est violé — l’efficience ne doit pas primer seule.</p>
        )}
      </div>

      <div className="form-grid three">
        <label>
          U<sub>validée</sub>
          <input
            type="number"
            value={efficiency.uValidee}
            onChange={(e) => onEfficiency({ ...efficiency, uValidee: +e.target.value })}
          />
        </label>
        <label>
          Attention<sub>humaine</sub> (min)
          <input
            type="number"
            value={efficiency.attentionHumaine}
            onChange={(e) => onEfficiency({ ...efficiency, attentionHumaine: +e.target.value })}
          />
        </label>
      </div>

      <h3>Garde-fous</h3>
      <div className="guardrail-grid">
        <div className={`guard-card ${breaches.rErreur ? 'breach' : 'ok'}`}>
          <header>
            R<sub>erreur</sub> ≤ r₀
            {breaches.rErreur ? <span className="badge badge-breach">Violation</span> : <span className="badge badge-ok">OK</span>}
          </header>
          <div className="form-grid two">
            <label>
              R<sub>erreur</sub>
              <input
                type="number"
                step={0.1}
                value={efficiency.rErreur}
                onChange={(e) => onEfficiency({ ...efficiency, rErreur: +e.target.value })}
              />
            </label>
            <label>
              r₀
              <input
                type="number"
                step={0.1}
                value={guardrails.r0}
                onChange={(e) => onGuardrails({ ...guardrails, r0: +e.target.value })}
              />
            </label>
          </div>
        </div>
        <div className={`guard-card ${breaches.kH ? 'breach' : 'ok'}`}>
          <header>
            K<sub>H</sub> ≥ k₀
            {breaches.kH ? <span className="badge badge-breach">Violation</span> : <span className="badge badge-ok">OK</span>}
          </header>
          <div className="form-grid two">
            <label>
              K<sub>H</sub>
              <input
                type="number"
                value={efficiency.kH}
                onChange={(e) => onEfficiency({ ...efficiency, kH: +e.target.value })}
              />
            </label>
            <label>
              k₀
              <input
                type="number"
                value={guardrails.k0}
                onChange={(e) => onGuardrails({ ...guardrails, k0: +e.target.value })}
              />
            </label>
          </div>
        </div>
        <div className={`guard-card ${breaches.portabilite ? 'breach' : 'ok'}`}>
          <header>
            Portabilité ≥ p₀
            {breaches.portabilite ? <span className="badge badge-breach">Violation</span> : <span className="badge badge-ok">OK</span>}
          </header>
          <div className="form-grid two">
            <label>
              Portabilité
              <input
                type="number"
                value={efficiency.portabilite}
                onChange={(e) => onEfficiency({ ...efficiency, portabilite: +e.target.value })}
              />
            </label>
            <label>
              p₀
              <input
                type="number"
                value={guardrails.p0}
                onChange={(e) => onGuardrails({ ...guardrails, p0: +e.target.value })}
              />
            </label>
          </div>
        </div>
      </div>
    </section>
  );
}
