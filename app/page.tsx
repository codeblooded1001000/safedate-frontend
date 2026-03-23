'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-dark overflow-hidden">
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ x: [0, 100, 0], y: [0, -50, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-40 -right-40 w-96 h-96 rounded-full blur-3xl"
          style={{ background: 'radial-gradient(circle, rgba(255,107,107,0.3), rgba(255,142,83,0.2))' }}
        />
        <motion.div
          animate={{ x: [0, -80, 0], y: [0, 80, 0], scale: [1, 1.3, 1] }}
          transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full blur-3xl"
          style={{ background: 'radial-gradient(circle, rgba(118,75,162,0.3), rgba(17,153,142,0.2))' }}
        />
      </div>

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
            <span className="text-lg">💜</span>
          </div>
          <span className="text-xl font-bold text-white">SafeDate</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3"
        >
          <span className="px-3 py-1.5 rounded-full text-sm border"
            style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)', borderColor: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.8)' }}>
            Delhi NCR & Mumbai
          </span>
        </motion.div>
      </nav>

      {/* Hero */}
      <main className="relative z-10 px-6 pt-16 pb-24 max-w-lg mx-auto text-center">
        {/* Floating emojis */}
        <motion.div
          animate={{ y: [0, -10, 0], rotate: [0, 10, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="absolute top-10 left-10 text-4xl pointer-events-none select-none"
        >
          💜
        </motion.div>
        <motion.div
          animate={{ y: [0, -15, 0], rotate: [0, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
          className="absolute top-20 right-10 text-3xl pointer-events-none select-none"
        >
          ✨
        </motion.div>
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, delay: 1 }}
          className="absolute top-40 right-20 text-2xl pointer-events-none select-none"
        >
          🎯
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight mb-6">
            Plan dates that
            <br />
            <span className="text-gradient-primary">
              actually happen
            </span>
          </h1>

          <p className="text-lg mb-10 max-w-md mx-auto leading-relaxed" style={{ color: 'rgba(255,255,255,0.7)' }}>
            Share a link. Pick a spot together.
            <br />
            Stay safe with built-in check-ins.
          </p>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Link
              href="/create"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-primary text-white font-semibold text-lg transition-all"
              style={{ boxShadow: '0 8px 32px rgba(255, 107, 107, 0.3)' }}
            >
              <span>✨</span>
              Start planning
              <motion.span
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                →
              </motion.span>
            </Link>
          </motion.div>
        </motion.div>

        {/* Feature pills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-wrap justify-center gap-3 mt-12"
        >
          {[
            { icon: '🎯', label: 'Midpoint matching' },
            { icon: '✅', label: 'Verified venues' },
            { icon: '🛡️', label: 'Safety check-ins' },
            { icon: '💜', label: 'Both decide together' },
          ].map((feature, i) => (
            <motion.div
              key={feature.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + i * 0.1 }}
              whileHover={{ scale: 1.05, y: -2 }}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-sm"
              style={{
                background: 'rgba(255,255,255,0.05)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'rgba(255,255,255,0.8)'
              }}
            >
              <span>{feature.icon}</span>
              <span>{feature.label}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* How it works */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-20"
        >
          <h2 className="text-2xl font-bold text-white mb-8">How it works</h2>

          <div className="flex flex-col gap-4">
            {[
              { step: 1, emoji: '🔗', title: 'Share a link', desc: 'Send to your date via any app' },
              { step: 2, emoji: '🎯', title: 'Both pick preferences', desc: 'Location, vibe, budget' },
              { step: 3, emoji: '💜', title: 'Suggest spots', desc: 'Match on a place together' },
              { step: 4, emoji: '🛡️', title: 'Stay safe', desc: 'Share location with a trusted friend' },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1 + i * 0.15 }}
                whileHover={{ x: 8 }}
                className="flex items-center gap-4 p-4 rounded-2xl text-left"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255,255,255,0.1)'
                }}
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center text-2xl shrink-0">
                  {item.emoji}
                </div>
                <div>
                  <h3 className="font-semibold text-white">{item.title}</h3>
                  <p className="text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>{item.desc}</p>
                </div>
                <div className="ml-auto font-bold text-lg" style={{ color: 'rgba(255,255,255,0.3)' }}>
                  0{item.step}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Safety section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6 }}
          className="mt-16 p-8 rounded-3xl text-center"
          style={{
            background: 'rgba(17,153,142,0.1)',
            border: '1px solid rgba(17,153,142,0.3)'
          }}
        >
          <div className="text-4xl mb-4">🛡️</div>
          <h2 className="text-2xl font-bold text-white mb-3">Safety built in</h2>
          <p className="mb-6 max-w-md mx-auto" style={{ color: 'rgba(255,255,255,0.7)' }}>
            Add a trusted contact who gets notified when your date starts. Automatic check-ins and one-tap SOS.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {['Safety contacts', 'Periodic check-ins', 'One-tap SOS', 'Location sharing'].map((f) => (
              <span key={f} className="px-4 py-2 rounded-full text-sm font-medium"
                style={{ background: 'rgba(56,239,125,0.15)', color: '#38ef7d' }}>
                {f}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="mt-16 text-sm"
          style={{ color: 'rgba(255,255,255,0.3)' }}
        >
          <p>SafeDate — Because every date should feel safe.</p>
        </motion.footer>
      </main>
    </div>
  );
}
