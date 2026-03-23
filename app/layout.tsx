import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SafeDate - Plan Safe Dates Together',
  description:
    'Plan your date safely. Share a link, pick preferences together, and get curated venue suggestions with built-in safety features.',
  keywords: ['safe date', 'date planning', 'Delhi', 'Mumbai', 'venues', 'safety'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#0f0f1a] text-white antialiased">{children}</body>
    </html>
  );
}
