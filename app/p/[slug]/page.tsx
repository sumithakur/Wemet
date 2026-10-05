import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default async function PublicProfilePage({ params }: { params: { slug: string } }) {
  const supabase = await createClient();
  
  // Try finding by slug first, fallback to id if needed for development
  let { data: profile } = await supabase
    .from('profiles')
    .select('*, profile_visibility(*)')
    .eq('public_slug', params.slug)
    .single();

  if (!profile) {
    const { data: profileById } = await supabase
      .from('profiles')
      .select('*, profile_visibility(*)')
      .eq('id', params.slug)
      .single();
    profile = profileById;
  }

  if (!profile || !profile.public_profile_enabled) {
    notFound();
  }

  const visibility = profile.profile_visibility?.[0] || {};

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 items-center justify-center p-4">
      <Card className="w-full max-w-sm overflow-hidden">
        <div className="h-24 bg-blue-600 w-full"></div>
        <CardContent className="p-6 pt-0 flex flex-col items-center text-center -mt-12 gap-4">
          <div className="w-24 h-24 rounded-full bg-white p-1 shadow-sm">
            <div className="w-full h-full rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-3xl">
              {profile.first_name?.[0] || 'U'}{profile.last_name?.[0] || ''}
            </div>
          </div>
          
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{profile.first_name} {profile.last_name}</h1>
            {(visibility.show_title || visibility.show_company) && (
              <p className="text-gray-500 font-medium mt-1">
                {visibility.show_title && profile.job_title}
                {visibility.show_title && visibility.show_company && profile.company ? ' at ' : ''}
                {visibility.show_company && profile.company}
              </p>
            )}
          </div>

          <div className="w-full flex flex-col gap-3 mt-4">
            <Button size="lg" className="w-full font-semibold bg-blue-600 hover:bg-blue-700">Save Contact</Button>
            
            <div className="flex flex-col gap-2 mt-4 text-left w-full border border-gray-100 rounded-lg p-4 bg-gray-50/50">
              {visibility.show_phone && profile.phone && (
                <div><span className="text-xs text-gray-500 uppercase font-semibold">Phone</span><p>{profile.phone}</p></div>
              )}
              {visibility.show_email && profile.email && (
                <div><span className="text-xs text-gray-500 uppercase font-semibold">Email</span><p>{profile.email}</p></div>
              )}
              {visibility.show_linkedin && profile.linkedin_url && (
                <div><span className="text-xs text-gray-500 uppercase font-semibold">LinkedIn</span><p className="text-blue-600 break-all">{profile.linkedin_url}</p></div>
              )}
              {visibility.show_website && profile.website && (
                <div><span className="text-xs text-gray-500 uppercase font-semibold">Website</span><p className="text-blue-600">{profile.website}</p></div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="mt-8 text-center text-xs text-gray-400">Powered by MeetMemo</div>
    </div>
  );
}
