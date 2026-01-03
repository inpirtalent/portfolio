import Link from 'next/link';
import { formatDate } from '@/lib/dateUtils';

interface BlogPostProps {
  title: string;
  date: string;
  excerpt: string;
  category: string;
  slug: string;
  readTime?: number;
}

export default function BlogPost({ title, date, excerpt, category, slug, readTime }: BlogPostProps) {
  const formattedDate = formatDate(date);
  return (
    <article className="border border-retro-border p-6 hover:glow-retro transition-all duration-300 bg-retro-bg/50 backdrop-blur-sm" itemScope itemType="https://schema.org/BlogPosting">
      <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
        <span className="border border-retro-accent px-3 py-1 text-xs text-retro-accent" itemProp="articleSection">
          {category}
        </span>
        <div className="flex items-center gap-3">
          {readTime && readTime > 0 && (
            <span className="text-retro-accent text-xs font-mono">
              {readTime} MIN READ
            </span>
          )}
          <time className="text-retro-text text-xs font-mono" dateTime={date} itemProp="datePublished">
            {formattedDate}
          </time>
        </div>
      </div>
      <h3 className="text-retro-text text-xl md:text-2xl mb-4 text-shadow-retro" itemProp="headline">
        <Link href={`/writings/${slug}`} className="hover:text-retro-accent transition-colors" itemProp="url">
          {title}
        </Link>
      </h3>
      <p className="text-retro-text text-xl md:text-2xl leading-relaxed mb-4" itemProp="description">
        {excerpt}
      </p>
      <Link 
        href={`/writings/${slug}`}
        className="inline-block text-retro-accent hover:text-retro-text border border-retro-border px-4 py-2 text-sm hover:glow-retro transition-all"
      >
        READ MORE &gt;
      </Link>
    </article>
  );
}

