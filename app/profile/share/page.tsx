import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import QRCode from 'qrcode';

export default async function ProfileSharePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  let publicUrl = '';
  let qrCodeDataUrl = '';

  if (profile) {
    // Basic fallback if public_slug is not set yet
    const slug = profile.public_slug || user.id; 
    publicUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/p/${slug}`;
    qrCodeDataUrl = await QRCode.toDataURL(publicUrl, { width: 300, margin: 2 });
  }

  return (
    <div className="p-4 max-w-xl mx-auto flex flex-col items-center justify-center min-h-[80vh] gap-6 mt-6 text-center">
      <h1 className="text-2xl font-bold text-gray-900">Share your contact</h1>
      
      <Card className="w-full max-w-sm">
        <CardContent className="p-8 flex flex-col items-center gap-6">
          <div className="text-center">
            <h2 className="text-xl font-bold">{profile?.first_name} {profile?.last_name}</h2>
            <p className="text-gray-500 text-sm">{profile?.job_title}</p>
          </div>
          
          <div className="bg-white p-2 rounded-xl border border-gray-100 shadow-sm">
            {qrCodeDataUrl && <img src={qrCodeDataUrl} alt="QR Code" className="w-full h-auto" />}
          </div>
          
          <p className="text-sm text-gray-500">Scan to save my contact details</p>
        </CardContent>
      </Card>
    </div>
  );
}
