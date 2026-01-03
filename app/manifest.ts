import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://julianocoutinho.dev';

  return {
    name: 'Juliano Coutinho - Portfolio',
    short_name: 'Juliano Coutinho',
    description: 'Full-stack developer specializing in Next.js, Node.js, Ruby on Rails, and marketing automation.',
    start_url: '/',
    display: 'standalone',
    background_color: '#000000',
    theme_color: '#00ff00',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
    categories: ['portfolio', 'developer', 'technology'],
    lang: 'en',
    dir: 'ltr',
    orientation: 'any',
  };
}

