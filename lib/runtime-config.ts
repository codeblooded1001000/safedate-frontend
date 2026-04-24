const isProduction = process.env.NODE_ENV === 'production';

export function getPublicApiUrl(): string {
  const value = process.env.NEXT_PUBLIC_API_URL?.trim();
  if (value) return value;

  if (isProduction) {
    throw new Error(
      'NEXT_PUBLIC_API_URL is required in production. Set it in Vercel project environment variables.',
    );
  }

  return 'http://localhost:3001';
}
