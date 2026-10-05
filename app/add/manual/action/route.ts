import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const requestUrl = new URL(request.url);
  const formData = await request.formData();
  
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(`${requestUrl.origin}/login`, { status: 301 });
  }

  const city = formData.get('city') as string;
  const detailedLocation = formData.get('detailed_location') as string;
  const latitude = formData.get('latitude') ? parseFloat(formData.get('latitude') as string) : null;
  const longitude = formData.get('longitude') ? parseFloat(formData.get('longitude') as string) : null;
  
  // Get the user's chosen event name (defaults to 'General Networking')
  const rawEventName = formData.get('event_name') as string;
  const eventName = rawEventName && rawEventName.trim() !== '' ? rawEventName : 'General Networking';

  // EVENT PROCESSING
  let eventId = null;
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);

  // Look for an event today with this exact name for this user
  const { data: existingEvent } = await supabase
    .from('events')
    .select('id')
    .eq('owner_id', user.id)
    .eq('name', eventName)
    .gte('created_at', todayStart.toISOString())
    .lte('created_at', todayEnd.toISOString())
    .limit(1)
    .single();
    
  if (existingEvent) {
    eventId = existingEvent.id;
  } else {
    // Create the event requested by the user
    const { data: newEvent } = await supabase.from('events').insert({
      owner_id: user.id,
      name: eventName,
      city: city || detailedLocation,
    }).select('id').single();
    
    if (newEvent) eventId = newEvent.id;
  }

  // Create Contact
  const { data: contact, error: contactError } = await supabase.from('contacts').insert({
    owner_id: user.id,
    first_name: formData.get('first_name'),
    last_name: formData.get('last_name'),
    company: formData.get('company'),
    job_title: formData.get('job_title'),
    phone: formData.get('phone'),
    email: formData.get('email'),
    website: formData.get('website'),
    linkedin_url: (formData.get('website') as string)?.includes('linkedin') ? formData.get('website') : null,
    city: city
  }).select().single();

  if (contactError || !contact) {
    return NextResponse.redirect(`${requestUrl.origin}/add/manual?error=Failed to save contact`, { status: 301 });
  }

  // Create Interaction
  const note = formData.get('note');
  await supabase.from('interactions').insert({
    owner_id: user.id,
    contact_id: contact.id,
    event_id: eventId,
    note: note,
    capture_method: 'manual',
    occurred_at: new Date().toISOString(),
    city: city,
    latitude: latitude,
    longitude: longitude
  });

  return NextResponse.redirect(`${requestUrl.origin}/contacts/${contact.id}`, { status: 301 });
}
