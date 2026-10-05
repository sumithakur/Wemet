'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import LocationAndEventTracker from "@/components/capture/LocationAndEventTracker";

export default function AddManualPage() {
  const searchParams = useSearchParams();
  const qr = searchParams.get('qr') || '';
  
  let defaultFirstName = '';
  let defaultLastName = '';
  let defaultPhone = '';
  let defaultEmail = '';
  let defaultCompany = '';
  let defaultTitle = '';
  let defaultWebsite = '';

  if (qr.startsWith('BEGIN:VCARD') || qr.startsWith('MECARD:')) {
    const fnMatch = qr.match(/FN:(.*?)(?:\n|;)/);
    if (fnMatch) {
      const parts = fnMatch[1].trim().split(' ');
      defaultFirstName = parts[0] || '';
      defaultLastName = parts.slice(1).join(' ') || '';
    } else {
      const nMatch = qr.match(/N:(.*?)(?:\n|;)/);
      if (nMatch) {
        const parts = nMatch[1].trim().split(',');
        if (parts.length > 1) {
          defaultLastName = parts[0];
          defaultFirstName = parts[1];
        } else {
          defaultFirstName = parts[0];
        }
      }
    }
    const telMatch = qr.match(/TEL.*?:(.*?)(?:\n|;)/);
    if (telMatch) defaultPhone = telMatch[1].trim();
    
    const emailMatch = qr.match(/EMAIL.*?:(.*?)(?:\n|;)/);
    if (emailMatch) defaultEmail = emailMatch[1].trim();
    
    const orgMatch = qr.match(/ORG:(.*?)(?:\n|;)/);
    if (orgMatch) defaultCompany = orgMatch[1].trim();
    
    const titleMatch = qr.match(/TITLE:(.*?)(?:\n|;)/);
    if (titleMatch) defaultTitle = titleMatch[1].trim();
    
    const urlMatch = qr.match(/URL:(.*?)(?:\n|;)/);
    if (urlMatch) defaultWebsite = urlMatch[1].trim();
  } else if (qr.startsWith('http://') || qr.startsWith('https://')) {
    defaultWebsite = qr;
  }

  return (
    <div className="p-4 max-w-xl mx-auto flex flex-col gap-6 mt-6 pb-20">
      <h1 className="text-2xl font-bold text-gray-900">Type details</h1>
      
      {qr && (
        <div className="bg-green-50 text-green-800 p-3 rounded-xl border border-green-200 text-sm">
          {defaultFirstName || defaultWebsite ? '✓ Parsed details from QR code' : 'QR Code detected. Please verify details.'}
        </div>
      )}

      <form className="flex flex-col gap-5" action="/add/manual/action" method="post">
        
        <LocationAndEventTracker />
        
        <div className="grid grid-cols-2 gap-4 mt-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="first_name" className="text-xs uppercase tracking-wider text-gray-500">First Name</Label>
            <Input name="first_name" defaultValue={defaultFirstName} className="h-12 rounded-xl" required />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="last_name" className="text-xs uppercase tracking-wider text-gray-500">Last Name</Label>
            <Input name="last_name" defaultValue={defaultLastName} className="h-12 rounded-xl" />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="company" className="text-xs uppercase tracking-wider text-gray-500">Company</Label>
          <Input name="company" defaultValue={defaultCompany} className="h-12 rounded-xl" />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="job_title" className="text-xs uppercase tracking-wider text-gray-500">Job Title</Label>
          <Input name="job_title" defaultValue={defaultTitle} className="h-12 rounded-xl" />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="phone" className="text-xs uppercase tracking-wider text-gray-500">Phone</Label>
          <Input type="tel" name="phone" defaultValue={defaultPhone} className="h-12 rounded-xl" />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="email" className="text-xs uppercase tracking-wider text-gray-500">Email</Label>
          <Input type="email" name="email" defaultValue={defaultEmail} className="h-12 rounded-xl" />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="website" className="text-xs uppercase tracking-wider text-gray-500">Website or LinkedIn</Label>
          <Input type="url" name="website" defaultValue={defaultWebsite} className="h-12 rounded-xl" />
        </div>
        <div className="flex flex-col gap-2 mt-2">
          <Label htmlFor="note" className="text-xs uppercase tracking-wider text-gray-500">Conversation Note</Label>
          <textarea 
            name="note" 
            rows={3} 
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white"
            placeholder="What did you discuss?"
          ></textarea>
        </div>
        
        <Button type="submit" size="lg" className="w-full bg-gray-900 hover:bg-gray-800 text-white rounded-xl h-14 mt-4">Save Contact</Button>
      </form>
    </div>
  );
}
