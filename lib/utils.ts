import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatBudget(min: number, max: number): string {
  if (min === max) return `₹${min}`;
  return `₹${min} – ₹${max}`;
}

export function formatPriceRange(range: number): string {
  return '₹'.repeat(range);
}

export function formatDistance(km: number): string {
  if (km < 1) return `${Math.round(km * 1000)}m`;
  return `${km.toFixed(1)}km`;
}

export function categoryLabel(cat: string): string {
  const map: Record<string, string> = {
    CAFE: 'Cafe',
    RESTAURANT: 'Restaurant',
    BAR: 'Bar',
    ACTIVITY: 'Activity',
  };
  return map[cat] || cat;
}

export function categoryEmoji(cat: string): string {
  const map: Record<string, string> = {
    CAFE: '☕',
    RESTAURANT: '🍽️',
    BAR: '🍸',
    ACTIVITY: '🎯',
  };
  return map[cat] || '📍';
}

export function timeSlotLabel(slot: string): string {
  const map: Record<string, string> = {
    LUNCH: 'Lunch (12pm - 4pm)',
    EVENING: 'Evening (5pm - 10pm)',
    LATE_NIGHT: 'Late Night (10pm+)',
  };
  return map[slot] || slot;
}
