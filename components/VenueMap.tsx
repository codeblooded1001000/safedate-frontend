'use client';

// This component is dynamically imported with ssr:false — safe to import leaflet CSS here
import 'leaflet/dist/leaflet.css';

import { useEffect, useRef, useState } from 'react';
import type L from 'leaflet';

interface Venue {
  id: string;
  name: string;
  address: string;
  area: string;
  latitude: number | string;
  longitude: number | string;
  category: string;
  priceRange: number;
  googleRating?: number | string | null;
  isVerified: boolean;
  photoUrl?: string | null;
  isSuggested?: boolean;
  suggestedBy?: string | null;
  isMatched?: boolean;
}

interface VenueMapProps {
  venues: Venue[];
  midpoint?: { lat: number; lng: number } | null;
  userType: 'creator' | 'partner' | null;
  otherUserViewing?: string | null;
  onVenueClick: (venue: Venue) => void;
  onSuggest: (venueId: string) => void;
  selectedVenueId?: string | null;
}

function getMarkerColor(venue: Venue, otherUserViewing?: string | null): string {
  if (venue.isMatched) return '#22C55E';
  if (venue.id === otherUserViewing) return '#3B82F6';
  if (venue.isSuggested) return '#8B5CF6';
  return '#534AB7';
}

function createSvgIcon(color: string) {
  const svg = `<svg width="32" height="40" viewBox="0 0 32 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 0C7.164 0 0 7.164 0 16c0 12 16 24 16 24s16-12 16-24C32 7.164 24.836 0 16 0z" fill="${color}"/>
    <circle cx="16" cy="14" r="6" fill="white"/>
  </svg>`;
  return svg;
}

