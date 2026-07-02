export function Wall() {
  return (
    <>
      {/* Desktop Vertical Wall */}
      <section className="hidden md:flex w-[10%] border-r-2 border-line flex-col items-center justify-center relative bg-ink min-h-[500px]">
        <div className="absolute inset-y-0 w-1 bg-neon left-1/2 -translate-x-1/2 shadow-[0_0_20px_0_var(--neon)]"></div>
        <div className="font-mono text-sm font-bold text-neon bg-ink py-4 z-10 tracking-widest uppercase" style={{ writingMode: 'vertical-rl' }}>
          THE DIAGNOSIS NEVER CROSSES THIS LINE
        </div>
      </section>
      
      {/* Mobile Horizontal Wall */}
      <div className="md:hidden w-full h-14 bg-ink border-b-2 border-line flex items-center justify-center relative">
        <div className="absolute inset-x-0 h-1 bg-neon top-1/2 -translate-y-1/2 shadow-[0_0_20px_0_var(--neon)]"></div>
        <div className="font-mono text-xs font-bold text-neon bg-ink px-4 py-1 z-10 tracking-widest uppercase whitespace-nowrap">
          THE DIAGNOSIS NEVER CROSSES THIS LINE
        </div>
      </div>
    </>
  );
}
