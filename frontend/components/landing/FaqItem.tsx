"use client";
import { useState } from 'react';

export function FaqItem({q, a}: {q:string, a:string}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-line py-6 cursor-pointer" onClick={() => setOpen(!open)}>
      <div className="flex justify-between items-center mb-4">
        <span className="font-mono font-bold text-paper uppercase">{q}</span>
        <span className="text-neon font-bold">{open ? "-" : "+"}</span>
      </div>
      {open && <p className="font-sans text-muted text-sm">{a}</p>}
    </div>
  );
}
