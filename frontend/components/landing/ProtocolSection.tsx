import { ProtocolWithoutZK } from './ProtocolWithoutZK';
import { ProtocolWithProva } from './ProtocolWithProva';

export function ProtocolSection() {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-2 relative min-h-screen">
      <ProtocolWithoutZK />
      <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-8 flex-col items-center justify-center z-30 pointer-events-none">
        <div className="h-full w-2 bg-neon border-x-2 border-ink"></div>
        <div className="absolute bg-neon text-ink py-6 px-3 font-mono font-bold text-sm tracking-widest writing-vertical-rl border-4 border-ink shadow-[8px_8px_0px_var(--ink)] whitespace-nowrap uppercase">
          THE DIAGNOSIS NEVER CROSSES THIS LINE
        </div>
      </div>
      <div className="lg:hidden w-full h-16 bg-neon border-y-2 border-ink flex items-center justify-center relative z-30">
        <div className="bg-neon text-ink py-1 px-4 font-mono font-bold text-sm tracking-widest border-2 border-ink shadow-[4px_4px_0px_var(--ink)] whitespace-nowrap uppercase">
          THE DIAGNOSIS NEVER CROSSES THIS LINE
        </div>
      </div>
      <ProtocolWithProva />
    </section>
  );
}
