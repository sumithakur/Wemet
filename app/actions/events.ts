'use server'

import { createClient } from '@/lib/supabase/server';

export async function fetchLocalEvents(city?: string) {
  if (!city) return [];
  
  const supabase = await createClient();
  
  // Extract just the main city name if it's a detailed location (e.g. "Lusail, Doha" -> "Doha")
  const mainCity = city.split(',').pop()?.trim() || city;

  // Fetch events happening around this time in this city
  const today = new Date().toISOString().split('T')[0];
  
  const { data, error } = await supabase
    .from('global_events')
    .select('name')
    .ilike('city', `%${mainCity}%`)
    .gte('end_date', today)
    .limit(10);

  if (error || !data) return [];
  
  // Remove duplicates
  return Array.from(new Set(data.map(e => e.name)));
}
