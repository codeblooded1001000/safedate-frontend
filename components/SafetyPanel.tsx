'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SafetyPanelProps {
  sessionCode: string;
  userType: 'creator' | 'partner';
  contacts: any[];
  isDateActive: boolean;
  onContactAdded: () => void;
}

export function SafetyPanel({
  sessionCode: _sessionCode,
  userType: _userType,
  contacts,
  isDateActive: _isDateActive,
  onContactAdded: _onContactAdded,
}: SafetyPanelProps) {
  const [isOpen, setIsOpen] = useState(false);

  const myContacts = contacts?.filter((c) => c.isActive) || [];

  return (
    <div className="mt-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-3 px-4 rounded-xl transition-all"
        style={{ background: 'rgba(17,153,142,0.1)', border: '1px solid rgba(17,153,142,0.25)' }}
      >
        <div className="flex items-center gap-2">
          <span className="text-lg">🛡️</span>
          <span className="font-semibold text-white">Safety features</span>
          <span
            className="text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full"
            style={{ background: 'rgba(245,158,11,0.2)', color: '#fcd34d', border: '1px solid rgba(245,158,11,0.35)' }}
          >
            Coming soon
          </span>
          {myContacts.length > 0 && (
            <span className="text-white text-xs px-2 py-0.5 rounded-full" style={{ background: '#11998e' }}>
              {myContacts.length}
            </span>
          )}
        </div>
        <span style={{ color: 'rgba(255,255,255,0.4)' }}>{isOpen ? '▲' : '▼'}</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 p-4 rounded-2xl overflow-hidden space-y-3"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
          >
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.72)' }}>
              Safety actions are temporarily disabled while we finish this feature.
            </p>

            <div className="grid gap-2">
              <button
                disabled
                className="w-full py-2.5 rounded-xl font-medium opacity-60 cursor-not-allowed"
                style={{ background: 'rgba(239,68,68,0.35)', color: 'rgba(255,255,255,0.8)' }}
              >
                🚨 Send SOS Alert (Coming soon)
              </button>
              <button
                disabled
                className="w-full py-2.5 rounded-xl font-medium opacity-60 cursor-not-allowed"
                style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.75)' }}
              >
                📍 Share location with contacts (Coming soon)
              </button>
              <button
                disabled
                className="w-full py-2.5 rounded-xl font-medium opacity-60 cursor-not-allowed"
                style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.75)' }}
              >
                + Add safety contact (Coming soon)
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
