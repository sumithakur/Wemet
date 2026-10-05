import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { saveProfile } from './actions';
import CountrySelect from '@/components/ui/country-select';

export default async function EditProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  let phoneParts = ['', ''];
  if (profile?.phone) {
    const parts = profile.phone.split(' ');
    if (parts.length > 1 && parts[0].startsWith('+')) {
      phoneParts[0] = parts[0];
      phoneParts[1] = parts.slice(1).join(' ');
    } else {
      phoneParts[1] = profile.phone;
    }
  }

  return (
    <div className="p-4 max-w-xl mx-auto flex flex-col gap-6 mt-6 pb-20">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-gray-900">Edit Profile</h1>
        <Link href="/profile" className="text-sm font-medium text-gray-500 hover:text-gray-900">Cancel</Link>
      </div>
      
      <form action={saveProfile} className="flex flex-col gap-6 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        
        <div className="flex flex-col gap-2 items-center mb-2">
          {profile?.avatar_url ? (
            <img src={profile.avatar_url} alt="Profile" className="w-24 h-24 rounded-full object-cover border border-gray-200" />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center font-bold text-3xl">
              {profile?.first_name?.[0] || 'U'}
            </div>
          )}
          <Label htmlFor="avatar" className="text-xs uppercase tracking-wider text-gray-900 font-bold mt-3 cursor-pointer bg-gray-100 px-4 py-2 rounded-full hover:bg-gray-200 transition-colors">Change Picture</Label>
          <input type="file" id="avatar" name="avatar" accept="image/*" className="hidden" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="first_name" className="text-xs uppercase tracking-wider text-gray-500">First Name</Label>
            <Input name="first_name" defaultValue={profile?.first_name || ''} className="h-12 rounded-xl" />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="last_name" className="text-xs uppercase tracking-wider text-gray-500">Last Name</Label>
            <Input name="last_name" defaultValue={profile?.last_name || ''} className="h-12 rounded-xl" />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="job_title" className="text-xs uppercase tracking-wider text-gray-500">Job Title</Label>
          <Input name="job_title" defaultValue={profile?.job_title || ''} className="h-12 rounded-xl" />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="company" className="text-xs uppercase tracking-wider text-gray-500">Company</Label>
          <Input name="company" defaultValue={profile?.company || ''} className="h-12 rounded-xl" />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="phone" className="text-xs uppercase tracking-wider text-gray-500">Phone</Label>
          <div className="flex gap-2">
            <CountrySelect name="country_code" defaultValue={phoneParts[0] || '+1'} className="h-12 rounded-xl border border-gray-200 px-2 bg-white focus:outline-none focus:ring-2 focus:ring-gray-900 w-28 md:w-36 text-sm" />
            <Input type="tel" name="phone" defaultValue={phoneParts[1]} className="h-12 rounded-xl flex-1" placeholder="Enter number..." />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="website" className="text-xs uppercase tracking-wider text-gray-500">Website or LinkedIn</Label>
          <Input type="url" name="website" defaultValue={profile?.website || 'https://www.'} className="h-12 rounded-xl" />
        </div>

        <Button type="submit" size="lg" className="w-full bg-gray-900 hover:bg-gray-800 text-white rounded-xl h-12 mt-4">Save Changes</Button>
      </form>
    </div>
  );
}
