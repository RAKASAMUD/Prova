export function NetworkErrorCard({ detail }: { detail: string }) {
  return (
    <div className="border-2 border-line p-6 relative bg-surface">
      <div className="absolute -top-3 left-6 bg-surface px-2 font-mono text-xs font-bold text-muted">
        NETWORK ERROR
      </div>
      <div className="mt-4 flex items-center gap-2 font-mono text-sm font-bold text-muted uppercase">
        <span aria-hidden="true">⚠</span>
        COULDN'T REACH THE NETWORK
      </div>
      <div className="mt-2 text-muted font-sans text-sm">
        This says nothing about the badge — try again.
      </div>
      <div className="mt-4 p-3 bg-ink text-muted font-mono text-xs overflow-x-auto border border-line">
        {detail}
      </div>
    </div>
  );
}
