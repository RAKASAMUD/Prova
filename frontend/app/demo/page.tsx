"use client";

import Link from "next/link";
import { useState } from "react";
import { checkBadge, simulateReclaim } from "@/lib/stellar";
import { config } from "@/lib/config";

export default function DemoPage() {
  const [targetAddr, setTargetAddr] = useState(config.sampleAddr || "GBX...");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<boolean | null>(null);
  const [revertLog, setRevertLog] = useState<string | null>(null);

  const handleVerify = async () => {
    setLoading(true);
    setResult(null);
    setRevertLog(null);
    try {
      // Simulate fake processing time for dramatic effect
      await new Promise(r => setTimeout(r, 2000));
      const hasBadge = await checkBadge(targetAddr);
      setResult(hasBadge);
    } catch (e: any) {
      console.error(e);
      setRevertLog(e.message || String(e));
      setResult(false);
    } finally {
      setLoading(false);
    }
  };

  const handleTestRevert = async () => {
    setLoading(true);
    setResult(null);
    setRevertLog(null);
    try {
      const errorMsg = await simulateReclaim();
      setRevertLog(errorMsg);
    } catch (e: any) {
      setRevertLog(e.message || String(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-ink text-paper min-h-screen w-full flex flex-col font-sans antialiased">
      {/* Header */}
      <header className="h-[56px] border-b-2 border-line flex justify-between items-center px-6 flex-shrink-0 z-50 bg-ink">
        <div className="font-display font-bold tracking-tighter text-xl">PROVA*</div>
        <Link href="/" className="font-mono text-xs uppercase text-muted hover:text-neon transition-colors flex items-center gap-2">
          ← BACK TO HOME
        </Link>
      </header>

      {/* Main 3-Column Layout */}
      <main className="flex-1 flex flex-col md:flex-row relative">
        {/* LEFT ZONE ( PRIVATE) */}
        <section className="w-full md:w-[45%] bg-paper border-b-2 md:border-b-0 md:border-r-2 border-line p-8 flex flex-col relative">
          <div className="font-mono text-muted-ink mb-12 flex items-center gap-2 font-bold uppercase">
            <span className="text-ink" aria-hidden="true"></span> PRIVATE
          </div>
          <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full text-ink">
            <h2 className="font-display text-4xl md:text-6xl mb-8 font-bold">YOUR IDENTITY.</h2>
            {/* Credential Card */}
            <div className="bg-white border-2 border-ink p-6 relative shadow-[8px_8px_0px_var(--ink)]">
              <div className="absolute -top-3 left-6 bg-white border-2 border-ink px-2 font-mono text-xs font-bold uppercase text-ink">
                ISSUED CREDENTIAL
              </div>
              <div className="space-y-6 mt-4">
                <div className="border-b-2 border-line/20 pb-2">
                  <div className="font-mono text-xs font-bold text-muted-ink mb-1">LEGAL NAME</div>
                  <div className="font-sans text-xl font-bold uppercase">JANE DOE</div>
                </div>
                <div className="border-b-2 border-line/20 pb-2">
                  <div className="font-mono text-xs font-bold text-muted-ink mb-1">DIAGNOSIS CODE</div>
                  <div className="bg-red-deep text-white font-mono text-xs font-bold px-2 py-1 inline-block uppercase line-through decoration-white/50">
                    REDACTED - M79.7
                  </div>
                </div>
                <div>
                  <div className="font-mono text-xs font-bold text-muted-ink mb-1">PROVA ID</div>
                  <div className="font-mono text-xs truncate">did:prova:8f2a...9b1c</div>
                </div>
              </div>
            </div>
            <p className="mt-6 font-mono text-xs font-bold text-muted-ink flex items-center gap-2 uppercase">
              <span aria-hidden="true">🔒</span>
              This never leaves your device.
            </p>
          </div>
        </section>

        {/* CENTER ZONE (THE WALL) — vertical on desktop, horizontal bar on mobile */}
        <section className="hidden md:flex w-[10%] border-r-2 border-line flex-col items-center justify-center relative bg-ink min-h-[500px]">
          <div className="absolute inset-y-0 w-1 bg-neon left-1/2 -translate-x-1/2 shadow-[0_0_20px_0_var(--neon)]"></div>
          <div className="font-mono text-sm font-bold text-neon bg-ink py-4 z-10 tracking-widest uppercase" style={{ writingMode: 'vertical-rl' }}>
            THE DIAGNOSIS NEVER CROSSES THIS LINE
          </div>
        </section>
        <div className="md:hidden w-full h-14 bg-ink border-b-2 border-line flex items-center justify-center relative">
          <div className="absolute inset-x-0 h-1 bg-neon top-1/2 -translate-y-1/2 shadow-[0_0_20px_0_var(--neon)]"></div>
          <div className="font-mono text-xs font-bold text-neon bg-ink px-4 py-1 z-10 tracking-widest uppercase whitespace-nowrap">
            THE DIAGNOSIS NEVER CROSSES THIS LINE
          </div>
        </div>

        {/* RIGHT ZONE ( PUBLIC) */}
        <section className="w-full md:w-[45%] p-8 flex flex-col relative bg-ink text-paper min-h-[600px]">
          <div className="font-mono text-muted mb-12 flex items-center gap-2 font-bold uppercase">
            <span className="text-neon" aria-hidden="true"></span> PUBLIC
          </div>
          <div className="flex-1 flex flex-col justify-center max-w-md w-full ml-0 md:ml-12">
            {/* Verification Input */}
            <div className="mb-12">
              <div className="border-b-2 border-line pb-2 focus-within:border-neon transition-colors">
                <label htmlFor="target-address" className="block font-mono text-xs font-bold text-muted mb-2 uppercase">Target Address</label>
                <input
                  id="target-address"
                  className="w-full bg-transparent border-none outline-none font-mono text-paper p-0"
                  type="text"
                  value={targetAddr}
                  onChange={(e) => setTargetAddr(e.target.value)}
                  placeholder="Enter Stellar address (G...)"
                />
              </div>
              <p className="mt-2 text-xs font-mono text-muted">
                *Enter any Stellar account address (G...) to check if it holds a verified Prova soulbound badge on the testnet.
              </p>
              <button
                onClick={handleVerify}
                disabled={loading}
                aria-busy={loading}
                className="mt-4 bg-neon text-ink font-sans font-bold uppercase px-6 py-3 flex items-center justify-between w-full hover:bg-neon-hi transition-colors disabled:opacity-50"
              >
                {loading ? "CHECKING ON-CHAIN..." : "VERIFY BADGE →"}
              </button>

              <button
                onClick={handleTestRevert}
                disabled={loading}
                aria-busy={loading}
                className="mt-4 bg-transparent border-2 border-red text-red font-sans font-bold uppercase px-6 py-3 flex items-center justify-between w-full hover:bg-red/10 transition-colors disabled:opacity-50"
              >
                TEST REVERT (DOUBLE CLAIM)
              </button>
            </div>

            <div aria-live="polite" role="status">
            {/* Verification Result */}
            {result === true && !loading && (
              <div className="border-2 border-neon p-6 relative shadow-[8px_8px_0px_var(--neon)] bg-surface">
                <div className="absolute -top-3 left-6 bg-surface px-2 font-mono text-xs font-bold text-neon flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-neon shadow-[0_0_10px_0_var(--neon)]"></div>
                  VERIFIED
                </div>
                <div className="mt-4 space-y-6">
                  <div className="flex items-center gap-4">
                    <span className="text-neon text-3xl">✓</span>
                    <div className="font-sans text-lg font-bold uppercase text-neon">VERIFIED DISABLED CREATOR</div>
                  </div>
                  <div className="bg-ink p-4 font-mono text-xs text-muted whitespace-pre border border-line overflow-x-auto">
{`{
  "eligible": true,
  "has_badge": true,
  "target": "${targetAddr.substring(0, 10)}..."
}`}
                  </div>
                  {config.contractId && (
                    <a
                      href={`https://stellar.expert/explorer/testnet/contract/${config.contractId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-xs font-bold text-neon hover:text-neon-hi uppercase inline-flex items-center gap-2"
                    >
                      VIEW CONTRACT ON STELLAR EXPERT ↗
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Rejected State */}
            {result === false && !loading && !revertLog && (
              <div className="border-2 border-red p-6 relative bg-surface">
                <div className="absolute -top-3 left-6 bg-surface px-2 font-mono text-xs font-bold text-red">
                  UNVERIFIED
                </div>
                <div className="mt-4 flex items-center gap-2 font-mono text-xs font-bold text-red uppercase">
                  <span>✗</span>
                  NO BADGE FOUND ON TARGET
                </div>
                <div className="mt-2 text-muted font-mono text-xs uppercase">
                  Target address does not hold a Prova badge.
                </div>
              </div>
            )}
            
            {/* Revert / Error State */}
            {revertLog && !loading && (
              <div className="mt-8 border-2 border-red p-6 relative bg-surface overflow-x-auto">
                <div className="absolute -top-3 left-6 bg-surface px-2 font-mono text-xs font-bold text-red">
                  REVERTED
                </div>
                <div className="mt-4 flex items-center gap-2 font-mono text-xs font-bold text-red uppercase">
                  <span>✗</span>
                  TX FAILED
                </div>
                <div className="mt-2 text-red font-mono text-xs break-all">
                  {revertLog}
                </div>
              </div>
            )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
