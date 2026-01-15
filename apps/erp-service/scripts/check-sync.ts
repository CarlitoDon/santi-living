import fs from "fs";
import path from "path";
import crypto from "crypto";

const CONTRACT_FILE = path.join(__dirname, "../sync-contract.json");
// Adjust path relative to where this script is run (likely from project root) or relative to __dirname
// Assuming this is in apps/erp-service/img/scripts -> ../../../sync-erp
// But project structure is apps/erp-service/scripts/check-sync.ts
// So sync-erp is at ../../../../sync-erp
const REMOTE_REPO_PATH = path.resolve(__dirname, "../../../../sync-erp");
const ROUTER_PATH = path.join(
  REMOTE_REPO_PATH,
  "apps/api/src/trpc/routers/public-rental.router.ts"
);

function calculateFileHash(filePath: string): string {
  const fileBuffer = fs.readFileSync(filePath);
  const hashSum = crypto.createHash("md5");
  hashSum.update(fileBuffer);
  return hashSum.digest("hex");
}

function main() {
  console.log("🔍 [Sync Check] Verifying backend contract...");

  if (!fs.existsSync(REMOTE_REPO_PATH)) {
    console.log(
      "⚠️  [Sync Check] Sync ERP repo not found locally. Skipping check (Deploy/CI mode)."
    );
    process.exit(0);
  }

  if (!fs.existsSync(ROUTER_PATH)) {
    console.error(
      `❌ [Sync Check] Sync ERP repo found, but router file missing at: ${ROUTER_PATH}`
    );
    // If repo exists but file is moved, that's a breaking change too!
    process.exit(1);
  }

  const currentHash = calculateFileHash(ROUTER_PATH);

  let contract: { publicRentalRouterHash: string };
  try {
    contract = JSON.parse(fs.readFileSync(CONTRACT_FILE, "utf-8"));
  } catch (error) {
    console.error("❌ [Sync Check] Could not read sync-contract.json");
    process.exit(1);
    return;
  }

  if (currentHash !== contract.publicRentalRouterHash) {
    console.error(
      "\n🚨🚨🚨 [Sync Check] CRITICAL: Backend Logic Changed! 🚨🚨🚨"
    );
    console.error(`Local Hash:   ${contract.publicRentalRouterHash}`);
    console.error(`Remote Hash:  ${currentHash}`);
    console.error(
      "\nThe public-rental.router.ts in sync-erp has been modified."
    );
    console.error(
      "Your local contract types in src/types/sync-erp.ts might be OUTDATED."
    );
    console.error("\n👉 ACTION REQUIRED:");
    console.error(
      "1. Compare sync-erp backend changes with src/types/sync-erp.ts"
    );
    console.error("2. Update your local types if necessary.");
    console.error("3. Update sync-contract.json with the new hash:");
    console.error(`   "publicRentalRouterHash": "${currentHash}"`);
    console.error("\nBuild BLOCKED for safety.\n");
    process.exit(1);
  }

  console.log(
    "✅ [Sync Check] Contract matches backend snapshot. Safe to build."
  );
  process.exit(0);
}

main();
