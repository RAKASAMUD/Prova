import DecryptedText from '@/components/effects/DecryptedText';

export function HeroTerminal() {
  return (
    <div className="w-full md:w-80 mt-12 md:mt-0 bg-surface p-6 border-4 border-neon shadow-[8px_8px_0px_var(--neon)] relative transform md:rotate-2 self-end md:self-auto">
      <div className="font-mono font-bold text-white uppercase border-b-2 border-line pb-2 mb-4 flex justify-between items-center">
        <span>01 — DEMO RUN</span>
        <span className="w-3 h-3 bg-[#00FF41] rounded-full inline-block animate-pulse" aria-hidden="true"></span>
      </div>
      <div className="font-mono text-sm leading-relaxed text-[#00FF41] flex flex-col items-start">
        <DecryptedText text="> load groth16_fixture [OK]" speed={50} maxIterations={40} animateOn="view" />
        <DecryptedText text="> journal_hash = sha256(raw)" speed={50} maxIterations={60} animateOn="view" />
        <DecryptedText text="> router.verify(seal) ... [OK]" speed={50} maxIterations={80} animateOn="view" className="text-white" parentClassName="text-white" encryptedClassName="text-white" />
        <DecryptedText text="> claim_badge → soulbound mint" speed={50} maxIterations={100} animateOn="view" />
        <span className="animate-pulse" aria-hidden="true">_</span>
      </div>
    </div>
  );
}
