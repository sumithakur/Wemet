'use server'

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export async function deleteContact(contactId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase
    .from('contacts')
    .delete()
    .eq('id', contactId)
    .eq('owner_id', user.id);

  if (error) {
    throw new Error(error.message);
  }

  redirect('/contacts');
}
