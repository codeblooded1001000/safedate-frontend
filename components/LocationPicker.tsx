'use client';

import { useState } from 'react';

interface LocationPickerProps {
  onLocationSelect: (lat: number, lng: number, areaName: string) => void;
  selected?: { lat: number; lng: number; areaName: string };
}

// Popular areas in Delhi NCR and Mumbai as quick picks
const POPULAR_AREAS = [
  // Delhi NCR
  { name: 'Connaught Place', city: 'Delhi NCR', lat: 28.6315, lng: 77.2167 },
  { name: 'Khan Market', city: 'Delhi NCR', lat: 28.6003, lng: 77.227 },
  { name: 'Greater Kailash', city: 'Delhi NCR', lat: 28.5494, lng: 77.234 },
  { name: 'Cyber Hub, Gurgaon', city: 'Delhi NCR', lat: 28.4947, lng: 77.0891 },
  { name: 'Hauz Khas', city: 'Delhi NCR', lat: 28.5535, lng: 77.2006 },
  { name: 'Saket', city: 'Delhi NCR', lat: 28.5245, lng: 77.2066 },
  { name: 'Vasant Vihar', city: 'Delhi NCR', lat: 28.5563, lng: 77.1545 },
  { name: 'Noida Sector 18', city: 'Delhi NCR', lat: 28.5709, lng: 77.3227 },
  // Mumbai
  { name: 'Bandra West', city: 'Mumbai', lat: 19.0544, lng: 72.8341 },
  { name: 'Lower Parel', city: 'Mumbai', lat: 18.9955, lng: 72.8267 },
  { name: 'Colaba', city: 'Mumbai', lat: 18.9205, lng: 72.832 },
  { name: 'Andheri West', city: 'Mumbai', lat: 19.1307, lng: 72.8264 },
  { name: 'Juhu', city: 'Mumbai', lat: 19.105, lng: 72.8265 },
  { name: 'Powai', city: 'Mumbai', lat: 19.1176, lng: 72.9058 },
];

export function LocationPicker({ onLocationSelect, selected }: LocationPickerProps) {
  const [city, setCity] = useState<'Delhi NCR' | 'Mumbai' | ''>('');
  const [useCurrentLocation, setUseCurrentLocation] = useState(false);
  const [locationError, setLocationError] = useState('');

  const filteredAreas = city ? POPULAR_AREAS.filter((a) => a.city === city) : [];

  function handleAreaSelect(area: (typeof POPULAR_AREAS)[0]) {
    onLocationSelect(area.lat, area.lng, `${area.name}, ${area.city}`);
  }

  function handleCurrentLocation() {
    if (!navigator.geolocation) {
      setLocationError('Geolocation not supported');
      return;
    }
    setUseCurrentLocation(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        onLocationSelect(pos.coords.latitude, pos.coords.longitude, 'Current location');
        setUseCurrentLocation(false);
      },
      () => {
        setLocationError('Could not get your location. Please pick an area instead.');
        setUseCurrentLocation(false);
      },
    );
  }

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={handleCurrentLocation}
        disabled={useCurrentLocation}
        className="w-full flex items-center justify-center gap-2 font-medium py-2.5 rounded-xl transition-all disabled:opacity-50"
        style={{ background: 'rgba(255,107,107,0.12)', color: '#FF8E53', border: '1px solid rgba(255,107,107,0.2)' }}
      >
        {useCurrentLocation ? 'Getting location...' : '📍 Use current location'}
      </button>

      {locationError && <p className="text-xs" style={{ color: '#fca5a5' }}>{locationError}</p>}

      <div className="text-center text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>or pick an area</div>

      <div className="flex gap-2">
        {(['Delhi NCR', 'Mumbai'] as const).map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setCity(c)}
            className="flex-1 py-2 rounded-xl text-sm font-medium transition-all"
            style={city === c ? {
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              color: 'white',
              boxShadow: '0 4px 16px rgba(118,75,162,0.25)'
            } : {
              background: 'rgba(255,255,255,0.05)',
              color: 'rgba(255,255,255,0.7)',
              border: '1px solid rgba(255,255,255,0.1)'
            }}
          >
            {c}
          </button>
        ))}
      </div>

      {filteredAreas.length > 0 && (
        <div className="grid grid-cols-2 gap-2">
          {filteredAreas.map((area) => (
            <button
              key={area.name}
              type="button"
              onClick={() => handleAreaSelect(area)}
              className="py-2 px-3 rounded-xl text-sm text-left transition-all"
              style={selected?.areaName?.includes(area.name) ? {
                background: 'linear-gradient(135deg, #FF6B6B, #FF8E53)',
                color: 'white',
                boxShadow: '0 4px 16px rgba(255,107,107,0.2)'
              } : {
                background: 'rgba(255,255,255,0.05)',
                color: 'rgba(255,255,255,0.7)',
                border: '1px solid rgba(255,255,255,0.1)'
              }}
            >
              {area.name}
            </button>
          ))}
        </div>
      )}

      {selected?.areaName && (
        <div className="text-sm font-medium text-center" style={{ color: '#38ef7d' }}>
          ✓ {selected.areaName}
        </div>
      )}
    </div>
  );
}
