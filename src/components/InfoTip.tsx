import { useState } from 'react';

export function InfoTip({ text }: { text: string }) {
  const [open, setOpen] = useState(false);
  return (
    <span className="info-tip" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button type="button" className="info-tip-btn" aria-label="Définition" onClick={() => setOpen((v) => !v)}>
        ?
      </button>
      {open && <span className="info-tip-popup" role="tooltip">{text}</span>}
    </span>
  );
}
