# Research: Santi Living - Website Sewa Kasur Jogja

**Feature**: 001-seo-living-marketing  
**Date**: 2026-01-02  
**Status**: Complete

## Research Summary

Dokumen ini berisi hasil riset untuk keputusan teknis website sewa kasur Jogja. Fokus pada stack yang optimal untuk performa, SEO lokal, dan kemudahan development.

---

## 1. Static Site Generator Selection

### Decision: **Astro 4.x**

### Rationale

- **Performance**: Astro ships zero JavaScript by default, hanya load JS ketika diperlukan (islands architecture)
- **SEO**: Built-in support untuk static HTML generation, perfect untuk SEO lokal
- **Simplicity**: Lebih simple dari Next.js untuk static content
- **Component Islands**: Kalkulator bisa reactive tanpa hydrate seluruh halaman
- **Build Size**: Bundle size sangat kecil, load time < 2 detik tercapai

### Alternatives Considered

| Option         | Pros                                     | Cons                                                       | Verdict     |
| -------------- | ---------------------------------------- | ---------------------------------------------------------- | ----------- |
| **Next.js**    | SSR, large ecosystem, Vercel integration | Overkill untuk static site, larger bundle, SSR tidak perlu | ❌ Rejected |
| **Nuxt**       | Vue ecosystem                            | Team familiarity with React/Astro, Vue learning curve      | ❌ Rejected |
| **Plain HTML** | Simplest, no build                       | No component reuse, harder to maintain                     | ❌ Rejected |
| **Astro**      | Zero JS default, islands, great DX       | Smaller ecosystem than Next                                | ✅ Selected |

---

## 2. Styling Approach

### Decision: **Vanilla CSS with CSS Custom Properties**

### Rationale

- **Constitution Compliance**: Zero Cognitive Load prinsip memerlukan design system yang konsisten
- **Performance**: Tidak ada CSS framework overhead
- **Control**: Full control untuk responsive breakpoints dan design tokens
- **Maintainability**: CSS Custom Properties untuk theming dan consistency

### Design System Tokens

```css
:root {
  /* Colors */
  --color-primary: #2563eb; /* Blue - trust, action */
  --color-secondary: #10b981; /* Green - success, WhatsApp */
  --color-background: #ffffff;
  --color-surface: #f8fafc;
  --color-text: #1e293b;
  --color-text-muted: #64748b;

  /* Typography */
  --font-family: "Inter", system-ui, sans-serif;
  --font-size-base: 16px;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.25rem;
  --font-size-2xl: 1.5rem;
  --font-size-3xl: 2rem;

  /* Spacing */
  --space-xs: 0.25rem;
  --space-sm: 0.5rem;
  --space-md: 1rem;
  --space-lg: 1.5rem;
  --space-xl: 2rem;
  --space-2xl: 3rem;

  /* Touch targets (min 44px) */
  --touch-target-min: 44px;

  /* Breakpoints */
  --breakpoint-sm: 640px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 1024px;
}
```

### Alternatives Considered

| Option                | Pros                             | Cons                                                                   | Verdict     |
| --------------------- | -------------------------------- | ---------------------------------------------------------------------- | ----------- |
| **Tailwind CSS**      | Rapid development, utility-first | Build complexity, utility bloat, harder to maintain design consistency | ❌ Rejected |
| **CSS Modules**       | Scoped styles                    | Extra complexity for small project                                     | ❌ Rejected |
| **Styled Components** | CSS-in-JS                        | Runtime overhead, not ideal for static site                            | ❌ Rejected |
| **Vanilla CSS**       | Zero overhead, full control      | Need discipline for consistency                                        | ✅ Selected |

---

## 3. Form Submission Strategy

### Decision: **Google Sheets via Apps Script**

### Rationale

- **Zero Backend**: Sesuai konstitusi - tidak ada backend custom di Phase 1
- **Familiar Tool**: Tim non-teknis bisa langsung akses dan manage di Google Sheets
- **Free**: Tidak ada biaya hosting atau database
- **Simple Integration**: Form submit ke Google Apps Script endpoint

### Implementation Approach

```
[Form Submit] → [Fetch to Apps Script URL] → [Write to Google Sheet]
```

1. Create Google Sheet dengan columns: Timestamp, Nama, WhatsApp, Alamat, Jenis Kasur, Jumlah, Tanggal Mulai, Durasi, Total Harga, Catatan
2. Create Apps Script dengan doPost() handler
3. Deploy as Web App
4. Form submit via fetch() ke Apps Script URL

### Alternatives Considered

| Option            | Pros                         | Cons                                       | Verdict        |
| ----------------- | ---------------------------- | ------------------------------------------ | -------------- |
| **Airtable**      | Better UI, API ready         | Paid for higher usage, external dependency | ⚪ Alternative |
| **Supabase**      | Full database, real-time     | Overkill, adds backend complexity          | ❌ Rejected    |
| **Formspree**     | Simple form handling         | Paid, less control                         | ❌ Rejected    |
| **Google Sheets** | Free, familiar, zero backend | Limited scalability (fine for MVP)         | ✅ Selected    |

---

## 4. WhatsApp Integration

### Decision: **wa.me URL dengan Auto-Compose**

### Rationale

- **Universal**: Works on all devices (mobile app atau web.whatsapp.com)
- **No SDK Required**: Simple URL-based, tidak ada dependency
- **Pre-filled Message**: User tinggal klik Send

