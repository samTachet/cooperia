import type { CompositeSInputs, EfficiencyInputs, Guardrails, DeltaInputs } from '../types';

/** Éq. 9 — efficience principale */
export function efficiencyRatio(e: EfficiencyInputs): number {
  if (e.attentionHumaine <= 0) return 0;
  return e.uValidee / e.attentionHumaine;
}

export function guardrailBreaches(e: EfficiencyInputs, g: Guardrails) {
  return {
    rErreur: e.rErreur > g.r0,
    kH: e.kH < g.k0,
    portabilite: e.portabilite < g.p0,
  };
}

/** Éq. 8 — composite S (secondaire, Goodhart) */
export function compositeS(s: CompositeSInputs): number {
  const num = s.uValidee + s.beta * s.dUtile;
  const den = s.cCoord + s.cVerif + s.cReprise + s.lambda * s.lEchappee;
  if (den <= 0) return 0;
  return num / den;
}

/** Éq. 1 & 2 — §1.2 */
export function computeDeltas(d: DeltaInputs) {
  const deltaAugmentation = d.pHIA - d.pH;
  const deltaSynergie = d.pHIA - Math.max(d.pH, d.pIA);
  return { deltaAugmentation, deltaSynergie };
}

export function statusVsThreshold(
  value: number,
  higherIsBetter: boolean,
  thresholds?: { min?: number; max?: number }
): 'ok' | 'warn' | 'breach' {
  if (!thresholds) return 'ok';
  if (higherIsBetter) {
    if (thresholds.min !== undefined && value < thresholds.min) return 'breach';
    if (thresholds.min !== undefined && value < thresholds.min * 1.05) return 'warn';
  } else {
    if (thresholds.max !== undefined && value > thresholds.max) return 'breach';
    if (thresholds.max !== undefined && value > thresholds.max * 0.95) return 'warn';
  }
  return 'ok';
}
