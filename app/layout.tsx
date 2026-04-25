import type { Metadata, Viewport } from 'next';
import './globals.css';
import { PwaInstallPrompt } from '@/components/PwaInstallPrompt';

export const metadata: Metadata = {
  title: 'SafeDate - Plan Safe Dates Together',
  description:
    'Plan your date safely. Share a link, pick preferences together, and get curated venue suggestions with built-in safety features.',
  keywords: ['safe date', 'date planning', 'Delhi', 'Mumbai', 'venues', 'safety'],
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'SafeDate',
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
};

export const viewport: Viewport = {
  themeColor: '#0f0f1a',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#0f0f1a] text-white antialiased">
        {children}
        <PwaInstallPrompt />
      </body>
    </html>
  );
}
