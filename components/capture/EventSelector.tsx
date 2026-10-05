'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function EventSelector({ city }: { city?: string }) {
  const [eventName, setEventName] = useState('General Networking');
  
  // In a production app with a paid API (like PredictHQ or SerpApi), 
  // you would fetch real events for the `city` here.
  // Since we are adhering to the "100% free" rule, we provide smart defaults 
  // and allow the user to type their own.

  const suggestions = [
    'General Networking',
    city ? `Tech Meetup ${city}` : 'Tech Meetup',
    'Conference / Summit',
    'Coffee Meeting',
  ];

  return (
    <div className="flex flex-col gap-2 mt-2">
      <Label htmlFor="event_name" className="text-xs uppercase tracking-wider text-gray-500">Event Name</Label>
      <div className="relative">
        <Input 
          name="event_name" 
          value={eventName}
          onChange={(e) => setEventName(e.target.value)}
          className="h-12 rounded-xl"
          placeholder="e.g. Web Summit 2025"
          list="event-suggestions"
        />
        <datalist id="event-suggestions">
          {suggestions.map((s, i) => (
            <option key={i} value={s} />
          ))}
        </datalist>
      </div>
      <p className="text-[10px] text-gray-400 ml-1">Leave as General Networking or type your specific event.</p>
    </div>
  );
}
