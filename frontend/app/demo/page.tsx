"use client";

import Link from "next/link";
import { useState } from "react";
import { checkBadge, simulateReclaim, isValidStellarAddress, StellarNetworkError } from "@/lib/stellar";
import { config } from "@/lib/config";
import { PrivateCard } from "@/components/demo/PrivateCard";
import { Wall } from "@/components/demo/Wall";
import { PublicPanel, DemoState } from "@/components/demo/PublicPanel";

export default function DemoPage() {
  const [targetAddr, setTargetAddr] = useState(config.sampleAddr || "");
  const [state, setState] = useState<DemoState>({ kind: "idle" });
  const [loadingRevert, setLoadingRevert] = useState(false);

  const handleVerify = async () => {
    const addr = targetAddr.trim();
    if (!isValidStellarAddress(addr)) {
      setState({ kind: "invalid_address" });
      return;
    }

    setState({ kind: "checking" });
    try {
      // NOTE: Removed artificial delay. Speed is determined by actual RPC latency.
      const hasBadge = await checkBadge(addr);
      if (hasBadge) {
        setState({ 
          kind: "verified", 
          addr, 
          isSample: addr === config.sampleAddr 
        });
      } else {
        setState({ kind: "no_badge", addr });
      }
    } catch (e: any) {
      if (e instanceof StellarNetworkError) {
        setState({ kind: "network_error", detail: e.message });
      } else {
        // Fallback for unexpected errors
        setState({ kind: "network_error", detail: e.message || String(e) });
      }
    }
  };

  const handleTestRevert = async () => {
    setLoadingRevert(true);
    try {
      const errorMsg = await simulateReclaim();
      setState({ kind: "rejected", detail: errorMsg });
    } catch (e: any) {
      setState({ kind: "rejected", detail: e.message || String(e) });
    } finally {
      setLoadingRevert(false);
    }
  };

  return (
    <div className="bg-ink text-paper min-h-screen w-full flex flex-col font-sans antialiased">
      {/* Header */}
      <header className="h-14 border-b-2 border-line flex justify-between items-center px-6 flex-shrink-0 z-50 bg-ink">
        <div className="font-display font-bold tracking-tighter text-xl">PROVA*</div>
        <Link href="/" className="font-mono text-xs uppercase text-muted hover:text-neon transition-colors flex items-center gap-2">
          ← BACK TO HOME
        </Link>
      </header>

      {/* Main 3-Column Layout */}
      <main className="flex-1 flex flex-col md:flex-row relative">
        {/* LEFT ZONE ( PRIVATE ) */}
        <section className="w-full md:w-[45%] bg-paper border-b-2 md:border-b-0 md:border-r-2 border-line p-8 flex flex-col relative">
          <div className="font-mono text-muted-ink mb-12 flex items-center gap-2 font-bold uppercase">
            <span className="text-ink" aria-hidden="true"></span> PRIVATE
          </div>
          <PrivateCard />
        </section>

        {/* CENTER ZONE ( THE WALL ) */}
        <Wall />

        {/* RIGHT ZONE ( PUBLIC ) */}
        <PublicPanel 
          targetAddr={targetAddr}
          setTargetAddr={setTargetAddr}
          onVerify={handleVerify}
          state={state}
          onTestRevert={handleTestRevert}
          loadingRevert={loadingRevert}
        />
      </main>
    </div>
  );
}
