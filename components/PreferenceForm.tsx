'use client';

import { motion } from 'framer-motion';
import { usePreferences } from '@/hooks/usePreferences';
import { LocationPicker } from './LocationPicker';

const VIBES = [
  { id: 'CAFE', emoji: '☕', label: 'Cafe', gradient: 'from-amber-500 to-orange-500' },
  { id: 'RESTAURANT', emoji: '🍽️', label: 'Restaurant', gradient: 'from-rose-500 to-pink-500' },
  { id: 'BAR', emoji: '🍸', label: 'Bar', gradient: 'from-purple-500 to-indigo-500' },
  { id: 'ACTIVITY', emoji: '🎯', label: 'Activity', gradient: 'from-teal-500 to-emerald-500' },
];

const TIME_SLOTS = [
  { id: 'LUNCH', emoji: '☀️', label: 'Lunch', time: '12pm – 4pm' },
  { id: 'EVENING', emoji: '🌆', label: 'Evening', time: '5pm – 10pm' },
  { id: 'LATE_NIGHT', emoji: '🌙', label: 'Late Night', time: '10pm+' },
];

const BUDGET_OPTIONS = [
  { label: 'Under ₹500', emoji: '💰', min: 0, max: 500 },
  { label: '₹500 – ₹1,000', emoji: '💰💰', min: 500, max: 1000 },
  { label: '₹1,000 – ₹2,000', emoji: '💰💰💰', min: 1000, max: 2000 },
  { label: '₹2,000+', emoji: '💎', min: 2000, max: 5000 },
];

interface PreferenceFormProps {
  sessionCode: string;
  userType: 'creator' | 'partner';
  onSubmit: () => void;
}

export function PreferenceForm({ sessionCode, userType, onSubmit }: PreferenceFormProps) {
  const { preferences, updatePreference, toggleVibe, submitPreferences, isSubmitting, error } =
    usePreferences(sessionCode, userType.toUpperCase());

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const success = await submitPreferences();
    if (success) onSubmit();
  }

  const glassStyle = {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    backdropFilter: 'blur(12px)',
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center mb-4">
        <h2 className="text-2xl font-bold text-white">Your preferences</h2>
        <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.5)' }}>
          Your choices are private until both of you submit
        </p>
      </div>

      {/* Location */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-5 rounded-2xl"
        style={glassStyle}
      >
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <span>📍</span> Where are you?
        </h3>
        <LocationPicker
          onLocationSelect={(lat, lng, areaName) => {
            updatePreference('latitude', lat);
            updatePreference('longitude', lng);
            updatePreference('areaName', areaName);
          }}
          selected={
            preferences.latitude
              ? { lat: preferences.latitude, lng: preferences.longitude, areaName: preferences.areaName }
              : undefined
          }
        />
      </motion.section>

      {/* Vibe */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="p-5 rounded-2xl"
        style={glassStyle}
      >
        <h3 className="text-lg font-semibold text-white mb-1 flex items-center gap-2">
          <span>✨</span> What&apos;s the vibe?
        </h3>
        <p className="text-sm mb-4" style={{ color: 'rgba(255,255,255,0.5)' }}>Select all that work for you</p>

        <div className="grid grid-cols-2 gap-3">
          {VIBES.map((vibe, i) => {
            const isSelected = preferences.vibes.includes(vibe.id);
            return (
              <motion.button
                key={vibe.id}
                type="button"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => toggleVibe(vibe.id)}
                className={`relative p-5 rounded-2xl flex flex-col items-center gap-2 transition-all ${
                  isSelected
                    ? `bg-gradient-to-br ${vibe.gradient} text-white shadow-lg`
                    : 'text-white'
                }`}
                style={isSelected ? {} : {
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)'
                }}
              >
                <motion.span
                  className="text-3xl"
                  animate={isSelected ? { scale: [1, 1.3, 1], rotate: [0, 10, -10, 0] } : {}}
                  transition={{ duration: 0.4 }}
                >
                  {vibe.emoji}
                </motion.span>
                <span className="font-medium text-sm">{vibe.label}</span>
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-white rounded-full flex items-center justify-center text-xs font-bold text-gray-800 shadow"
                  >
                    ✓
                  </motion.div>
                )}
              </motion.button>
            );
          })}
        </div>
      </motion.section>

      {/* Time */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="p-5 rounded-2xl"
        style={glassStyle}
      >
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <span>🕐</span> When?
        </h3>
        <div className="flex gap-3">
          {TIME_SLOTS.map((slot) => {
            const isSelected = preferences.timeSlot === slot.id;
            return (
              <motion.button
                key={slot.id}
                type="button"
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => updatePreference('timeSlot', slot.id)}
                className="flex-1 p-4 rounded-2xl text-center transition-all"
                style={isSelected ? {
                  background: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E53 50%, #FFC837 100%)',
                  boxShadow: '0 8px 24px rgba(255,107,107,0.25)',
                  color: 'white'
                } : {
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: 'rgba(255,255,255,0.8)'
                }}
              >
                <span className="text-2xl block mb-1">{slot.emoji}</span>
                <p className="font-medium text-sm">{slot.label}</p>
                <p className="text-xs opacity-70">{slot.time}</p>
              </motion.button>
            );
          })}
        </div>
      </motion.section>

      {/* Budget */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="p-5 rounded-2xl"
        style={glassStyle}
      >
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <span>💸</span> Budget per person
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {BUDGET_OPTIONS.map((b) => {
            const isSelected = preferences.budgetMin === b.min && preferences.budgetMax === b.max;
            return (
              <motion.button
                key={b.label}
                type="button"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  updatePreference('budgetMin', b.min);
                  updatePreference('budgetMax', b.max);
                }}
                className="p-4 rounded-2xl text-center transition-all"
                style={isSelected ? {
                  background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
                  boxShadow: '0 8px 24px rgba(17,153,142,0.25)',
                  color: 'white'
                } : {
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: 'rgba(255,255,255,0.8)'
                }}
              >
                <span className="text-lg">{b.emoji}</span>
                <p className="font-medium text-sm mt-1">{b.label}</p>
              </motion.button>
            );
          })}
        </div>
      </motion.section>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-4 py-3 rounded-xl text-sm"
          style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', color: '#fca5a5' }}
        >
          {error}
        </motion.div>
      )}

      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        type="submit"
        disabled={isSubmitting || preferences.vibes.length === 0 || !preferences.latitude}
        className="w-full py-5 rounded-2xl bg-gradient-primary text-white font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
        style={{ boxShadow: '0 8px 32px rgba(255,107,107,0.25)' }}
      >
        {isSubmitting ? (
          <>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="w-5 h-5 border-2 rounded-full"
              style={{ borderColor: 'rgba(255,255,255,0.3)', borderTopColor: 'white' }}
            />
            Submitting...
          </>
        ) : (
          <>
            Find venues
            <motion.span
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              🔥
            </motion.span>
          </>
        )}
      </motion.button>
    </form>
  );
}
