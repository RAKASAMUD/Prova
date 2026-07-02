"use client";
import { useId, useState } from 'react';

export function FaqItem({q, a}: {q:string, a:string}) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  return (
    <div className="border-b border-line">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen(!open)}
        className="w-full py-6 flex justify-between items-center gap-4 text-left cursor-pointer"
      >
        <span className="font-mono font-bold text-paper uppercase">{q}</span>
        <span className="text-neon font-bold" aria-hidden="true">{open ? "−" : "+"}</span>
      </button>
      {open && (
        <p id={panelId} className="font-sans text-white text-base md:text-lg pb-6 max-w-[70ch] leading-relaxed text-justify">
          {a}
        </p>
      )}
    </div>
  );
}
