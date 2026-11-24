import { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, LockKeyhole, Mail, RefreshCw, ShieldCheck } from 'lucide-react';
import './VotingChampionship.css';

type Round = { id: string; name: string; max_selections: number; opens_at: string | null; closes_at: string | null };
type Song = { id: string; title: string; display_order: number };
type AuthUser = { id: string; email?: string; email_confirmed_at?: string | null };

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;
const TOKEN_KEY = 'wett-girls-voter-token';

function apiHeaders(token?: string) {
  return {
    apikey: SUPABASE_ANON_KEY || '',
    Authorization: 'Bearer ' + (token || SUPABASE_ANON_KEY || ''),
    'Content-Type': 'application/json',
  };
}

export default function VotingChampionship() {
  const configured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
  const [round, setRound] = useState<Round | null>(null);
  const [songs, setSongs] = useState<Song[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [email, setEmail] = useState('');
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const headers = useMemo(() => apiHeaders(token), [token]);

  async function loadRound() {
    if (!configured) { setLoading(false); return; }
    setLoading(true); setError('');
    try {
      const response = await fetch(SUPABASE_URL + '/rest/v1/competition_rounds?status=eq.open&select=id,name,max_selections,opens_at,closes_at&order=opens_at.asc&limit=1', { headers: apiHeaders() });
      if (!response.ok) throw new Error('Could not load the official voting round.');
      const rounds = await response.json() as Round[];
      if (!rounds.length) { setRound(null); setSongs([]); return; }
      const active = rounds[0];
      setRound(active);
      const lineupResponse = await fetch(SUPABASE_URL + '/rest/v1/competition_round_songs?round_id=eq.' + active.id + '&select=display_order,song_id,competition_songs(id,title)&order=display_order.asc', { headers: apiHeaders() });
      if (!lineupResponse.ok) throw new Error('Could not load the official song lineup.');
      const lineup = await lineupResponse.json() as Array<{display_order:number;song_id:string;competition_songs:{id:string;title:string}|null}>;
      setSongs(lineup.filter(x => x.competition_songs).map(x => ({ id: x.song_id, title: x.competition_songs!.title, display_order: x.display_order })));
    } catch (e) { setError(e instanceof Error ? e.message : 'Unable to load voting.'); }
    finally { setLoading(false); }
  }

  useEffect(() => {
    if (!configured) { setLoading(false); return; }
    const params = new URLSearchParams(window.location.hash.replace(/^#/, ''));
    const hashToken = params.get('access_token');
    const stored = hashToken || sessionStorage.getItem(TOKEN_KEY) || '';
    if (hashToken) {
      sessionStorage.setItem(TOKEN_KEY, hashToken);
      window.history.replaceState({}, document.title, window.location.pathname + window.location.search);
    }
    if (stored) {
      setToken(stored);
      fetch(SUPABASE_URL + '/auth/v1/user', { headers: apiHeaders(stored) })
        .then(r => r.ok ? r.json() : null)
        .then((u: AuthUser | null) => { if (u?.id) setUser(u); else { sessionStorage.removeItem(TOKEN_KEY); setToken(''); } })
        .catch(() => { sessionStorage.removeItem(TOKEN_KEY); setToken(''); });
    }
    void loadRound();
  }, [configured]);

  async function sendMagicLink(e: React.FormEvent) {
    e.preventDefault(); setError(''); setMessage(''); setSending(true);
    try {
      const response = await fetch(SUPABASE_URL + '/auth/v1/otp?redirect_to=' + encodeURIComponent(window.location.href.split('#')[0]), {
        method: 'POST', headers: apiHeaders(),
        body: JSON.stringify({ email, create_user: true,  }),
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.msg || data.message || 'Could not send your sign-in link.');
      }
      setMessage('Check your inbox. Open the secure WETT Girls sign-in link on this device to verify your email and return to the ballot.');
    } catch (e) { setError(e instanceof Error ? e.message : 'Unable to send sign-in link.'); }
    finally { setSending(false); }
  }

  function toggleSong(id: string) {
    setSelected(current => current.includes(id) ? current.filter(x => x !== id) : current.length < (round?.max_selections || 0) ? [...current, id] : current);
  }

  async function submitBallot() {
    if (!round || !token || selected.length === 0) return;
    setSending(true); setError(''); setMessage('');
    try {
      const response = await fetch(SUPABASE_URL + '/rest/v1/rpc/submit_competition_ballot', {
        method: 'POST', headers, body: JSON.stringify({ p_round_id: round.id, p_song_ids: selected }),
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message || data.details || 'Your ballot could not be submitted.');
      }
      setSubmitted(true);
      setMessage('Your ballot has been securely recorded. Thank you for being part of the WETT Girls Fan Championship.');
    } catch (e) { setError(e instanceof Error ? e.message : 'Unable to submit your ballot.'); }
    finally { setSending(false); }
  }

  return <section className="wg-voting" id="official-ballot">
    <div className="wg-voting-heading">
      <span className="wg-voting-kicker">THE OFFICIAL FAN BALLOT</span>
      <h3>Make your picks.<br/><em>Make your voice count.</em></h3>
      <p>One verified email. One ballot per round. Your selections are recorded privately and securely.</p>
    </div>
    {!configured ? <div className="wg-voting-state"><LockKeyhole/><strong>Official voting is being prepared.</strong><p>The secure ballot will appear here when the site connection is configured. Voting is not open yet.</p></div>
    : loading ? <div className="wg-voting-state"><RefreshCw className="wg-spin"/><p>Checking the official voting schedule…</p></div>
    : error && !round ? <div className="wg-voting-state"><strong>Ballot temporarily unavailable</strong><p>{error}</p><button onClick={() => void loadRound()}>Try again</button></div>
    : !round ? <div className="wg-voting-state"><LockKeyhole/><strong>No voting round is open right now.</strong><p>Check back for the official announcement. Draft rounds are not visible as active ballots.</p></div>
    : <div className="wg-ballot-card">
      <div className="wg-round-label"><span className="wg-live-dot"/> OFFICIAL ROUND OPEN</div>
      <h4>{round.name}</h4>
      <p className="wg-ballot-instruction">Choose up to {round.max_selections} {round.max_selections === 1 ? 'song' : 'songs'}.</p>
      {user && !submitted ? <div className="wg-verified"><ShieldCheck size={17}/> Verified as {user.email || 'your email'}</div> : null}
      <div className="wg-song-grid">
        {songs.map(song => <label className={'wg-song-option ' + (selected.includes(song.id) ? 'is-selected' : '')} key={song.id}>
          <input type="checkbox" checked={selected.includes(song.id)} disabled={!user || submitted || (!selected.includes(song.id) && selected.length >= round.max_selections)} onChange={() => toggleSong(song.id)}/>
          <span className="wg-song-number">{String(song.display_order).padStart(2,'0')}</span>
          <span className="wg-song-title">{song.title}</span>
          {selected.includes(song.id) ? <CheckCircle2 size={18}/> : null}
        </label>)}
      </div>
      {!user ? <form className="wg-voter-form" onSubmit={sendMagicLink}>
        <label htmlFor="wg-voter-email">Email address</label>
        <div className="wg-email-row"><Mail size={18}/><input id="wg-voter-email" type="email" autoComplete="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com"/><button type="submit" disabled={sending}>{sending ? 'Sending…' : 'Verify email'}</button></div>
        <small>We’ll email you a secure sign-in link. You must verify your email before voting.</small>
      </form> : <div className="wg-submit-row"><span>{selected.length} of {round.max_selections} selected</span><button onClick={submitBallot} disabled={sending || selected.length === 0 || submitted}>{submitted ? 'Ballot recorded' : sending ? 'Submitting…' : 'Submit my ballot'}</button></div>}
      {message && <p className="wg-voting-success" role="status">{message}</p>}
      {error && <p className="wg-voting-error" role="alert">{error}</p>}
    </div>}
    <div className="wg-voting-trust"><ShieldCheck size={16}/><span>Verified-email voting · One ballot per verified account per round · Private ballot records</span></div>
  </section>;
}
