import { useMemo, useState } from 'react';
import type { BeforeTaskAnswers, EnjeuNiveau, ProjectBrief } from '../types';
import { defaultBeforeTask, defaultProject } from '../data/defaults';

const BEFORE_TASK_FIELDS: {
  key: keyof BeforeTaskAnswers;
  label: string;
  placeholder: string;
}[] = [
  {
    key: 'resultat',
    label: 'Résultat attendu',
    placeholder: 'Quel livrable concret et quelles exclusions ?',
  },
  {
    key: 'benchmark',
    label: 'Benchmark',
    placeholder: 'Contre quoi comparer (humain seul, autre outil, version) ?',
  },
  {
    key: 'risque',
    label: 'Risque principal',
    placeholder: 'Erreur maximale crédible et réversibilité ?',
  },
  {
    key: 'preuve',
    label: 'Preuve de validation',
    placeholder: 'Quelle preuve indépendante avant validation ?',
  },
  {
    key: 'allocation',
    label: 'Allocation envisagée',
    placeholder: 'Qui produit, qui contrôle, qui arbitre ?',
  },
  {
    key: 'competence',
    label: 'Compétence à préserver',
    placeholder: 'Quelle pratique humaine faut-il préserver ?',
  },
];

const ENJEU_OPTIONS: { value: EnjeuNiveau; label: string }[] = [
  { value: '', label: '— non précisé —' },
  { value: 'faible', label: 'Faible' },
  { value: 'moyen', label: 'Moyen' },
  { value: 'élevé', label: 'Élevé' },
];

interface Props {
  project: ProjectBrief;
  beforeTask: BeforeTaskAnswers;
  onChange: (p: ProjectBrief) => void;
  onBeforeTask: (b: BeforeTaskAnswers) => void;
}

function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

