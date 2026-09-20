import type {
  AllocationCriteria,
  AllocationMode,
  BeforeTaskAnswers,
  OrchestrationRole,
} from '../types';

const MODES: { mode: AllocationMode; conditions: string; gouvernance: string }[] = [
  {
    mode: 'IA dominante',
    conditions: 'IA meilleure ; sortie testable ; erreur réversible ; jugement normatif faible.',
    gouvernance: 'Automatisation avec contrôle échantillonné et seuil d’escalade.',
  },
  {
    mode: 'Humain dominant',
    conditions: 'Humain meilleur ; finalité contestable ; conséquences fortes ; preuve incomplète.',
    gouvernance: 'IA consultative, décision motivée par l’humain.',
  },
  {
    mode: 'Hybride séquentiel',
    conditions: 'Sous-tâches séparables ; avantages relatifs différents ; transmission vérifiable.',
    gouvernance: 'Responsable et contrôleur distincts, contrat de passage.',
  },
  {
    mode: 'Double contrôle',
    conditions: 'Erreur rare mais grave ; vérification indépendante possible.',
    gouvernance: 'Deux voies de preuve, arbitrage en cas de divergence.',
  },
  {
    mode: 'Expérimental',
    conditions: 'Aucun avantage relatif établi ; interaction nouvelle.',
    gouvernance: 'Comparer H, IA et H+IA avant généralisation.',
  },
];

const BEFORE_TASK_FIELDS: {
  key: keyof BeforeTaskAnswers;
  label: string;
  placeholder: string;
}[] = [
  {
    key: 'resultat',
    label: 'Résultat',
    placeholder: 'Quel livrable concret et quelles exclusions ?',
  },
  {
    key: 'benchmark',
    label: 'Benchmark',
    placeholder: 'Contre quoi comparer (humain seul, autre outil, version) ?',
  },
  {
    key: 'risque',
    label: 'Risque',
    placeholder: 'Erreur maximale crédible et réversibilité ?',
  },
  {
    key: 'preuve',
    label: 'Preuve',
    placeholder: 'Quelle preuve indépendante avant validation ?',
  },
  {
    key: 'allocation',
    label: 'Allocation',
    placeholder: 'Qui produit, qui contrôle, qui arbitre ?',
  },
  {
    key: 'competence',
    label: 'Compétence',
    placeholder: 'Quelle pratique humaine faut-il préserver ?',
  },
];

interface Props {
  mode: AllocationMode;
  criteria: AllocationCriteria[];
  roles: OrchestrationRole[];
  beforeTask: BeforeTaskAnswers;
  onMode: (m: AllocationMode) => void;
  onCriteria: (c: AllocationCriteria[]) => void;
  onRoles: (r: OrchestrationRole[]) => void;
  onBeforeTask: (b: BeforeTaskAnswers) => void;
}

export function AllocationPanel({
  mode,
  criteria,
  roles,
  beforeTask,
  onMode,
  onCriteria,
  onRoles,
  onBeforeTask,
}: Props) {
  return (
    <section className="panel" id="allocation">
      <div className="panel-head">
        <h2>Allocation et orchestration</h2>
        <span className="section-tag">§4 · §4.1 · §5.3 · §11.2</span>
      </div>
      <p className="muted">
        Choisissez le mode d’allocation pour le projet courant, cochez les six critères (§4.1),
        précisez les rôles d’orchestration (§5.3) et répondez aux questions avant tâche (§11.2).
      </p>

      <h3>Mode d’allocation (§4)</h3>
      <div className="mode-grid">
        {MODES.map((m) => (
          <button
            key={m.mode}
            type="button"
            className={`mode-card ${mode === m.mode ? 'selected' : ''}`}
            onClick={() => onMode(m.mode)}
          >
            <h3>{m.mode}</h3>
            <p>
              <strong>Conditions :</strong> {m.conditions}
            </p>
            <p>
              <strong>Gouvernance :</strong> {m.gouvernance}
            </p>
          </button>
        ))}
      </div>

      <h3>Six critères d’allocation (§4.1)</h3>
      <ul className="criteria-list">
        {criteria.map((c, i) => (
          <li key={c.id}>
            <label>
              <input
                type="checkbox"
                checked={c.checked}
                onChange={(e) => {
                  const next = [...criteria];
                  next[i] = { ...c, checked: e.target.checked };
                  onCriteria(next);
                }}
              />
              <span>
                <strong>{c.label}</strong> — {c.question}
              </span>
            </label>
          </li>
        ))}
      </ul>
      <p className="muted">
        Mode actif : <strong>{mode}</strong> · Critères cochés :{' '}
        {criteria.filter((c) => c.checked).length}/6
      </p>

      <h3>Rôles d’orchestration (§5.3)</h3>
      <p className="muted">
        Table générique (non liée à un cas particulier) : autorité et artefact de sortie attendu.
      </p>
      <div className="table-wrap">
        <table className="data-table orch-table">
          <thead>
            <tr>
              <th>Rôle</th>
              <th>Autorité</th>
              <th>Artefact de sortie</th>
            </tr>
          </thead>
          <tbody>
            {roles.map((r, i) => (
              <tr key={r.id}>
                <td>
                  <strong>{r.role}</strong>
                </td>
                <td>
                  <input
                    className="cell-input"
                    value={r.autorite}
                    onChange={(e) => {
                      const next = [...roles];
                      next[i] = { ...r, autorite: e.target.value };
                      onRoles(next);
                    }}
                    aria-label={`Autorité ${r.role}`}
                  />
                </td>
                <td>
                  <input
                    className="cell-input"
                    value={r.artefact}
                    onChange={(e) => {
                      const next = [...roles];
                      next[i] = { ...r, artefact: e.target.value };
                      onRoles(next);
                    }}
                    aria-label={`Artefact ${r.role}`}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3>Avant tâche (§11.2)</h3>
      <p className="muted">
        Même point d’entrée que dans « Créer un projet » : Résultat, Benchmark, Risque, Preuve,
        Allocation, Compétence. Modifiable ici pour affiner après le diagnostic des goulots.
      </p>
      <div className="form-grid two before-task-form">
        {BEFORE_TASK_FIELDS.map((f) => (
          <label key={f.key}>
            {f.label}
            <textarea
              rows={2}
              value={beforeTask[f.key]}
              placeholder={f.placeholder}
              onChange={(e) => onBeforeTask({ ...beforeTask, [f.key]: e.target.value })}
            />
          </label>
        ))}
      </div>
    </section>
  );
}
