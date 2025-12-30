'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      // Redirect to admin dashboard
      router.push('/admin');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen relative p-6 md:p-8 flex items-center justify-center">
      <div className="max-w-md w-full relative z-10">
        <div className="border border-retro-border p-8 bg-retro-bg/50 backdrop-blur-sm">
          <h1 className="text-3xl md:text-4xl text-retro-text mb-6 text-shadow-retro text-center">
            &gt; ADMIN LOGIN
          </h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-retro-text mb-2 text-sm">
                USERNAME:
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full bg-retro-bg border border-retro-border px-4 py-2 text-retro-text focus:outline-none focus:border-retro-border focus:glow-retro"
                autoComplete="username"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-retro-text mb-2 text-sm">
                PASSWORD:
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-retro-bg border border-retro-border px-4 py-2 text-retro-text focus:outline-none focus:border-retro-border focus:glow-retro"
                autoComplete="current-password"
              />
            </div>

            {error && (
              <div className="text-retro-muted text-sm text-center border border-retro-border px-4 py-2">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full border border-retro-border px-6 py-3 text-retro-text hover:bg-retro-text hover:text-retro-bg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed glow-retro"
            >
              {isLoading ? 'LOGGING IN...' : 'LOGIN'}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}

