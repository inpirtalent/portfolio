'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { formatDate } from '@/lib/dateUtils';

interface Post {
  id: string;
  title: string;
  slug: string;
  date: string;
  category: string;
  excerpt: string;
  readTime?: number;
}

export default function AdminPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/posts?limit=1000&offset=0');
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.details || data.error || 'Failed to fetch posts');
        }
        
        setPosts(data.posts || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load posts');
        console.error('Error fetching posts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleDelete = async (id: string, slug: string) => {
    if (!confirm('Are you sure you want to delete this post?')) {
      return;
    }

    setDeletingId(id);
    try {
      const response = await fetch(`/api/posts/${slug}?recordId=${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.details || data.error || 'Failed to delete post');
      }

      // Remove from local state
      setPosts(posts.filter(post => post.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete post');
      console.error('Error deleting post:', err);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <main className="min-h-screen relative p-6 md:p-8">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="mb-8">
          <Link
            href="/"
            className="inline-block text-retro-text hover:text-retro-text border border-retro-border px-4 py-2 mb-4 hover:glow-retro transition-all"
          >
            &lt; BACK TO HOME
          </Link>
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl md:text-4xl text-retro-text mb-2 text-shadow-retro">
              &gt; ADMIN DASHBOARD
            </h1>
            <Link
              href="/admin/blog/add"
              className="border border-retro-border px-6 py-3 text-retro-text hover:bg-retro-text hover:text-retro-bg transition-all duration-300 glow-retro"
            >
              + ADD NEW POST
            </Link>
          </div>
          <p className="text-retro-text text-sm">
            Manage your blog posts. No authentication required.
          </p>
        </div>

        {loading && (
          <div className="text-retro-text text-center py-8">
            LOADING POSTS...
          </div>
        )}

        {error && (
          <div className="text-retro-muted text-center py-8 border border-retro-border p-4 mb-4">
            ERROR: {error}
          </div>
        )}

        {!loading && !error && (
          <div className="border border-retro-border p-6 bg-retro-bg/50 backdrop-blur-sm">
            {posts.length === 0 ? (
              <div className="text-retro-text text-center py-8">
                NO POSTS FOUND. <Link href="/admin/blog/add" className="text-retro-text hover:underline">CREATE ONE</Link>
              </div>
            ) : (
              <div className="space-y-4">
                {posts.map((post) => (
                  <div
                    key={post.id}
                    className="border border-retro-border p-4 hover:glow-retro transition-all bg-retro-bg/30"
                  >
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-retro-text text-lg md:text-xl mb-2 text-shadow-retro">
                          {post.title}
                        </h3>
                        <div className="flex items-center gap-4 flex-wrap text-sm text-retro-text mb-2">
                          <span className="border border-retro-accent px-2 py-1 text-retro-accent text-xs">
                            {post.category}
                          </span>
                          <span className="text-retro-text">{formatDate(post.date)}</span>
                        </div>
                        <p className="text-retro-text text-sm line-clamp-2">{post.excerpt}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin/blog/edit/${post.slug}?id=${post.id}`}
                          className="border border-retro-border px-4 py-2 text-retro-text hover:bg-retro-text hover:text-retro-bg transition-all text-sm"
                        >
                          EDIT
                        </Link>
                        <button
                          onClick={() => handleDelete(post.id, post.slug)}
                          disabled={deletingId === post.id}
                          className="border border-retro-border px-4 py-2 text-retro-muted hover:bg-retro-text hover:text-retro-bg transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {deletingId === post.id ? 'DELETING...' : 'DELETE'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}

