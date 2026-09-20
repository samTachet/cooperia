import { useState } from 'react';
import { usePersistentState } from './hooks/usePersistentState';
import { ProjectHeader } from './components/ProjectHeader';
import { StopCriteriaBanner } from './components/StopCriteriaBanner';
import { DimensionCards } from './components/DimensionCards';
import { EfficiencyPanel } from './components/EfficiencyPanel';
import { CompositeSPanel } from './components/CompositeSPanel';
import { ComparisonDeltas } from './components/ComparisonDeltas';
import { EpisodesTable } from './components/EpisodesTable';
import { AllocationPanel } from './components/AllocationPanel';
import { BottlenecksGrid } from './components/BottlenecksGrid';
import { ControlsHierarchy } from './components/ControlsHierarchy';
import { CompetenceTrend } from './components/CompetenceTrend';
import { PowerPortability } from './components/PowerPortability';
import type { AppTab } from './types';
import './App.css';

const NAV: { id: AppTab; label: string }[] = [
  { id: 'accueil', label: 'Accueil' },
  { id: 'cas-ccl', label: 'Cas CCL' },
  { id: 'dimensions', label: 'Dimensions' },
  { id: 'efficience', label: 'Efficience' },
  { id: 'episodes', label: 'Épisodes' },
  { id: 'controles', label: 'Contrôles' },
  { id: 'competence', label: 'Compétence' },
  { id: 'pouvoir', label: 'Pouvoir' },
];

export default function App() {
  const { state, update, reset } = usePersistentState();
  const [tab, setTab] = useState<AppTab>('accueil');

  const projectLabel = state.project.name.trim() || 'Nouveau projet';
  const projectReady =
    state.project.name.trim().length > 0 && state.project.but.trim().length > 0;

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <span className="brand-mark" aria-hidden>
            H↔IA
          </span>
          <div>
            <h1>Coopéria · Tableau de bord</h1>
            <p className="tagline">
              Coopération humain–IA · {projectLabel} · Tachet, sept. 2026
            </p>
          </div>
        </div>
        <div className="top-actions">
          <button
            type="button"
            className="btn"
            onClick={() => update({ theme: state.theme === 'light' ? 'dark' : 'light' })}
            aria-label="Basculer thème"
          >
            {state.theme === 'light' ? 'Mode sombre' : 'Mode clair'}
          </button>
          <button type="button" className="btn btn-ghost" onClick={reset}>
            Réinitialiser
          </button>
        </div>
      </header>

      <nav className="nav-rail" aria-label="Sections">
        {NAV.map((n) => (
          <button
            key={n.id}
            type="button"
            className={`nav-tab ${tab === n.id ? 'active' : ''}`}
            onClick={() => setTab(n.id)}
          >
            {n.label}
          </button>
        ))}
      </nav>

      <main className="main">
        {tab === 'accueil' && (
          <>
            <aside className="intro-card">
              <p>
                Accueil Coopéria : créer un projet (identité, brief, point d’entrée §11.2),
                diagnostiquer les <strong>14 goulots</strong> (§2), puis gérer{' '}
                <strong>allocation et orchestration</strong> (§4 · §5.3). Le cas CCL et les
                autres panneaux sont accessibles via la navigation.
              </p>
            </aside>

            <ProjectHeader
              project={state.project}
              beforeTask={state.beforeTask}
              onChange={(project) => update({ project })}
              onBeforeTask={(beforeTask) => update({ beforeTask })}
            />

            <BottlenecksGrid
              bottlenecks={state.bottlenecks}
              bindingId={state.bindingBottleneckId}
              ready={projectReady}
              onChange={(bottlenecks) => update({ bottlenecks })}
              onBinding={(bindingBottleneckId) => update({ bindingBottleneckId })}
            />

            <AllocationPanel
              mode={state.allocationMode}
              criteria={state.allocationCriteria}
              roles={state.orchestrationRoles}
              beforeTask={state.beforeTask}
              onMode={(allocationMode) => update({ allocationMode })}
              onCriteria={(allocationCriteria) => update({ allocationCriteria })}
              onRoles={(orchestrationRoles) => update({ orchestrationRoles })}
              onBeforeTask={(beforeTask) => update({ beforeTask })}
            />
          </>
        )}

        {tab === 'cas-ccl' && (
          <>
            <aside className="intro-card">
              <p>
                <strong>Cas CCL</strong> (exemple) — Capital Conversion Lab. Préférer un{' '}
                <strong>tableau de bord multidimensionnel</strong> à un score unique (§6.3). Les
                équations sont des définitions opérationnelles, non des lois validées. Données
                d’épisodes marquées comme exemple.
              </p>
            </aside>

            <StopCriteriaBanner
              stop={state.stopCriteria}
              onChange={(stopCriteria) => update({ stopCriteria })}
            />

            <ComparisonDeltas
              deltas={state.deltas}
              onChange={(deltas) => update({ deltas })}
            />

            <EpisodesTable
              episodes={state.episodes}
              onChange={(episodes) => update({ episodes })}
            />
          </>
        )}

        {tab === 'dimensions' && (
          <DimensionCards
            dimensions={state.dimensions}
            thresholds={state.dimensionThresholds}
            onChange={(dimensions) =>
              update({
                dimensions,
                efficiency: {
                  ...state.efficiency,
                  uValidee: dimensions.qualiteExterne,
                  attentionHumaine: dimensions.attentionHumaine,
                  rErreur: dimensions.erreursEchappees,
                  kH: dimensions.competenceHumaine,
                  portabilite: dimensions.portabilite,
                },
              })
            }
          />
        )}

        {tab === 'efficience' && (
          <div className="two-col">
            <EfficiencyPanel
              efficiency={state.efficiency}
              guardrails={state.guardrails}
              onEfficiency={(efficiency) => update({ efficiency })}
              onGuardrails={(guardrails) => update({ guardrails })}
            />
            <CompositeSPanel
              inputs={state.compositeS}
              onChange={(compositeS) => update({ compositeS })}
            />
          </div>
        )}

        {tab === 'episodes' && (
          <EpisodesTable
            episodes={state.episodes}
            onChange={(episodes) => update({ episodes })}
          />
        )}

        {tab === 'controles' && (
          <ControlsHierarchy
            levels={state.controlLevels}
            onChange={(controlLevels) => update({ controlLevels })}
          />
        )}

        {tab === 'competence' && (
          <CompetenceTrend
            trend={state.competenceTrend}
            k0={state.guardrails.k0}
            onChange={(competenceTrend) => update({ competenceTrend })}
          />
        )}

        {tab === 'pouvoir' && (
          <PowerPortability
            levers={state.powerLevers}
            onChange={(powerLevers) => update({ powerLevers })}
          />
        )}

        <footer className="footer">
          <p>
            Source : Samirah Tachet, « Optimiser la coopération humain-IA », septembre 2026.
            Coopéria — tableau de bord de coopération (usage recherche). Exemple CCL disponible
            dans l’onglet « Cas CCL ».
          </p>
        </footer>
      </main>
    </div>
  );
}
