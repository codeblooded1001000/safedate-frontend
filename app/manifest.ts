import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'SafeDate',
    short_name: 'SafeDate',
    description:
      'Plan your date safely. Share a link, pick preferences together, and get curated venue suggestions with built-in safety features.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0f0f1a',
    theme_color: '#0f0f1a',
    orientation: 'portrait',
    icons: [
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any',
      },
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'maskable',
      },
    ],
  };
}
