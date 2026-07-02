import { HeroText } from './HeroText';
import { HeroCTA } from './HeroCTA';
import { HeroTerminal } from './HeroTerminal';
import ShapeGrid from '@/components/effects/ShapeGrid';

export function Hero() {
  return (
    <section className="relative min-h-[85vh] flex flex-col md:flex-row items-center justify-center p-6 md:p-12 border-b-2 border-line z-10 pt-[100px] overflow-hidden">
      <div className="absolute inset-0 z-0 bg-ink pointer-events-auto">
        <ShapeGrid shape="square" squareSize={30} hoverTrailAmount={2} borderColor="#2A2A2A" hoverFillColor="#00FF41" speed={0.4} />
      </div>
      <div className="absolute inset-0 bg-neon w-2/3 h-3/4 z-0 mix-blend-screen opacity-10 hidden md:block" style={{top: '10%', left: '10%', transform: 'rotate(-2deg)'}}></div>
      <div className="flex-1 w-full max-w-5xl relative z-10">
        <HeroText />
        <HeroCTA />
      </div>
      <div className="relative z-10">
        <HeroTerminal />
      </div>
    </section>
  );
}
