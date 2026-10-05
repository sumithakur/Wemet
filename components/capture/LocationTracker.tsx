'use client';

import { useEffect, useState } from 'react';

export default function LocationTracker() {
  const [location, setLocation] = useState<{ lat: number; lng: number; city?: string; detailed?: string } | null>(null);

  useEffect(() => {
    if ('geolocation' in navigator) {
      // Request high accuracy for precise event clustering
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          
          try {
            const res = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`);
            const data = await res.json();
            
            // Extract the most precise meaningful name (e.g. neighborhood + city)
            const place = data.locality || data.principalSubdivision || '';
            const city = data.city || place;
            const detailed = [data.locality, data.city].filter(Boolean).join(', ') || city;
            
            setLocation({ lat, lng, city, detailed });
          } catch (e) {
            setLocation({ lat, lng });
          }
        },
        (error) => {
          console.warn("Location access denied or failed", error);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    }
  }, []);

  return (
    <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 text-sm text-gray-500 mb-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
        {location ? (
          <span>{location.detailed ? `📍 ${location.detailed}` : 'Precise location acquired'}</span>
        ) : (
          <span className="animate-pulse">Acquiring precise location...</span>
        )}
      </div>
      
      {location && (
        <>
          <input type="hidden" name="latitude" value={location.lat} />
          <input type="hidden" name="longitude" value={location.lng} />
          {location.city && <input type="hidden" name="city" value={location.city} />}
          {location.detailed && <input type="hidden" name="detailed_location" value={location.detailed} />}
        </>
      )}
    </div>
  );
}
