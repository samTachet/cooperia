import type { Episode } from '../types';

export function episodesToCSV(episodes: Episode[]): string {
  const headers = [
    'id',
    'tache',
    'strate',
    'difficulte',
    'condition',
    'dureeMin',
    'critereValidation',
    'qualiteExterne',
    'attentionHumaine',
    'erreursEchappees',
    'coutReprise',
    'calibration',
    'rendementDesaccord',
    'competenceHumaine',
    'portabilite',
  ];
  const rows = episodes.map((e) =>
    [
      e.id,
      `"${e.tache.replace(/"/g, '""')}"`,
      e.strate,
      e.difficulte,
      e.condition,
      e.dureeMin,
      `"${e.critereValidation.replace(/"/g, '""')}"`,
      e.scores.qualiteExterne,
      e.scores.attentionHumaine,
      e.scores.erreursEchappees,
      e.scores.coutReprise,
      e.scores.calibration,
      e.scores.rendementDesaccord,
      e.scores.competenceHumaine,
      e.scores.portabilite,
    ].join(',')
  );
  return [headers.join(','), ...rows].join('\n');
}

export function downloadText(filename: string, content: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
