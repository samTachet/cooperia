import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import type { ControlLevel } from '../types';

interface Props {
  levels: ControlLevel[];
  onChange: (l: ControlLevel[]) => void;
}

export function ControlsHierarchy({ levels, onChange }: Props) {
  const chartData = levels.map((l) => ({
    name: `${l.niveau}. ${l.label}`,
    count: l.count,
  }));

  return (
    <section className="panel" id="controles">
      <div className="panel-head">
        <h2>Hiérarchie de contrôles</h2>
        <span className="section-tag">§6.4</span>
      </div>
      <p className="muted">
        Niveaux 0–4 : adapter le contrôle à la gravité et à la détectabilité de l’erreur. Compteurs
        éditables (échantillon CCL).
      </p>
      <div className="control-list">
        {levels.map((l, i) => (
          <article key={l.niveau} className={`control-row niveau-${l.niveau}`}>
            <div className="control-level">N{l.niveau}</div>
            <div className="control-body">
              <h3>{l.label}</h3>
              <p>{l.moyens}</p>
              <p className="muted">Risque : {l.risque}</p>
            </div>
            <label className="control-count">
              Comptes
              <input
                type="number"
                min={0}
                value={l.count}
                onChange={(e) => {
                  const next = [...levels];
                  next[i] = { ...l, count: +e.target.value };
                  onChange(next);
                }}
              />
            </label>
          </article>
        ))}
      </div>
      <div className="chart-box">
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={0} angle={-15} textAnchor="end" height={60} />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="count" name="Occurrences" fill="var(--accent)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
