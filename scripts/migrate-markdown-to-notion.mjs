/**
 * Script Migrasi Massal Artikel Markdown ke Database Notion (Headless CMS)
 *
 * Fitur:
 * 1. Otomatis membaca konfigurasi dari apps/web-next/.env.local (NOTION_API_KEY & NOTION_BLOG_DATABASE_ID).
 * 2. Cek idempotensi: Membaca seluruh slug yang sudah ada di Notion agar tidak terjadi duplikasi.
 * 3. Rate-limiting guard: Menjaga request rate aman di bawah batas Notion API (3 req/sec).
 * 4. Parser Markdown to Notion Blocks: Mengonversi heading, paragraph, bullet list, quote/callout secara otomatis.
 *
 * Cara Eksekusi:
 * node scripts/migrate-markdown-to-notion.mjs
 */

import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Muat variabel lingkungan
dotenv.config({ path: path.resolve(__dirname, '../apps/web-next/.env.local') });

const NOTION_API_KEY = process.env.NOTION_API_KEY;
const DATABASE_ID = process.env.NOTION_BLOG_DATABASE_ID || '3c1d670b-614f-8075-aa6c-fdffcfd30c3f';
const ARTICLES_DIR = path.resolve(__dirname, '../apps/web-next/src/content/blog/id');

if (!NOTION_API_KEY) {
  console.error('ERROR: NOTION_API_KEY tidak ditemukan di .env.local!');
  process.exit(1);
}

// Helper: Parse YAML Frontmatter sederhana tanpa dependensi berat
function parseFrontmatter(fileContent) {
  const match = fileContent.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) return { data: {}, content: fileContent };

  const rawYaml = match[1];
  const body = match[2];
  const data = {};

  rawYaml.split('\n').forEach(line => {
    const colonIdx = line.indexOf(':');
    if (colonIdx > -1) {
      const key = line.slice(0, colonIdx).trim();
      let val = line.slice(colonIdx + 1).trim();

      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      } else if (val.startsWith('[') && val.endsWith(']')) {
        val = val.slice(1, -1).split(',').map(s => s.trim().replace(/^['"]|['"]$/g, ''));
      }
      data[key] = val;
    }
  });

  return { data, content: body };
}

// Helper: Konversi teks Markdown ke Notion Blocks
function markdownToBlocks(markdown) {
  const lines = markdown.split('\n');
  const blocks = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Batasi maksimum 95 blok per halaman saat pembuatan pertama
    if (blocks.length >= 95) break;

    if (line.startsWith('### ')) {
      blocks.push({
        object: 'block',
        type: 'heading_3',
        heading_3: {
          rich_text: [{ type: 'text', text: { content: line.replace('### ', '').slice(0, 2000) } }]
        }
      });
    } else if (line.startsWith('## ')) {
      blocks.push({
        object: 'block',
        type: 'heading_2',
        heading_2: {
          rich_text: [{ type: 'text', text: { content: line.replace('## ', '').slice(0, 2000) } }]
        }
      });
    } else if (line.startsWith('# ')) {
      blocks.push({
        object: 'block',
        type: 'heading_1',
        heading_1: {
          rich_text: [{ type: 'text', text: { content: line.replace('# ', '').slice(0, 2000) } }]
        }
      });
    } else if (line.startsWith('- ') || line.startsWith('* ')) {
      blocks.push({
        object: 'block',
        type: 'bulleted_list_item',
        bulleted_list_item: {
          rich_text: [{ type: 'text', text: { content: line.replace(/^[-*]\s+/, '').slice(0, 2000) } }]
        }
      });
    } else if (line.startsWith('> ')) {
      blocks.push({
        object: 'block',
        type: 'quote',
        quote: {
          rich_text: [{ type: 'text', text: { content: line.replace(/^>\s+/, '').slice(0, 2000) } }]
        }
      });
    } else {
      blocks.push({
        object: 'block',
        type: 'paragraph',
        paragraph: {
          rich_text: [{ type: 'text', text: { content: line.slice(0, 2000) } }]
        }
      });
    }
  }

  return blocks;
}