export function VenueMap({
  venues,
  midpoint,
  userType,
  otherUserViewing,
  onVenueClick,
  onSuggest,
  selectedVenueId,
}: VenueMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<Map<string, L.Marker>>(new Map());
  const [mapReady, setMapReady] = useState(false);

  // Initialize map once
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    import('leaflet').then((leaflet) => {
      const L = leaflet.default || leaflet;

      if (!mapContainerRef.current || mapRef.current) return;

      const center = midpoint || { lat: 28.6139, lng: 77.209 };

      mapRef.current = L.map(mapContainerRef.current, {
        center: [center.lat, center.lng],
        zoom: 13,
        zoomControl: false,
      });

      L.control.zoom({ position: 'topright' }).addTo(mapRef.current);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(mapRef.current);

      if (midpoint) {
        const midpointIcon = L.divIcon({
          html: `<div style="position:relative;width:20px;height:20px">
            <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:30px;height:30px;background:rgba(139,92,246,0.3);border-radius:50%;animation:pulse 2s ease-out infinite"></div>
            <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:10px;height:10px;background:#8B5CF6;border-radius:50%;border:2px solid white;box-shadow:0 2px 4px rgba(0,0,0,0.2)"></div>
          </div>`,
          className: '',
          iconSize: [20, 20],
          iconAnchor: [10, 10],
        });
        L.marker([midpoint.lat, midpoint.lng], { icon: midpointIcon })
          .addTo(mapRef.current)
          .bindPopup('<div style="padding:8px;font-size:13px;font-weight:600;color:#6d28d9">📍 Midpoint between you both</div>');
      }

      setMapReady(true);
    });

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
      setMapReady(false);
    };
  }, []);

  // Update venue markers whenever venues change or map becomes ready
  useEffect(() => {
    if (!mapReady || !mapRef.current) return;

    import('leaflet').then((leaflet) => {
      const L = leaflet.default || leaflet;
      if (!mapRef.current) return;

      // Remove old markers
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current.clear();

      venues.forEach((venue) => {
        const lat = Number(venue.latitude);
        const lng = Number(venue.longitude);
        if (isNaN(lat) || isNaN(lng)) return;

        const color = getMarkerColor(venue, otherUserViewing);
        const icon = L.divIcon({
          html: createSvgIcon(color),
          className: 'custom-marker',
          iconSize: [32, 40],
          iconAnchor: [16, 40],
          popupAnchor: [0, -40],
        });

        const marker = L.marker([lat, lng], { icon });

        const imageUrl = venue.photoUrl || `https://picsum.photos/seed/${encodeURIComponent(venue.id)}/280/140`;
        const isOtherSuggested = venue.isSuggested && venue.suggestedBy?.toLowerCase() !== userType;

        const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
        const appleMapsUrl = `https://maps.apple.com/?q=${encodeURIComponent(venue.name)}&ll=${lat},${lng}`;

        const popupContent = document.createElement('div');
        popupContent.style.fontFamily = 'system-ui,-apple-system,sans-serif';
        popupContent.innerHTML = `
          <div style="width:280px">
            <img src="${imageUrl}" alt="${venue.name}" style="width:100%;height:140px;object-fit:cover" onerror="this.style.display='none'" />
            <div style="padding:12px 16px">
              <h3 style="margin:0 0 4px;font-size:16px;font-weight:600;color:#1a1a1a">${venue.name}</h3>
              <p style="margin:0 0 8px;font-size:13px;color:#666">${venue.address}</p>
              <div style="display:flex;gap:12px;font-size:13px;margin-bottom:10px">
                <span style="color:#f59e0b">★ ${venue.googleRating ? Number(venue.googleRating).toFixed(1) : 'N/A'}</span>
                <span style="color:#22c55e">${'₹'.repeat(venue.priceRange)}</span>
                ${venue.isVerified ? '<span style="color:#8b5cf6;font-weight:500">✓ Verified</span>' : ''}
              </div>
              <div style="display:flex;gap:8px;margin-bottom:10px">
                <a href="${googleMapsUrl}" target="_blank" rel="noopener noreferrer"
                  style="flex:1;padding:8px 0;background:#4285F4;color:white;border-radius:8px;text-align:center;font-size:12px;font-weight:500;text-decoration:none">
                  Google Maps
                </a>
                <a href="${appleMapsUrl}" target="_blank" rel="noopener noreferrer"
                  style="flex:1;padding:8px 0;background:#000;color:white;border-radius:8px;text-align:center;font-size:12px;font-weight:500;text-decoration:none">
                  Apple Maps
                </a>
              </div>
              ${venue.isMatched ? '<div style="padding:8px 12px;background:#dcfce7;color:#15803d;border-radius:8px;text-align:center;font-size:13px;font-weight:500">🎉 It\'s a match!</div>' : ''}
              ${isOtherSuggested && !venue.isMatched ? '<div style="padding:8px 12px;background:#f3f0ff;color:#6d28d9;border-radius:8px;text-align:center;font-size:13px;font-weight:500">💜 They suggested this!</div>' : ''}
            </div>
            ${!venue.isSuggested ? `
              <div style="padding:12px 16px;border-top:1px solid #eee">
                <button class="map-suggest-btn" data-venue-id="${venue.id}" style="width:100%;padding:10px;background:linear-gradient(135deg,#534AB7,#7C3AED);color:white;border:none;border-radius:10px;font-size:14px;font-weight:500;cursor:pointer">
                  💜 Suggest this place
                </button>
              </div>
            ` : ''}
          </div>
        `;

        popupContent.querySelector('.map-suggest-btn')?.addEventListener('click', () => {
          onSuggest(venue.id);
        });

        marker.bindPopup(popupContent, { maxWidth: 300 });
        marker.on('click', () => onVenueClick(venue));
        marker.addTo(mapRef.current!);
        markersRef.current.set(venue.id, marker);
      });

      // Fit map to show all venue markers
      if (markersRef.current.size > 0) {
        const markerList = Array.from(markersRef.current.values());
        const group = L.featureGroup(markerList);
        mapRef.current.fitBounds(group.getBounds().pad(0.2));
      }
    });
  }, [venues, otherUserViewing, userType, onVenueClick, onSuggest, mapReady]);

  // Open popup for selected venue
  useEffect(() => {
    if (selectedVenueId && markersRef.current.has(selectedVenueId)) {
      const marker = markersRef.current.get(selectedVenueId)!;
      marker.openPopup();
      mapRef.current?.panTo(marker.getLatLng());
    }
  }, [selectedVenueId]);

  return (
    <>
      <style>{`
        @keyframes pulse {
          0% { transform: translate(-50%,-50%) scale(0.5); opacity: 1; }
          100% { transform: translate(-50%,-50%) scale(2); opacity: 0; }
        }
        .custom-marker { background: none !important; border: none !important; }
        .leaflet-popup-content-wrapper { border-radius: 16px !important; padding: 0 !important; overflow: hidden !important; box-shadow: 0 10px 40px rgba(0,0,0,0.15) !important; }
        .leaflet-popup-content { margin: 0 !important; }
        .leaflet-popup-tip { background: white !important; }
      `}</style>
      <div
        ref={mapContainerRef}
        className="w-full h-[420px] rounded-2xl overflow-hidden shadow-lg"
      />
    </>
  );
}
