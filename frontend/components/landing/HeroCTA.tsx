import Link from 'next/link';
import GlareHover from '@/components/effects/GlareHover';

export function HeroCTA() {
  return (
    <Link href="/demo" className="inline-block transition-all hover:translate-y-[4px] hover:translate-x-[4px] shadow-[8px_8px_0px_var(--ink)] hover:shadow-[4px_4px_0px_var(--ink)]">
      <GlareHover
        width="100%"
        height="100%"
        background="var(--neon)"
        borderRadius="0px"
        borderColor="var(--ink)"
        glareColor="#ffffff"
        className="text-ink font-display text-white text-2xl md:text-4xl font-black px-8 py-4 uppercase"
        style={{ border: '4px solid var(--ink)' }}
      >
        Start Proving
      </GlareHover>
    </Link>
  );
}
