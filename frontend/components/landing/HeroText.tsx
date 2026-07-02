import TextType from '@/components/effects/TextType';

export function HeroText() {
  return (
    <>
      <div className="bg-surface text-neon font-mono font-bold inline-block px-4 py-2 mb-8 shadow-[6px_6px_0px_var(--neon)] uppercase text-sm md:text-base border-2 border-neon transform -rotate-1">
        REAL-WORLD ZK · STELLAR
      </div>
      <div className="relative">
        <div className="absolute -inset-4 bg-neon z-0 hidden md:block transform rotate-1 shadow-[8px_8px_0px_var(--ink)] border-2 border-ink"></div>
        <h1 className="font-display text-5xl md:text-8xl font-black tracking-[-0.04em] mb-8 leading-[0.9] text-paper relative z-10">
          Prove you qualify.<br/>
          <TextType 
            text="Without ever" 
            as="span" 
            className="text-ink bg-paper px-2 mt-2 inline-block shadow-[4px_4px_0px_var(--ink)] md:shadow-none border-2 border-ink md:border-transparent"
          /><br/>
          showing your diagnosis.
        </h1>
      </div>
      <p className="font-sans text-xl md:text-2xl text-paper max-w-2xl mb-12 font-medium bg-surface inline-block p-4 border-2 border-line">
        Prova lets disabled creators prove a valid credential with a zero-knowledge proof — and mint a soulbound badge on Stellar.
      </p>
    </>
  );
}
