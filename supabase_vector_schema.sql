-- Enable the pgvector extension to work with embedding vectors
create extension if not exists vector;

-- Create a table to store your documents
create table public.market_data (
  id uuid default gen_random_uuid() primary key,
  title text,
  location text,
  price numeric,
  area_sqft numeric,
  bedrooms integer,
  property_type text,
  raw_content text, -- A string summarizing the property for Gemini
  embedding vector(768), -- Gemini embeddings use 768 dimensions
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create a function to search for real estate listings based on similarity
create or replace function match_properties (
  query_embedding vector(768),
  match_threshold float,
  match_count int
)
returns table (
  id uuid,
  title text,
  location text,
  price numeric,
  area_sqft numeric,
  bedrooms integer,
  property_type text,
  raw_content text,
  similarity float
)
language sql stable
as $$
  select
    market_data.id,
    market_data.title,
    market_data.location,
    market_data.price,
    market_data.area_sqft,
    market_data.bedrooms,
    market_data.property_type,
    market_data.raw_content,
    1 - (market_data.embedding <=> query_embedding) as similarity
  from market_data
  where 1 - (market_data.embedding <=> query_embedding) > match_threshold
  order by similarity desc
  limit match_count;
$$;
