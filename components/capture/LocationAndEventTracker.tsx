'use client';

import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { fetchLocalEvents } from '@/app/actions/events';

export default function LocationAndEventTracker() {
  const [location, setLocation] = useState<{ lat: number; lng: number; city?: string; detailed?: string } | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  
  // By default we select General Networking
  const [selectedEvent, setSelectedEvent] = useState('General Networking');
  const [customEvent, setCustomEvent] = useState('');

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          
          try {
            const res = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`);
            const data = await res.json();
            
            const place = data.locality || data.principalSubdivision || '';
            const city = data.city || place;
            const detailed = [data.locality, data.city].filter(Boolean).join(', ') || city;
            
            setLocation({ lat, lng, city, detailed });
            
            if (city) {
              const events = await fetchLocalEvents(city);
              if (events && events.length > 0) {
                setSuggestions(events);
                // Pre-select the first real event found locally, prioritizing it
                setSelectedEvent(events[0]);
              }
            }
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
    <>
      <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 text-sm text-gray-500 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          {location ? (
            <span className="truncate max-w-[200px]">{location.detailed ? `📍 ${location.detailed}` : 'Precise location acquired'}</span>
          ) : (
            <span className="animate-pulse">Acquiring location...</span>
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

      <div className="flex flex-col gap-2 mt-2">
        <Label htmlFor="event_name" className="text-xs uppercase tracking-wider text-gray-500">Event context</Label>
        
        <select 
          value={selectedEvent}
          onChange={(e) => setSelectedEvent(e.target.value)}
          className="h-12 rounded-xl border border-gray-200 px-3 bg-white focus:outline-none focus:ring-2 focus:ring-gray-900 w-full text-sm"
        >
          {suggestions.length > 0 && (
            <optgroup label="📍 Trending Near You">
              {suggestions.map((s, i) => (
                <option key={i} value={s}>{s}</option>
              ))}
            </optgroup>
          )}
          <optgroup label="Standard Options">
            <option value="General Networking">General Networking</option>
            <option value="Coffee Meeting">Coffee / Casual Meeting</option>
            <option value="other">Custom Event (Type it below)</option>
          </optgroup>
        </select>

        {/* This hidden input ensures the backend always receives 'event_name' cleanly */}
        <input 
          type="hidden" 
          name="event_name" 
          value={selectedEvent === 'other' ? customEvent : selectedEvent} 
        />

        {selectedEvent === 'other' && (
          <Input 
            value={customEvent}
            onChange={(e) => setCustomEvent(e.target.value)}
            className="h-12 rounded-xl border-blue-200 focus:ring-blue-500 mt-2" 
            placeholder="Type your specific event name..."
            required
          />
        )}
      </div>
    </>
  );
}
