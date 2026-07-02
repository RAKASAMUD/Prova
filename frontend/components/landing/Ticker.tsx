import ScrollVelocity from '@/components/effects/ScrollVelocity';

const items = (
  <>
    <span className="text-black bg-white px-2 py-1">STATUS: LIVE ON TESTNET</span>
    <span className="text-ink font-black text-2xl" aria-hidden="true">/</span>
    <span className="text-ink">SOULBOUND</span>
    <span className="text-ink font-black text-2xl" aria-hidden="true">/</span>
    <span className="text-ink">NON-TRANSFERABLE</span>
    <span className="text-ink font-black text-2xl" aria-hidden="true">/</span>
  </>
);

export function Ticker() {
  return (
    <div className="font-mono font-bold text-lg uppercase text-ink py-4 border-b-2 border-line overflow-hidden bg-neon flex items-center">
      <ScrollVelocity 
        texts={([items] as unknown) as never[]}
        velocity={50}
        parallaxClassName="overflow-hidden whitespace-nowrap flex flex-nowrap m-0 w-full"
        scrollerClassName="flex items-center whitespace-nowrap flex-nowrap"
        className="flex items-center gap-8 pr-8"
      />
    </div>
  );
}
