import { useCallback, useEffect, useState } from 'react';
import {
  STORAGE_KEY,
  LEGACY_STORAGE_KEY,
  createDefaultState,
  defaultBeforeTask,
  defaultOrchestrationRoles,
  defaultProject,
} from '../data/defaults';
import { defaultBottlenecks } from '../data/bottlenecks';
import type { Bottleneck, BottleneckStatus, DashboardState } from '../types';

const LEGACY_STATUS_MAP: Record<string, BottleneckStatus> = {
  inactif: 'fluide',
  surveillé: 'fluide',
  actif: 'sous tension',
  contraignant: 'bloquant',
  fluide: 'fluide',
  'sous tension': 'sous tension',
  bloquant: 'bloquant',
};

function migrateBottlenecks(raw: unknown): Bottleneck[] {
  const defaults = defaultBottlenecks.map((b) => ({ ...b }));
  if (!Array.isArray(raw)) return defaults;

  return defaults.map((def) => {
    const found = raw.find(
      (x): x is Record<string, unknown> =>
        typeof x === 'object' && x !== null && (x as { id?: number }).id === def.id
    );
    if (!found) return def;
    const statusRaw = String(found.status ?? def.status);
    const status = LEGACY_STATUS_MAP[statusRaw] ?? def.status;
    const answersRaw = found.questionnaireAnswers;
    let questionnaireAnswers: Record<string, number> | undefined;
    if (answersRaw && typeof answersRaw === 'object' && !Array.isArray(answersRaw)) {
      const entries = Object.entries(answersRaw as Record<string, unknown>).filter(
        ([, v]) => typeof v === 'number' && Number.isFinite(v)
      ) as [string, number][];
      if (entries.length > 0) {
        questionnaireAnswers = Object.fromEntries(entries);
      }
    }

    const proposedRaw = found.proposedStatus;
    const proposedStatus =
      typeof proposedRaw === 'string' && proposedRaw in LEGACY_STATUS_MAP
        ? LEGACY_STATUS_MAP[proposedRaw]
        : undefined;

    const diagnosedAt =
      typeof found.diagnosedAt === 'string' ? found.diagnosedAt : undefined;

    return {
      ...def,
      status,
      note: typeof found.note === 'string' ? found.note : '',
      mecanisme: typeof found.mecanisme === 'string' ? found.mecanisme : def.mecanisme,
      consequence: typeof found.consequence === 'string' ? found.consequence : def.consequence,
      ...(questionnaireAnswers ? { questionnaireAnswers } : {}),
      ...(proposedStatus ? { proposedStatus } : {}),
      ...(diagnosedAt ? { diagnosedAt } : {}),
    };
  });
}

function migrateState(parsed: Record<string, unknown>): DashboardState {
  const base = createDefaultState();
  const theme = parsed.theme === 'dark' ? 'dark' : 'light';

  const rawProject =
    parsed.project && typeof parsed.project === 'object'
      ? (parsed.project as Record<string, unknown>)
      : {};
  const enjeuRaw = String(rawProject.enjeu ?? '');
  const enjeu =
    enjeuRaw === 'faible' || enjeuRaw === 'moyen' || enjeuRaw === 'élevé' ? enjeuRaw : '';
  const project = {
    ...defaultProject,
    ...rawProject,
    name: typeof rawProject.name === 'string' ? rawProject.name : '',
    code: typeof rawProject.code === 'string' ? rawProject.code : '',
    but: typeof rawProject.but === 'string' ? rawProject.but : '',
    destinataire: typeof rawProject.destinataire === 'string' ? rawProject.destinataire : '',
    perimetre: typeof rawProject.perimetre === 'string' ? rawProject.perimetre : '',
    contraintes: typeof rawProject.contraintes === 'string' ? rawProject.contraintes : '',
    horizon: typeof rawProject.horizon === 'string' ? rawProject.horizon : '',
    enjeu: enjeu as typeof defaultProject.enjeu,
  };

  return {
    ...base,
    ...parsed,
    theme,
    project,
    bottlenecks: migrateBottlenecks(parsed.bottlenecks),
    bindingBottleneckId:
      typeof parsed.bindingBottleneckId === 'number' ? parsed.bindingBottleneckId : null,
    orchestrationRoles: Array.isArray(parsed.orchestrationRoles)
      ? (parsed.orchestrationRoles as DashboardState['orchestrationRoles'])
      : defaultOrchestrationRoles.map((r) => ({ ...r })),
    beforeTask:
      parsed.beforeTask && typeof parsed.beforeTask === 'object'
        ? { ...defaultBeforeTask, ...(parsed.beforeTask as object) }
        : { ...defaultBeforeTask },
    allocationCriteria: Array.isArray(parsed.allocationCriteria)
      ? (parsed.allocationCriteria as DashboardState['allocationCriteria'])
      : base.allocationCriteria,
  };
}

function loadInitial(): DashboardState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return migrateState(JSON.parse(raw) as Record<string, unknown>);
    }
    const legacy = localStorage.getItem(LEGACY_STORAGE_KEY);
    if (legacy) {
      const migrated = migrateState(JSON.parse(legacy) as Record<string, unknown>);
      // Ne pas forcer le framing CCL : reset projet + binding si migration legacy
      migrated.project = { ...defaultProject };
      migrated.bindingBottleneckId = null;
      migrated.bottlenecks = defaultBottlenecks.map((b) => ({ ...b }));
      migrated.allocationCriteria = createDefaultState().allocationCriteria;
      migrated.beforeTask = { ...defaultBeforeTask };
      return migrated;
    }
  } catch {
    /* ignore */
  }
  return createDefaultState();
}

export function usePersistentState() {
  const [state, setState] = useState<DashboardState>(() => loadInitial());

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', state.theme);
  }, [state.theme]);

  const update = useCallback((patch: Partial<DashboardState>) => {
    setState((prev) => ({ ...prev, ...patch }));
  }, []);

  const reset = useCallback(() => {
    const fresh = createDefaultState();
    fresh.theme = state.theme;
    setState(fresh);
  }, [state.theme]);

  return { state, setState, update, reset };
}
