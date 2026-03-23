'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '@/lib/api';

interface SafetyPanelProps {
  sessionCode: string;
  userType: 'creator' | 'partner';
  contacts: any[];
  isDateActive: boolean;
  onContactAdded: () => void;
}

export function SafetyPanel({
  sessionCode,
  userType,
  contacts,
  isDateActive,
  onContactAdded,
}: SafetyPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [checkinInterval, setCheckinInterval] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [sosConfirm, setSosConfirm] = useState(false);

  const myContacts = contacts?.filter(
    (c) => c.userType === userType.toUpperCase() && c.isActive,
  );

  async function handleAddContact(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    try {
      await api.addSafetyContact(sessionCode, {
        userType: userType.toUpperCase(),
        contactName,
        contactPhone,
        notifyOnStart: true,
        checkinIntervalMins: checkinInterval || undefined,
      });
      setContactName('');
      setContactPhone('');
      setCheckinInterval(null);
      setShowAddForm(false);
      onContactAdded();
    } catch (err) {
      // silent
    } finally {
      setIsLoading(false);
    }
  }

  async function handleRemoveContact(contactId: string) {
    await api.removeSafetyContact(sessionCode, contactId);
    onContactAdded();
  }

  async function handleShareLocation() {
    await api.shareLocation(sessionCode, userType.toUpperCase());
  }

  async function handleSOS() {
    if (!sosConfirm) {
      setSosConfirm(true);
      setTimeout(() => setSosConfirm(false), 5000);
      return;
    }
    await api.sos(sessionCode, userType.toUpperCase());
    setSosConfirm(false);
  }

  const glassStyle = {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
  };

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
          {myContacts?.length > 0 && (
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
            className="mt-3 space-y-3 overflow-hidden"
          >
            {/* SOS button when date is active */}
            {isDateActive && (
              <motion.button
                onClick={handleSOS}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 rounded-xl font-bold text-white transition-all"
                style={sosConfirm
                  ? { background: '#dc2626', boxShadow: '0 0 20px rgba(220,38,38,0.4)', animation: 'pulse 1s infinite' }
                  : { background: '#ef4444', boxShadow: '0 4px 16px rgba(239,68,68,0.3)' }}
              >
                {sosConfirm ? 'Tap again to confirm SOS' : '🚨 Send SOS Alert'}
              </motion.button>
            )}

            {/* Safety contacts */}
            <div className="p-4 rounded-2xl" style={glassStyle}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-white">Safety contacts</h3>
                <button
                  onClick={() => setShowAddForm(!showAddForm)}
                  className="text-sm font-medium"
                  style={{ color: '#FF8E53' }}
                >
                  + Add
                </button>
              </div>

              {myContacts?.length === 0 && !showAddForm && (
                <p className="text-sm text-center py-3" style={{ color: 'rgba(255,255,255,0.4)' }}>
                  No safety contacts added yet. Add someone you trust.
                </p>
              )}

              {myContacts?.map((contact: any) => (
                <div
                  key={contact.id}
                  className="flex items-center justify-between py-2"
                  style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}
                >
                  <div>
                    <div className="font-medium text-sm text-white">{contact.contactName}</div>
                    <div className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{contact.contactPhone}</div>
                  </div>
                  <button
                    onClick={() => handleRemoveContact(contact.id)}
                    className="text-xs"
                    style={{ color: '#fca5a5' }}
                  >
                    Remove
                  </button>
                </div>
              ))}

              {showAddForm && (
                <form
                  onSubmit={handleAddContact}
                  className="mt-3 space-y-3 pt-3"
                  style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}
                >
                  <input
                    type="text"
                    placeholder="Contact name"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    className="input-field text-sm"
                    required
                  />
                  <input
                    type="tel"
                    placeholder="Phone number"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    className="input-field text-sm"
                    required
                    pattern="[6-9][0-9]{9}"
                  />
                  <div>
                    <label className="text-xs block mb-1" style={{ color: 'rgba(255,255,255,0.5)' }}>Check-in interval</label>
                    <select
                      value={checkinInterval || ''}
                      onChange={(e) => setCheckinInterval(e.target.value ? Number(e.target.value) : null)}
                      className="input-field text-sm"
                    >
                      <option value="" style={{ background: '#1a1a2e' }}>No check-ins</option>
                      <option value="30" style={{ background: '#1a1a2e' }}>Every 30 mins</option>
                      <option value="60" style={{ background: '#1a1a2e' }}>Every hour</option>
                      <option value="120" style={{ background: '#1a1a2e' }}>Every 2 hours</option>
                    </select>
                  </div>
                  <div className="flex gap-2">
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      disabled={isLoading}
                      className="flex-1 py-2 rounded-xl text-sm font-semibold text-white disabled:opacity-50"
                      style={{ background: 'linear-gradient(135deg, #FF6B6B, #FF8E53)' }}
                    >
                      {isLoading ? 'Adding...' : 'Add contact'}
                    </motion.button>
                    <button
                      type="button"
                      onClick={() => setShowAddForm(false)}
                      className="px-4 py-2 rounded-xl text-sm"
                      style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.6)' }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Share location */}
            {isDateActive && myContacts?.length > 0 && (
              <button
                onClick={handleShareLocation}
                className="w-full py-3 rounded-xl font-medium transition-all"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.8)' }}
              >
                📍 Share location with contacts
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
