import { useMemo, useState } from 'react';
import type { Episode, Strate, Condition } from '../types';
import { downloadText, episodesToCSV } from '../utils/export';

interface Props {
  episodes: Episode[];
  onChange: (e: Episode[]) => void;
}

export function EpisodesTable({ episodes, onChange }: Props) {
  const [strateFilter, setStrateFilter] = useState<Strate | 'toutes'>('toutes');
  const [condFilter, setCondFilter] = useState<Condition | 'toutes'>('toutes');

  const filtered = useMemo(
    () =>
      episodes.filter(
        (e) =>
          (strateFilter === 'toutes' || e.strate === strateFilter) &&
          (condFilter === 'toutes' || e.condition === condFilter)
      ),
    [episodes, strateFilter, condFilter]
  );

  const updateScore = (id: string, key: keyof Episode['scores'], value: number) => {
    onChange(
      episodes.map((e) =>
        e.id === id ? { ...e, scores: { ...e.scores, [key]: value } } : e
      )
    );
  };

  return (
    <section className="panel" id="episodes">
      <div className="panel-head">
        <h2>Épisodes pilote CCL</h2>
        <span className="section-tag">§10.2 · §9.3</span>
        <span className="badge badge-sample">Données d’exemple</span>
      </div>
      <p className="muted">
        Vingt-quatre épisodes stratifiés (théorie / code / documentation / revue). Conditions : A
        pratique actuelle · B mémoire canonique · C contrat de transmission · D mémoire +
        transmission + audit.
      </p>
      <div className="toolbar">
        <label>
          Strate
          <select
            value={strateFilter}
            onChange={(e) => setStrateFilter(e.target.value as Strate | 'toutes')}
          >
            <option value="toutes">Toutes</option>
            <option value="théorie">Théorie</option>
            <option value="code">Code</option>
            <option value="documentation">Documentation</option>
            <option value="revue">Revue</option>
          </select>
        </label>
        <label>
          Condition
          <select
            value={condFilter}
            onChange={(e) => setCondFilter(e.target.value as Condition | 'toutes')}
          >
            <option value="toutes">Toutes</option>
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="C">C</option>
            <option value="D">D</option>
          </select>
        </label>
        <button
          type="button"
          className="btn"
          onClick={() =>
            downloadText('episodes-ccl.csv', episodesToCSV(episodes), 'text/csv;charset=utf-8')
          }
        >
          Export CSV
        </button>
        <button
          type="button"
          className="btn"
          onClick={() =>
            downloadText(
              'episodes-ccl.json',
              JSON.stringify(episodes, null, 2),
              'application/json'
            )
          }
        >
          Export JSON
        </button>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Tâche</th>
              <th>Strate</th>
              <th>Diff.</th>
              <th>Cond.</th>
              <th>Durée</th>
              <th>Critère de validation</th>
              <th>Q.ext</th>
              <th>Att.</th>
              <th>Err.</th>
              <th>Repr.</th>
              <th>Cal.</th>
              <th>R.dés.</th>
              <th>K_H</th>
              <th>Port.</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((e) => (
              <tr key={e.id}>
                <td>{e.id}</td>
                <td className="task-cell">{e.tache}</td>
                <td>
                  <span className={`chip strate-${e.strate}`}>{e.strate}</span>
                </td>
                <td>{e.difficulte}</td>
                <td>
                  <span className="chip">{e.condition}</span>
                </td>
                <td>{e.dureeMin}</td>
                <td className="critere-cell">{e.critereValidation}</td>
                {(
                  [
                    'qualiteExterne',
                    'attentionHumaine',
                    'erreursEchappees',
                    'coutReprise',
                    'calibration',
                    'rendementDesaccord',
                    'competenceHumaine',
                    'portabilite',
                  ] as const
                ).map((k) => (
                  <td key={k}>
                    <input
                      className="cell-input"
                      type="number"
                      step={k === 'rendementDesaccord' || k === 'erreursEchappees' ? 0.05 : 1}
                      value={e.scores[k]}
                      onChange={(ev) => updateScore(e.id, k, +ev.target.value)}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
