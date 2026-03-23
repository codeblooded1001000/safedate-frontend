'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { categoryLabel, formatDistance, formatPriceRange } from '@/lib/utils';

interface VenueCardProps {
  venue: any;
  userType: 'creator' | 'partner' | null;
  isOtherUserViewing?: boolean;
  onSuggest?: (venueId: string) => void;
  onVote?: (venueId: string, vote: boolean) => void;
  onSelect?: (venueId: string) => void;
  onViewOnMap?: () => void;
  showSelect?: boolean;
}

export function VenueCard({
  venue,
  userType,
  isOtherUserViewing,
  onSuggest,
  onVote,
  onSelect,
  onViewOnMap,
  showSelect,
}: VenueCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);

  const suggestion = venue.suggestion;
  const isSuggested = !!suggestion || venue.isSuggested;
  const suggestedBy = suggestion?.suggestedBy ?? venue.suggestedBy;
  const creatorVote = suggestion?.creatorVote ?? venue.creatorVote;
  const partnerVote = suggestion?.partnerVote ?? venue.partnerVote;
  const isMatched = creatorVote === true && partnerVote === true;

  const otherUserSuggested = isSuggested && suggestedBy?.toLowerCase() !== userType;
  const iSuggested = isSuggested && suggestedBy?.toLowerCase() === userType;
  const myVote = userType === 'creator' ? creatorVote : partnerVote;
  const waitingForResponse =
    iSuggested &&
    myVote === true &&
    (userType === 'creator' ? partnerVote === null : creatorVote === null);

  const imageUrl =
    venue.photoUrl || `https://picsum.photos/seed/${encodeURIComponent(venue.id)}/400/300`;

  const ringStyle = isMatched
    ? { boxShadow: '0 0 0 2px #38ef7d, 0 0 0 4px #0f0f1a' }
    : otherUserSuggested
    ? { boxShadow: '0 0 0 2px #FF6B6B, 0 0 0 4px #0f0f1a' }
    : isOtherUserViewing
    ? { boxShadow: '0 0 0 2px #667eea, 0 0 0 4px #0f0f1a' }
    : {};

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="relative rounded-3xl overflow-hidden"
      style={{
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.1)',
        backdropFilter: 'blur(12px)',
        ...ringStyle,
      }}
    >
      {/* Status badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
        {venue.isVerified && (
          <span
            className="px-2.5 py-1 text-white text-xs font-medium rounded-full shadow-sm flex items-center gap-1"
            style={{ background: 'rgba(34,197,94,0.9)', backdropFilter: 'blur(8px)' }}
          >
            ✓ Verified Safe
          </span>
        )}
        {isMatched && (
          <motion.span
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="px-2.5 py-1 text-white text-xs font-medium rounded-full shadow-sm"
            style={{ background: 'linear-gradient(135deg, #11998e, #38ef7d)' }}
          >
            🎉 It&apos;s a match!
          </motion.span>
        )}
        {otherUserSuggested && !isMatched && (
          <motion.span
            animate={{ opacity: [1, 0.7, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="px-2.5 py-1 text-white text-xs font-medium rounded-full shadow-sm"
            style={{ background: 'linear-gradient(135deg, #FF6B6B, #FF8E53)' }}
          >
            💜 They suggested this!
          </motion.span>
        )}
        {waitingForResponse && (
          <span
            className="px-2.5 py-1 text-xs font-medium rounded-full"
            style={{ background: 'rgba(118,75,162,0.3)', color: '#c084fc', border: '1px solid rgba(118,75,162,0.4)' }}
          >
            Waiting for response...
          </span>
        )}
        {isOtherUserViewing && !isMatched && (
          <span
            className="px-2.5 py-1 text-white text-xs font-medium rounded-full flex items-center gap-1"
            style={{ background: 'rgba(102,126,234,0.8)', backdropFilter: 'blur(8px)' }}
          >
            <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
            They&apos;re viewing
          </span>
        )}
      </div>

      {/* Image */}
      <div className="relative h-44 overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
        {!imageLoaded && <div className="absolute inset-0 animate-shimmer" />}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl}
          alt={venue.name}
          className={`w-full h-full object-cover transition-all duration-700 ${imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'}`}
          onLoad={() => setImageLoaded(true)}
          onError={(e) => {
            (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${venue.id}/400/300`;
            setImageLoaded(true);
          }}
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, #0f0f1a 0%, transparent 60%)' }} />

        {/* Distance pill */}
        {venue.distance !== undefined && (
          <div
            className="absolute bottom-3 right-3 px-3 py-1.5 rounded-full text-white text-xs font-medium"
            style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}
          >
            📍 {formatDistance(venue.distance)}
          </div>
        )}

        {onViewOnMap && (
          <button
            onClick={onViewOnMap}
            className="absolute bottom-3 left-3 px-3 py-1.5 rounded-full text-xs font-medium text-white"
            style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}
          >
            View on map →
          </button>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-3">
          <div>
            <h3 className="font-bold text-white text-lg leading-tight">{venue.name}</h3>
            <p className="text-sm mt-0.5" style={{ color: 'rgba(255,255,255,0.6)' }}>
              {venue.area || venue.address}
            </p>
          </div>
          {venue.googleRating && (
            <div
              className="flex items-center gap-1 px-2 py-1 rounded-xl shrink-0"
              style={{ background: 'rgba(245,158,11,0.15)' }}
            >
              <span style={{ color: '#fbbf24' }}>★</span>
              <span className="text-sm font-semibold" style={{ color: '#fbbf24' }}>
                {Number(venue.googleRating).toFixed(1)}
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 mb-4 flex-wrap">
          <span
            className="px-2.5 py-1 rounded-lg text-xs font-medium"
            style={{ background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.8)' }}
          >
            {categoryLabel(venue.category)}
          </span>
          <span className="text-xs font-medium" style={{ color: '#38ef7d' }}>
            {formatPriceRange(venue.priceRange)}
          </span>
        </div>

        {/* Vote status */}
        {isSuggested && !isMatched && (
          <div className="flex gap-2 text-xs mb-3" style={{ color: 'rgba(255,255,255,0.4)' }}>
            {creatorVote !== null && creatorVote !== undefined && (
              <span>{creatorVote ? '✅ Creator likes' : '❌ Creator pass'}</span>
            )}
            {partnerVote !== null && partnerVote !== undefined && (
              <span>{partnerVote ? '✅ Partner likes' : '❌ Partner pass'}</span>
            )}
          </div>
        )}

        {/* Action buttons */}
        {userType && (
          <div className="flex gap-2">
            {isMatched ? (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onSelect?.(venue.id)}
                className="flex-1 py-3 px-4 rounded-2xl text-white font-semibold flex items-center justify-center gap-2"
                style={{
                  background: 'linear-gradient(135deg, #11998e, #38ef7d)',
                  boxShadow: '0 4px 20px rgba(17,153,142,0.3)'
                }}
              >
                View date details →
              </motion.button>
            ) : (otherUserSuggested && myVote === null) || (otherUserSuggested && myVote === undefined) ? (
              <>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onVote?.(venue.id, true)}
                  className="flex-1 py-3 px-4 rounded-2xl text-white font-semibold flex items-center justify-center gap-2"
                  style={{
                    background: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E53 50%, #FFC837 100%)',
                    boxShadow: '0 4px 20px rgba(255,107,107,0.3)'
                  }}
                >
                  💜 I&apos;m in!
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onVote?.(venue.id, false)}
                  className="py-3 px-5 rounded-2xl font-medium"
                  style={{ background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)' }}
                >
                  Pass
                </motion.button>
              </>
            ) : iSuggested ? (
              <div
                className="flex-1 py-3 px-4 rounded-2xl text-center text-sm"
                style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.5)' }}
              >
                {waitingForResponse ? (
                  <span className="flex items-center justify-center gap-2">
                    <motion.span
                      animate={{ opacity: [1, 0.4, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      Waiting for them... ⏳
                    </motion.span>
                  </span>
                ) : (
                  'You suggested this'
                )}
              </div>
            ) : myVote !== null && myVote !== undefined ? (
              <div
                className="text-sm flex-1 text-center py-3"
                style={{ color: 'rgba(255,255,255,0.5)' }}
              >
                {myVote ? 'You liked this ✅' : 'You passed ❌'}
              </div>
            ) : (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onSuggest?.(venue.id)}
                className="flex-1 py-3 px-4 rounded-2xl text-white font-semibold flex items-center justify-center gap-2"
                style={{
                  background: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E53 50%, #FFC837 100%)',
                  boxShadow: '0 4px 20px rgba(255,107,107,0.25)'
                }}
              >
                💜 Suggest this place
              </motion.button>
            )}

            {showSelect && isMatched && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onSelect?.(venue.id)}
                className="py-3 px-4 rounded-2xl text-white font-medium"
                style={{ background: 'linear-gradient(135deg, #11998e, #38ef7d)' }}
              >
                Select
              </motion.button>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
