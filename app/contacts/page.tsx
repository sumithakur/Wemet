import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ExportButton from '@/components/contacts/ExportButton';

export default async function ContactsPage({
  searchParams,
}: {
  searchParams: { q?: string; event?: string; date?: string };
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Build the query
  let query = supabase
    .from('contacts')
    .select('*, interactions!left(event_id, occurred_at)')
    .eq('owner_id', user.id)
    .order('first_name', { ascending: true });

  if (searchParams.q) {
    const searchTerm = `%${searchParams.q}%`;
    query = query.or(`first_name.ilike.${searchTerm},last_name.ilike.${searchTerm},company.ilike.${searchTerm},job_title.ilike.${searchTerm}`);
  }

  const { data: contacts } = await query;

  // Simple client-side formatting for export
  const exportData = contacts?.map(c => ({
    FirstName: c.first_name || '',
    LastName: c.last_name || '',
    Company: c.company || '',
    JobTitle: c.job_title || '',
    Email: c.email || '',
    Phone: c.phone || '',
  })) || [];

  return (
    <div className="p-4 max-w-2xl mx-auto flex flex-col gap-6 mt-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Contacts</h1>
        <div className="flex gap-2">
          <ExportButton data={exportData} />
          <Button  size="sm" className="bg-blue-600 hover:bg-blue-700">
            <Link href="/add">+ Add</Link>
          </Button>
        </div>
      </div>
      
      {/* Search and Filters */}
      <form className="flex flex-col sm:flex-row gap-3 bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
        <Input 
          name="q" 
          defaultValue={searchParams.q} 
          placeholder="Search name, company, title..." 
          className="flex-1"
        />
        <select name="date" className="border border-gray-300 rounded-md px-3 py-2 text-sm bg-white" defaultValue={searchParams.date}>
          <option value="">Any Date</option>
          <option value="today">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
        </select>
        <Button type="submit" variant="secondary">Filter</Button>
      </form>

      {(!contacts || contacts.length === 0) ? (
        <div className="text-center text-gray-500 py-12 bg-white rounded-xl border border-dashed border-gray-200">
          No contacts found.
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {contacts.map((contact) => (
            <Link key={contact.id} href={`/contacts/${contact.id}`}>
              <Card className="hover:bg-gray-50 transition border-gray-100 shadow-sm">
                <CardContent className="p-4 flex gap-4 items-center">
                  <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-lg shrink-0">
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
                  <div className="text-gray-400">›</div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
