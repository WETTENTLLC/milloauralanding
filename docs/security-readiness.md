# WETT Girls — lean security and privacy baseline

**Status:** Working baseline, not an audit, attestation, or certification  
**Reviewed:** November 25, 2026  
**Scope:** Public artist/marketing website and Fan Championship registration/voting only  
**Budget target:** Use existing/free platform features first; no paid compliance program authorized

## 1. Scope decision

WETT Girls is a public music and artist website with public music/artist content, links to external platforms, optional traffic analytics, email-verified Fan Championship registration, and private ballot records.

The current site does not collect health information, precise location, payment-card details, government ID, or sensitive identity documents. It does not operate a patient portal or payment processor. HIPAA, a paid SOC 2 engagement, and ISO/IEC 27001 certification are therefore not baseline requirements for the current website. Reassess before adding healthcare services, payments, advertising, customer accounts, or processing data under an enterprise contract.

Use the free NIST Cybersecurity Framework 2.0 Small Business Quick-Start Guide as the proportionate risk-management reference: https://www.nist.gov/publications/nist-cybersecurity-framework-20-small-business-quick-start-guide

## 2. System inventory and boundaries

| Component | Current role | Data handled |
|---|---|---|
| GitHub repository and Actions | Source code, version control, static-site deployment | Public website code and build artifacts |
| GitHub Pages | Public website hosting | Web requests and hosting/security telemetry handled by provider |
| Supabase project `ynnanrasjzuhcwauxttg` | Authentication and voting database | Voter email/account, round, selected songs, timestamps |
| Google Analytics 4 | Optional site measurement | Usage/cookie/device identifiers only after opt-in is implemented |
| Email provider / user's email app | Voting magic links and direct contact | Email address and message content |
| External music/social providers | Streaming, social and commerce links | Visitor data governed by each third party |

Public site media and publishable client credentials are not secrets. Never expose Supabase service-role/secret keys, database passwords, private tokens, or privileged credentials in browser code or repository files.

## 3. Data minimization and user notice

- Load Google Analytics only after affirmative acceptance. Rejection leaves the analytics tag unloaded.
- Provide a persistent cookie-preference control in the footer.
- Explain that optional analytics can process cookie/device identifiers.
- Disclose that voting requires an email-verified Supabase account and that the ballot is linked internally to the account identifier. Do not call ballots anonymous.
- Ask voting participants to confirm they are at least 13 before requesting an email address. Do not request date of birth.
- Keep health, precise location, payment-card, government-ID, and unrelated demographic fields out of this site.
- Link the Privacy Notice and Voting Terms at the point of collection and in the site footer.

## 4. Supabase control observations

Read-only checks on November 25, 2026 found:

- Project active/healthy; region `us-east-2`.
- Five public competition tables, all with RLS enabled.
- Public visitors can read the song catalogue, published/open round metadata, and public round lineups as configured.
- Direct SELECT access to `competition_ballots` and `competition_ballot_selections` is denied to both anonymous and authenticated roles.
- Anonymous users cannot execute `submit_competition_ballot`; authenticated users can.
- The ballot function is SECURITY DEFINER, owned by postgres, and configured with an empty search path. Its code checks `auth.uid()`, email verification, round status/timing, allowed song lineup, selection cap, duplicate choices, and the one-ballot-per-account constraint.
- The Security Advisor reported two `rls_enabled_no_policy` INFO findings for the private ballot tables and one `authenticated_security_definer_function_executable` WARN finding for the ballot function. The no-policy state is intentionally fail-closed; the function is a necessary privileged write path and must remain tightly constrained and independently reviewed.
- Performance Advisor identified three unindexed foreign keys. These are performance improvements, not evidence of a data exposure.
- Current competition tables contained 30 songs, 3 rounds, 30 round-song entries, and 0 ballot records during the check.

Do not “fix” the no-policy findings by granting direct ballot access. Do not change the privileged ballot function without regression tests and a reviewed threat model.

## 5. Hosting and deployment limitations

The repository includes `app/public/_headers`, but that file is a Cloudflare Pages convention and is not applied as custom response headers by GitHub Pages. Do not tell investors that these response headers are enforced on the current GitHub Pages deployment.

Free, low-risk improvement path:
1. Keep the existing GitHub Actions deployment workflow least-privileged.
2. Use GitHub's free Dependabot alerts/security updates and weekly dependency-update PRs.
3. Keep required pull-request build/type-check/lint validation.
4. Before any future hosting migration, test the full site and configure security response headers on a host/CDN that supports them. Do not change DNS or hosting without a rollback plan.
5. Confirm GitHub account MFA and Supabase account MFA for every administrator. These settings require an account owner and have not been verified by this review.

## 6. Retention and deletion operations

The privacy notice describes purpose-based retention. Operational owner tasks:
- At the end of each competition round, record the date results are finalized and the dispute/review window closes.
- Review whether account-to-ballot linkage remains necessary. Preserve only what is required for competition integrity, disputes, and legal obligations.
- Process verified access/correction/deletion requests through an authorized administrator; do not promise deletion of a ballot while doing so would invalidate an active contest or conflict with legal obligations.
- Review dormant voter accounts and completed-round data quarterly. Delete or de-identify information when no longer reasonably needed.
- Document any exception, reason, approver, and review date. Do not export voter emails or ballot-level data into public spreadsheets or marketing lists.

## 7. Incident and recovery basics

Maintain an internal incident log with date/time, system, impact, containment, affected data categories, notifications considered, remediation, and owner. On suspected account compromise or unauthorized ballot access:
1. Preserve logs and relevant evidence.
2. Restrict compromised accounts/credentials and rotate affected secrets.
3. Check Supabase Auth, database and GitHub audit/deployment events.
4. Assess affected people, jurisdictional notification requirements, and contractual obligations promptly.
5. Record the decision and remediation.
6. Test restoration from available backups before relying on them. Confirm backup availability and recovery settings in the Supabase dashboard; those settings were not verified in this review.

## 8. Lightweight recurring checklist

**Monthly**
- Review GitHub Dependabot alerts and open dependency PRs.
- Review Supabase Security Advisor findings and unexpected auth/database activity.
- Confirm no service-role key, database password, or private token entered the public repository.
- Review admin and collaborator access.

**Quarterly**
- Reconfirm MFA for administrators.
- Review data retention and outstanding privacy requests.
- Review external processors and any new website data collection.
- Test a backup restore or document the result of a recovery exercise.
- Review the risk register and record decisions.

**Before new features**
- Identify data collected and why it is needed.
- Minimize fields and retention.
- Update the Privacy Notice and Terms before launch.
- Review access control/RLS and test anonymous, authenticated, and administrator paths.
- Keep analytics and marketing tracking opt-in where required.

## 9. Claims and investor communication

Allowed factual description after validating the implementation: “WETT Girls has a documented, risk-based security and privacy baseline using access controls, verified-email voting, restricted ballot access, consent-based analytics, and recurring control reviews.”

Do not claim “HIPAA compliant,” “SOC 2 certified,” “SOC 2 Type II,” “ISO 27001 certified,” “fully compliant,” or “audited” unless the relevant legal requirements and independent examinations/certifications have actually been completed and are in scope.

This internal record is not a penetration test, legal opinion, SOC 2 report, or ISO 27001 Statement of Applicability.
