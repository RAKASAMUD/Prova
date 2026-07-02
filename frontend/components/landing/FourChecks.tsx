"use client";

import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const checks = [
  { title: "FAKE GUEST", desc: "The contract stores a trusted image ID. Proofs from any other program are rejected." },
  { title: "FORGED ELIGIBILITY", desc: "The contract holds the set of valid commitments. Unknown commitments are rejected." },
  { title: "CROSS-CONTRACT REPLAY", desc: "The proof binds the target contract. Any other address is rejected." },
  { title: "DOUBLE CLAIM", desc: "A one-time nullifier is spent on mint. The same proof can never mint twice." }
];

export function FourChecks() {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const rows = gsap.utils.toArray<HTMLElement>(".check-row");
      
      rows.forEach((row) => {
        const title = row.querySelector(".check-title");
        const desc = row.querySelector(".check-desc");
        
        // 1. Text mask wipe from left to right for the title
        gsap.fromTo(title,
          { clipPath: "inset(0 100% 0 0)" },
          {
            clipPath: "inset(0 0% 0 0)",
            ease: "none",
            scrollTrigger: {
              trigger: row,
              start: "top 75%",
              end: "top 40%",
              scrub: 0.6,
              // markers: true, // Uncomment for development debugging
            }
          }
        );

        // 2. Description fades in and slides slightly up
        gsap.fromTo(desc,
          { autoAlpha: 0, y: 8 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.4,
            ease: "power2.out",
            scrollTrigger: {
              trigger: row,
              start: "top 45%", // Triggers later in the scroll compared to the title
              toggleActions: "play none none reverse",
              // markers: true, // Uncomment for development debugging
            }
          }
        );
      });
    });

    mm.add("(prefers-reduced-motion: reduce)", () => {
      gsap.set(".check-title", { clipPath: "inset(0 0% 0 0)" });
      gsap.set(".check-desc", { autoAlpha: 1, y: 0 });
    });

  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="p-8 md:p-16 bg-surface border-t-2 border-line relative z-10 min-h-screen">
      <div className="max-w-[1400px] mx-auto w-full">
        
        <div className="section-header mb-32 md:mb-48">
          <div className="font-mono font-bold text-neon uppercase mb-8 border-b-2 border-line inline-block pb-1 text-xl">03 — DEFENSE</div>
          <h2 className="font-display font-black text-4xl md:text-6xl text-paper uppercase tracking-[-0.04em]">Four checks. Four attacks closed.</h2>
        </div>
        
        <div className="flex flex-col gap-40 md:gap-64 pb-48">
          {checks.map((check, i) => (
            <div key={i} className="check-row flex flex-col items-center text-center w-full">
              <h3 className="check-title font-display font-black text-4xl md:text-6xl tracking-[-0.04em] text-neon uppercase mb-8 whitespace-nowrap">
                {check.title}
              </h3>
              <p className="check-desc font-sans text-white text-lg md:text-2xl max-w-3xl leading-relaxed text-justify">
                {check.desc}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
