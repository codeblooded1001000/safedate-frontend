'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';

interface SessionHeaderProps {
  session: any;
  userType: 'creator' | 'partner' | null;
  isConnected: boolean;
}

export function SessionHeader({ session, userType, isConnected }: SessionHeaderProps) {
  const shareUrl = typeof window !== 'undefined' ? window.location.href.split('?')[0] : '';

  async function copyLink() {
    await navigator.clipboard.writeText(shareUrl);
  }

  return (
    <header className="sticky top-0 z-10" style={{ background: 'rgba(15,15,26,0.85)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
      <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-1.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-primary flex items-center justify-center">
              <span className="text-sm">💜</span>
            </div>
            <span className="font-bold text-white text-sm hidden sm:block">SafeDate</span>
          </Link>

          {session && (
            <>
              <span style={{ color: 'rgba(255,255,255,0.2)' }}>|</span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-sm" style={{ color: '#FF8E53' }}>
                    {session.shortCode}
                  </span>
                  <span
                    className={cn('w-2 h-2 rounded-full', isConnected ? 'animate-pulse' : '')}
                    style={{ background: isConnected ? '#38ef7d' : 'rgba(255,255,255,0.3)' }}
                    title={isConnected ? 'Connected' : 'Connecting...'}
                  />
                </div>
                <div className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
                  {session.partnerName
                    ? `${session.creatorName} & ${session.partnerName}`
                    : `${session.creatorName} (waiting for partner)`}
                </div>
              </div>
            </>
          )}
        </div>

        <div className="flex items-center gap-2">
          {session && !session.partnerName && (
            <button
              onClick={copyLink}
              className="text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
              style={{ background: 'rgba(255,107,107,0.15)', color: '#FF8E53', border: '1px solid rgba(255,107,107,0.2)' }}
            >
              Copy Link
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
