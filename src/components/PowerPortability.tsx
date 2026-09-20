import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import type { PowerLever } from '../types';
import { InfoTip } from './InfoTip';

interface Props {
  levers: PowerLever[];
  onChange: (l: PowerLever[]) => void;
}

export function PowerPortability({ levers, onChange }: Props) {
  const radar = levers.map((l) => ({ subject: l.label, score: l.score, fullMark: 100 }));
  const mean = levers.reduce((a, l) => a + l.score, 0) / levers.length;

  return (
    <section className="panel" id="pouvoir">
      <div className="panel-head">
        <h2>Pouvoir / portabilité</h2>
        <span className="section-tag">§7.3 · éq. 10</span>
      </div>
      <p className="muted">
        Leviers du fournisseur : mémoire, version, accès, règles, sortie. Actif<sub>net</sub> =
        Actif<sub>accumulé</sub> − Exposition<sub>verrouillage</sub> − Perte<sub>attendue</sub> de
        continuité.
        <InfoTip text="La relation n’est pas dyadique : le fournisseur contrôle la continuité. Tester la portabilité au lieu de la supposer." />
      </p>
      <div className="power-layout">
        <div className="chart-box">
          <ResponsiveContainer width="100%" height={280}>
            <RadarChart data={radar}>
              <PolarGrid stroke="var(--border)" />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12 }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10 }} />
              <Radar
                name="Maturité gouvernance"
                dataKey="score"
                stroke="var(--accent)"
                fill="var(--accent)"
                fillOpacity={0.35}
              />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
          <p className="muted center">Maturité moyenne : {mean.toFixed(0)} / 100</p>
        </div>
        <div className="lever-list">
          {levers.map((l, i) => (
            <article key={l.id} className="lever-card">
              <h3>{l.label}</h3>
              <p>
                <strong>Pouvoir :</strong> {l.pouvoir}
              </p>
              <p>
                <strong>Gouvernance :</strong> {l.gouvernance}
              </p>
              <label>
                Score gouvernance
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={l.score}
                  onChange={(e) => {
                    const next = [...levers];
                    next[i] = { ...l, score: +e.target.value };
                    onChange(next);
                  }}
                />
                <span>{l.score}</span>
              </label>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
