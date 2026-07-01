export function HeroTerminal() {
  return (
    <div className="w-full md:w-80 mt-12 md:mt-0 bg-surface text-[#00FF41] p-6 border-4 border-neon shadow-[8px_8px_0px_var(--neon)] relative transform md:rotate-2 self-end md:self-auto">
      <div className="font-mono font-bold text-white uppercase border-b-2 border-line pb-2 mb-4 flex justify-between items-center">
        <span>§01 — INTRO</span>
        <span className="w-3 h-3 bg-[#00FF41] rounded-full inline-block animate-pulse"></span>
      </div>
      <div className="font-mono text-sm leading-relaxed text-[#00FF41]">
        &gt; init proof_generation<br/>
        &gt; loading risc_zero_zkvm<br/>
        <span className="text-white">&gt; verifying credential... [OK]</span><br/>
        &gt; minting soulbound token<br/>
        <span className="animate-pulse">_</span>
      </div>
    </div>
  );
}
