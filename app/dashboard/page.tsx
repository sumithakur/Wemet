import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('first_name, avatar_url')
    .eq('id', user.id)
    .single();

  const { data: contacts } = await supabase
    .from('contacts')
    .select('*')
    .eq('owner_id', user.id)
    .order('created_at', { ascending: false })
    .limit(5);

  return (
    <div className="flex flex-col gap-8 max-w-xl mx-auto mt-2">
      <header className="flex justify-between items-center">
        <h1 className="text-xl font-medium tracking-tight text-gray-900">
          Good evening, {profile?.first_name || 'User'}.
        </h1>
        <Link href="/profile">
          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center font-medium text-sm hover:bg-gray-200 transition-colors overflow-hidden border border-gray-200">
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              profile?.first_name?.[0] || 'U'
            )}
          </div>
        </Link>
      </header>
      
      <div className="relative">
        <input 
          type="search" 
          placeholder="Search people, companies, events or notes"
          className="w-full px-4 py-4 rounded-xl border border-gray-100 bg-white shadow-sm focus:outline-none focus:ring-1 focus:ring-gray-300 text-sm"
        />
      </div>

      <div className="grid grid-cols-2 gap-3 mt-2">
        <Link href="/add/card">
          <div className="h-32 bg-white rounded-2xl border border-gray-100 shadow-sm hover:border-gray-300 transition-colors flex flex-col items-center justify-center gap-3">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="8" width="18" height="14" rx="2" ry="2"/><path d="M12 16h.01"/><path d="M21 8v-2a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v2"/></svg>
            <span className="font-medium text-xs tracking-wide">SCAN CARD</span>
          </div>
        </Link>
        <Link href="/add/qr">
          <div className="h-32 bg-white rounded-2xl border border-gray-100 shadow-sm hover:border-gray-300 transition-colors flex flex-col items-center justify-center gap-3">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><path d="M8 8h.01"/><path d="M16 8h.01"/><path d="M8 16h.01"/><path d="M16 16h.01"/></svg>
            <span className="font-medium text-xs tracking-wide">SCAN QR</span>
          </div>
        </Link>
        <Link href="/add/phone">
          <div className="h-32 bg-white rounded-2xl border border-gray-100 shadow-sm hover:border-gray-300 transition-colors flex flex-col items-center justify-center gap-3">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
            <span className="font-medium text-xs tracking-wide">ADD PHONE</span>
          </div>
        </Link>
        <Link href="/add/manual">
          <div className="h-32 bg-white rounded-2xl border border-gray-100 shadow-sm hover:border-gray-300 transition-colors flex flex-col items-center justify-center gap-3">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
            <span className="font-medium text-xs tracking-wide">TYPE DETAILS</span>
          </div>
        </Link>
      </div>

      <div className="mt-4">
        <div className="flex justify-between items-center mb-4 px-1">
          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400">Recent Contacts</h2>
          <Link href="/contacts" className="text-xs font-medium text-gray-900 hover:underline">View all</Link>
        </div>
        
        {(!contacts || contacts.length === 0) ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center text-gray-500 text-sm shadow-sm">
            <p>Your networking memory starts here.</p>
            <p className="mt-1">Scan your first business card.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {contacts.map((contact) => (
              <Link key={contact.id} href={`/contacts/${contact.id}`}>
                <div className="bg-white rounded-2xl border border-gray-100 p-4 flex gap-4 items-center shadow-sm hover:border-gray-300 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-gray-50 border border-gray-100 text-gray-600 flex items-center justify-center font-medium text-sm shrink-0">
                    {contact.first_name?.[0]}{contact.last_name?.[0]}
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <h3 className="font-medium text-gray-900 truncate text-sm">
                      {contact.first_name} {contact.last_name}
                    </h3>
                    {(contact.job_title || contact.company) && (
                      <p className="text-xs text-gray-500 truncate mt-0.5">
                        {contact.job_title} {contact.company ? `at ${contact.company}` : ''}
                      </p>
                    )}
                  </div>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-300"><polyline points="9 18 15 12 9 6"/></svg>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
