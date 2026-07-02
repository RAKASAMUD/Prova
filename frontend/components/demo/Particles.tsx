"use client";

import { useEffect, useState } from "react";
import "./particles.css";

export function Particles() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Generate deterministic but pseudo-random arrays for SSR consistency (though we only render mounted)
  const redParticles = Array.from({ length: 15 }).map((_, i) => ({
    id: `red-${i}`,
    top: `${10 + (i * 7) % 80}%`,
    delay: `${(i * 0.4) % 5}s`,
    duration: `${3 + (i % 3)}s`,
  }));

  const violetParticles = Array.from({ length: 15 }).map((_, i) => ({
    id: `violet-${i}`,
    top: `${20 + (i * 9) % 70}%`,
    delay: `${(i * 0.7) % 5}s`,
    duration: `${4 + (i % 4)}s`,
  }));

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-50" aria-hidden="true">
      <div className="particles-container w-full h-full relative">
        {redParticles.map((p) => (
          <div
            key={p.id}
            className="particle particle-red absolute w-1 h-1 bg-red-deep rounded-full shadow-[0_0_5px_var(--red)]"
            style={{
              top: p.top,
              animationDelay: p.delay,
              animationDuration: p.duration,
            }}
          />
        ))}

        {violetParticles.map((p) => (
          <div
            key={p.id}
            className="particle particle-violet absolute w-1 h-1 bg-neon rounded-full shadow-[0_0_5px_var(--neon)]"
            style={{
              top: p.top,
              animationDelay: p.delay,
              animationDuration: p.duration,
            }}
          />
        ))}
      </div>
    </div>
  );
}
