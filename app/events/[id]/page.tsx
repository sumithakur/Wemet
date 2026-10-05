import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';

export default async function EventDetailPage({ params }: { params: { id: string } }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: event } = await supabase
    .from('events')
    .select('*')
    .eq('id', params.id)
    .eq('owner_id', user.id)
    .single();

  if (!event) redirect('/events');

  const { data: interactions } = await supabase
    .from('interactions')
    .select('*, contacts(*)')
    .eq('event_id', params.id)
    .order('occurred_at', { ascending: false });

  // Get unique contacts met at this event
  const uniqueContacts = Array.from(new Map(interactions?.map(i => [i.contacts?.id, i.contacts])).values()).filter(Boolean);

  return (
    <div className="p-4 max-w-2xl mx-auto flex flex-col gap-6 mt-6 pb-20">
      <Link href="/events" className="text-gray-500 text-sm hover:text-gray-900 font-medium w-fit">← Back to Events</Link>
      
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-gray-900">{event.name}</h1>
        <div className="flex items-center gap-4 text-sm font-medium text-gray-500">
          <span className="flex items-center gap-1 bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
            📍 {event.city || 'Unknown Location'}
          </span>
          <span className="flex items-center gap-1 bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
            📅 {new Date(event.created_at).toLocaleDateString()}
          </span>
        </div>
      </div>

      <div>
        <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-4 px-1">People you met here ({uniqueContacts.length})</h2>
        
        {uniqueContacts.length === 0 ? (
          <p className="text-gray-500 text-sm bg-gray-50 p-6 rounded-xl text-center border border-dashed">No contacts linked to this event yet.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {uniqueContacts.map((contact: any) => (
              <Link key={contact.id} href={`/contacts/${contact.id}`}>
                <Card className="hover:bg-gray-50 transition border-gray-100 shadow-sm rounded-2xl">
                  <CardContent className="p-4 flex gap-4 items-center">
                    <div className="w-12 h-12 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center font-bold text-lg shrink-0 border border-gray-200">
                      {contact.first_name?.[0]}{contact.last_name?.[0]}
                    </div>
                    <div className="overflow-hidden flex-1">
                      <h3 className="font-semibold text-gray-900 truncate">
                        {contact.first_name} {contact.last_name}
                      </h3>
                      {(contact.job_title || contact.company) && (
                        <p className="text-sm text-gray-500 truncate">
                          {contact.job_title} {contact.company ? `at ${contact.company}` : ''}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
