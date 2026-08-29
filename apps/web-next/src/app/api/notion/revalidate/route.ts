import { timingSafeEqual } from 'node:crypto';
import { verifyWebhookSignature } from '@notionhq/client';
import { revalidatePath, revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import {
  getNotionSlugsForPage,
  notionPostTag,
  NOTION_POST_DETAILS_TAG,
  NOTION_POSTS_TAG,
} from '@/lib/notion';

export const dynamic = 'force-dynamic';

const NotionEventSchema = z.object({
  verification_token: z.string().min(1).optional(),
  type: z.string().optional(),
  entity: z.object({
    type: z.string(),
    id: z.string().min(1),
  }).optional(),
});

function secretsMatch(provided: string, expected: string): boolean {
  const providedBuffer = Buffer.from(provided);
  const expectedBuffer = Buffer.from(expected);
  return providedBuffer.length === expectedBuffer.length
    && timingSafeEqual(providedBuffer, expectedBuffer);
}

export async function POST(request: NextRequest) {
  const expectedSecret = process.env.NOTION_REVALIDATE_SECRET?.trim();
  const providedSecret = request.nextUrl.searchParams.get('secret') || '';
  if (!expectedSecret || !secretsMatch(providedSecret, expectedSecret)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const rawBody = await request.text();
  const parsed = NotionEventSchema.safeParse((() => {
    try {
      return JSON.parse(rawBody);
    } catch {
      return null;
    }
  })());
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }

  if (parsed.data.verification_token) {
    // Notion requires the owner to paste this one-time value back into the
    // connection UI. Keep the endpoint URL secret and remove the private log
    // after the subscription has been verified.
    console.info('[notion-webhook] verification_token=%s', parsed.data.verification_token);
    return NextResponse.json({ received: true, verification: true });
  }

  const verificationToken = process.env.NOTION_WEBHOOK_VERIFICATION_TOKEN?.trim();
  if (verificationToken) {
    const signature = request.headers.get('x-notion-signature');
    const isTrusted = await verifyWebhookSignature({
      body: rawBody,
      signature,
      verificationToken,
    });
    if (!isTrusted) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }
  }

  const eventType = parsed.data.type || '';
  const pageId = parsed.data.entity?.type === 'page' ? parsed.data.entity.id : null;
  if (!eventType.startsWith('page.') || !pageId) {
    return NextResponse.json({ received: true, ignored: true });
  }

  const slugs = await getNotionSlugsForPage(pageId);
  revalidateTag(NOTION_POSTS_TAG, { expire: 0 });
  revalidatePath('/id/artikel');
  revalidatePath('/en/artikel');
  revalidatePath('/sitemap.xml');

  if (slugs.length > 0) {
    for (const slug of slugs) {
      revalidateTag(notionPostTag(slug), { expire: 0 });
      revalidatePath(`/id/artikel/${slug}`);
      revalidatePath(`/en/artikel/${slug}`);
    }
  } else {
    // If Notion no longer exposes the page and the old slug is not in the
    // cached index, expire every detail data entry so a deleted article cannot
    // remain permanently available under an unknown route.
    revalidateTag(NOTION_POST_DETAILS_TAG, { expire: 0 });
  }

  return NextResponse.json({
    received: true,
    revalidated: true,
    slugs: slugs.length > 0 ? slugs : undefined,
  });
}
