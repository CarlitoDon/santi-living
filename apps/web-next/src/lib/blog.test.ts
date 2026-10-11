import { describe, expect, it } from 'vitest';
import { getAllPosts, getPostBySlug } from './blog';

describe('getPostBySlug', () => {
  it('loads one known local article directly', () => {
    const post = getPostBySlug('cara-pesan-rental-kasur-whatsapp', 'id');
    expect(post?.slug).toBe('cara-pesan-rental-kasur-whatsapp');
    expect(post?.frontmatter.title).toBeTruthy();
  });

  it('rejects path-like slugs', () => {
    expect(getPostBySlug('../secrets', 'id')).toBeUndefined();
    expect(getPostBySlug('folder/article', 'id')).toBeUndefined();
  });
});

describe('getAllPosts', () => {
  it('returns an empty array when locale is en and directory has no markdown articles', () => {
    const posts = getAllPosts('en');
    expect(posts).toEqual([]);
  });
});
