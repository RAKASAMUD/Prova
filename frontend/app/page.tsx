import Link from 'next/link';
import { FaqItem } from '@/components/landing/FaqItem';
import { Navbar } from '@/components/landing/Navbar';
import { HeroText } from '@/components/landing/HeroText';
import { HeroCTA } from '@/components/landing/HeroCTA';
import { HeroTerminal } from '@/components/landing/HeroTerminal';
import { Ticker } from '@/components/landing/Ticker';
import { ProtocolSection } from '@/components/landing/ProtocolSection';

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

function Hero() {
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



function FourChecks() {
  return (
    <section className="p-8 md:p-16 bg-surface border-t-2 border-line relative z-10">
      <div className="max-w-[1600px] mx-auto">
        <div className="font-mono font-bold text-neon uppercase mb-8 border-b-2 border-line inline-block pb-1 text-xl">§03 — DEFENSE</div>
        <h2 className="font-display text-4xl md:text-6xl mb-12 text-paper uppercase tracking-tighter">Four checks. Four attacks closed.</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-line border border-line">
          <div className="bg-surface p-8">
            <div className="font-mono font-bold text-4xl text-neon mb-4">01</div>
            <div className="font-mono font-bold text-paper uppercase mb-2">FAKE GUEST</div>
            <p className="font-sans text-muted text-sm">The contract stores a trusted image ID. Proofs from any other program are rejected.</p>
          </div>
          <div className="bg-surface p-8">
            <div className="font-mono font-bold text-4xl text-neon mb-4">02</div>
            <div className="font-mono font-bold text-paper uppercase mb-2">FORGED ELIGIBILITY</div>
            <p className="font-sans text-muted text-sm">The contract holds the set of valid commitments. Unknown commitments are rejected.</p>
          </div>
          <div className="bg-surface p-8">
            <div className="font-mono font-bold text-4xl text-neon mb-4">03</div>
            <div className="font-mono font-bold text-paper uppercase mb-2">CROSS-CONTRACT REPLAY</div>
            <p className="font-sans text-muted text-sm">The proof binds the target contract. Any other address is rejected.</p>
          </div>
          <div className="bg-surface p-8">
            <div className="font-mono font-bold text-4xl text-neon mb-4">04</div>
            <div className="font-mono font-bold text-paper uppercase mb-2">DOUBLE CLAIM</div>
            <p className="font-sans text-muted text-sm">A one-time nullifier is spent on mint. The same proof can never mint twice.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  return (
    <section className="p-8 md:p-16 bg-paper border-t-2 border-line relative z-10">
      <div className="max-w-[1600px] mx-auto">
        <div className="font-mono font-bold text-ink uppercase mb-8 border-b-2 border-line inline-block pb-1 text-xl">§04 — FLOW</div>
        <h2 className="font-display text-4xl md:text-6xl mb-16 text-ink uppercase tracking-tighter">How it works.</h2>
        <div className="relative">
          <div className="absolute top-12 left-0 w-full h-px bg-line hidden md:block"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            <div className="bg-paper">
              <div className="font-mono font-bold text-6xl text-neon mb-6 relative bg-paper inline-block pr-4">01</div>
              <div className="font-mono font-bold text-ink uppercase mb-2">ISSUER REGISTERS</div>
              <p className="font-sans text-ink/70 text-sm">A trusted issuer registers a hash of your credential on-chain. Your document never leaves you.</p>
            </div>
            <div className="bg-paper">
              <div className="font-mono font-bold text-6xl text-neon mb-6 relative bg-paper inline-block px-4">02</div>
              <div className="font-mono font-bold text-ink uppercase mb-2">YOU PROVE PRIVATELY</div>
              <p className="font-sans text-ink/70 text-sm">Inside the RISC Zero zkVM, your device computes a commitment and nullifier. Your secret never leaves the machine.</p>
            </div>
            <div className="bg-paper">
              <div className="font-mono font-bold text-6xl text-neon mb-6 relative bg-paper inline-block pl-4">03</div>
              <div className="font-mono font-bold text-ink uppercase mb-2">STELLAR VERIFIES &amp; MINTS</div>
              <p className="font-sans text-ink/70 text-sm">The Soroban contract verifies the Groth16 proof and mints your soulbound badge.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Faq() {
  const faqs = [
    { q: "DOES THE PROVING SERVICE SEE MY SECRET?", a: "During proof generation, yes — but the secret is a random number with no medical or identity content. Client-side proving is an open path that needs no contract change." },
    { q: "CAN THE BADGE BE SOLD OR SYBIL-FARMED?", a: "Out of scope, and we say so openly. One claim per contract limits abuse." },
    { q: "WHY STELLAR?", a: "Groth16 BN254 verification runs natively via Protocol 25/26 host functions. The badge is issued as an on-chain credential." },
    { q: "IS THE ISSUER REAL?", a: "A simulated mock authority. KYC and credential issuance are out of scope — Prova is the verifier, not the passport office." },
    { q: "IS THIS AUDITED?", a: "No. This is a hackathon proof-of-concept and has not been audited." }
  ];

  return (
    <section className="p-8 md:p-16 bg-surface border-t-2 border-line relative z-10">
      <div className="max-w-[1600px] mx-auto">
        <div className="font-mono font-bold text-neon uppercase mb-8 border-b-2 border-line inline-block pb-1 text-xl">§05 — HONESTY</div>
        <h2 className="font-display text-4xl md:text-6xl mb-12 text-paper uppercase tracking-tighter">Questions worth asking.</h2>
        <div className="border-t border-line">
          {faqs.map((f, i) => (
            <FaqItem key={i} q={f.q} a={f.a} />
          ))}
        </div>
      </div>
    </section>
  );
}



function Footer() {
  return (
    <footer className="w-full bg-neon text-ink border-t-4 border-ink flex flex-col items-center py-8 px-4 gap-8 mx-auto relative z-50">
      <div className="w-full max-w-[1600px] flex flex-col md:flex-row justify-between items-center md:items-start gap-8">
        <div className="font-display text-6xl text-ink font-bold tracking-tighter bg-neon px-4 py-2 border-2 border-ink shadow-[6px_6px_0px_var(--ink)]">
          PROVA*
        </div>
        <div className="font-mono font-bold uppercase text-center md:text-left flex flex-col gap-2 bg-paper text-ink p-4 border-2 border-ink shadow-[4px_4px_0px_var(--ink)]">
          <span className="bg-ink text-white px-2 py-1 self-center md:self-start mb-2">© 2026 PROVA ON STELLAR.</span>
          <span className="font-black text-red">TESTNET DISCLAIMER: EXPERIMENTAL PROTOCOL. NOT AUDITED.</span>
          <span className="text-xs mt-2 border-t-2 border-ink/20 pt-2">Built on NethermindEth/stellar-risc0-verifier</span>
        </div>
        <div className="flex flex-col md:flex-row flex-wrap gap-4 font-mono font-bold uppercase bg-ink p-4 border-2 border-line">
          <a className="text-paper hover:bg-paper hover:text-ink px-3 py-2 transition-colors border-2 border-transparent hover:border-paper" href="#">DOCUMENTATION</a>
          <a className="text-paper hover:bg-paper hover:text-ink px-3 py-2 transition-colors border-2 border-transparent hover:border-paper" href="#">EXPLORER</a>
          <a className="text-paper hover:bg-paper hover:text-ink px-3 py-2 transition-colors border-2 border-transparent hover:border-paper" href="#">GITHUB</a>
          <a className="text-paper hover:bg-paper hover:text-ink px-3 py-2 transition-colors border-2 border-transparent hover:border-paper" href="#">TELEGRAM</a>
        </div>
      </div>
    </footer>
  );
}
