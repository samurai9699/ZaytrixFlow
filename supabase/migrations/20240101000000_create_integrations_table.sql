-- Create integrations table
create table if not exists public.integrations (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references auth.users not null,
    integration_id text not null,
    settings jsonb default '{}'::jsonb,
    last_synced timestamp with time zone,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unique(user_id, integration_id)
);

-- Set up RLS (Row Level Security)
alter table public.integrations enable row level security;

-- Create policies
create policy "Users can view their own integrations"
    on public.integrations for select
    using (auth.uid() = user_id);

create policy "Users can insert their own integrations"
    on public.integrations for insert
    with check (auth.uid() = user_id);

create policy "Users can update their own integrations"
    on public.integrations for update
    using (auth.uid() = user_id)
    with check (auth.uid() = user_id);

create policy "Users can delete their own integrations"
    on public.integrations for delete
    using (auth.uid() = user_id);

-- Create updated_at trigger
create or replace function public.handle_updated_at()
returns trigger as $$
begin
    new.updated_at = timezone('utc'::text, now());
    return new;
end;
$$ language plpgsql;

create trigger handle_integrations_updated_at
    before update on public.integrations
    for each row
    execute function public.handle_updated_at(); 