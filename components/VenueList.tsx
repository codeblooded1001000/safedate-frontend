'use client';

import { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { VenueCard } from './VenueCard';
import { api } from '@/lib/api';
import { useSocket } from '@/hooks/useSocket';

const VenueMap = dynamic(
  () => import('./VenueMap').then((m) => ({ default: m.VenueMap })),
  { ssr: false, loading: () => <div className="w-full h-[420px] rounded-2xl animate-shimmer" style={{ background: 'rgba(255,255,255,0.05)' }} /> },
);

interface VenueListProps {
  sessionCode: string;
  userType: 'creator' | 'partner' | null;
  preferences: any[];
  onVenueSelected?: () => void;
  onVenueMatched?: (venue: any) => void;
}

export function VenueList({ sessionCode, userType, preferences, onVenueSelected, onVenueMatched }: VenueListProps) {
  const [venues, setVenues] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [selectedVenueId, setSelectedVenueId] = useState<string | null>(null);
  const [otherUserViewing, setOtherUserViewing] = useState<string | null>(null);

  const { socket, isConnected } = useSocket(sessionCode, userType);
  const bothSubmitted = preferences?.length === 2;

  const loadVenues = useCallback(async (silent = false) => {
    if (!silent) setIsLoading(true);
    try {
      const data = await api.getVenues(sessionCode);
      setVenues(data);
    } catch (err: any) {
      if (!silent) setError(err.response?.data?.message || 'Failed to load venues');
    } finally {
      if (!silent) setIsLoading(false);
    }
  }, [sessionCode]);

  useEffect(() => {
    loadVenues();
  }, [loadVenues]);

  // Socket event handlers for real-time updates
  useEffect(() => {
    if (!socket) return;

    const onVenueSuggested = (data: any) => {
      setVenues((prev) =>
        prev.map((v) =>
          v.id === data.venue?.id
            ? { ...v, suggestion: data.suggestion, isSuggested: true, suggestedBy: data.suggestedBy }
            : v,
        ),
      );
    };

    const onVenueVoted = (data: any) => {
      setVenues((prev) =>
        prev.map((v) => (v.id === data.venueId ? { ...v, suggestion: data.suggestion } : v)),
      );
    };

    const onVenueMatchedSocket = (data: any) => {
      setVenues((prev) =>
        prev.map((v) => (v.id === data.venue?.id ? { ...v, suggestion: data.suggestion } : v)),
      );
      // Notify parent — parent controls the celebration modal and stage transition
      onVenueMatched?.(data.venue);
    };

    const onUserViewingVenue = (data: any) => {
      if (data.userType?.toLowerCase() !== userType) {
        setOtherUserViewing(data.venueId);
      }
    };

    socket.on('venueSuggested', onVenueSuggested);
    socket.on('venueVoted', onVenueVoted);
    socket.on('venueMatched', onVenueMatchedSocket);
    socket.on('userViewingVenue', onUserViewingVenue);

    return () => {
      socket.off('venueSuggested', onVenueSuggested);
      socket.off('venueVoted', onVenueVoted);
      socket.off('venueMatched', onVenueMatchedSocket);
      socket.off('userViewingVenue', onUserViewingVenue);
    };
  }, [socket, userType, onVenueMatched]);

  // Emit viewingVenue when user selects a venue
  useEffect(() => {
    if (socket && selectedVenueId) {
      socket.emit('viewingVenue', {
        sessionCode,
        userType: userType?.toUpperCase(),
        venueId: selectedVenueId,
      });
    }
  }, [socket, selectedVenueId, sessionCode, userType]);

  async function handleSuggest(venueId: string) {
    if (!userType) return;
    try {
      await api.suggestVenue(sessionCode, venueId, userType.toUpperCase());
      await loadVenues(true);
    } catch (err) {
      console.error('Failed to suggest venue:', err);
    }
  }

  async function handleVote(venueId: string, vote: boolean) {
    if (!userType) return;
    try {
      const result = await api.voteVenue(sessionCode, venueId, userType.toUpperCase(), vote);
      // Reload venues silently to reflect server state (no loading skeleton flash)
      await loadVenues(true);
      // Show match celebration from the API response — don't rely on socket timing
      if (result?.isMatch) {
        const matchedVenue = result?.suggestion?.venue || venues.find((v) => v.id === venueId);
        onVenueMatched?.(matchedVenue);
      }
    } catch (err) {
      console.error('Failed to vote:', err);
    }
  }

  async function handleSelect(venueId: string) {
    try {
      await api.selectVenue(sessionCode, { venueId });
      onVenueSelected?.();
    } catch (err) {
      console.error('Failed to select venue:', err);
    }
  }

  const midpoint =
    preferences?.length === 2
      ? {
          lat: (Number(preferences[0].latitude) + Number(preferences[1].latitude)) / 2,
          lng: (Number(preferences[0].longitude) + Number(preferences[1].longitude)) / 2,
        }
      : null;

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-64 rounded-2xl animate-shimmer" style={{ background: 'rgba(255,255,255,0.05)' }} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="px-4 py-3 rounded-xl text-sm" style={{ background: 'rgba(234,179,8,0.15)', color: '#fde047', border: '1px solid rgba(234,179,8,0.3)' }}>{error}</div>
      </div>
    );
  }

  if (!bothSubmitted) {
    return (
      <div className="text-center py-12 rounded-2xl" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
        <div className="text-4xl mb-3">⏳</div>
        <h3 className="font-semibold text-white mb-1">Waiting for preferences</h3>
        <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
          {preferences?.length === 1
            ? 'Your preferences are in! Waiting for your date to submit theirs.'
            : 'Both of you need to submit preferences to see venue suggestions.'}
        </p>
      </div>
    );
  }

  if (venues.length === 0) {
    return (
      <div className="text-center py-12 rounded-2xl" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
        <div className="text-4xl mb-3">🔍</div>
        <h3 className="font-semibold text-white mb-1">No venues found</h3>
        <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
          We couldn&apos;t find venues matching both preferences. Try broadening your vibe choices.
        </p>
      </div>
    );
  }

  const enrichVenue = (v: any) => {
    const creatorVote = v.suggestion?.creatorVote ?? v.creatorVote ?? null;
    const partnerVote = v.suggestion?.partnerVote ?? v.partnerVote ?? null;
    return {
      ...v,
      isSuggested: v.isSuggested ?? !!v.suggestion,
      suggestedBy: v.suggestedBy ?? v.suggestion?.suggestedBy,
      creatorVote,
      partnerVote,
      isMatched: creatorVote === true && partnerVote === true,
    };
  };

  const enrichedVenues = venues.map(enrichVenue);
  const otherSuggested = enrichedVenues.filter(
    (v) => v.isSuggested && v.suggestedBy?.toLowerCase() !== userType && !v.isMatched,
  );
  // Include matched venues in rest so they stay visible after a match
  const rest = enrichedVenues.filter(
    (v) => v.isMatched || !(v.isSuggested && v.suggestedBy?.toLowerCase() !== userType),
  );
  const mapVenues = enrichedVenues.filter((v) => !v.isRejected);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="font-bold text-white">Venue suggestions</h2>
          <span className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>({venues.length})</span>
          {isConnected && (
            <span className="flex items-center gap-1 text-xs" style={{ color: '#38ef7d' }}>
              <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#38ef7d' }} />
              Live
            </span>
          )}
        </div>

        <div className="flex rounded-xl p-1" style={{ background: 'rgba(255,255,255,0.08)' }}>
          <button
            onClick={() => setViewMode('list')}
            className="px-4 py-1.5 text-sm font-medium rounded-lg transition-all"
            style={viewMode === 'list'
              ? { background: 'rgba(255,255,255,0.15)', color: 'white' }
              : { color: 'rgba(255,255,255,0.5)' }}
          >
            List
          </button>
          <button
            onClick={() => setViewMode('map')}
            className="px-4 py-1.5 text-sm font-medium rounded-lg transition-all"
            style={viewMode === 'map'
              ? { background: 'rgba(255,255,255,0.15)', color: 'white' }
              : { color: 'rgba(255,255,255,0.5)' }}
          >
            Map
          </button>
        </div>
      </div>

      {/* Other user's suggestions */}
      {otherSuggested.length > 0 && viewMode === 'list' && (
        <div className="p-4 rounded-2xl" style={{ background: 'rgba(255,107,107,0.08)', border: '1px solid rgba(255,107,107,0.2)' }}>
          <h3 className="font-semibold mb-3 flex items-center gap-2" style={{ color: '#FF8E53' }}>
            <span className="text-xl">💜</span>
            They suggested these places
          </h3>
          <div className="space-y-3">
            {otherSuggested.map((venue) => (
              <VenueCard
                key={venue.id}
                venue={venue}
                userType={userType}
                isOtherUserViewing={venue.id === otherUserViewing}
                onSuggest={() => handleSuggest(venue.id)}
                onVote={handleVote}
                onSelect={handleSelect}
                onViewOnMap={() => { setSelectedVenueId(venue.id); setViewMode('map'); }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Map view */}
      {viewMode === 'map' && (
        <VenueMap
          venues={mapVenues}
          midpoint={midpoint}
          userType={userType}
          otherUserViewing={otherUserViewing}
          selectedVenueId={selectedVenueId}
          onVenueClick={(venue) => setSelectedVenueId(venue.id)}
          onSuggest={handleSuggest}
        />
      )}

      {/* List view */}
      {viewMode === 'list' && (
        <div className="space-y-3">
          {rest.length > 0 && otherSuggested.length > 0 && (
            <h3 className="text-sm font-medium uppercase tracking-wide" style={{ color: 'rgba(255,255,255,0.4)' }}>
              Explore more
            </h3>
          )}
          {rest.map((venue) => (
            <VenueCard
              key={venue.id}
              venue={venue}
              userType={userType}
              isOtherUserViewing={venue.id === otherUserViewing}
              onSuggest={() => handleSuggest(venue.id)}
              onVote={handleVote}
              onSelect={handleSelect}
              onViewOnMap={() => { setSelectedVenueId(venue.id); setViewMode('map'); }}
              showSelect={userType === 'creator'}
            />
          ))}
        </div>
      )}
    </div>
  );
}