export function ProjectHeader({ project, beforeTask, onChange, onBeforeTask }: Props) {
  const [nameError, setNameError] = useState(false);
  const [savedFlash, setSavedFlash] = useState(false);

  const set = <K extends keyof ProjectBrief>(key: K, value: ProjectBrief[K]) => {
    if (key === 'name' && nameError && String(value).trim()) {
      setNameError(false);
    }
    onChange({ ...project, [key]: value });
  };

  const nameFilled = project.name.trim().length > 0;
  const butFilled = project.but.trim().length > 0;
  const ready = nameFilled && butFilled;

  const beforeFilled = useMemo(
    () => BEFORE_TASK_FIELDS.filter((f) => beforeTask[f.key].trim()).length,
    [beforeTask]
  );

  const handleSave = () => {
    if (!project.name.trim()) {
      setNameError(true);
      setSavedFlash(false);
      return;
    }
    setNameError(false);
    setSavedFlash(true);
    window.setTimeout(() => setSavedFlash(false), 2200);
  };

  const handleResetProject = () => {
    onChange({ ...defaultProject });
    onBeforeTask({ ...defaultBeforeTask });
    setNameError(false);
    setSavedFlash(false);
  };

  return (
    <section className="panel project-header" id="projet">
      <div className="panel-head">
        <h2>Créer un projet</h2>
        <span className="section-tag">Accueil · Coopéria</span>
        <span className={`badge ${ready ? 'badge-ok' : 'badge-sample'}`}>
          {ready ? 'Prêt pour goulots & allocation' : 'Identité + but requis'}
        </span>
      </div>
      <p className="muted">
        Workflow guidé pour cadrer un projet de coopération humain–IA. Remplissez l’identité et le
        brief, esquissez le point d’entrée opérationnel (§11.2), puis poursuivez vers le diagnostic
        des goulots et l’allocation. Persistance locale automatique.
      </p>

      {/* Progress steps */}
      <ol className="project-steps" aria-label="Étapes du formulaire">
        <li className={nameFilled ? 'done' : 'current'}>
          <span className="step-num">1</span>
          <span className="step-label">Identité</span>
        </li>
        <li className={butFilled ? 'done' : nameFilled ? 'current' : ''}>
          <span className="step-num">2</span>
          <span className="step-label">Brief</span>
        </li>
        <li className={beforeFilled >= 3 ? 'done' : ready ? 'current' : ''}>
          <span className="step-num">3</span>
          <span className="step-label">Lancement</span>
        </li>
      </ol>

      {/* 1. Identité */}
      <div className="form-section">
        <h3 className="form-section-title">1. Identité</h3>
        <div className="form-grid two">
          <label className={`project-name-field ${nameError ? 'field-error' : ''}`}>
            Nom du projet <span className="req">*</span>
            <input
              type="text"
              value={project.name}
              placeholder="ex. Revue documentaire Q4, Audit processus…"
              onChange={(e) => set('name', e.target.value)}
              aria-label="Nom du projet"
              aria-invalid={nameError}
              aria-describedby={nameError ? 'project-name-error' : undefined}
            />
            {nameError && (
              <span id="project-name-error" className="field-error-msg" role="alert">
                Le nom du projet est obligatoire.
              </span>
            )}
          </label>
          <label>
            Référence / code court
            <input
              type="text"
              value={project.code}
              placeholder="ex. REV-Q4, AUD-01…"
              onChange={(e) => set('code', e.target.value)}
              aria-label="Référence ou code court"
            />
          </label>
        </div>
      </div>

      {/* 2. Brief */}
      <div className="form-section">
        <h3 className="form-section-title">2. Brief</h3>
        <div className="form-grid three project-brief">
          <label>
            But <span className="req">*</span>
            <input
              type="text"
              value={project.but}
              placeholder="Objectif principal"
              onChange={(e) => set('but', e.target.value)}
            />
          </label>
          <label>
            Destinataire
            <input
              type="text"
              value={project.destinataire}
              placeholder="Qui décide / reçoit"
              onChange={(e) => set('destinataire', e.target.value)}
            />
          </label>
          <label>
            Périmètre
            <input
              type="text"
              value={project.perimetre}
              placeholder="Inclusions / exclusions"
              onChange={(e) => set('perimetre', e.target.value)}
            />
          </label>
        </div>
        <div className="form-grid three project-brief">
          <label>
            Contraintes
            <input
              type="text"
              value={project.contraintes}
              placeholder="Délais, outils, confidentialité…"
              onChange={(e) => set('contraintes', e.target.value)}
            />
          </label>
          <label>
            Horizon / échéance
            <input
              type="text"
              value={project.horizon}
              placeholder="ex. 30 jours, fin Q4…"
              onChange={(e) => set('horizon', e.target.value)}
            />
          </label>
          <label>
            Niveau d’enjeu
            <select
              value={project.enjeu}
              onChange={(e) => set('enjeu', e.target.value as EnjeuNiveau)}
              aria-label="Niveau d'enjeu"
            >
              {ENJEU_OPTIONS.map((o) => (
                <option key={o.value || 'none'} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {/* 3. Point d'entrée opérationnel */}
      <div className="form-section">
        <h3 className="form-section-title">
          3. Point d’entrée opérationnel{' '}
          <span className="section-tag tiny">§11.2 · {beforeFilled}/6</span>
        </h3>
        <p className="muted">
          Première passe des six questions « avant tâche ». Les mêmes champs restent éditables dans
          Allocation &amp; orchestration plus bas.
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
      </div>

      {/* Actions */}
      <div className="project-actions">
        <button type="button" className="btn btn-primary" onClick={handleSave}>
          Enregistrer le projet
        </button>
        <button type="button" className="btn btn-ghost" onClick={handleResetProject}>
          Réinitialiser
        </button>
        <button
          type="button"
          className={`btn ${ready ? 'btn-accent' : ''}`}
          disabled={!ready}
          title={
            ready
              ? 'Aller aux goulots puis à l’allocation'
              : 'Renseignez au minimum le nom et le but'
          }
          onClick={() => {
            scrollToId('goulots');
            window.setTimeout(() => scrollToId('allocation'), 700);
          }}
        >
          Continuer vers goulots &amp; allocation
        </button>
        {savedFlash && (
          <span className="save-flash" role="status">
            Projet enregistré (localStorage)
          </span>
        )}
      </div>

      {/* Compact summary strip */}
      {(nameFilled || butFilled) && (
        <div className="project-summary-strip" aria-live="polite">
          <strong>{project.name.trim() || 'Sans nom'}</strong>
          {project.code.trim() && <span className="sum-code">{project.code.trim()}</span>}
          {project.but.trim() && <span>· But : {project.but.trim()}</span>}
          {project.destinataire.trim() && <span>· Dest. : {project.destinataire.trim()}</span>}
          {project.horizon.trim() && <span>· Horizon : {project.horizon.trim()}</span>}
          {project.enjeu && (
            <span className={`enjeu-chip enjeu-${project.enjeu}`}>Enjeu {project.enjeu}</span>
          )}
          <span className="sum-ready">{ready ? '→ sections débloquées' : '→ complètez nom + but'}</span>
        </div>
      )}
    </section>
  );
}
