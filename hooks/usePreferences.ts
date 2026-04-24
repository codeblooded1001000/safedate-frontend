'use client';

import { useState } from 'react';
import { api } from '@/lib/api';

const ANYTHING_WORKS_VIBE = 'ANYTHING_WORKS';
const MAX_VIBE_SELECTIONS = 2;

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
    setPreferences((prev) => {
      if (vibe === ANYTHING_WORKS_VIBE) {
        setError('');
        return { ...prev, vibes: [ANYTHING_WORKS_VIBE] };
      }

      const concreteVibes = prev.vibes.filter((v) => v !== ANYTHING_WORKS_VIBE);
      if (concreteVibes.includes(vibe)) {
        setError('');
        return { ...prev, vibes: concreteVibes.filter((v) => v !== vibe) };
      }

      if (concreteVibes.length >= MAX_VIBE_SELECTIONS) {
        setError('You can choose up to 2 vibes, or select "Anything works".');
        return prev;
      }

      setError('');
      return { ...prev, vibes: [...concreteVibes, vibe] };
    });
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
      const selectedVibes = preferences.vibes.includes(ANYTHING_WORKS_VIBE)
        ? []
        : preferences.vibes;
      await api.submitPreferences(sessionCode, {
        userType,
        ...preferences,
        vibes: selectedVibes,
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
