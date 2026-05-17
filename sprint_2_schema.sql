-- Create user_portfolios table
create table public.user_portfolios (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references auth.users(id) on delete cascade not null,
    city text not null,
    floors text,
    area text,
    estimated_value numeric not null,
    projected_roi numeric not null,
    key_strengths jsonb not null default '[]'::jsonb,
    risk_factors jsonb not null default '[]'::jsonb,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table public.user_portfolios enable row level security;

-- Create policy to allow users to insert their own portfolios
create policy "Users can insert their own portfolios" 
on public.user_portfolios for insert 
with check (auth.uid() = user_id);

-- Create policy to allow users to select their own portfolios
create policy "Users can view their own portfolios" 
on public.user_portfolios for select 
using (auth.uid() = user_id);

-- Create policy to allow users to update their own portfolios
create policy "Users can update their own portfolios" 
on public.user_portfolios for update 
using (auth.uid() = user_id);

-- Create policy to allow users to delete their own portfolios
create policy "Users can delete their own portfolios" 
on public.user_portfolios for delete 
using (auth.uid() = user_id);
