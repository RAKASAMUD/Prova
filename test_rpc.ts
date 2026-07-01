import { checkBadge } from "./frontend/services/stellar";

async function run() {
  const address = "GDWG5G5IWFIFESNPFH3LFDNHO2RZUGUUMWGZVEN2YCNYOCT6HBXQEDAF";
  console.log("Checking:", address);
  try {
    const res = await checkBadge(address);
    console.log("Result:", res);
  } catch (e) {
    console.error(e);
  }
}
run();
