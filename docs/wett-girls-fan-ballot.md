# WETT Girls official fan ballot

## What is implemented in this branch

- The Fan Championship section now embeds the official ballot component.
- The ballot reads only an `open` round and its published lineup.
- Email sign-in uses Supabase Auth email OTP/magic links.
- The client calls the database's `submit_competition_ballot(uuid, uuid[])` RPC; the database remains responsible for checking verified email, open/valid voting window, selection cap, lineup membership and one ballot per authenticated account per round.
- The ballot UI does not reveal vote totals or voter records.
- When no round is open, the site displays a closed-state message. Draft rounds are not exposed as an active ballot.

## Required GitHub Actions repository variables

Set these under **GitHub → Settings → Secrets and variables → Actions → Variables**:

- `VITE_SUPABASE_URL` = `https://ynnanrasjzuhcwauxttg.supabase.co`
- `VITE_SUPABASE_ANON_KEY` = the project's publishable key (preferred) or legacy anon key from Supabase API settings.

These are public browser credentials protected by Supabase RLS. Never set a service_role key as a Vite variable, GitHub variable, or client-side secret.

The Pages workflow passes these variables to the Vite build. If either is missing, the ballot displays a preparation notice and does not make requests.

## Supabase Auth configuration

Before enabling a round, configure Supabase Auth URL settings:

- Site URL: `https://wettentllc.github.io/milloauralanding/`
- Add that exact URL to the allowed redirect URLs.
- Ensure email OTP/magic-link delivery is enabled and the email template returns the user to the requested redirect URL.
- Confirm the email provider's delivery and rate limits.

The app uses the implicit access-token return supported by Supabase Auth's default browser flow. If the project is configured for PKCE instead, use the Supabase JS client or add PKCE code-exchange handling before opening voting.

## Pre-launch requirements — not yet complete

1. Compare the live schema, constraints, grants and function definition against the migration file. The owner's earlier confirmation of diagnostic queries is useful, but the exact result sets have not been independently inspected here.
2. Establish the Supabase CLI migration baseline in the authenticated project session. Do not replay the foundation migration or run `db push` until the baseline is verified.
3. Configure the two GitHub Actions variables above.
4. Verify Supabase Auth redirect settings and email delivery.
5. Implement and protect a server-side/admin-only results and round-management workflow. Do not expose raw ballots or voter identities publicly.
6. Run end-to-end tests with test accounts: valid email, unverified email, duplicate submission, too many selections, wrong-round song, closed round, expired window, and simultaneous duplicate requests.
7. Confirm the prize fulfillment, tie-break rule, voter eligibility and result announcement process with the campaign owner.

## Competition rules represented in the current database

- Opening Round — 30 Songs: up to 2 selections.
- Top 15: up to 2 selections.
- Top 8 Final: 1 selection.

All rounds remain draft until an authorized administrator explicitly opens them. This branch does not open voting or publish a new website build by itself.
