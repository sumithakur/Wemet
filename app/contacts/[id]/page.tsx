import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { deleteContact } from './actions';

export default async function ContactDetailPage({ params }: { params: any }) {
  // Fix Next.js 15+ promise based params
  const { id } = await params;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: contact } = await supabase
    .from('contacts')
    .select('*')
    .eq('id', id)
    .eq('owner_id', user.id)
    .single();

  if (!contact) redirect('/contacts');

  const { data: interactions } = await supabase
    .from('interactions')
    .select('*')
    .eq('contact_id', id)
    .order('occurred_at', { ascending: false });

  const { data: assets } = await supabase
    .from('contact_assets')
    .select('*')
    .eq('contact_id', id);

  let imageUrls: string[] = [];
  if (assets && assets.length > 0) {
    for (const asset of assets) {
      const { data } = await supabase.storage.from('cards').createSignedUrl(asset.storage_path, 3600);
      if (data?.signedUrl) {
        imageUrls.push(data.signedUrl);
      }
    }
  }

  // Server action binding for delete
  const deleteAction = deleteContact.bind(null, id);

  return (
    <div className="p-4 max-w-2xl mx-auto flex flex-col gap-6 mt-6 pb-20">
      <div className="flex justify-between items-center mb-2">
        <Link href="/contacts" className="text-blue-600 text-sm hover:underline font-medium">← Back to Contacts</Link>
        <form action={deleteAction}>
          <Button type="submit" variant="ghost" className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 text-xs font-medium">
            🗑️ Delete Contact
          </Button>
        </form>
      </div>

      <div className="flex flex-col items-center text-center gap-3 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="w-24 h-24 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-4xl shadow-inner">
          {contact.first_name?.[0]}{contact.last_name?.[0]}
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">{contact.first_name} {contact.last_name}</h1>
          <p className="text-gray-600 font-medium mt-1">{contact.job_title} {contact.company ? `• ${contact.company}` : ''}</p>
        </div>

        <div className="flex flex-wrap justify-center gap-3 mt-4 w-full">
          {contact.phone && (
            <Button variant="outline" size="sm" className="rounded-full">
              <a href={`tel:${contact.phone}`}>📞 Call</a>
            </Button>
          )}
          {contact.email && (
            <Button variant="outline" size="sm" className="rounded-full">
              <a href={`mailto:${contact.email}`}>✉️ Email</a>
            </Button>
          )}
          {contact.linkedin_url && (
            <Button variant="outline" size="sm" className="rounded-full">
              <a href={contact.linkedin_url} target="_blank">in LinkedIn</a>
            </Button>
          )}
        </div>
      </div>

      {imageUrls.length > 0 && (
        <div className="mt-4">
          <h2 className="text-sm uppercase tracking-wider font-bold text-gray-500 mb-3">Scanned Business Cards</h2>
          <div className="flex gap-4 overflow-x-auto pb-4 snap-x">
            {imageUrls.map((url, i) => (
              <div key={i} className="min-w-[280px] sm:min-w-[320px] rounded-xl overflow-hidden border border-gray-200 shadow-sm snap-center">
                <img src={url} alt="Business Card" className="w-full h-auto object-cover" />
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-4">
        <div className="flex justify-between items-center border-b pb-2 mb-4">
          <h2 className="text-sm uppercase tracking-wider font-bold text-gray-500">Interaction History</h2>
          <Button variant="ghost" size="sm" className="text-blue-600 text-xs h-8 pointer-events-none opacity-50">
            + Add Note
          </Button>
        </div>
        {(!interactions || interactions.length === 0) ? (
          <p className="text-gray-500 text-sm bg-gray-50 p-6 rounded-xl text-center border border-dashed">No interactions recorded yet.</p>
        ) : (
          <div className="flex flex-col gap-4">
            {interactions.map((interaction: any) => (
              <Card key={interaction.id} className="shadow-sm border-gray-100">
                <CardContent className="p-5 flex flex-col gap-3">
                  <div className="flex justify-between items-center">
                    <div className="text-xs font-bold text-gray-500 uppercase tracking-wider flex gap-2 items-center">
                      <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">
                        {new Date(interaction.occurred_at).toLocaleDateString()}
                      </span>
                      {interaction.city ? `📍 ${interaction.city}` : ''}
                    </div>
                  </div>
                  {interaction.note ? (
                    <p className="text-gray-900 leading-relaxed text-sm">{interaction.note}</p>
                  ) : (
                    <p className="text-gray-400 italic text-sm">No conversation notes recorded.</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
