import Link from 'next/link';

export function HeroCTA() {
  return (
    <Link href="/demo">
      <button className="bg-neon text-ink font-display text-2xl md:text-4xl font-bold px-8 py-4 uppercase border-4 border-ink shadow-[8px_8px_0px_var(--ink)] hover:translate-y-[4px] hover:translate-x-[4px] hover:shadow-[4px_4px_0px_var(--ink)] transition-all">
        Start Proving
      </button>
    </Link>
  );
}
