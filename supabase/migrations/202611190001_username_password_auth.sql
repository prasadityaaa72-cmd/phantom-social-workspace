alter table public.profiles
  add column if not exists username text;

create unique index if not exists profiles_username_unique
  on public.profiles (lower(username))
  where username is not null;

alter table public.profiles
  drop constraint if exists profiles_username_format;

alter table public.profiles
  add constraint profiles_username_format
  check (username is null or username ~ '^[a-z0-9_]{3,24}$');

create table if not exists public.auth_usernames (
  user_id uuid primary key references auth.users(id) on delete cascade,
  username text not null unique,
  email text not null
);

alter table public.auth_usernames enable row level security;
revoke all on table public.auth_usernames from anon, authenticated;
grant all on table public.auth_usernames to service_role;

create or replace function public.sync_phantom_auth_identity()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  requested_username text;
begin
  requested_username := lower(coalesce(new.raw_user_meta_data ->> 'username', ''));
  if requested_username !~ '^[a-z0-9_]{3,24}$' then
    raise exception 'Username must be 3-24 characters using lowercase letters, numbers, or underscores';
  end if;

  insert into public.profiles (id, display_name, username)
  values (new.id, requested_username, requested_username)
  on conflict (id) do update
    set username = excluded.username;

  insert into public.auth_usernames (user_id, username, email)
  values (new.id, requested_username, new.email)
  on conflict (user_id) do update
    set username = excluded.username, email = excluded.email;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created_phantom on auth.users;
create trigger on_auth_user_created_phantom
after insert or update of email, raw_user_meta_data on auth.users
for each row execute function public.sync_phantom_auth_identity();
