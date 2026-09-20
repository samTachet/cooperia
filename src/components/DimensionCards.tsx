import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
} from 'recharts';
import { DIMENSION_META } from '../data/defaults';
import type { DashboardState, DimensionScores } from '../types';
import { statusVsThreshold } from '../utils/metrics';
import { InfoTip } from './InfoTip';

interface Props {
  dimensions: DimensionScores;
  thresholds: DashboardState['dimensionThresholds'];
  onChange: (d: DimensionScores) => void;
}

const KEYS = Object.keys(DIMENSION_META) as (keyof DimensionScores)[];

export function DimensionCards({ dimensions, thresholds, onChange }: Props) {
  const chartData = KEYS.map((k) => {
    const meta = DIMENSION_META[k];
    let display = dimensions[k];
    if (k === 'rendementDesaccord') display = dimensions[k] * 100;
    return {
      key: k,
      label: meta.label,
      value: display,
      higherIsBetter: meta.higherIsBetter,
    };
  });

  return (
    <section className="panel" id="dimensions">
      <div className="panel-head">
        <h2>Huit dimensions</h2>
        <span className="section-tag">§6.3</span>
      </div>
      <p className="muted">
        Tableau de bord multidimensionnel — ne pas réduire à un score unique (Goodhart / §6.1).
        Valeurs éditables (échantillon CCL).
      </p>
      <div className="dim-grid">
        {KEYS.map((k) => {
          const meta = DIMENSION_META[k];
          const val = dimensions[k];
          const st = statusVsThreshold(val, meta.higherIsBetter, thresholds[k]);
          return (
            <article key={k} className={`kpi-card status-${st}`}>
              <header>
                <h3>{meta.label}</h3>
                <InfoTip text={meta.definition} />
              </header>
              <div className="kpi-value">
                <input
                  type="number"
                  step={k === 'rendementDesaccord' || k === 'erreursEchappees' ? 0.05 : 1}
                  value={val}
                  onChange={(e) =>
                    onChange({ ...dimensions, [k]: parseFloat(e.target.value) || 0 })
                  }
                />
                <span className="unit">{meta.unit}</span>
              </div>
              <footer>
                <span className={`status-dot ${st}`} />
                {st === 'breach' ? 'Seuil franchi' : st === 'warn' ? 'Proche seuil' : 'Dans les seuils'}
                <span className="section-tag tiny">{meta.section}</span>
              </footer>
            </article>
          );
        })}
      </div>
      <div className="chart-box">
        <h3>Vue comparative (échelle affichée)</h3>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 48 }}>
            <XAxis dataKey="label" angle={-25} textAnchor="end" interval={0} tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <Bar dataKey="value" name="Valeur" radius={[4, 4, 0, 0]}>
              {chartData.map((d) => (
                <Cell
                  key={d.key}
                  fill={
                    statusVsThreshold(
                      dimensions[d.key as keyof DimensionScores],
                      DIMENSION_META[d.key as keyof DimensionScores].higherIsBetter,
                      thresholds[d.key as keyof DimensionScores]
                    ) === 'breach'
                      ? 'var(--danger)'
                      : 'var(--accent)'
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
