'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AdminAuthGuard from '@/components/AdminAuthGuard';

function AddBlogForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    date: new Date().toISOString().split('T')[0],
    category: '',
    slug: '',
    excerpt: '',
    content: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      // Auto-generate slug from title
      ...(name === 'title' && { slug: value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') })
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title.trim(),
          date: formData.date,
          category: formData.category.trim(),
          excerpt: formData.excerpt.trim(),
          content: formData.content.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.details || data.error || 'Failed to create post');
      }

      setSubmitStatus('success');
      setFormData({
        title: '',
        date: new Date().toISOString().split('T')[0],
        category: '',
        slug: '',
        excerpt: '',
        content: '',
      });

      setTimeout(() => {
        setSubmitStatus('idle');
        router.push('/admin');
      }, 2000);
    } catch (error) {
      setSubmitStatus('error');
      console.error('Error creating post:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen relative p-6 md:p-8">
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl md:text-4xl text-retro-text mb-2 text-shadow-retro">
              &gt; ADMIN - ADD POST
            </h1>
            <Link
              href="/admin"
              className="border border-retro-border px-4 py-2 text-retro-text hover:bg-retro-text hover:text-retro-bg transition-all text-sm"
            >
              BACK TO DASHBOARD
            </Link>
          </div>
          <p className="text-retro-text text-sm">
            Add a new blog post. Changes will be saved to Airtable.
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

          <div>
            <label htmlFor="slug" className="block text-retro-text mb-2 text-sm">
              SLUG (URL):
            </label>
            <input
              type="text"
              id="slug"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              required
              className="w-full bg-retro-bg border border-retro-border px-4 py-2 text-retro-text focus:outline-none focus:border-retro-border focus:glow-retro"
              placeholder="auto-generated-from-title"
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
            {isSubmitting ? 'SUBMITTING...' : 'ADD POST'}
          </button>

          {submitStatus === 'success' && (
            <div className="text-retro-text text-sm text-center border border-retro-border px-4 py-2">
              POST ADDED SUCCESSFULLY! Redirecting...
            </div>
          )}
          {submitStatus === 'error' && (
            <div className="text-retro-muted text-sm text-center border border-retro-border px-4 py-2">
              ERROR ADDING POST. PLEASE TRY AGAIN.
            </div>
          )}
        </form>
      </div>
    </main>
  );
}

export default function AddBlogPage() {
  return (
    <AdminAuthGuard>
      <AddBlogForm />
    </AdminAuthGuard>
  );
}
