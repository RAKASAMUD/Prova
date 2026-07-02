export function RejectedCard({ detail }: { detail: string }) {
  return (
    <div className="border-2 border-red p-6 relative bg-surface">
      <div className="absolute -top-3 left-6 bg-surface px-2 font-mono text-xs font-bold text-red">
        REJECTED
      </div>
      <div className="mt-4 flex items-center gap-2 font-mono text-sm font-bold text-red uppercase">
        <span aria-hidden="true">✕</span>
        REJECTED — NULLIFIER ALREADY USED
      </div>
      <div className="mt-2 text-red-deep font-sans text-sm">
        Rejected live by the contract on testnet. The same proof can never mint twice.
      </div>
      <div className="mt-4 p-3 bg-ink text-red font-mono text-xs overflow-x-auto border border-red-deep">
        {detail}
      </div>
    </div>
  );
}
