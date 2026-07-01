import { FaqItem } from './FaqItem';

export function Faq() {
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
