import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { signout } from '@/app/auth/actions';

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  return (
    <div className="p-4 max-w-xl mx-auto flex flex-col gap-6 mt-6">
      <h1 className="text-2xl font-bold text-gray-900">Your Profile</h1>
      
      <Card className="border-gray-100 shadow-sm rounded-2xl">
        <CardContent className="p-8 flex flex-col items-center text-center gap-4">
          <div className="w-24 h-24 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center font-bold text-3xl overflow-hidden border border-gray-200">
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              profile?.first_name?.[0] || 'U'
            )}
          </div>
          <div>
            <h2 className="text-xl font-bold">{profile?.first_name} {profile?.last_name}</h2>
            <p className="text-gray-500 text-sm mt-1">{profile?.job_title} {profile?.company ? `at ${profile?.company}` : ''}</p>
          </div>
          
          <div className="flex gap-3 mt-4 w-full">
            <Button asChild className="flex-1 bg-gray-900 hover:bg-gray-800 text-white rounded-xl">
              <Link href="/profile/share">Share QR</Link>
            </Button>
            <Button asChild variant="outline" className="flex-1 rounded-xl">
              <Link href="/profile/edit">Edit Profile</Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      <form action={signout}>
        <Button variant="ghost" className="w-full mt-2 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-xl" type="submit">Sign Out</Button>
      </form>
    </div>
  );
}
