-- WETT Girls competition foundation
-- Baseline for the already-applied production schema.
-- IMPORTANT: Register this migration as applied before any db push.
-- It creates a private ballot ledger and does not open voting.

create extension if not exists pgcrypto;

create table if not exists public.competition_songs (
  id uuid primary key default gen_random_uuid(),
  challenge_number smallint not null unique check (challenge_number between 1 and 30),
  title text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists public.competition_rounds (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  max_selections smallint not null check (max_selections between 1 and 2),
  status text not null default 'draft' check (status in ('draft','scheduled','open','closed','finalized')),
  opens_at timestamptz,
  closes_at timestamptz,
  created_at timestamptz not null default now(),
  check (closes_at is null or opens_at is null or closes_at > opens_at)
);

create table if not exists public.competition_round_songs (
  round_id uuid not null references public.competition_rounds(id) on delete cascade,
  song_id uuid not null references public.competition_songs(id) on delete restrict,
  display_order smallint not null,
  primary key (round_id, song_id),
  unique (round_id, display_order)
);

create table if not exists public.competition_ballots (
  id uuid primary key default gen_random_uuid(),
  round_id uuid not null references public.competition_rounds(id) on delete restrict,
  voter_id uuid not null references auth.users(id) on delete restrict,
  submitted_at timestamptz not null default now(),
  unique (round_id, voter_id),
  unique (id, round_id)
);

create table if not exists public.competition_ballot_selections (
  ballot_id uuid not null,
  round_id uuid not null,
  song_id uuid not null,
  primary key (ballot_id, song_id),
  foreign key (ballot_id, round_id)
    references public.competition_ballots(id, round_id) on delete cascade,
  foreign key (round_id, song_id)
    references public.competition_round_songs(round_id, song_id) on delete restrict
);

create index if not exists competition_ballots_round_idx
  on public.competition_ballots(round_id, submitted_at);
create index if not exists competition_selections_song_idx
  on public.competition_ballot_selections(round_id, song_id);

alter table public.competition_songs enable row level security;
alter table public.competition_rounds enable row level security;
alter table public.competition_round_songs enable row level security;
alter table public.competition_ballots enable row level security;
alter table public.competition_ballot_selections enable row level security;

drop policy if exists "published rounds are readable" on public.competition_rounds;
create policy "published rounds are readable"
  on public.competition_rounds for select to anon, authenticated
  using (status in ('scheduled','open','closed','finalized'));

drop policy if exists "songs are readable" on public.competition_songs;
create policy "songs are readable"
  on public.competition_songs for select to anon, authenticated
  using (true);

drop policy if exists "round lineups are readable" on public.competition_round_songs;
create policy "round lineups are readable"
  on public.competition_round_songs for select to anon, authenticated
  using (exists (
    select 1 from public.competition_rounds r
    where r.id = round_id and r.status in ('scheduled','open','closed','finalized')
  ));

revoke all on public.competition_ballots from anon, authenticated;
revoke all on public.competition_ballot_selections from anon, authenticated;
revoke insert, update, delete on public.competition_songs from anon, authenticated;
revoke insert, update, delete on public.competition_rounds from anon, authenticated;
revoke insert, update, delete on public.competition_round_songs from anon, authenticated;

create or replace function public.submit_competition_ballot(
  p_round_id uuid,
  p_song_ids uuid[]
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_voter_id uuid := auth.uid();
  v_verified_at timestamptz;
  v_round public.competition_rounds%rowtype;
  v_ballot_id uuid;
  v_unique_count integer;
  v_valid_count integer;
begin
  if v_voter_id is null then
    raise exception 'Sign in with a verified email before voting' using errcode = '42501';
  end if;

  select u.email_confirmed_at into v_verified_at
  from auth.users u where u.id = v_voter_id;

  if v_verified_at is null then
    raise exception 'Verify your email before voting' using errcode = '42501';
  end if;

  select * into v_round
  from public.competition_rounds r
  where r.id = p_round_id
  for share;

  if not found or v_round.status <> 'open'
     or v_round.opens_at is null or v_round.closes_at is null
     or now() < v_round.opens_at or now() >= v_round.closes_at then
    raise exception 'This voting round is not open';
  end if;

  if p_song_ids is null or cardinality(p_song_ids) = 0 then
    raise exception 'Select at least one song';
  end if;

  select count(distinct x) into v_unique_count
  from unnest(p_song_ids) as x;

  if v_unique_count <> cardinality(p_song_ids) then
    raise exception 'A song may only be selected once';
  end if;

  if cardinality(p_song_ids) > v_round.max_selections then
    raise exception 'You selected more songs than this round allows';
  end if;

  select count(*) into v_valid_count
  from public.competition_round_songs rs
  where rs.round_id = p_round_id
    and rs.song_id = any(p_song_ids);

  if v_valid_count <> cardinality(p_song_ids) then
    raise exception 'One or more selected songs are not in this round';
  end if;

  insert into public.competition_ballots(round_id, voter_id)
  values (p_round_id, v_voter_id)
  returning id into v_ballot_id;

  insert into public.competition_ballot_selections(ballot_id, round_id, song_id)
  select v_ballot_id, p_round_id, x
  from unnest(p_song_ids) as x;

  return v_ballot_id;
exception
  when unique_violation then
    raise exception 'A ballot has already been submitted for this round';
end;
$$;

revoke all on function public.submit_competition_ballot(uuid, uuid[]) from public, anon;
grant execute on function public.submit_competition_ballot(uuid, uuid[]) to authenticated;

insert into public.competition_songs(challenge_number, title) values
  (1, 'Silk Concrete'),
  (2, 'Wait A Minute'),
  (3, 'Move Around'),
  (4, 'Fresh Water'),
  (5, 'Pocket Change'),
  (6, 'Thorn Heart'),
  (7, 'I Know What I Know'),
  (8, 'Mo Scratch'),
  (9, 'KIR (Keep It Real)'),
  (10, 'Pick Up'),
  (11, 'Chock On It'),
  (12, 'Cuddle Me'),
  (13, 'FFE (Fine Forever)'),
  (14, 'Sex Release'),
  (15, 'Body Rub'),
  (16, 'Ballers'),
  (17, 'ISDBM'),
  (18, 'Bird Call'),
  (19, 'Beat Me There'),
  (20, 'Check In'),
  (21, 'Burn Rubber'),
  (22, 'My Old Phone'),
  (23, 'I Don''t Want to Go Outside'),
  (24, 'Make Me Feel Sexy'),
  (25, 'Fur'),
  (26, 'Where''s Santa Now?'),
  (27, 'Thank You'),
  (28, 'Shot O''Clock'),
  (29, 'Layover'),
  (30, 'Take Me')
on conflict (challenge_number) do update set title = excluded.title;

insert into public.competition_rounds(slug, name, max_selections, status)
values
  ('round-1', 'Opening Round — 30 Songs', 2, 'draft'),
  ('round-2', 'Top 15', 2, 'draft'),
  ('final', 'Top 8 Final', 1, 'draft')
on conflict (slug) do nothing;

insert into public.competition_round_songs(round_id, song_id, display_order)
select r.id, s.id, s.challenge_number
from public.competition_rounds r
cross join public.competition_songs s
where r.slug = 'round-1'
on conflict (round_id, song_id) do nothing;

comment on table public.competition_ballots is
  'Private immutable ballot ledger; one ballot per authenticated voter per round.';
comment on function public.submit_competition_ballot(uuid, uuid[]) is
  'Validates verified email, open round, allowed lineup and selection cap; inserts one immutable ballot.';
