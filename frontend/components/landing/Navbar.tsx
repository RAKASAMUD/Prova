import Link from 'next/link';

export function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 bg-neon border-b-2 border-line flex justify-between items-center px-4 py-3 md:py-2">
      <div className="font-display text-3xl md:text-5xl font-bold text-ink tracking-tighter uppercase leading-none">
        PROVA*
      </div>
      <div className="flex items-center gap-4 font-mono font-bold text-ink uppercase text-xs md:text-sm">
        <a className="hover:bg-paper hover:text-neon px-2 py-1 transition-colors duration-0 border border-transparent hover:border-paper hidden md:block" href="#">GITHUB ↗</a>
        <Link href="/demo" className="bg-ink text-paper px-4 py-2 border-2 border-ink hover:bg-paper hover:text-ink transition-colors duration-0 shadow-[4px_4px_0px_var(--ink)]">
          SEE DEMO →
        </Link>
      </div>
    </nav>
  );
}
