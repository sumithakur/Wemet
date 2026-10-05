import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { signup } from '@/app/auth/actions';

export default async function SignupPage({
  searchParams,
}: {
  searchParams: { message?: string; error?: string };
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) redirect('/dashboard');

  return (
    <div className="flex flex-col min-h-screen bg-[#FCFCFC] px-6 py-12 justify-center items-center">
      <div className="w-full max-w-[340px] flex flex-col gap-10">
        <div className="text-center">
          <Link href="/"><h1 className="text-2xl font-bold tracking-tight text-gray-900 mb-2">WeMet.</h1></Link>
          <p className="text-gray-500 text-sm">Create your account</p>
        </div>

        <form className="flex flex-col gap-5" action={signup}>
          <div className="flex flex-col gap-2">
            <Label htmlFor="email" className="text-xs uppercase tracking-wider text-gray-500">Email</Label>
            <Input name="email" type="email" placeholder="name@example.com" className="h-12 bg-white rounded-xl border-gray-200" required />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="password" className="text-xs uppercase tracking-wider text-gray-500">Password</Label>
            <Input type="password" name="password" placeholder="••••••••" className="h-12 bg-white rounded-xl border-gray-200" required />
          </div>
          
          <Button type="submit" className="w-full mt-2 bg-gray-900 hover:bg-gray-800 text-white rounded-xl h-12 font-medium">
            Sign Up
          </Button>
          
          {searchParams?.message && <p className="mt-2 text-green-600 text-xs text-center">{searchParams.message}</p>}
          {searchParams?.error && <p className="mt-2 text-red-500 text-xs text-center">{searchParams.error}</p>}
        </form>

        <p className="text-center text-sm text-gray-500">
          Already have an account? <Link href="/login" className="text-gray-900 font-medium hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
}
