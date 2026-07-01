import { Navbar } from '@/components/landing/Navbar';
import { Hero } from '@/components/landing/Hero';
import { Ticker } from '@/components/landing/Ticker';
import { ProtocolSection } from '@/components/landing/ProtocolSection';
import { FourChecks } from '@/components/landing/FourChecks';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { Faq } from '@/components/landing/Faq';
import { Footer } from '@/components/landing/Footer';

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <main className="pt-[60px] md:pt-[72px] w-full mx-auto border-x-2 border-line max-w-[1600px] bg-ink min-h-screen relative overflow-hidden">
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


