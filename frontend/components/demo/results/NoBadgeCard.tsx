export function NoBadgeCard() {
  return (
    <div className="border-2 border-line p-6 relative bg-surface">
      <div className="absolute -top-3 left-6 bg-surface px-2 font-mono text-xs font-bold text-muted">
        UNVERIFIED
      </div>
      <div className="mt-4 flex items-center gap-2 font-mono text-sm font-bold text-muted uppercase">
        <span aria-hidden="true">—</span>
        NO BADGE FOUND FOR THIS ADDRESS.
      </div>
      <div className="mt-2 text-muted font-sans text-sm">
        This address has not claimed a Prova badge.
      </div>
    </div>
  );
}
