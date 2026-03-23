'use client';

import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession } from '@/hooks/useSession';
import { useSocket } from '@/hooks/useSocket';
import { PreferenceForm } from '@/components/PreferenceForm';
import { VenueList } from '@/components/VenueList';
import { SafetyPanel } from '@/components/SafetyPanel';
import { SessionHeader } from '@/components/SessionHeader';
import { MatchCelebration } from '@/components/MatchCelebration';
import { api } from '@/lib/api';
import { categoryEmoji } from '@/lib/utils';

type Stage = 'join' | 'preferences' | 'waiting' | 'venues' | 'confirmed';

export default function PlanPage() {
  const params = useParams<{ code: string }>();
  const code = params.code.toUpperCase();
  const searchParams = useSearchParams();
  const roleParam = searchParams.get('role');

  const { session, isLoading, error, refetch } = useSession(code);

  const [stage, setStage] = useState<Stage>('join');
  const [matchedVenue, setMatchedVenue] = useState<any | null>(null);
  const [userType, setUserType] = useState<'creator' | 'partner' | null>(
    roleParam === 'creator' ? 'creator' : null,
  );

  const { socket, isConnected } = useSocket(code, userType);
  const [partnerName, setPartnerName] = useState('');
  const [partnerPhone, setPartnerPhone] = useState('');
  const [joinLoading, setJoinLoading] = useState(false);
  const [joinError, setJoinError] = useState('');
  const [otherUserLeft, setOtherUserLeft] = useState(false);

  // Socket event listeners
  useEffect(() => {
    if (!socket) return;

    const onPartnerJoined = () => { setOtherUserLeft(false); refetch(); };
    const onPreferencesUpdated = () => refetch();
    const onVenueSuggested = () => refetch();
    const onVenueSelected = () => {
      setStage('confirmed');
      refetch();
    };
    const onVenueMatchedSocket = (data: any) => {
      // Show celebration — don't change stage yet, wait for user to dismiss
      setMatchedVenue(data.venue);
    };
    const onUserLeft = (data: any) => {
      if (data.userType?.toLowerCase() !== userType) setOtherUserLeft(true);
    };
    const onUserJoined = (data: any) => {
      if (data.userType?.toLowerCase() !== userType) setOtherUserLeft(false);
    };

    socket.on('partnerJoined', onPartnerJoined);
    socket.on('preferencesUpdated', onPreferencesUpdated);
    socket.on('venueSuggested', onVenueSuggested);
    socket.on('venueSelected', onVenueSelected);
    socket.on('venueMatched', onVenueMatchedSocket);
    socket.on('userLeft', onUserLeft);
    socket.on('userJoined', onUserJoined);

    return () => {
      socket.off('partnerJoined', onPartnerJoined);
      socket.off('preferencesUpdated', onPreferencesUpdated);
      socket.off('venueSuggested', onVenueSuggested);
      socket.off('venueSelected', onVenueSelected);
      socket.off('venueMatched', onVenueMatchedSocket);
      socket.off('userLeft', onUserLeft);
      socket.off('userJoined', onUserJoined);
    };
  }, [socket, refetch]);

  // Set initial stage and userType based on session state
  useEffect(() => {
    if (!session) return;

    if (session.status === 'VENUE_SELECTED' || session.status === 'COMPLETED') {
      setStage('confirmed');
      return;
    }

    if (roleParam === 'creator') {
      setUserType('creator');
      const creatorPref = session.preferences?.find((p: any) => p.userType === 'CREATOR');
      setStage(creatorPref ? (session.preferences?.length === 2 ? 'venues' : 'waiting') : 'preferences');
      return;
    }

    if (userType === 'partner') {
      const partnerPref = session.preferences?.find((p: any) => p.userType === 'PARTNER');
      setStage(partnerPref ? (session.preferences?.length === 2 ? 'venues' : 'waiting') : 'preferences');
      return;
    }

    if (!userType) setStage('join');
  }, [session, roleParam, userType]);

  async function handleJoin(e: React.FormEvent) {
    e.preventDefault();
    setJoinError('');
    setJoinLoading(true);
    try {
      await api.joinSession(code, { partnerName, partnerPhone });
      setUserType('partner');
      setStage('preferences');
      refetch();
    } catch (err: any) {
      setJoinError(err.response?.data?.message || 'Failed to join session');
    } finally {
      setJoinLoading(false);
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-dark">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="w-10 h-10 border-4 rounded-full mx-auto mb-4"
            style={{ borderColor: 'rgba(255,107,107,0.3)', borderTopColor: '#FF6B6B' }}
          />
          <p style={{ color: 'rgba(255,255,255,0.5)' }}>Loading session...</p>
        </div>
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-dark px-4">
        <div className="text-center max-w-sm">
          <div className="text-5xl mb-4">😕</div>
          <h1 className="text-xl font-bold text-white mb-2">Session not found</h1>
          <p className="mb-6" style={{ color: 'rgba(255,255,255,0.5)' }}>
            {error || 'This session may have expired or the link is incorrect.'}
          </p>
          <Link href="/" className="btn-primary inline-block">
            Start a new plan
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-dark">
      {/* Match celebration — lives at page level so it survives stage transitions */}
      {matchedVenue && (
        <MatchCelebration
          venue={matchedVenue}
          onContinue={() => {
            setMatchedVenue(null);
            setStage('confirmed');
            refetch();
          }}
        />
      )}

      <SessionHeader session={session} userType={userType} isConnected={isConnected} />

      <main className="max-w-lg mx-auto px-4 py-6 pb-16">
        {/* User left banner */}
        <AnimatePresence>
          {otherUserLeft && userType && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-4 px-4 py-3 rounded-xl flex items-center justify-between gap-3"
              style={{ background: 'rgba(234,179,8,0.12)', border: '1px solid rgba(234,179,8,0.25)' }}
            >
              <div className="flex items-center gap-2">
                <span>👋</span>
                <p className="text-sm font-medium" style={{ color: '#fde047' }}>
                  {userType === 'creator' ? (session.partnerName || 'Your date') : session.creatorName} left the app
                </p>
              </div>
              <button
                onClick={() => setOtherUserLeft(false)}
                className="text-xs underline flex-shrink-0"
                style={{ color: 'rgba(253,224,71,0.7)' }}
              >
                Dismiss
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Join stage */}
        {stage === 'join' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="text-center mb-6">
              <div className="text-4xl mb-3">👋</div>
              <h1 className="text-2xl font-bold text-white mb-1">
                {session.creatorName} invited you!
              </h1>
              <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
                You&apos;re planning a date together. Enter your details to get started.
              </p>
            </div>

            <div className="p-5 rounded-2xl space-y-4" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <form onSubmit={handleJoin} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: 'rgba(255,255,255,0.7)' }}>Your name</label>
                  <input
                    type="text"
                    value={partnerName}
                    onChange={(e) => setPartnerName(e.target.value)}
                    placeholder="Enter your name"
                    className="input-field"
                    required
                    minLength={2}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: 'rgba(255,255,255,0.7)' }}>
                    Your phone number
                  </label>
                  <div className="flex gap-2">
                    <span className="input-field w-16 shrink-0 flex items-center justify-center font-medium" style={{ color: 'rgba(255,255,255,0.5)' }}>
                      +91
                    </span>
                    <input
                      type="tel"
                      value={partnerPhone}
                      onChange={(e) => setPartnerPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      placeholder="9876543210"
                      className="input-field flex-1"
                      required
                      pattern="[6-9][0-9]{9}"
                    />
                  </div>
                  <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.35)' }}>For safety check-ins only</p>
                </div>

                {joinError && (
                  <div className="px-4 py-3 rounded-xl text-sm" style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', color: '#fca5a5' }}>
                    {joinError}
                  </div>
                )}

                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={joinLoading}
                  className="w-full py-4 rounded-2xl text-white font-semibold text-lg disabled:opacity-50 flex items-center justify-center gap-2"
                  style={{ background: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E53 50%, #FFC837 100%)', boxShadow: '0 8px 32px rgba(255,107,107,0.25)' }}
                >
                  {joinLoading ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="w-5 h-5 border-2 rounded-full"
                        style={{ borderColor: 'rgba(255,255,255,0.3)', borderTopColor: 'white' }}
                      />
                      Joining...
                    </>
                  ) : "Let's plan 💜"}
                </motion.button>
              </form>
            </div>
          </motion.div>
        )}

        {/* Preferences stage */}
        {stage === 'preferences' && userType && (
          <PreferenceForm
            sessionCode={code}
            userType={userType}
            onSubmit={() => {
              const otherPref = session.preferences?.find(
                (p: any) => p.userType !== userType.toUpperCase(),
              );
              setStage(otherPref ? 'venues' : 'waiting');
              refetch();
            }}
          />
        )}

        {/* Waiting stage */}
        {stage === 'waiting' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <div className="p-8 rounded-2xl" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <div className="text-4xl mb-4">⏳</div>
              <h2 className="text-xl font-bold text-white mb-2">Preferences submitted!</h2>
              <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
                Waiting for{' '}
                {userType === 'creator' ? session.partnerName || 'your date' : session.creatorName}{' '}
                to submit their preferences...
              </p>
              <div className="mt-6 flex justify-center gap-1.5">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                    className="w-2 h-2 rounded-full"
                    style={{ background: '#FF8E53' }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Venues stage */}
        {stage === 'venues' && (
          <VenueList
            sessionCode={code}
            userType={userType}
            preferences={session.preferences || []}
            onVenueSelected={() => { setStage('confirmed'); refetch(); }}
            onVenueMatched={(venue) => setMatchedVenue(venue)}
          />
        )}

        {/* Confirmed stage */}
        {stage === 'confirmed' && session.selectedVenue && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="mb-6">
              <div className="text-5xl mb-3">🎉</div>
              <h2 className="text-2xl font-bold text-white mb-1">Date confirmed!</h2>
              <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>Have a wonderful time</p>
            </div>

            <div className="p-6 rounded-2xl text-left mb-4" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">{categoryEmoji(session.selectedVenue.category)}</span>
                <div>
                  <h3 className="font-bold text-white">{session.selectedVenue.name}</h3>
                  <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>{session.selectedVenue.address}</p>
                </div>
              </div>

              {session.selectedVenue.googleRating && (
                <div className="flex items-center gap-4 text-sm mb-3" style={{ color: 'rgba(255,255,255,0.6)' }}>
                  <span style={{ color: '#fbbf24' }}>★ {Number(session.selectedVenue.googleRating).toFixed(1)}</span>
                  {session.selectedVenue.safetyScore && (
                    <span style={{ color: '#38ef7d' }}>
                      🛡️ {Number(session.selectedVenue.safetyScore).toFixed(1)} safety
                    </span>
                  )}
                </div>
              )}

              {session.dateTime && (
                <div className="px-4 py-2 rounded-xl text-sm font-medium" style={{ background: 'rgba(255,107,107,0.12)', color: '#FF8E53' }}>
                  📅 {new Date(session.dateTime).toLocaleString('en-IN')}
                </div>
              )}
            </div>

            {session.selectedVenue.phoneNumber && (
              <a
                href={`tel:${session.selectedVenue.phoneNumber}`}
                className="inline-block w-full py-3 rounded-xl font-semibold text-center mb-3 transition-all"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.8)' }}
              >
                Call venue
              </a>
            )}
          </motion.div>
        )}

        {/* Safety panel */}
        {userType && (
          <SafetyPanel
            sessionCode={code}
            userType={userType}
            contacts={session.safetyContacts || []}
            isDateActive={stage === 'confirmed'}
            onContactAdded={refetch}
          />
        )}
      </main>
    </div>
  );
}
