-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create property_analysis table
create table public.property_analysis (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references auth.users(id) on delete cascade not null,
    city text not null,
    floors integer not null,
    area numeric not null,
    estimated_value numeric not null,
    projected_roi numeric not null,
    key_strengths jsonb not null default '[]'::jsonb,
    risk_factors jsonb not null default '[]'::jsonb,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table public.property_analysis enable row level security;

-- Create policy to allow users to insert their own analyses
create policy "Users can insert their own analyses" 
on public.property_analysis for insert 
with check (auth.uid() = user_id);

-- Create policy to allow users to select their own analyses
create policy "Users can view their own analyses" 
on public.property_analysis for select 
using (auth.uid() = user_id);

-- Create policy to allow users to update their own analyses (optional)
create policy "Users can update their own analyses" 
on public.property_analysis for update 
using (auth.uid() = user_id);

-- Create policy to allow users to delete their own analyses (optional)
create policy "Users can delete their own analyses" 
on public.property_analysis for delete 
using (auth.uid() = user_id);
