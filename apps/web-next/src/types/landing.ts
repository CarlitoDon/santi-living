import { z } from 'zod';

// ─── Landing Page Types ──────────────────────────────────────────────────────

export const ThemeColorSchema = z.enum(["blue", "purple", "green", "cyan", "emerald", "indigo"]);
export type ThemeColor = z.infer<typeof ThemeColorSchema>;

export const GRADIENT_MAP: Record<ThemeColor, string> = {
  blue: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)',
  purple: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
  green: 'linear-gradient(135deg, #10b981 0%, #047857 100%)',
  cyan: 'linear-gradient(135deg, #06b6d4 0%, #0369a1 100%)',
  emerald: 'linear-gradient(135deg, #10b981 0%, #047857 100%)',
  indigo: 'linear-gradient(135deg, #6366f1 0%, #4338ca 100%)',
};

export const ACCENT_COLOR_MAP: Record<ThemeColor, string> = {
  blue: '#2563eb',
  purple: '#7c3aed',
  green: '#059669',
  cyan: '#0891b2',
  emerald: '#10b981',
  indigo: '#4f46e5',
};

export const FAQItemSchema = z.object({
  question: z.string(),
  answer: z.string(),
});
export type FAQItem = z.infer<typeof FAQItemSchema>;

export const PriceCardSchema = z.object({
  name: z.string(),
  size: z.string(),
  price: z.string(),
  daily: z.string(),
  note: z.string(),
  popular: z.boolean().optional(),
});
export type PriceCard = z.infer<typeof PriceCardSchema>;

export const BenefitSchema = z.object({
  icon: z.string(),
  title: z.string(),
  description: z.string(),
});
export type Benefit = z.infer<typeof BenefitSchema>;

export const AudienceItemSchema = z.object({
  icon: z.string(),
  title: z.string(),
  description: z.string(),
});
export type AudienceItem = z.infer<typeof AudienceItemSchema>;

export const LandingPageConfigSchema = z.object({
  meta: z.object({
    title: z.string(),
    description: z.string(),
  }),
  hero: z.object({
    title: z.string(),
    subtitle: z.string(),
    badge: z.string().optional(),
    features: z.array(z.object({ icon: z.string().optional(), text: z.string() })).optional(),
    actions: z.array(z.object({
      type: z.enum(['link', 'wa']),
      label: z.string(),
      href: z.string().optional(),
      waText: z.string().optional(),
      waSource: z.string().optional(),
      variant: z.enum(['primary', 'ghost']).optional(),
    })).optional(),
    badges: z.array(z.string()).optional(),
    phone: z.string().optional(),
    bgImage: z.string().optional(),
    bgImageAlt: z.string().optional(),
  }),
  color: ThemeColorSchema,
  tracking: z.object({
    productCategory: z.string().optional(),
    pageType: z.string().optional(),
    intent: z.string().optional(),
  }).optional(),
  benefits: z.array(BenefitSchema).optional(),
  priceSection: z.object({
    title: z.string().optional(),
    linkLabel: z.string().optional(),
    linkHref: z.string().optional(),
  }).optional(),
  priceCards: z.array(PriceCardSchema).optional(),
  audience: z.array(AudienceItemSchema).optional(),
  faqs: z.array(FAQItemSchema),
  cta: z.object({
    title: z.string(),
    description: z.string(),
    waText: z.string(),
    waSource: z.string(),
    secondaryLabel: z.string().optional(),
    secondaryHref: z.string().optional(),
  }),
  /** Extra content sections rendered between benefits and FAQ */
  sections: z.array(z.object({
    title: z.string(),
    content: z.string(), // HTML string
  })).optional(),
});

export type LandingPageConfig = z.infer<typeof LandingPageConfigSchema> & {
  /** English overrides for all text fields */
  en?: {
    meta?: { title?: string; description?: string };
    hero?: {
      title?: string; subtitle?: string; badge?: string;
      bgImage?: string; bgImageAlt?: string;
      features?: { icon?: string; text?: string }[];
      actions?: {
        type?: string; label?: string; href?: string;
        waText?: string; waSource?: string; variant?: string
      }[];
      badges?: string[];
      phone?: string;
    };
    benefits?: { icon?: string; title?: string; description?: string }[];
    priceCards?: { name?: string; size?: string; price?: string; daily?: string; note?: string; popular?: boolean }[];
    priceSection?: { title?: string; linkLabel?: string };
    audience?: { icon?: string; title?: string; description?: string }[];
    faqs?: { question?: string; answer?: string }[];
    cta?: { title?: string; description?: string; secondaryLabel?: string; waText?: string; waSource?: string };
    sections?: { title?: string; content?: string }[];
  };
};
