'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';

export default function CreatePage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState('');

  async function handleCreate() {
    setError('');
    setIsCreating(true);
    try {
      const session = await api.createSession({ creatorName: name, creatorPhone: phone });
      router.push(`/plan/${session.shortCode}?role=creator`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create session. Please try again.');
      setIsCreating(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-dark flex flex-col">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
          className="absolute -top-1/2 -right-1/2 w-full h-full"
          style={{
            background: 'conic-gradient(from 0deg, transparent, rgba(255,107,107,0.06), transparent)',
          }}
        />
        <motion.div
          animate={{ x: [0, 60, 0], y: [0, -40, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-20 left-10 w-64 h-64 rounded-full blur-3xl"
          style={{ background: 'radial-gradient(circle, rgba(118,75,162,0.2), transparent)' }}
        />
      </div>

      {/* Nav */}
      <nav className="relative z-10 flex items-center gap-3 px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
            <span className="text-lg">💜</span>
          </div>
          <span className="text-xl font-bold text-white">SafeDate</span>
        </Link>
      </nav>

      <main className="relative z-10 flex-1 flex flex-col justify-center px-6 pb-20 max-w-md mx-auto w-full">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div
              key="step0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-5"
            >
              {/* Chat bubble from app */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="p-5 rounded-3xl rounded-tl-lg"
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255,255,255,0.1)'
                }}
              >
                <p className="text-white text-lg">Hey! 👋 Let&apos;s plan your date.</p>
                <p className="mt-2" style={{ color: 'rgba(255,255,255,0.7)' }}>What&apos;s your name?</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && name && setStep(1)}
                  placeholder="Your first name"
                  className="w-full px-5 py-4 rounded-2xl text-white text-lg transition-all"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.2)',
                  }}
                  autoFocus
                />
              </motion.div>

              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                onClick={() => name.trim() && setStep(1)}
                disabled={!name.trim()}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-4 rounded-2xl bg-gradient-primary text-white font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ boxShadow: '0 8px 32px rgba(255, 107, 107, 0.25)' }}
              >
                Continue →
              </motion.button>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-5"
            >
              {/* Previous answer shown as user bubble */}
              <div className="flex justify-end">
                <div className="px-5 py-3 rounded-3xl rounded-tr-lg bg-gradient-primary">
                  <p className="text-white font-medium">{name}</p>
                </div>
              </div>

              {/* New question */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="p-5 rounded-3xl rounded-tl-lg"
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255,255,255,0.1)'
                }}
              >
                <p className="text-white text-lg">Nice to meet you, {name}! 💜</p>
                <p className="mt-2" style={{ color: 'rgba(255,255,255,0.7)' }}>
                  Drop your number — we&apos;ll only use it for safety check-ins (never shared with your date).
                </p>
              </motion.div>

              {/* Phone input */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex gap-3"
              >
                <div
                  className="px-4 py-4 rounded-2xl shrink-0 flex items-center font-medium"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    color: 'rgba(255,255,255,0.7)'
                  }}
                >
                  +91
                </div>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  placeholder="9876543210"
                  className="flex-1 px-5 py-4 rounded-2xl text-white text-lg transition-all"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.2)',
                  }}
                  autoFocus
                />
              </motion.div>

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
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                onClick={handleCreate}
                disabled={phone.length !== 10 || isCreating}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-4 rounded-2xl bg-gradient-primary text-white font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                style={{ boxShadow: '0 8px 32px rgba(255, 107, 107, 0.25)' }}
              >
                {isCreating ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="w-5 h-5 border-2 rounded-full"
                      style={{ borderColor: 'rgba(255,255,255,0.3)', borderTopColor: 'white' }}
                    />
                    Creating your date plan...
                  </>
                ) : (
                  <>
                    Create date plan
                    <span>✨</span>
                  </>
                )}
              </motion.button>

              <p className="text-center text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>
                🔒 Your number stays private
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
