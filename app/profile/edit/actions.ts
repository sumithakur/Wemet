'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function saveProfile(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return

  let avatarUrl = undefined;
  
  // Handle Avatar Upload
  const avatarFile = formData.get('avatar') as File;
  if (avatarFile && avatarFile.size > 0) {
    const fileExt = avatarFile.name.split('.').pop();
    // Use native Node.js crypto.randomUUID() instead of the 'uuid' package
    const fileName = `${user.id}-${crypto.randomUUID()}.${fileExt}`;
    
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(fileName, avatarFile, { upsert: true });
      
    if (!uploadError) {
      const { data: publicUrlData } = supabase.storage.from('avatars').getPublicUrl(fileName);
      avatarUrl = publicUrlData.publicUrl;
    }
  }

  // Combine country code and phone
  const countryCode = formData.get('country_code') as string;
  const rawPhone = formData.get('phone') as string;
  const fullPhone = rawPhone ? `${countryCode} ${rawPhone}` : '';

  const updates: any = {
    first_name: formData.get('first_name'),
    last_name: formData.get('last_name'),
    job_title: formData.get('job_title'),
    company: formData.get('company'),
    phone: fullPhone,
    website: formData.get('website'),
    updated_at: new Date().toISOString(),
  };

  if (avatarUrl) {
    updates.avatar_url = avatarUrl;
  }

  await supabase.from('profiles').update(updates).eq('id', user.id)

  revalidatePath('/profile')
  revalidatePath('/dashboard')
  redirect('/profile')
}
