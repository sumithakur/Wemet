import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const TOPICS = ['general', 'javascript', 'python', 'data', 'devops', 'ux', 'ios', 'android', 'tech-comm'];

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const year = new Date().getFullYear();
  let allEvents: any[] = [];

  for (const topic of TOPICS) {
    try {
      const res = await fetch(`https://raw.githubusercontent.com/tech-conferences/conference-data/main/conferences/${year}/${topic}.json`);
      if (res.ok) {
        const events = await res.json();
        const formattedEvents = events.map((e: any) => ({
          name: e.name || 'Unknown Event',
          city: (e.city && typeof e.city === 'string' && e.city.trim() !== '') ? e.city : 'Online',
          start_date: e.startDate || year + '-01-01',
          end_date: e.endDate || e.startDate || year + '-01-01',
          category: topic,
        }));
        allEvents = [...allEvents, ...formattedEvents];
      }
    } catch (e) {
      console.error(`Failed to fetch topic ${topic}:`, e);
    }
  }

  if (allEvents.length === 0) {
    return NextResponse.json({ message: 'No events found to sync' });
  }

  const uniqueEvents = Array.from(new Map(allEvents.map(item => [`${item.name}-${item.city}`, item])).values());

  const { error } = await supabaseAdmin
    .from('global_events')
    .upsert(uniqueEvents, { onConflict: 'name,city', ignoreDuplicates: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ 
    message: 'Successfully synced global events', 
    count: uniqueEvents.length 
  });
}
