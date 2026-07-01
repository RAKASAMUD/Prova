export function FourChecks() {
  return (
    <section className="p-8 md:p-16 bg-surface border-t-2 border-line relative z-10">
      <div className="max-w-[1600px] mx-auto">
        <div className="font-mono font-bold text-neon uppercase mb-8 border-b-2 border-line inline-block pb-1 text-xl">§03 — DEFENSE</div>
        <h2 className="font-display text-4xl md:text-6xl mb-12 text-paper uppercase tracking-tighter">Four checks. Four attacks closed.</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-line border border-line">
          <div className="bg-surface p-8">
            <div className="font-mono font-bold text-4xl text-neon mb-4">01</div>
            <div className="font-mono font-bold text-paper uppercase mb-2">FAKE GUEST</div>
            <p className="font-sans text-muted text-sm">The contract stores a trusted image ID. Proofs from any other program are rejected.</p>
          </div>
          <div className="bg-surface p-8">
            <div className="font-mono font-bold text-4xl text-neon mb-4">02</div>
            <div className="font-mono font-bold text-paper uppercase mb-2">FORGED ELIGIBILITY</div>
            <p className="font-sans text-muted text-sm">The contract holds the set of valid commitments. Unknown commitments are rejected.</p>
          </div>
          <div className="bg-surface p-8">
            <div className="font-mono font-bold text-4xl text-neon mb-4">03</div>
            <div className="font-mono font-bold text-paper uppercase mb-2">CROSS-CONTRACT REPLAY</div>
            <p className="font-sans text-muted text-sm">The proof binds the target contract. Any other address is rejected.</p>
          </div>
          <div className="bg-surface p-8">
            <div className="font-mono font-bold text-4xl text-neon mb-4">04</div>
            <div className="font-mono font-bold text-paper uppercase mb-2">DOUBLE CLAIM</div>
            <p className="font-sans text-muted text-sm">A one-time nullifier is spent on mint. The same proof can never mint twice.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
