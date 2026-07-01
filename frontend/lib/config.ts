export const config = {
  contractId: process.env.NEXT_PUBLIC_CONTRACT_ID || "",
  rpcUrl: process.env.NEXT_PUBLIC_RPC_URL || "https://soroban-testnet.stellar.org:443",
  networkPassphrase: process.env.NEXT_PUBLIC_NETWORK_PASSPHRASE || "Test SDF Network ; September 2015",
  sampleAddr: process.env.NEXT_PUBLIC_SAMPLE_ADDR || "",
  
  // Simulation mock data for double-claim
  reclaimCaller: process.env.RECLAIM_CALLER || "",
  reclaimSealHex: process.env.RECLAIM_SEAL_HEX || "",
  reclaimJournalHex: process.env.RECLAIM_JOURNAL_HEX || "",
};
