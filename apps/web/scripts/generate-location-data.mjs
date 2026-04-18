/**
 * Script to download NusantaraKita CSV data and generate static JSON files
 * filtered for DIY (Daerah Istimewa Yogyakarta, province code "34")
 *
 * Source: https://github.com/Yuefii/NusantaraKita/tree/main/data/csv
 *
 * Usage: node scripts/generate-location-data.mjs
 */

import { writeFileSync, mkdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = resolve(__dirname, "../src/data/locations");

const BASE =
  "https://raw.githubusercontent.com/Yuefii/NusantaraKita/286a03b8a583c3b83d911de863fa493423730099/data/csv";

const DIY_CODE = "34";

/**
 * Simple CSV parser - handles quoted fields
 */
function parseCSV(text) {
  const lines = text.trim().split("\n");
  const headers = parseLine(lines[0]);
  const rows = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseLine(lines[i]);
    if (values.length === headers.length) {
      const row = {};
      headers.forEach((h, idx) => {
        row[h] = values[idx];
      });
      rows.push(row);
    }
  }
  return rows;
}

function parseLine(line) {
  const result = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      inQuotes = !inQuotes;
    } else if (ch === "," && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += ch;
    }
  }
  result.push(current.trim());
  return result;
}

async function main() {
  console.log("📥 Downloading CSVs from NusantaraKita...\n");

  // Download all 3 CSVs
  const [kabKotaCsv, kecamatanCsv, kelurahanCsv] = await Promise.all([
    fetch(`${BASE}/nk_kabupaten_kota.csv`).then((r) => r.text()),
    fetch(`${BASE}/nk_kecamatan.csv`).then((r) => r.text()),
    fetch(`${BASE}/nk_desa_kelurahan.csv`).then((r) => r.text()),
  ]);

  console.log("✅ Downloaded all CSVs");

  // Parse CSVs
  const allKabKota = parseCSV(kabKotaCsv);
  const allKecamatan = parseCSV(kecamatanCsv);
  const allKelurahan = parseCSV(kelurahanCsv);

  console.log(
    `📊 Total: ${allKabKota.length} kab/kota, ${allKecamatan.length} kecamatan, ${allKelurahan.length} kelurahan`,
  );

  // Filter for DIY (province code 34)
  const diyKabKota = allKabKota.filter((row) => row.kode_provinsi === DIY_CODE);
  const diyKabKotaCodes = new Set(diyKabKota.map((r) => r.kode));
  const diyKecamatan = allKecamatan.filter((row) =>
    diyKabKotaCodes.has(row.kode_kabupaten_kota),
  );
  const diyKecamatanCodes = new Set(diyKecamatan.map((r) => r.kode));
  const diyKelurahan = allKelurahan.filter((row) =>
    diyKecamatanCodes.has(row.kode_kecamatan),
  );

  console.log(
    `🎯 DIY: ${diyKabKota.length} kab/kota, ${diyKecamatan.length} kecamatan, ${diyKelurahan.length} kelurahan`,
  );

  // Build output JSON matching WilayahItem interface
  // kabupaten-kota.json — flat array
  const kabKotaJson = diyKabKota.map((r) => ({
    kode: r.kode,
    nama: r.nama,
    lat: parseFloat(r.lat),
    lng: parseFloat(r.lng),
  }));

  // kecamatan.json — grouped by kode_kabupaten_kota for fast lookup
  const kecamatanByKabKota = {};
  for (const r of diyKecamatan) {
    const key = r.kode_kabupaten_kota;
    if (!kecamatanByKabKota[key]) kecamatanByKabKota[key] = [];
    kecamatanByKabKota[key].push({
      kode: r.kode,
      nama: r.nama,
      lat: parseFloat(r.lat),
      lng: parseFloat(r.lng),
    });
  }

  // kelurahan.json — grouped by kode_kecamatan for fast lookup
  const kelurahanByKecamatan = {};
  for (const r of diyKelurahan) {
    const key = r.kode_kecamatan;
    if (!kelurahanByKecamatan[key]) kelurahanByKecamatan[key] = [];
    kelurahanByKecamatan[key].push({
      kode: r.kode,
      nama: r.nama,
      lat: parseFloat(r.lat),
      lng: parseFloat(r.lng),
      kode_pos: r.kode_pos || undefined,
    });
  }

  // Create output directory
  mkdirSync(OUTPUT_DIR, { recursive: true });

  // Write files
  writeFileSync(
    resolve(OUTPUT_DIR, "kabupaten-kota.json"),
    JSON.stringify(kabKotaJson, null, 2),
  );
  writeFileSync(
    resolve(OUTPUT_DIR, "kecamatan.json"),
    JSON.stringify(kecamatanByKabKota, null, 2),
  );
  writeFileSync(
    resolve(OUTPUT_DIR, "kelurahan.json"),
    JSON.stringify(kelurahanByKecamatan, null, 2),
  );

  console.log(`\n✅ Generated JSON files in ${OUTPUT_DIR}`);
  console.log(`   - kabupaten-kota.json (${kabKotaJson.length} items)`);
  console.log(
    `   - kecamatan.json (${Object.keys(kecamatanByKabKota).length} groups)`,
  );
  console.log(
    `   - kelurahan.json (${Object.keys(kelurahanByKecamatan).length} groups)`,
  );
}

main().catch(console.error);
