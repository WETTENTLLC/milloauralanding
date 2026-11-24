# WETT Girls Supabase baseline

## Current production state

The WETT Girls Supabase project already received the competition foundation manually through the SQL Editor. The owner verified:

- 30 songs
- 3 rounds: Opening Round — 30 Songs, Top 15, Top 8 Final
- 30 opening-round lineup entries
- 0 ballots
- 0 ballot selections
- All three rounds remain `draft`

The migration in `supabase/migrations/202611230001_wett_girls_competition.sql` records the SQL that created that foundation.

## Critical: baseline before deploying

The GitHub integration must **not** replay this migration against the already-provisioned production database. Before any production database deployment:

1. Confirm the Supabase dashboard GitHub integration points to `WETTENTLLC/milloauralanding`, working directory `.`, production branch `main`.
2. Keep **Deploy to production OFF** until migration history is reconciled.
3. Link the Supabase CLI to the existing project `ynnanrasjzuhcwauxttg` using an authorized operator session.
4. Inspect remote migration history and the live schema. Do not reset, drop, truncate, or recreate the production database.
5. If the migration is absent from remote migration history and the live schema matches this file, register this version as already applied using the Supabase CLI migration-repair workflow (for example, `supabase migration repair --status applied 202611230001 --linked`). Verify the exact CLI syntax/version before running.
6. Run a read-only schema diff and confirm the migration history and remote schema are aligned.
7. Only then consider enabling production deployment for future migrations.

Do not run `supabase db push` before the baseline is registered and verified.

## Secrets

- Never commit the Supabase `service_role` key, database password, or access token.
- The browser may use only the Supabase project URL and publishable/anon key, protected by RLS.
- GitHub Pages is static hosting. It does not provide a private server runtime for service-role operations.

## Voting state

Voting remains closed. All rounds are draft. Do not open a round until email verification, public read permissions, duplicate ballot prevention, admin controls, and end-to-end tests have passed.
