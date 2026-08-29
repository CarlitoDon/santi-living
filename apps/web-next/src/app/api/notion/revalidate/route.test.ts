import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';
import { signWebhookPayload } from '@notionhq/client';

const mocks = vi.hoisted(() => ({
  getNotionSlugsForPage: vi.fn(),
  revalidatePath: vi.fn(),
  revalidateTag: vi.fn(),
}));

vi.mock('next/cache', () => ({
  revalidatePath: mocks.revalidatePath,
  revalidateTag: mocks.revalidateTag,
}));

vi.mock('@/lib/notion', () => ({
  NOTION_POSTS_TAG: 'notion-blog-posts-v3',
  NOTION_POST_DETAILS_TAG: 'notion-blog-post-details-v3',
  notionPostTag: (slug: string) => `notion-blog-post-v3:${slug}`,
  getNotionSlugsForPage: mocks.getNotionSlugsForPage,
}));

import { POST } from './route';

function request(body: unknown, secret = 'test-secret', signature?: string) {
  const rawBody = JSON.stringify(body);
  return new NextRequest(`https://santiliving.com/api/notion/revalidate?secret=${secret}`, {
    method: 'POST',
    body: rawBody,
    headers: {
      'content-type': 'application/json',
      ...(signature ? { 'x-notion-signature': signature } : {}),
    },
  });
}

describe('POST /api/notion/revalidate', () => {
  beforeEach(() => {
    process.env.NOTION_REVALIDATE_SECRET = 'test-secret';
    delete process.env.NOTION_WEBHOOK_VERIFICATION_TOKEN;
    mocks.getNotionSlugsForPage.mockReset();
    mocks.revalidatePath.mockReset();
    mocks.revalidateTag.mockReset();
  });

  it('rejects a request without the private subscription secret', async () => {
    const response = await POST(request({ type: 'page.content_updated' }, 'wrong'));
    expect(response.status).toBe(401);
    expect(mocks.revalidatePath).not.toHaveBeenCalled();
  });

  it('captures the one-time Notion verification token in private runtime logs', async () => {
    const log = vi.spyOn(console, 'info').mockImplementation(() => undefined);
    const response = await POST(request({ verification_token: 'secret_notion_token' }));
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ received: true, verification: true });
    expect(log).toHaveBeenCalledWith(
      '[notion-webhook] verification_token=%s',
      'secret_notion_token',
    );
    log.mockRestore();
  });

  it('rejects an event with an invalid Notion signature once verification is configured', async () => {
    process.env.NOTION_WEBHOOK_VERIFICATION_TOKEN = 'verification-secret';
    const response = await POST(request({
      type: 'page.content_updated',
      entity: { type: 'page', id: 'page-id' },
    }, 'test-secret', 'sha256=invalid'));

    expect(response.status).toBe(401);
    expect(mocks.revalidateTag).not.toHaveBeenCalled();
  });

  it('accepts a correctly signed event', async () => {
    process.env.NOTION_WEBHOOK_VERIFICATION_TOKEN = 'verification-secret';
    const body = {
      type: 'page.content_updated',
      entity: { type: 'page', id: 'page-id' },
    };
    const signature = await signWebhookPayload({
      body: JSON.stringify(body),
      verificationToken: 'verification-secret',
    });
    mocks.getNotionSlugsForPage.mockResolvedValue([]);

    const response = await POST(request(body, 'test-secret', signature));
    expect(response.status).toBe(200);
  });

  it('revalidates only the changed slug plus list and sitemap surfaces', async () => {
    mocks.getNotionSlugsForPage.mockResolvedValue(['tips-sewa-kasur']);
    const response = await POST(request({
      type: 'page.content_updated',
      entity: { type: 'page', id: 'page-id' },
    }));

    expect(response.status).toBe(200);
    expect(mocks.revalidateTag).toHaveBeenCalledWith(
      'notion-blog-posts-v3',
      { expire: 0 },
    );
    expect(mocks.revalidateTag).toHaveBeenCalledWith(
      'notion-blog-post-v3:tips-sewa-kasur',
      { expire: 0 },
    );
    expect(mocks.revalidatePath.mock.calls.map(([path]) => path)).toEqual([
      '/id/artikel',
      '/en/artikel',
      '/sitemap.xml',
      '/id/artikel/tips-sewa-kasur',
      '/en/artikel/tips-sewa-kasur',
    ]);
  });

  it.each(['page.moved', 'page.deleted'])('invalidates old and current slugs for %s', async (type) => {
    mocks.getNotionSlugsForPage.mockResolvedValue(['slug-lama', 'slug-baru']);
    const response = await POST(request({
      type,
      entity: { type: 'page', id: 'page-id' },
    }));

    expect(response.status).toBe(200);
    expect(mocks.revalidateTag).toHaveBeenCalledWith(
      'notion-blog-post-v3:slug-lama',
      { expire: 0 },
    );
    expect(mocks.revalidateTag).toHaveBeenCalledWith(
      'notion-blog-post-v3:slug-baru',
      { expire: 0 },
    );
    expect(mocks.revalidatePath).toHaveBeenCalledWith('/id/artikel/slug-lama');
    expect(mocks.revalidatePath).toHaveBeenCalledWith('/id/artikel/slug-baru');
  });

  it('expires all article details when a deleted page has no recoverable slug', async () => {
    mocks.getNotionSlugsForPage.mockResolvedValue([]);
    const response = await POST(request({
      type: 'page.deleted',
      entity: { type: 'page', id: 'page-id' },
    }));

    expect(response.status).toBe(200);
    expect(mocks.revalidateTag).toHaveBeenCalledWith(
      'notion-blog-post-details-v3',
      { expire: 0 },
    );
  });
});
