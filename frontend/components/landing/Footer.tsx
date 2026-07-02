export function Footer() {
  return (
    <footer className="w-full bg-neon text-ink border-t-4 border-ink flex flex-col items-center py-8 px-4 gap-8 mx-auto relative z-50">
      <div className="w-full max-w-[1600px] flex flex-col md:flex-row justify-between items-center md:items-start gap-8">
        <div className="font-display text-6xl text-ink font-black tracking-[-0.04em] bg-neon px-4 py-2 border-2 border-ink shadow-[6px_6px_0px_var(--ink)]">
          PROVA*
        </div>
        <div className="font-mono font-bold uppercase text-center md:text-left flex flex-col gap-2 bg-paper text-ink p-4 border-2 border-ink shadow-[4px_4px_0px_var(--ink)]">
          <span className="bg-ink text-white px-2 py-1 self-center md:self-start mb-2">© 2026 PROVA ON STELLAR.</span>
          <span className="font-black text-red-deep">TESTNET DISCLAIMER: EXPERIMENTAL PROTOCOL. NOT AUDITED.</span>
          <span className="text-xs mt-2 border-t-2 border-ink/20 pt-2">Built on NethermindEth/stellar-risc0-verifier</span>
        </div>
        <div className="flex flex-col md:flex-row flex-wrap gap-4 font-mono font-bold uppercase bg-ink p-4 border-2 border-line">
          <a
            className="text-paper hover:bg-paper hover:text-ink px-3 py-2 transition-colors border-2 border-transparent hover:border-paper"
            href="https://github.com/RAKASAMUD/Prova"
            target="_blank"
            rel="noopener noreferrer"
          >
            GITHUB
          </a>
          <a
            className="text-paper hover:bg-paper hover:text-ink px-3 py-2 transition-colors border-2 border-transparent hover:border-paper"
            href="https://stellar.expert/explorer/testnet"
            target="_blank"
            rel="noopener noreferrer"
          >
            EXPLORER
          </a>
        </div>
      </div>
    </footer>
  );
}
