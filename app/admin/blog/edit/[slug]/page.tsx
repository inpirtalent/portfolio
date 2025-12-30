'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams, useParams } from 'next/navigation';
import Link from 'next/link';
import AdminAuthGuard from '@/components/AdminAuthGuard';

function EditBlogForm() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const recordId = searchParams.get('id');
  const slug = (params?.slug as string) || '';

  const [formData, setFormData] = useState({
    title: '',
    date: new Date().toISOString().split('T')[0],
    category: '',
    excerpt: '',
    content: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) {
        setError('Missing post slug');
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/posts/${slug}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.details || data.error || 'Failed to fetch post');
        }

        const post = data.post;
        
        // If content is an array, join it with double newlines
        const contentText = Array.isArray(post.content) 
          ? post.content.join('\n\n') 
          : post.content;

        setFormData({
          title: post.title,
          date: post.date.split('T')[0], // Extract date part if it includes time
          category: post.category,
          excerpt: post.excerpt,
          content: contentText,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load post');
        console.error('Error fetching post:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch(`/api/posts/${slug}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recordId,
          title: formData.title.trim(),
          date: formData.date,
          category: formData.category.trim(),
          excerpt: formData.excerpt.trim(),
          content: formData.content.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.details || data.error || 'Failed to update post');
      }

      setSubmitStatus('success');
      setTimeout(() => {
        router.push('/admin');
      }, 2000);
    } catch (error) {
      setSubmitStatus('error');
      console.error('Error updating post:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <main className="min-h-screen relative p-6 md:p-8">
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="text-retro-text text-center py-8">
            LOADING POST...
          </div>
        </div>
      </main>
    );
  }

  if (error && !formData.title) {
    return (
      <main className="min-h-screen relative p-6 md:p-8">
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="text-retro-muted text-center py-8 border border-retro-border p-4">
            ERROR: {error}
          </div>
          <Link
            href="/admin"
            className="inline-block mt-4 text-retro-text hover:text-retro-text border border-retro-border px-4 py-2 hover:glow-retro transition-all"
          >
            BACK TO ADMIN
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen relative p-6 md:p-8">
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl md:text-4xl text-retro-text mb-2 text-shadow-retro">
              &gt; ADMIN - EDIT POST
            </h1>
            <Link
              href="/admin"
              className="border border-retro-border px-4 py-2 text-retro-text hover:bg-retro-text hover:text-retro-bg transition-all text-sm"
            >
              BACK TO DASHBOARD
            </Link>
          </div>
          <p className="text-retro-text text-sm">
            Edit your blog post. Changes will be saved to Airtable.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="border border-retro-border p-6 md:p-8 bg-retro-bg/50 backdrop-blur-sm space-y-6">
          <div>
            <label htmlFor="title" className="block text-retro-text mb-2 text-sm">
              TITLE:
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full bg-retro-bg border border-retro-border px-4 py-2 text-retro-text focus:outline-none focus:border-retro-border focus:glow-retro"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="date" className="block text-retro-text mb-2 text-sm">
                DATE:
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="w-full bg-retro-bg border border-retro-border px-4 py-2 text-retro-text focus:outline-none focus:border-retro-border focus:glow-retro"
              />
            </div>

            <div>
              <label htmlFor="category" className="block text-retro-text mb-2 text-sm">
                CATEGORY:
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full bg-retro-bg border border-retro-border px-4 py-2 text-retro-text focus:outline-none focus:border-retro-border focus:glow-retro"
              >
                <option value="">Select category</option>
                <option value="Full-Stack">Full-Stack</option>
                <option value="Backend">Backend</option>
                <option value="Frontend">Frontend</option>
                <option value="Automation">Automation</option>
                <option value="Marketing">Marketing</option>
                <option value="Development">Development</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="excerpt" className="block text-retro-text mb-2 text-sm">
              EXCERPT (2-3 sentences):
            </label>
            <textarea
              id="excerpt"
              name="excerpt"
              value={formData.excerpt}
              onChange={handleChange}
              required
              rows={3}
              className="w-full bg-retro-bg border border-retro-border px-4 py-2 text-retro-text focus:outline-none focus:border-retro-border focus:glow-retro resize-none"
            />
          </div>

          <div>
            <label htmlFor="content" className="block text-retro-text mb-2 text-sm">
              CONTENT (separate paragraphs with blank lines):
            </label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              required
              rows={12}
              className="w-full bg-retro-bg border border-retro-border px-4 py-2 text-retro-text focus:outline-none focus:border-retro-border focus:glow-retro resize-none font-mono text-sm"
              placeholder="First paragraph...&#10;&#10;Second paragraph...&#10;&#10;Third paragraph..."
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full border border-retro-border px-6 py-3 text-retro-text hover:bg-retro-text hover:text-retro-bg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed glow-retro"
          >
            {isSubmitting ? 'UPDATING...' : 'UPDATE POST'}
          </button>

          {submitStatus === 'success' && (
            <div className="text-retro-text text-sm text-center border border-retro-border px-4 py-2">
              POST UPDATED SUCCESSFULLY! Redirecting...
            </div>
          )}
          {submitStatus === 'error' && (
            <div className="text-retro-muted text-sm text-center border border-retro-border px-4 py-2">
              ERROR UPDATING POST. PLEASE TRY AGAIN.
            </div>
          )}
        </form>
      </div>
    </main>
  );
}

export default function EditBlogPage() {
  return (
    <AdminAuthGuard>
      <Suspense fallback={
        <main className="min-h-screen relative p-6 md:p-8">
          <div className="max-w-4xl mx-auto relative z-10">
            <div className="text-retro-text text-center py-8">
              LOADING...
            </div>
          </div>
        </main>
      }>
        <EditBlogForm />
      </Suspense>
    </AdminAuthGuard>
  );
}

