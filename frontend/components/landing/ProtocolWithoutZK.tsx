export function ProtocolWithoutZK() {
  return (
    <div className="p-8 md:p-16 lg:p-24 lg:border-r-2 border-line bg-paper relative overflow-hidden group h-full">
      <div className="relative z-10 h-full flex flex-col justify-start">
        <div>
          <div className="font-mono font-bold text-ink uppercase mb-8 border-b-4 border-ink inline-block pb-1 text-xl bg-paper px-2">02 — PROTOCOL</div>
          <h2 className="font-display font-black text-6xl md:text-8xl leading-none md:leading-none mb-12 lg:mb-24 text-red-deep uppercase tracking-[-0.04em] break-words">WITHOUT<br/>ZK</h2>
        </div>
        <div className="border-2 border-ink bg-paper shadow-[12px_12px_0px_var(--ink)] relative z-20 max-w-lg transform -rotate-1 group-hover:rotate-0 transition-transform">
          <div className="bg-paper p-6 m-2 border-2 border-ink relative">
            <div className="absolute -top-4 -right-4 bg-red-deep text-white font-mono font-bold text-sm px-3 py-2 border-2 border-ink shadow-[4px_4px_0px_var(--ink)] transform rotate-3">
              VULNERABLE
            </div>
            <div className="space-y-6 font-mono text-ink text-base mt-4">
              <div className="flex justify-between items-end border-b-2 border-ink/20 pb-2">
                <span className="font-bold">NAME:</span>
                <span className="bg-ink text-paper px-2 py-1">JANE DOE██</span>
              </div>
              <div className="flex justify-between items-end border-b-2 border-red-deep pb-2 bg-red-deep/10 -mx-2 px-2 pt-2">
                <span className="text-red-deep font-bold">DIAGNOSIS:</span>
                <span className="text-red-deep font-bold bg-paper px-1">EXPOSED_MEDICAL_DATA</span>
              </div>
              <div className="flex justify-between items-end border-b-2 border-ink/20 pb-2">
                <span className="font-bold">ID:</span>
                <span className="bg-ink text-paper px-2 py-1">492-XXX-██</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
