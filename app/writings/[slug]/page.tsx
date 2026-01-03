import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Metadata } from 'next';
import Airtable from 'airtable';
import { formatDate } from '@/lib/dateUtils';
import StructuredData from '@/components/StructuredData';

// Initialize Airtable
const base = new Airtable({
  apiKey: process.env.AIRTABLE_TOKEN,
}).base(process.env.AIRTABLE_BASE_ID || '');

interface AirtablePost {
  id: string;
  fields: {
    Title?: string;
    Date?: string;
    Category?: string;
    Excerpt?: string;
    Content?: string;
    Summary?: string;
    'Read Time (minutes)'?: number;
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

interface Post {
  id: string;
  title: string;
  slug: string;
  date: string;
  category: string;
  excerpt: string;
  content: string[];
  summary: string;
  readTime: number;
}

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://julianocoutinho.dev';

async function getPost(slug: string): Promise<Post | null> {
  try {
    if (!process.env.AIRTABLE_TOKEN || !process.env.AIRTABLE_BASE_ID) {
      return null;
    }

    const records = await base('Blog Posts')
      .select({
        filterByFormula: `{Title} != ""`,
      })
      .all();

    const post = records.find((record: AirtablePost) => {
      const title = String(record.fields.Title || '');
      return generateSlug(title) === slug;
    });

    if (!post) {
      return null;
    }

    const fields = post.fields;
    const title = String(fields.Title || '');
    
    // Split content by newlines or double newlines into paragraphs
    const content = String(fields.Content || '');
    const contentParagraphs = content
      .split(/\n\s*\n/)
      .map(p => p.trim())
      .filter(p => p.length > 0);

    return {
      id: post.id,
      title,
      slug: generateSlug(title),
      date: String(fields.Date || ''),
      category: String(fields.Category || ''),
      excerpt: String(fields.Excerpt || ''),
      content: contentParagraphs.length > 0 ? contentParagraphs : [content],
      summary: String(fields.Summary || ''),
      readTime: typeof fields['Read Time (minutes)'] === 'number' ? fields['Read Time (minutes)'] : 0,
    };
  } catch (error) {
    console.error('Error fetching post:', error);
    return null;
  }
}
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const writing = await getPost(slug);

  if (!writing) {
    return {
      title: 'Post Not Found',
    };
  }

  const url = `${siteUrl}/writings/${slug}`;
  const description = writing.excerpt || writing.summary || `Read ${writing.title} by Juliano Coutinho`;

  return {
    title: writing.title,
    description: description,
    keywords: [writing.category, 'blog', 'article', 'web development', 'technology', writing.title],
    authors: [{ name: 'Juliano Coutinho' }],
    openGraph: {
      title: writing.title,
      description: description,
      url: url,
      siteName: 'Juliano Coutinho - Portfolio',
      locale: 'en_US',
      type: 'article',
      publishedTime: writing.date,
      authors: ['Juliano Coutinho'],
      tags: [writing.category],
      images: [
        {
          url: `${siteUrl}/og-image.png`,
          width: 1200,
          height: 630,
          alt: writing.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: writing.title,
      description: description,
      creator: '@julianocoutinho',
      images: [`${siteUrl}/og-image.png`],
    },
    alternates: {
      canonical: url,
    },
  };
}

export default async function WritingPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const writing = await getPost(slug);

  if (!writing) {
    notFound();
  }

  const url = `${siteUrl}/writings/${slug}`;

  const blogPostStructuredData = {
    '@type': 'BlogPosting',
    headline: writing.title,
    description: writing.excerpt || writing.summary,
    image: `${siteUrl}/og-image.png`,
    datePublished: writing.date,
    dateModified: writing.date,
    author: {
      '@type': 'Person',
      name: 'Juliano Coutinho',
      url: siteUrl,
    },
    publisher: {
      '@type': 'Person',
      name: 'Juliano Coutinho',
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    keywords: writing.category,
    articleSection: writing.category,
    wordCount: writing.content.join(' ').split(/\s+/).length,
  };

  return (
    <main className="min-h-screen relative">
      <StructuredData type="BlogPosting" data={blogPostStructuredData} />
      <div className="max-w-4xl mx-auto p-6 md:p-8 relative z-10">
        <Link 
          href="/"
          className="inline-block text-retro-text hover:text-retro-text border border-retro-border px-4 py-2 mb-8 hover:glow-retro transition-all"
        >
          &lt; BACK
        </Link>
        
        <article className="border border-retro-border p-8 md:p-12 bg-retro-bg/50 backdrop-blur-sm" itemScope itemType="https://schema.org/BlogPosting">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
            <span className="border border-retro-accent px-3 py-1 text-xs text-retro-accent" itemProp="articleSection">
              {writing.category}
            </span>
            <time className="text-retro-text text-sm font-mono" dateTime={writing.date} itemProp="datePublished">
              {formatDate(writing.date)}
            </time>
          </div>
          
          <h1 className="text-3xl md:text-4xl lg:text-5xl text-retro-text mb-8 text-shadow-retro" itemProp="headline">
            {writing.title}
          </h1>
          
          <div className="text-retro-text text-xl md:text-2xl leading-relaxed space-y-6" itemProp="articleBody">
            {writing.content.map((paragraph: string, index: number) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
          {writing.readTime && writing.readTime > 0 && (
            <div className="mt-6 text-retro-accent text-sm">
              READ TIME: {writing.readTime} MINUTES
            </div>
          )}
        </article>
      </div>
    </main>
  );
}

