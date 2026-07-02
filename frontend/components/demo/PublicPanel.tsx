import { useState } from "react";
import { VerifiedCard } from "./results/VerifiedCard";
import { NoBadgeCard } from "./results/NoBadgeCard";
import { InvalidCard } from "./results/InvalidCard";
import { NetworkErrorCard } from "./results/NetworkErrorCard";
import { RejectedCard } from "./results/RejectedCard";

export type DemoState =
  | { kind: "idle" }
  | { kind: "checking" }
  | { kind: "verified"; addr: string; isSample: boolean }
  | { kind: "no_badge"; addr: string }
  | { kind: "invalid_address" }
  | { kind: "network_error"; detail: string }
  | { kind: "rejected"; detail: string };

interface PublicPanelProps {
  targetAddr: string;
  setTargetAddr: (addr: string) => void;
  onVerify: () => void;
  state: DemoState;
  onTestRevert: () => void;
  loadingRevert: boolean;
}

export function PublicPanel({
  targetAddr,
  setTargetAddr,
  onVerify,
  state,
  onTestRevert,
  loadingRevert,
}: PublicPanelProps) {
  const isChecking = state.kind === "checking";

  return (
    <section className="w-full md:w-[45%] p-8 flex flex-col relative bg-ink text-paper min-h-[600px]">
      <div className="font-mono text-muted mb-12 flex items-center gap-2 font-bold uppercase">
        <span className="text-neon" aria-hidden="true"></span> PUBLIC
      </div>
      <div className="flex-1 flex flex-col justify-center max-w-md w-full ml-0 md:ml-12">
        {/* Verification Input */}
        <div className="mb-12">
          <div className="border-b-2 border-line pb-2 focus-within:border-neon transition-colors">
            <label htmlFor="target-address" className="block font-mono text-xs font-bold text-muted mb-2 uppercase">
              Target Address
            </label>
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
            *Pre-filled with a creator who claimed via a real Groth16 proof.
          </p>
          <button
            onClick={onVerify}
            disabled={isChecking}
            aria-busy={isChecking}
            className="mt-4 bg-neon text-ink font-sans font-bold uppercase px-6 py-3 flex items-center justify-between w-full hover:bg-neon-hi transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isChecking ? "CHECKING ON-CHAIN..." : "VERIFY BADGE →"}
          </button>
        </div>

        <div aria-live="polite" role="status">
          {state.kind === "checking" && (
            <div className="border-2 border-line p-6 bg-surface opacity-50 animate-pulse">
              <div className="h-4 bg-line w-1/4 mb-4"></div>
              <div className="h-8 bg-line w-3/4"></div>
            </div>
          )}

          {state.kind === "verified" && (
            <VerifiedCard 
              addr={state.addr} 
              isSample={state.isSample} 
              onTestRevert={onTestRevert}
              loadingRevert={loadingRevert}
            />
          )}

          {state.kind === "no_badge" && <NoBadgeCard />}

          {state.kind === "invalid_address" && <InvalidCard />}

          {state.kind === "network_error" && (
            <NetworkErrorCard detail={state.detail} />
          )}

          {state.kind === "rejected" && (
            <RejectedCard detail={state.detail} />
          )}
        </div>
      </div>
    </section>
  );
}