### Implementation

```typescript
function composeWhatsAppMessage(booking: BookingData): string {
  const phone = "6281234567890"; // Nomor WA bisnis
  const message = encodeURIComponent(
    `Halo, saya mau sewa:\n` +
      `- Kasur: ${booking.type}\n` +
      `- Jumlah: ${booking.quantity}\n` +
      `- Tanggal: ${booking.startDate} - ${booking.endDate}\n` +
      `- Total: Rp ${booking.total.toLocaleString("id-ID")}\n` +
      `- Nama: ${booking.name}\n` +
      `- Alamat: ${booking.address}`
  );
  return `https://wa.me/${phone}?text=${message}`;
}
```

### Fallback Strategy

- Jika WhatsApp tidak terinstall, browser akan buka web.whatsapp.com
- Tambahkan fallback link ke halaman kontak jika web.whatsapp.com juga gagal

---

## 5. SEO Local Strategy

### Decision: **Schema Markup + Meta Optimization**

### Key SEO Elements

1. **Meta Tags**

   ```html
   <title>Sewa Kasur Jogja - Antar Jemput Same Day | Santi Living</title>
   <meta
     name="description"
     content="Sewa kasur bersih di Jogja. Antar jemput sama hari. Single, Double, Extra Bed. Harga mulai Rp 25.000/hari. Hubungi via WhatsApp sekarang!"
   />
   ```

2. **Schema Markup (LocalBusiness + Product)**

   ```json
   {
     "@context": "https://schema.org",
     "@type": "LocalBusiness",
     "name": "Santi Living",
     "description": "Layanan sewa kasur Jogja dengan antar jemput",
     "address": {
       "@type": "PostalAddress",
       "addressLocality": "Yogyakarta",
       "addressRegion": "DI Yogyakarta",
       "addressCountry": "ID"
     },
     "areaServed": "Yogyakarta",
     "telephone": "+6281234567890"
   }
   ```

3. **Open Graph**
   ```html
   <meta property="og:title" content="Sewa Kasur Jogja - Santi Living" />
   <meta
     property="og:description"
     content="Kasur bersih, antar hari ini, Jogja"
   />
   <meta property="og:image" content="/images/og-cover.jpg" />
   <meta property="og:type" content="website" />
   ```

---

## 6. Image Optimization

### Decision: **Astro Image + WebP**

### Strategy

- Gunakan Astro's built-in image optimization
- Convert semua gambar ke WebP format
- Lazy loading untuk gambar di bawah fold
- Responsive images dengan srcset

### Implementation

```astro
---
import { Image } from 'astro:assets';
import kasurDouble from '../assets/images/kasur-double.jpg';
---
<Image
  src={kasurDouble}
  alt="Kasur Double Santi Living"
  widths={[320, 640, 768]}
  loading="lazy"
/>
```

---

## 7. Analytics & Tracking

### Decision: **Google Analytics 4 + Simple Event Tracking**

### Key Events to Track

| Event                    | Trigger                 | Purpose                |
| ------------------------ | ----------------------- | ---------------------- |
| `calculator_interaction` | User fills calculator   | Track engagement       |
| `calculator_result_view` | User sees total price   | Track intent           |
| `whatsapp_click`         | User clicks WA button   | **Primary conversion** |
| `form_submit`            | Form submitted (backup) | Track form usage       |

### Implementation

- GA4 gtag dengan minimal config
- Custom events untuk conversion funnel
- No cookies banner needed (GA4 with anonymized IP)

---

## 8. Hosting

### Decision: **Vercel**

### Rationale

- Free tier sufficient untuk MVP traffic
- Automatic SSL
- Global CDN
- Git integration untuk auto-deploy
- Built-in analytics

### Alternatives Considered

| Option               | Pros                      | Cons                         | Verdict        |
| -------------------- | ------------------------- | ---------------------------- | -------------- |
| **Netlify**          | Similar to Vercel         | Slightly slower in Indonesia | ⚪ Alternative |
| **Cloudflare Pages** | Fast, unlimited bandwidth | Newer, less mature           | ⚪ Alternative |
| **GitHub Pages**     | Free, simple              | No build pipeline            | ❌ Rejected    |
| **Vercel**           | Best DX, fast, free tier  | N/A                          | ✅ Selected    |

---

## Research Conclusion

### Final Stack

| Layer            | Technology                      | Reason                           |
| ---------------- | ------------------------------- | -------------------------------- |
| **Framework**    | Astro 4.x                       | Zero JS default, islands, static |
| **Styling**      | Vanilla CSS + Custom Properties | Performance, control             |
| **Form Backend** | Google Sheets (Apps Script)     | Zero backend, familiar           |
| **WhatsApp**     | wa.me URL                       | Universal, no SDK                |
| **SEO**          | Schema.org + Meta               | Local SEO focus                  |
| **Images**       | Astro Image + WebP              | Built-in optimization            |
| **Analytics**    | GA4                             | Free, conversion tracking        |
| **Hosting**      | Vercel                          | Free, fast, auto-deploy          |

### Unresolved Items

None - all technical decisions resolved.

### Next Steps

1. Generate data-model.md (entities structure)
2. Create quickstart.md (development setup)
3. Proceed to tasks.md generation
