'use client';

import { useState, useEffect } from 'react';
import TypingEffect from '@/components/TypingEffect';
import MouseTracker from '@/components/MouseTracker';
import BlogPost from '@/components/BlogPost';
import SkillsSection from '@/components/SkillsSection';
import StructuredData from '@/components/StructuredData';

interface Post {
  id: string;
  title: string;
  slug: string;
  date: string;
  category: string;
  excerpt: string;
  readTime?: number;
}

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [offset, setOffset] = useState(0);
  const initialLimit = 4;
  const loadMoreLimit = 2;

  useEffect(() => {
    async function fetchPosts() {
      try {
        const response = await fetch(`/api/posts?limit=${initialLimit}&offset=0`);
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: 'Failed to fetch posts' }));
          throw new Error(errorData.details || errorData.error || 'Failed to fetch posts');
        }
        
        const data = await response.json();
        
        if (!data.posts || !Array.isArray(data.posts)) {
          throw new Error('Invalid response format');
        }
        
        setPosts(data.posts);
        setHasMore(data.hasMore || false);
        setOffset(data.offset || data.posts.length);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load posts';
        setError(errorMessage);
        console.error('Error fetching posts:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, []);

  const handleLoadMore = async () => {
    if (loadingMore || !hasMore) return;

    setLoadingMore(true);
    setError(null); // Clear previous errors
    try {
      const response = await fetch(`/api/posts?limit=${loadMoreLimit}&offset=${offset}`);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to fetch more posts' }));
        throw new Error(errorData.details || errorData.error || 'Failed to fetch more posts');
      }
      
      const data = await response.json();
      
      if (!data.posts || !Array.isArray(data.posts)) {
        throw new Error('Invalid response format');
      }
      
      setPosts(prev => [...prev, ...data.posts]);
      setHasMore(data.hasMore || false);
      setOffset(data.offset || offset + data.posts.length);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load more posts';
      setError(errorMessage);
      console.error('Error fetching more posts:', err);
    } finally {
      setLoadingMore(false);
    }
  };

  const siteUrl = typeof window !== 'undefined' ? window.location.origin : process.env.NEXT_PUBLIC_SITE_URL || 'https://julianocoutinho.dev';

  const personStructuredData = {
    name: 'Juliano Coutinho',
    url: siteUrl,
    jobTitle: 'Full-Stack Developer | Marketing Specialist | Automation Engineer',
    description: 'Full-stack developer passionate about building modern web applications with Next.js, Node.js, and Ruby on Rails. Specializes in marketing automation and workflow optimization.',
    email: 'coutinhojuliano23@gmail.com',
    sameAs: [
      'https://linkedin.com/in/juliano-coutinhos',
      'https://github.com/inpirtalent',
    ],
    knowsAbout: [
      'JavaScript',
      'TypeScript',
      'Next.js',
      'React',
      'Angular',
      'Node.js',
      'Ruby on Rails',
      'PostgreSQL',
      'MongoDB',
      'Marketing Automation',
      'Make.com',
      'Airtable',
      'Web Development',
      'Full-Stack Development',
    ],
    alumniOf: {
      '@type': 'Organization',
      name: 'Developer',
    },
  };

  const websiteStructuredData = {
    name: 'Juliano Coutinho - Portfolio',
    url: siteUrl,
    description: 'Full-stack developer specializing in Next.js, Node.js, Ruby on Rails, and marketing automation.',
    publisher: {
      '@type': 'Person',
      name: 'Juliano Coutinho',
    },
  };

  return (
    <main className="min-h-screen relative scan-line">
      <StructuredData type="Person" data={personStructuredData} />
      <StructuredData type="WebSite" data={websiteStructuredData} />
      <TypingEffect />
      <MouseTracker />
      
      {/* Header */}
      <header className="relative z-10 border-b border-retro-border p-6 md:p-8" itemScope itemType="https://schema.org/Person">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl md:text-5xl lg:text-6xl text-retro-text text-shadow-retro mb-4" style={{ fontFamily: "'Press Start 2P', monospace" }} itemProp="name">
            JULIANO COUTINHO
          </h1>
          <p className="text-retro-text text-lg md:text-xl mb-4" itemProp="jobTitle">
            &gt; Full-Stack Developer | Marketing Specialist | Automation Engineer
          </p>
          <div className="flex flex-wrap gap-4 text-sm md:text-base">
            <a
              href="mailto:coutinhojuliano23@gmail.com"
              className="text-retro-text hover:text-retro-text border border-retro-border px-4 py-2 hover:glow-retro transition-all"
              itemProp="email"
            >
              EMAIL
            </a>
            <a
              href="https://linkedin.com/in/juliano-coutinhos"
              target="_blank"
              rel="noopener noreferrer"
              className="text-retro-text hover:text-retro-text border border-retro-border px-4 py-2 hover:glow-retro transition-all"
            >
              LINKEDIN
            </a>
            <a
              href={`https://github.com/inpirtalent`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-retro-text hover:text-retro-text border border-retro-border px-4 py-2 hover:glow-retro transition-all"
            >
              GITHUB
            </a>
          </div>
        </div>
      </header>

      {/* About Section */}
      <section className="relative z-10 border-b border-retro-border p-6 md:p-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl text-retro-text mb-4 text-shadow-retro">
            &gt; ABOUT
          </h2>
          <div className="text-retro-text text-xl md:text-2xl leading-relaxed space-y-4">
            <p>
              I&apos;m a full-stack developer passionate about building modern web applications with Next.js, Node.js, and Ruby on Rails. I transform complex business requirements into elegant, scalable solutions that deliver real value.
            </p>
            <p>
              On the frontend, I craft intuitive user experiences using React, Next.js, and modern CSS frameworks. I&apos;m skilled in creating responsive, performant interfaces that work seamlessly across all devices.
            </p>
            <p>
              For backend development, I leverage Node.js and Ruby on Rails to build robust APIs, handle database operations, and implement secure authentication systems. I&apos;m experienced with PostgreSQL, MongoDB, and RESTful architecture.
            </p>
            <p>
              Beyond traditional development, I specialize in marketing automation and workflow optimization. Using Airtable and Make.com, I&apos;ve automated complex business processes, reducing manual work by up to 80% and increasing operational efficiency.
            </p>
            <p>
              My marketing expertise includes developing data-driven strategies, running successful campaigns, and analyzing performance metrics. I bridge the gap between technical implementation and business objectives.
            </p>
            <p>
              I&apos;m always exploring new technologies and methodologies to stay at the forefront of web development. Whether it&apos;s implementing the latest Next.js features, optimizing database queries, or creating seamless automation workflows, I&apos;m driven by the challenge of solving complex problems.
            </p>
          </div>
        </div>
      </section>

      {/* Writing Section */}
      <section className="relative z-10 border-b border-retro-border p-6 md:p-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl text-retro-text mb-8 text-shadow-retro">
            &gt; BLOG POSTS
          </h2>
          {loading && (
            <div className="text-retro-text text-center py-8">
              LOADING POSTS...
            </div>
          )}
          {error && (
            <div className="text-retro-muted text-center py-8 border border-retro-border p-4">
              ERROR: {error}
            </div>
          )}
          {!loading && !error && (
            <>
              {posts.length === 0 ? (
                <div className="text-retro-text text-center py-8">
                  NO POSTS FOUND
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {posts.map((writing) => (
                      <BlogPost
                        key={writing.id}
                        title={writing.title}
                        date={writing.date}
                        category={writing.category}
                        slug={writing.slug}
                        excerpt={writing.excerpt}
                        readTime={writing.readTime}
                      />
                    ))}
                  </div>
                  {hasMore && (
                    <div className="mt-8 text-center">
                      <button
                        onClick={handleLoadMore}
                        disabled={loadingMore}
                        className="border border-retro-border px-6 py-3 text-retro-text hover:bg-retro-text hover:text-retro-bg transition-all duration-300 glow-retro disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loadingMore ? 'LOADING...' : 'SHOW MORE'}
                      </button>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </section>

      {/* Skills Section */}
      <section className="relative z-10 border-b border-retro-border p-6 md:p-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl text-retro-text mb-8 text-shadow-retro">
            &gt; SKILLS
          </h2>
          <div className="space-y-8">
            <SkillsSection
              title="Languages"
              items={['JavaScript', 'TypeScript', 'Ruby', 'Python', 'HTML', 'CSS', 'SQL']}
              color="green"
            />
            <SkillsSection
              title="Frameworks & Libraries"
              items={['Next.js', 'React', 'Angular', 'Node.js', 'Ruby on Rails', 'Express.js', 'Tailwind CSS']}
              color="cyan"
            />
            <SkillsSection
              title="Databases"
              items={['PostgreSQL', 'MongoDB', 'MySQL', 'Airtable']}
              color="yellow"
            />
            <SkillsSection
              title="Tools & Platforms"
              items={['Make.com', 'Zapier', 'Git', 'GitHub', 'Vercel', 'Docker', 'AWS']}
              color="magenta"
            />
            <SkillsSection
              title="Marketing & Analytics"
              items={['Google Analytics', 'SEO', 'HubSpot', 'Salesforce', 'Data visualization', 'A/B Testing', 'Campaign Management']}
              color="magenta"
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-retro-border p-6 md:p-8 mt-12">
        <div className="max-w-7xl mx-auto text-center text-retro-text text-sm">
          <p>&copy; 2026 JULIANO COUTINHO. ALL RIGHTS RESERVED.</p>
          <p className="mt-2 text-retro-text">BUILT WITH COFFEE & LOVE</p>
        </div>
      </footer>
    </main>
  );
}

