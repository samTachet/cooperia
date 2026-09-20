import type { CompositeSInputs } from '../types';
import { compositeS } from '../utils/metrics';
import { InfoTip } from './InfoTip';

interface Props {
  inputs: CompositeSInputs;
  onChange: (s: CompositeSInputs) => void;
}

export function CompositeSPanel({ inputs, onChange }: Props) {
  const s = compositeS(inputs);
  return (
    <section className="panel warn-panel" id="composite-s">
      <div className="panel-head">
        <h2>Indicateur composite S (secondaire)</h2>
        <span className="section-tag">éq. 8 · §6.2</span>
      </div>
      <div className="goodhart-warn" role="alert">
        <strong>Avertissement Goodhart (§6.1) :</strong> S reste exposé au gaming et{' '}
        <em>ne doit pas devenir l’unique objectif</em>. Préférer le tableau de bord multidimensionnel
        (§6.3). Les équations sont des définitions opérationnelles, non des lois validées.
        <InfoTip text="S = (U_validée + β·D_utile) / (C_coord + C_vérif + C_reprise + λ·L_échappée)" />
      </div>
      <div className="efficiency-readout secondary">
        <div className="big-metric">
          <span className="label">S</span>
          <span className="value">{s.toFixed(3)}</span>
        </div>
      </div>
      <div className="form-grid four">
        {(
          [
            ['uValidee', 'U_validée'],
            ['dUtile', 'D_utile'],
            ['cCoord', 'C_coord'],
            ['cVerif', 'C_vérif'],
            ['cReprise', 'C_reprise'],
            ['lEchappee', 'L_échappée'],
            ['beta', 'β'],
            ['lambda', 'λ'],
          ] as const
        ).map(([key, label]) => (
          <label key={key}>
            {label}
            <input
              type="number"
              step={0.1}
              value={inputs[key]}
              onChange={(e) => onChange({ ...inputs, [key]: +e.target.value })}
            />
          </label>
        ))}
      </div>
    </section>
  );
}
