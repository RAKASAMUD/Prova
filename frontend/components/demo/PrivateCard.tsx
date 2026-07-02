export function PrivateCard() {
  return (
    <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full text-ink">
      <h2 className="font-display text-4xl md:text-6xl mb-8 font-bold">YOUR IDENTITY.</h2>
      {/* Credential Card */}
      <div className="bg-white border-2 border-ink p-6 relative shadow-[8px_8px_0px_var(--ink)]">
        <div className="absolute -top-3 left-6 bg-white border-2 border-ink px-2 font-mono text-xs font-bold uppercase text-ink">
          ISSUED CREDENTIAL
        </div>
        <div className="space-y-6 mt-4">
          <div className="border-b-2 border-line/20 pb-2">
            <div className="font-mono text-xs font-bold text-muted-ink mb-1">LEGAL NAME</div>
            <div className="font-sans text-xl font-bold uppercase">JANE DOE</div>
          </div>
          <div className="border-b-2 border-line/20 pb-2">
            <div className="font-mono text-xs font-bold text-muted-ink mb-1">DIAGNOSIS CODE</div>
            <div className="bg-red-deep text-white font-mono text-xs font-bold px-2 py-1 inline-block uppercase line-through decoration-white/50">
              REDACTED - M79.7
            </div>
          </div>
          <div>
            <div className="font-mono text-xs font-bold text-muted-ink mb-1">PROVA ID</div>
            <div className="font-mono text-xs truncate">did:prova:8f2a...9b1c</div>
          </div>
        </div>
      </div>
      <p className="mt-6 font-mono text-xs font-bold text-muted-ink flex items-center gap-2 uppercase">
        <span aria-hidden="true">🔒</span>
        This never leaves your device.
      </p>
    </div>
  );
}
