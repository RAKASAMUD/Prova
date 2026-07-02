import * as StellarSdk from "@stellar/stellar-sdk";
import { config } from "@/lib/config";

const rpc = new StellarSdk.rpc.Server(config.rpcUrl);

export const isValidStellarAddress = (s: string) =>
  StellarSdk.StrKey.isValidEd25519PublicKey(s?.trim() ?? "");

export class StellarNetworkError extends Error {}

export async function checkBadge(address: string): Promise<boolean> {
  if (!config.contractId) throw new Error("Contract ID not set");
  if (!address) throw new Error("Address not set");

  const tx = new StellarSdk.TransactionBuilder(
    new StellarSdk.Account(address, "0"),
    { fee: "100", networkPassphrase: config.networkPassphrase }
  )
    .addOperation(
      StellarSdk.Operation.invokeHostFunction({
        func: StellarSdk.xdr.HostFunction.hostFunctionTypeInvokeContract(
          new StellarSdk.xdr.InvokeContractArgs({
            contractAddress: new StellarSdk.Address(config.contractId).toScAddress(),
            functionName: "has_badge",
            args: [StellarSdk.nativeToScVal(address, { type: "address" })],
          })
        ),
        auth: [],
      })
    )
    .setTimeout(30)
    .build();

  let simulation;
  try {
    simulation = await rpc.simulateTransaction(tx);
  } catch (err: any) {
    throw new StellarNetworkError(err?.message || "Failed to fetch from RPC");
  }

  if (StellarSdk.rpc.Api.isSimulationError(simulation)) {
    const errorMsg = typeof simulation.error === "string" ? simulation.error : JSON.stringify(simulation.error);
    throw new StellarNetworkError(errorMsg);
  }

  if (StellarSdk.rpc.Api.isSimulationSuccess(simulation)) {
    const result = (simulation as any).result?.retval;
    if (result) {
      return StellarSdk.scValToNative(result) as boolean;
    }
  }
  
  // If the contract didn't return a clear boolean value or missing retval
  return false;
}

export async function simulateReclaim(): Promise<string> {
  if (!config.contractId) throw new Error("Contract ID not set");
  if (!config.reclaimCaller) throw new Error("Reclaim caller not set in config");

  const caller = config.reclaimCaller;
  const sealHex = config.reclaimSealHex || "";
  const journalHex = config.reclaimJournalHex || "";

  const tx = new StellarSdk.TransactionBuilder(
    new StellarSdk.Account(caller, "0"),
    { fee: "100", networkPassphrase: config.networkPassphrase }
  )
    .addOperation(
      StellarSdk.Operation.invokeHostFunction({
        func: StellarSdk.xdr.HostFunction.hostFunctionTypeInvokeContract(
          new StellarSdk.xdr.InvokeContractArgs({
            contractAddress: new StellarSdk.Address(config.contractId).toScAddress(),
            functionName: "claim",
            args: [
              StellarSdk.nativeToScVal(caller, { type: "address" }),
              StellarSdk.xdr.ScVal.scvBytes(Buffer.from(sealHex, "hex")),
              StellarSdk.xdr.ScVal.scvBytes(Buffer.from(journalHex, "hex")),
            ],
          })
        ),
        auth: [],
      })
    )
    .setTimeout(30)
    .build();

  let simulation;
  try {
    simulation = await rpc.simulateTransaction(tx);
  } catch (err: any) {
    return err?.message || "Failed to fetch from RPC";
  }

  if (StellarSdk.rpc.Api.isSimulationError(simulation)) {
    return typeof simulation.error === "string" ? simulation.error : JSON.stringify(simulation.error); 
  }
  return "Tx success (unexpected)";
}
