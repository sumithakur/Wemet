import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    redirect('/dashboard');
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#FCFCFC] selection:bg-gray-900 selection:text-white">
      <header className="px-8 py-6 flex justify-between items-center max-w-5xl mx-auto w-full">
        <div className="font-bold text-xl tracking-tight text-gray-900">WeMet.</div>
        <div className="flex gap-6 items-center text-sm font-medium">
          <Link href="/login" className="text-gray-500 hover:text-gray-900 transition-colors">Log In</Link>
          <Link href="/signup" className="text-gray-900 hover:text-gray-600 transition-colors border-b border-gray-900 pb-0.5">Sign Up</Link>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center text-center px-6 py-24 max-w-3xl mx-auto w-full">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-gray-900 mb-8 leading-[1.1]">
          Remember everyone.
        </h1>
        <p className="text-lg text-gray-500 mb-12 max-w-xl leading-relaxed font-light">
          A minimalist tool to capture who you met, where you met them, and what you talked about. In under 30 seconds.
        </p>
        <div className="flex w-full sm:w-auto">
          <Button asChild className="h-14 px-10 text-base w-full sm:w-auto rounded-full bg-gray-900 text-white hover:bg-gray-800 shadow-md">
            <Link href="/signup">Start Remembering</Link>
          </Button>
        </div>
      </main>
    </div>
  );
}
