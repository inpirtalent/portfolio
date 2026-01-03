import { MetadataRoute } from 'next';
import Airtable from 'airtable';

const base = new Airtable({
  apiKey: process.env.AIRTABLE_TOKEN,
}).base(process.env.AIRTABLE_BASE_ID || '');

interface AirtablePost {
  id: string;
  fields: {
    Title?: string;
    Date?: string;
  };
}

function generateSlug(title: string): string {
  if (!title || typeof title !== 'string') {
    return '';
  }
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '') || 'untitled';
}

async function getAllPosts(): Promise<Array<{ slug: string; date: string }>> {
  try {
    if (!process.env.AIRTABLE_TOKEN || !process.env.AIRTABLE_BASE_ID) {
      return [];
    }

    const records = await base('Blog Posts')
      .select({
        filterByFormula: `{Title} != ""`,
      })
      .all();

    return records.map((record: AirtablePost) => {
      const title = String(record.fields.Title || '');
      const date = String(record.fields.Date || new Date().toISOString());
      return {
        slug: generateSlug(title),
        date: new Date(date).toISOString(),
      };
    });
  } catch (error) {
    console.error('Error fetching posts for sitemap:', error);
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://julianocoutinho.dev';
  const baseUrl = siteUrl;

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
  ];

  // Dynamic blog posts
  const posts = await getAllPosts();
  const blogPages: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${baseUrl}/writings/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  return [...staticPages, ...blogPages];
}

