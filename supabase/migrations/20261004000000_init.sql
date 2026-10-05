-- Create tables

CREATE TABLE profiles (
  id uuid primary key references auth.users(id),
  first_name text,
  last_name text,
  display_name text,
  job_title text,
  company text,
  bio text,
  phone text,
  email text,
  website text,
  linkedin_url text,
  avatar_path text,
  public_slug text unique,
  public_profile_enabled boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

CREATE TABLE profile_visibility (
  user_id uuid primary key references profiles(id) on delete cascade,
  show_photo boolean default true,
  show_phone boolean default false,
  show_email boolean default false,
  show_website boolean default true,
  show_linkedin boolean default true,
  show_company boolean default true,
  show_title boolean default true,
  show_bio boolean default true
);

CREATE TABLE contacts (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references auth.users(id) on delete cascade,
  first_name text,
  last_name text,
  display_name text,
  job_title text,
  company text,
  phone text,
  email text,
  website text,
  linkedin_url text,
  address text,
  city text,
  region text,
  country text,
  avatar_path text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

CREATE TABLE contact_fields (
  id uuid primary key default gen_random_uuid(),
  contact_id uuid references contacts(id) on delete cascade,
  field_name text,
  field_value text,
  source_type text,
  confidence numeric,
  verified_by_user boolean default false,
  created_at timestamptz default now()
);

CREATE TABLE events (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references auth.users(id) on delete cascade,
  name text not null,
  description text,
  venue text,
  city text,
  country text,
  website text,
  starts_at timestamptz,
  ends_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

CREATE TABLE interactions (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references auth.users(id) on delete cascade,
  contact_id uuid references contacts(id) on delete cascade,
  event_id uuid references events(id) on delete set null,
  occurred_at timestamptz default now(),
  timezone text,
  latitude numeric,
  longitude numeric,
  location_accuracy numeric,
  location_name text,
  city text,
  region text,
  country text,
  location_source text,
  note text,
  follow_up_note text,
  follow_up_at timestamptz,
  follow_up_status text default 'none',
  capture_method text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

CREATE TABLE tags (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references auth.users(id) on delete cascade,
  name text not null,
  created_at timestamptz default now()
);

CREATE TABLE contact_tags (
  contact_id uuid references contacts(id) on delete cascade,
  tag_id uuid references tags(id) on delete cascade,
  primary key(contact_id, tag_id)
);

CREATE TABLE interaction_tags (
  interaction_id uuid references interactions(id) on delete cascade,
  tag_id uuid references tags(id) on delete cascade,
  primary key(interaction_id, tag_id)
);

CREATE TABLE contact_assets (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references auth.users(id) on delete cascade,
  contact_id uuid references contacts(id) on delete cascade,
  asset_type text,
  storage_path text,
  mime_type text,
  created_at timestamptz default now()
);

-- Row Level Security (RLS) policies

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile_visibility ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_fields ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE interaction_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_assets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Anyone can read public profiles" ON profiles FOR SELECT USING (public_profile_enabled = true);

CREATE POLICY "Users can manage own visibility" ON profile_visibility FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own contacts" ON contacts FOR ALL USING (auth.uid() = owner_id);
CREATE POLICY "Users can manage own contact fields" ON contact_fields FOR ALL USING (
  EXISTS (SELECT 1 FROM contacts WHERE contacts.id = contact_fields.contact_id AND contacts.owner_id = auth.uid())
);
CREATE POLICY "Users can manage own events" ON events FOR ALL USING (auth.uid() = owner_id);
CREATE POLICY "Users can manage own interactions" ON interactions FOR ALL USING (auth.uid() = owner_id);
CREATE POLICY "Users can manage own tags" ON tags FOR ALL USING (auth.uid() = owner_id);
CREATE POLICY "Users can manage own contact tags" ON contact_tags FOR ALL USING (
  EXISTS (SELECT 1 FROM contacts WHERE contacts.id = contact_tags.contact_id AND contacts.owner_id = auth.uid())
);
CREATE POLICY "Users can manage own interaction tags" ON interaction_tags FOR ALL USING (
  EXISTS (SELECT 1 FROM interactions WHERE interactions.id = interaction_tags.interaction_id AND interactions.owner_id = auth.uid())
);
CREATE POLICY "Users can manage own contact assets" ON contact_assets FOR ALL USING (auth.uid() = owner_id);

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = now();
   RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_modtime BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_contacts_modtime BEFORE UPDATE ON contacts FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_events_modtime BEFORE UPDATE ON events FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_interactions_modtime BEFORE UPDATE ON interactions FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (new.id, new.email);
  
  INSERT INTO public.profile_visibility (user_id)
  VALUES (new.id);
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
