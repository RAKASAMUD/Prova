import { Navbar } from '@/components/landing/Navbar';
import { Hero } from '@/components/landing/Hero';
import { Ticker } from '@/components/landing/Ticker';
import { ProtocolSection } from '@/components/landing/ProtocolSection';
import { FourChecks } from '@/components/landing/FourChecks';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { Faq } from '@/components/landing/Faq';
import { Footer } from '@/components/landing/Footer';
import ShapeGrid from '@/components/effects/ShapeGrid';

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <div className="fixed inset-0 z-[-1] bg-ink pointer-events-auto">
        <ShapeGrid 
          shape="hexagon"
          squareSize={40}
          borderColor="#2A2A2A"
          hoverFillColor="#00FF41"
          hoverTrailAmount={3}
          speed={0.5}
        />
      </div>
      <main className="pt-[60px] md:pt-[72px] w-full mx-auto border-x-2 border-line max-w-[1600px] min-h-screen relative overflow-hidden pointer-events-none *:pointer-events-auto">
        <Hero />
        <Ticker />
        <ProtocolSection />
        <FourChecks />
        <HowItWorks />
        <Faq />
      </main>
      <Footer />
    </>
  );
}


