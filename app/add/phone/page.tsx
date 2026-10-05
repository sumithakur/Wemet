import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import LocationAndEventTracker from "@/components/capture/LocationAndEventTracker";
import CountrySelect from "@/components/ui/country-select";

export default async function PhoneCapturePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  return (
    <div className="p-4 max-w-xl mx-auto flex flex-col gap-6 mt-6 h-full min-h-[80vh] pb-20">
      <h1 className="text-2xl font-bold text-gray-900">Enter Phone Number</h1>
      
      <form action="/add/manual/action" method="post" className="flex flex-col gap-6 flex-1">
        
        <LocationAndEventTracker />
        
        <div className="flex flex-col gap-2 mt-4">
          <Label htmlFor="phone">Phone Number</Label>
          <div className="flex gap-2">
            <CountrySelect name="country_code" defaultValue="+1" className="border border-gray-300 rounded-xl px-3 py-2 bg-white w-28 md:w-36 text-sm" />
            <Input type="tel" name="phone" placeholder="Enter number..." className="flex-1 h-12 rounded-xl" required />
          </div>
        </div>

        <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-6 mt-4">
          <h2 className="font-semibold text-gray-900 mb-6">Who did you meet? <span className="text-gray-400 font-normal">(Optional)</span></h2>
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <Label htmlFor="first_name" className="text-xs uppercase tracking-wider text-gray-500">First Name</Label>
              <Input name="first_name" placeholder="John" className="h-12 rounded-xl" />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="company" className="text-xs uppercase tracking-wider text-gray-500">Company</Label>
              <Input name="company" placeholder="Acme Corp" className="h-12 rounded-xl" />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="note" className="text-xs uppercase tracking-wider text-gray-500">Conversation Note</Label>
              <textarea 
                name="note" 
                rows={3} 
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900"
                placeholder="What did you talk about?"
              ></textarea>
            </div>
          </div>
        </div>

        <div className="mt-auto pt-4">
          <Button type="submit" size="lg" className="w-full bg-gray-900 hover:bg-gray-800 text-white rounded-xl h-14 text-lg">Save Contact</Button>
        </div>
      </form>
    </div>
  );
}