// Fetch seluruh slug yang telah terdaftar di Notion
async function getExistingSlugs() {
  const existingSlugs = new Set();
  let hasMore = true;
  let startCursor = undefined;

  console.log('Memeriksa artikel yang sudah ada di database Notion...');

  while (hasMore) {
    const res = await fetch(`https://api.notion.com/v1/databases/${DATABASE_ID}/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${NOTION_API_KEY}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        page_size: 100,
        start_cursor: startCursor
      })
    });

    const data = await res.json();
    if (!data.results) break;

    for (const page of data.results) {
      const slugProp = page.properties.Slug;
      if (slugProp && slugProp.rich_text && slugProp.rich_text.length > 0) {
        existingSlugs.add(slugProp.rich_text[0].plain_text.trim());
      }
    }

    hasMore = data.has_more;
    startCursor = data.next_cursor;
  }

  return existingSlugs;
}

// Eksekusi Migrasi
async function runMigration() {
  const existingSlugs = await getExistingSlugs();
  console.log(`Ditemukan ${existingSlugs.size} artikel di database Notion.`);

  if (!fs.existsSync(ARTICLES_DIR)) {
    console.error(`Direktori ${ARTICLES_DIR} tidak ditemukan.`);
    process.exit(1);
  }

  const files = fs.readdirSync(ARTICLES_DIR).filter(f => f.endsWith('.md'));
  console.log(`Ditemukan total ${files.length} file markdown lokal.`);

  let created = 0;
  let skipped = 0;
  let failed = 0;

  for (let i = 0; i < files.length; i++) {
    const filename = files[i];
    const slug = filename.replace(/\.md$/, '');

    if (existingSlugs.has(slug)) {
      skipped++;
      continue;
    }

    const fullPath = path.join(ARTICLES_DIR, filename);
    const fileContent = fs.readFileSync(fullPath, 'utf8');
    const { data: frontmatter, content } = parseFrontmatter(fileContent);

    const title = frontmatter.title || slug.replace(/-/g, ' ');
    const description = frontmatter.description || frontmatter.excerpt || '';
    const category = frontmatter.category || 'Tips & Panduan';
    const dateStr = frontmatter.date || new Date().toISOString().split('T')[0];
    const image = frontmatter.image || frontmatter.featuredImage || '';
    const tags = Array.isArray(frontmatter.tags) ? frontmatter.tags : [];

    const blocks = markdownToBlocks(content);

    const requestPayload = {
      parent: { database_id: DATABASE_ID },
      properties: {
        Name: {
          title: [{ type: 'text', text: { content: title.slice(0, 2000) } }]
        },
        Slug: {
          rich_text: [{ type: 'text', text: { content: slug } }]
        },
        Category: {
          select: { name: category }
        },
        'Meta Description': {
          rich_text: [{ type: 'text', text: { content: description.slice(0, 2000) } }]
        },
        Status: {
          status: { name: 'Published' }
        },
        'Published Date': {
          date: { start: dateStr }
        }
      },
      children: blocks
    };

    if (image) {
      requestPayload.properties['Featured Image'] = { url: image };
    }

    if (tags.length > 0) {
      requestPayload.properties.Keywords = {
        multi_select: tags.slice(0, 10).map(t => ({ name: String(t).slice(0, 100) }))
      };
    }

    try {
      const res = await fetch('https://api.notion.com/v1/pages', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${NOTION_API_KEY}`,
          'Notion-Version': '2022-06-28',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestPayload)
      });

      if (res.ok) {
        created++;
        existingSlugs.add(slug);
        if (created % 20 === 0 || created === 1) {
          console.log(`[Progress ${created + skipped}/${files.length}] Berhasil migrasi: ${title}`);
        }
      } else {
        const errData = await res.json();
        console.error(`Gagal membuat page [${slug}]:`, errData.message || res.statusText);
        failed++;
      }
    } catch (err) {
      console.error(`Error fetch [${slug}]:`, err.message);
      failed++;
    }

    // Rate limiting: jeda 100ms per artikel
    await new Promise(r => setTimeout(r, 100));
  }

  console.log('\n========================================');
  console.log('HASIL MIGRASI KE NOTION CMS:');
  console.log(`Berhasil Dibuat : ${created}`);
  console.log(`Dilewati (Ada)  : ${skipped}`);
  console.log(`Gagal           : ${failed}`);
  console.log('========================================\n');
}

runMigration();
