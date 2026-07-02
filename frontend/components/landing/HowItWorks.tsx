export function HowItWorks() {
  return (
    <section className="p-8 md:p-16 bg-paper border-t-2 border-line relative z-10">
      <div className="max-w-[1600px] mx-auto">
        <div className="font-mono font-bold text-ink uppercase mb-8 border-b-2 border-line inline-block pb-1 text-xl">04 — FLOW</div>
        <h2 className="font-display font-black text-4xl md:text-6xl mb-16 text-ink uppercase tracking-[-0.04em]">How it works.</h2>
        <div className="relative">
          <div className="absolute top-12 left-0 w-full h-px bg-line hidden md:block"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            <div className="bg-paper">
              <div className="font-mono font-bold text-6xl text-neon mb-6 relative bg-paper inline-block pr-4">01</div>
              <div className="font-mono font-bold text-ink uppercase mb-2">ISSUER REGISTERS</div>
              <p className="font-sans text-ink/70 text-sm">A trusted issuer registers a hash of your credential on-chain. Your document never leaves you.</p>
            </div>
            <div className="bg-paper">
              <div className="font-mono font-bold text-6xl text-neon mb-6 relative bg-paper inline-block px-4">02</div>
              <div className="font-mono font-bold text-ink uppercase mb-2">YOU PROVE PRIVATELY</div>
              <p className="font-sans text-ink/70 text-sm">Inside the RISC Zero zkVM, your device computes a commitment and nullifier. Your secret never leaves the machine.</p>
            </div>
            <div className="bg-paper">
              <div className="font-mono font-bold text-6xl text-neon mb-6 relative bg-paper inline-block pl-4">03</div>
              <div className="font-mono font-bold text-ink uppercase mb-2">STELLAR VERIFIES &amp; MINTS</div>
              <p className="font-sans text-ink/70 text-sm">The Soroban contract verifies the Groth16 proof and mints your soulbound badge.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
