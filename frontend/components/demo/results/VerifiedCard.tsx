import { FIXTURE } from "@/lib/fixture";

export function VerifiedCard({
  addr,
  isSample,
  onTestRevert,
  loadingRevert,
}: {
  addr: string;
  isSample: boolean;
  onTestRevert: () => void;
  loadingRevert: boolean;
}) {
  return (
    <div className="border-2 border-neon p-6 relative shadow-[8px_8px_0px_var(--neon)] bg-surface">
      <div className="absolute -top-3 left-6 bg-surface px-2 font-mono text-xs font-bold text-neon flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-neon shadow-[0_0_10px_0_var(--neon)]"></div>
        VERIFIED
      </div>
      <div className="mt-4 space-y-6">
        <div className="flex items-center gap-4">
          <span className="text-neon text-3xl">✓</span>
          <div className="font-sans text-lg font-bold uppercase text-neon">
            VERIFIED DISABLED CREATOR
          </div>
        </div>

        {isSample && (
          <div className="bg-ink p-4 font-mono text-xs text-muted whitespace-pre border border-line overflow-x-auto">
            <div className="mb-2 text-neon-hi">JOURNAL — FROM CLAIM TX 7efdbe3…</div>
{`{
  "eligible": ${FIXTURE.eligible},
  "nullifier": "${FIXTURE.nullifier.substring(0, 10)}...",
  "target": "${FIXTURE.target.substring(0, 10)}..."
}`}
          </div>
        )}

        <div className="flex flex-col gap-3">
          {isSample && (
            <a
              href={`https://stellar.expert/explorer/testnet/tx/7efdbe322e86599451e3ac7341ca887182f53deb9f271172110c1db699bead9d`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-xs font-bold text-neon hover:text-neon-hi uppercase inline-flex items-center gap-2"
            >
              VIEW CLAIM TX ↗
            </a>
          )}
          
          {isSample && (
            <button
              onClick={onTestRevert}
              disabled={loadingRevert}
              className="mt-2 border-2 border-neon text-neon font-sans font-bold uppercase px-4 py-2 text-sm hover:bg-neon/10 transition-colors disabled:opacity-50 text-left"
            >
              {loadingRevert ? "PROCESSING..." : "TRY TO CLAIM AGAIN"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
