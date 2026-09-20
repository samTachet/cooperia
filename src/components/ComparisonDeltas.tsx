import type { DeltaInputs } from '../types';
import { computeDeltas } from '../utils/metrics';
import { InfoTip } from './InfoTip';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  ReferenceLine,
  Cell,
} from 'recharts';

interface Props {
  deltas: DeltaInputs;
  onChange: (d: DeltaInputs) => void;
}

export function ComparisonDeltas({ deltas, onChange }: Props) {
  const { deltaAugmentation, deltaSynergie } = computeDeltas(deltas);
  const chart = [
    { name: 'P_H', value: deltas.pH },
    { name: 'P_IA', value: deltas.pIA },
    { name: 'P_H+IA', value: deltas.pHIA },
    { name: 'Δaug.', value: deltaAugmentation },
    { name: 'Δsyn.', value: deltaSynergie },
  ];

  return (
    <section className="panel" id="comparaison">
      <div className="panel-head">
        <h2>Comparaison : augmentation ≠ synergie</h2>
        <span className="section-tag">§1.2 · éq. 1–2</span>
      </div>
      <p className="muted">
        Un système peut aider une personne (augmentation) tout en restant inférieur au meilleur
        composant isolé (pas de synergie).
        <InfoTip text="Δaugmentation = P_H+IA − P_H ; Δsynergie = P_H+IA − max(P_H, P_IA). Ne pas confondre." />
      </p>
      <div className="form-grid three">
        <label>
          P<sub>H</sub> (humain seul)
          <input type="number" value={deltas.pH} onChange={(e) => onChange({ ...deltas, pH: +e.target.value })} />
        </label>
        <label>
          P<sub>IA</sub> (IA seule)
          <input type="number" value={deltas.pIA} onChange={(e) => onChange({ ...deltas, pIA: +e.target.value })} />
        </label>
        <label>
          P<sub>H+IA</sub> (hybride)
          <input type="number" value={deltas.pHIA} onChange={(e) => onChange({ ...deltas, pHIA: +e.target.value })} />
        </label>
      </div>
      <div className="delta-cards">
        <article className="delta-card">
          <h3>Δaugmentation</h3>
          <p className="formula">P<sub>H+IA</sub> − P<sub>H</sub></p>
          <p className={`delta-value ${deltaAugmentation >= 0 ? 'pos' : 'neg'}`}>
            {deltaAugmentation >= 0 ? '+' : ''}
            {deltaAugmentation.toFixed(1)}
          </p>
          <p className="muted">Gain par rapport à l’humain seul</p>
        </article>
        <article className="delta-card highlight">
          <h3>Δsynergie</h3>
          <p className="formula">P<sub>H+IA</sub> − max(P<sub>H</sub>, P<sub>IA</sub>)</p>
          <p className={`delta-value ${deltaSynergie >= 0 ? 'pos' : 'neg'}`}>
            {deltaSynergie >= 0 ? '+' : ''}
            {deltaSynergie.toFixed(1)}
          </p>
          <p className="muted">Gain par rapport au meilleur isolé — <strong>≠ augmentation</strong></p>
        </article>
      </div>
      <div className="chart-box">
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={chart}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <ReferenceLine y={0} stroke="var(--text-muted)" />
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              {chart.map((d) => (
                <Cell
                  key={d.name}
                  fill={
                    d.name === 'Δsyn.'
                      ? d.value >= 0
                        ? 'var(--ok)'
                        : 'var(--danger)'
                      : d.name === 'Δaug.'
                        ? 'var(--accent)'
                        : 'var(--chart-neutral)'
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
