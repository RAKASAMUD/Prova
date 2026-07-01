export function Ticker() {
  return (
    <div className="font-mono font-bold text-lg uppercase text-ink py-4 border-b-2 border-line overflow-hidden whitespace-nowrap bg-neon flex items-center gap-8">
      <div className="flex animate-[marquee_20s_linear_infinite] gap-8">
        <span className="text-white bg-ink px-2 py-1">STATUS: LIVE ON TESTNET</span>
        <span className="text-ink font-black text-2xl">/</span>
        <span className="text-ink">SOULBOUND</span>
        <span className="text-ink font-black text-2xl">/</span>
        <span className="text-ink">NON-TRANSFERABLE</span>
        <span className="text-ink font-black text-2xl">/</span>
        <span className="text-white bg-ink px-2 py-1">STATUS: LIVE ON TESTNET</span>
        <span className="text-ink font-black text-2xl">/</span>
        <span className="text-ink">SOULBOUND</span>
        <span className="text-ink font-black text-2xl">/</span>
        <span className="text-ink">NON-TRANSFERABLE</span>
      </div>
    </div>
  );
}
