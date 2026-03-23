'use client';

import Link from 'next/link';

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center max-w-sm">
        <div className="text-5xl mb-4">⚠️</div>
        <h1 className="text-xl font-bold text-gray-900 mb-2">Something went wrong</h1>
        <p className="text-gray-500 mb-6 text-sm">{error.message}</p>
        <div className="flex gap-3 justify-center">
          <button onClick={reset} className="btn-primary">
            Try again
          </button>
          <Link href="/" className="btn-secondary">
            Home
          </Link>
        </div>
      </div>
    </div>
  );
}
