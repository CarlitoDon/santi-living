#!/usr/bin/env npx ts-node
/**
 * Bundle Sync Script
 *
 * Reads mattressPackages from products.json and syncs them to sync-erp.
 * Run this on deploy to ensure bundles exist in sync-erp database.
 *
 * Usage:
 *   npx ts-node src/scripts/sync-bundles.ts
 *   # or
 *   npm run sync-bundles (after adding to package.json)
 */

import * as fs from "fs";
import * as path from "path";

interface Package {
  id: string;
  name: string;
  shortName: string;
  description: string;
  pricePerDay: number;
  dimensions: string;
  capacity: string;
  image: string;
  includes: string[];
}

interface ProductsJson {
  mattressPackages: Package[];
  mattressOnly: unknown[];
  accessories: unknown[];
}

const SYNC_ERP_API_URL =
  process.env.SYNC_ERP_API_URL || "http://localhost:3001/api/trpc";
const COMPANY_ID = process.env.SANTI_LIVING_COMPANY_ID || "demo-company-rental";

async function syncBundles() {
  console.log("📦 Starting bundle sync...\n");

  // Read products.json from santi-living main app
  const productsPath = path.resolve(
    __dirname,
    "../../../../src/data/products.json"
  );

  if (!fs.existsSync(productsPath)) {
    console.error(`❌ products.json not found at: ${productsPath}`);
    process.exit(1);
  }

  const products: ProductsJson = JSON.parse(
    fs.readFileSync(productsPath, "utf-8")
  );

  console.log(
    `📋 Found ${products.mattressPackages.length} packages to sync\n`
  );

  // Map to bundle format
  const bundles = products.mattressPackages.map((pkg) => ({
    externalId: pkg.id,
    name: pkg.name,
    shortName: pkg.shortName,
    description: pkg.description,
    dailyRate: pkg.pricePerDay,
    dimensions: pkg.dimensions,
    capacity: pkg.capacity,
    imagePath: pkg.image,
    includes: pkg.includes,
  }));

  // Call sync-erp API
  const url = `${SYNC_ERP_API_URL}/rentalBundle.syncFromSantiLiving?batch=1`;

  console.log(`🔄 Syncing to: ${url}\n`);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        0: {
          json: {
            companyId: COMPANY_ID,
            bundles,
          },
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    interface SyncResult {
      result?: {
        data?: {
          json?: {
            synced: number;
            bundles: Array<{ name: string }>;
          };
        };
      };
    }

    const data = (await response.json()) as SyncResult[];
    const result = data[0]?.result?.data?.json;

    if (result) {
      console.log(`✅ Successfully synced ${result.synced} bundles:\n`);
      result.bundles?.forEach((b) => {
        console.log(`   • ${b.name}`);
      });
    } else {
      console.log("⚠️ Sync completed but no result data returned");
    }
  } catch (error) {
    console.error("❌ Sync failed:", error);
    process.exit(1);
  }

  console.log("\n🎉 Bundle sync complete!");
}

// Run
syncBundles();
