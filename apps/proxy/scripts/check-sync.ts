import fs from "fs";
import path from "path";
import crypto from "crypto";

const CONTRACT_FILE = path.join(__dirname, "../sync-contract.json");
// Adjust path relative to where this script is run (likely from project root) or relative to __dirname
// Assuming this is in apps/proxy/img/scripts -> ../../../sync-erp
// But project structure is apps/proxy/scripts/check-sync.ts
// So sync-erp is at ../../../../sync-erp
const REMOTE_REPO_PATH = path.resolve(__dirname, "../../../../sync-erp");
const ROUTER_PATHS = [
  "apps/api/src/trpc/routers/public-rental.router.ts",
  "apps/api/src/trpc/routers/public-rental/public-rental-partner.router.ts",
  "apps/api/src/trpc/routers/public-rental/public-rental-order.router.ts",
  "apps/api/src/trpc/routers/public-rental/public-rental-payment.router.ts",
].map((relativePath) => path.join(REMOTE_REPO_PATH, relativePath));

function calculateFileHash(filePaths: string[]): string {
  const hashSum = crypto.createHash("md5");
  for (const filePath of filePaths) {
    hashSum.update(filePath);
    hashSum.update(fs.readFileSync(filePath));
  }
  return hashSum.digest("hex");
}

function main() {
  console.log("🔍 [Sync Check] Verifying backend contract...");

  if (!fs.existsSync(REMOTE_REPO_PATH)) {
    console.log(
      "⚠️  [Sync Check] Sync ERP repo not found locally. Skipping check (Deploy/CI mode).",
    );
    process.exit(0);
  }

  const missingPath = ROUTER_PATHS.find((routerPath) => !fs.existsSync(routerPath));
  if (missingPath) {
    console.error(
      `❌ [Sync Check] Sync ERP repo found, but router file missing at: ${missingPath}`,
    );
    // If repo exists but file is moved, that's a breaking change too!
    process.exit(1);
  }

  const currentHash = calculateFileHash(ROUTER_PATHS);

  let contract: { publicRentalRouterHash: string };
  try {
    contract = JSON.parse(fs.readFileSync(CONTRACT_FILE, "utf-8"));
  } catch (error) {
    console.error("❌ [Sync Check] Could not read sync-contract.json");
    process.exit(1);
  }

  if (currentHash !== contract.publicRentalRouterHash) {
    console.error(
      "\n🚨🚨🚨 [Sync Check] CRITICAL: Backend Logic Changed! 🚨🚨🚨",
    );
    console.error(`Local Hash:   ${contract.publicRentalRouterHash}`);
    console.error(`Remote Hash:  ${currentHash}`);
    console.error(
      "\nThe publicRental router contract in sync-erp has been modified.",
    );
    console.error(
      "Your local contract types in src/types/sync-erp.ts might be OUTDATED.",
    );
    console.error("\n👉 ACTION REQUIRED:");
    console.error(
      "1. Compare sync-erp backend changes with src/types/sync-erp.ts",
    );
    console.error("2. Update your local types if necessary.");
    console.error("3. Update sync-contract.json with the new hash:");
    console.error(`   "publicRentalRouterHash": "${currentHash}"`);
    console.error("\nBuild BLOCKED for safety.\n");
    process.exit(1);
  }

  console.log(
    "✅ [Sync Check] Contract matches backend snapshot. Safe to build.",
  );
  process.exit(0);
}

main();
