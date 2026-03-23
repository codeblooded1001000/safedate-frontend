'use client';

import { useState } from 'react';
import { api } from '@/lib/api';

const DEFAULT_PREFERENCES = {
  latitude: 0,
  longitude: 0,
  areaName: '',
  budgetMin: 300,
  budgetMax: 1500,
  vibes: [] as string[],
  timeSlot: 'EVENING' as string,
};

export function usePreferences(sessionCode: string, userType: string) {
  const [preferences, setPreferences] = useState(DEFAULT_PREFERENCES);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  function updatePreference<K extends keyof typeof DEFAULT_PREFERENCES>(
    key: K,
    value: (typeof DEFAULT_PREFERENCES)[K],
  ) {
    setPreferences((prev) => ({ ...prev, [key]: value }));
  }

  function toggleVibe(vibe: string) {
    setPreferences((prev) => ({
      ...prev,
      vibes: prev.vibes.includes(vibe)
        ? prev.vibes.filter((v) => v !== vibe)
        : [...prev.vibes, vibe],
    }));
  }

  async function submitPreferences() {
    if (!preferences.latitude || !preferences.longitude) {
      setError('Please select your location');
      return false;
    }
    if (preferences.vibes.length === 0) {
      setError('Please select at least one vibe');
      return false;
    }

    setIsSubmitting(true);
    setError('');

    try {
      await api.submitPreferences(sessionCode, {
        userType,
        ...preferences,
      });
      return true;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit preferences');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    preferences,
    updatePreference,
    toggleVibe,
    submitPreferences,
    isSubmitting,
    error,
  };
}
