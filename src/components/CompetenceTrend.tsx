import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';
import type { CompetencePoint } from '../types';

interface Props {
  trend: CompetencePoint[];
  k0: number;
  onChange: (t: CompetencePoint[]) => void;
}

export function CompetenceTrend({ trend, k0, onChange }: Props) {
  const last = trend[trend.length - 1];
  const below = last && last.score < k0;

  return (
    <section className="panel" id="competence">
      <div className="panel-head">
        <h2>Compétence & ironies de l’automatisation</h2>
        <span className="section-tag">§3 · §6.3 · Bainbridge</span>
      </div>
      <p className="muted">
        Tendance des sondes périodiques sans assistance. La compétence de contrôle dépend de la
        pratique que l’automatisation peut supprimer.
      </p>
      {below && (
        <p className="breach-msg">Dernière sonde sous k₀ ({k0}) — surveiller critère d’arrêt.</p>
      )}
      <div className="chart-box">
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={trend}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="date" tick={{ fontSize: 11 }} />
            <YAxis domain={[50, 100]} tick={{ fontSize: 11 }} />
            <Tooltip />
            <ReferenceLine y={k0} stroke="var(--danger)" strokeDasharray="4 4" label="k₀" />
            <Line
              type="monotone"
              dataKey="score"
              name="Score sans IA"
              stroke="var(--accent)"
              strokeWidth={2}
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="table-wrap compact">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Tâche</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>
            {trend.map((p, i) => (
              <tr key={p.date + i}>
                <td>{p.date}</td>
                <td>{p.tache}</td>
                <td>
                  <input
                    className="cell-input"
                    type="number"
                    value={p.score}
                    onChange={(e) => {
                      const next = [...trend];
                      next[i] = { ...p, score: +e.target.value };
                      onChange(next);
                    }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
