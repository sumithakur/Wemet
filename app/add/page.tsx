import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';

export default async function AddPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  return (
    <div className="p-4 max-w-xl mx-auto flex flex-col gap-6 mt-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Add someone</h1>
      
      <div className="flex flex-col gap-4">
        <Link href="/add/card">
          <Card className="hover:bg-gray-50 transition">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="text-3xl">📸</div>
              <div className="flex flex-col">
                <span className="font-semibold text-lg">Scan Business Card</span>
                <span className="text-sm text-gray-500">Extract info instantly using OCR</span>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/add/qr">
          <Card className="hover:bg-gray-50 transition">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="text-3xl">📱</div>
              <div className="flex flex-col">
                <span className="font-semibold text-lg">Scan QR Code</span>
                <span className="text-sm text-gray-500">LinkedIn, vCard, or Profile QR</span>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/add/manual">
          <Card className="hover:bg-gray-50 transition">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="text-3xl">☎️</div>
              <div className="flex flex-col">
                <span className="font-semibold text-lg">Enter Phone or Details</span>
                <span className="text-sm text-gray-500">Add manually if no card/QR</span>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
