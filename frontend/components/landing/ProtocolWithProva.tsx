import { Terminal } from "@/components/ui/terminal";

export function ProtocolWithProva() {
  return (
    <div className="p-8 md:p-16 lg:p-24 bg-ink relative overflow-hidden h-full">
      <div className="absolute inset-0 bg-ink/90 z-0"></div>
      <div className="relative z-10 h-full flex flex-col justify-between">
        <div>
          <div className="flex justify-end mb-8">
            <div className="font-mono font-bold text-ink bg-neon uppercase px-3 py-1 border-2 border-ink shadow-[4px_4px_0px_var(--neon)] text-xl">SECURE STATE</div>
          </div>
          <h2 className="font-display font-black text-6xl md:text-7xl leading-none md:leading-none mb-12 lg:mb-24 text-white uppercase tracking-[-0.04em] text-right break-words">WITH<br/><span className="text-neon">PROVA</span></h2>
        </div>
        <div className="border-4 border-neon bg-ink p-6 relative shadow-[12px_12px_0px_var(--neon)] self-end max-w-lg w-full transform rotate-1 hover:rotate-0 transition-transform">
          <div className="absolute -top-6 -right-6 bg-neon border-4 border-ink rounded-full p-2 w-16 h-16 flex items-center justify-center shadow-[4px_4px_0px_var(--ink)]">
            <span className="text-ink text-4xl font-bold">✓</span>
          </div>
          <div className="font-mono font-bold text-neon mb-6 border-b-2 border-neon/30 pb-3 text-lg">ZK_PROOF_VERIFIED</div>
          <div className="w-full relative h-[250px]">
            <Terminal
              commands={[
                "cat proof_result.json",
              ]}
              outputs={{
                0: [
                  "{",
                  '  "eligible": true,',
                  '  "nullifier": "0x8f2a...9b1c",',
                  '  "target": "stellar_contract_v1"',
                  "}"
                ],
              }}
              typingSpeed={40}
              delayBetweenCommands={500}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
