import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';

export default async function EventsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: events } = await supabase
    .from('events')
    .select('*, interactions(id, contact_id)')
    .eq('owner_id', user.id)
    .order('created_at', { ascending: false });

  return (
    <div className="p-4 max-w-2xl mx-auto flex flex-col gap-6 mt-6 pb-20">
      <h1 className="text-2xl font-bold text-gray-900">Your Events</h1>

      {(!events || events.length === 0) ? (
        <div className="text-center text-gray-500 py-12 bg-white rounded-xl border border-dashed border-gray-200">
          No events found. Events are automatically created when you meet people in new locations.
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {events.map((event) => {
            const contactCount = new Set(event.interactions?.map((i: any) => i.contact_id)).size;
            return (
              <Link key={event.id} href={`/events/${event.id}`}>
                <Card className="hover:bg-gray-50 transition border-gray-100 shadow-sm rounded-2xl">
                  <CardContent className="p-5 flex justify-between items-center gap-4">
                    <div className="flex-1 overflow-hidden">
                      <h3 className="font-semibold text-gray-900 truncate text-lg">
                        {event.name}
                      </h3>
                      <div className="text-sm text-gray-500 flex gap-2 items-center mt-1">
                        <span className="flex items-center gap-1">
                          📍 {event.city || 'Unknown Location'}
                        </span>
                        <span>•</span>
                        <span>{new Date(event.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-center bg-gray-50 border border-gray-100 px-4 py-2 rounded-xl">
                      <span className="text-lg font-bold text-gray-900">{contactCount}</span>
                      <span className="text-[10px] uppercase tracking-wider text-gray-500 font-medium">Met</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
