export function InvalidCard() {
  return (
    <div className="border-2 border-line p-6 relative bg-surface">
      <div className="absolute -top-3 left-6 bg-surface px-2 font-mono text-xs font-bold text-muted-ink">
        INVALID FORMAT
      </div>
      <div className="mt-4 flex items-center gap-2 font-mono text-sm font-bold text-muted-ink uppercase">
        <span aria-hidden="true">!</span>
        INVALID STELLAR ADDRESS
      </div>
      <div className="mt-2 text-muted font-sans text-sm">
        Stellar addresses start with G and are 56 characters.
      </div>
    </div>
  );
}
