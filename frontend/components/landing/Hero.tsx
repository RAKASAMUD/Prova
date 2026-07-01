import { HeroText } from './HeroText';
import { HeroCTA } from './HeroCTA';
import { HeroTerminal } from './HeroTerminal';

export function Hero() {
  return (
    <section className="relative min-h-[85vh] flex flex-col md:flex-row items-center justify-center p-6 md:p-12 border-b-2 border-line z-10 pt-[100px]">
      <div className="absolute inset-0 bg-neon w-2/3 h-3/4 -z-10 mix-blend-screen opacity-10 hidden md:block" style={{top: '10%', left: '10%', transform: 'rotate(-2deg)'}}></div>
      <div className="flex-1 w-full max-w-5xl relative">
        <HeroText />
        <HeroCTA />
      </div>
      <HeroTerminal />
    </section>
  );
}
