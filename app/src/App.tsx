import { useEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowRight, ArrowUpRight, Disc3, Instagram, Menu, Pause, Play, Volume2, X } from 'lucide-react';
import './App.css';

const base = import.meta.env.BASE_URL;
const img = (name: string) => base + encodeURIComponent(name);
const instagram = 'https://www.instagram.com/millo_aura/';
const direct = 'https://wettentertainment.gumroad.com/l/milloaura2026';
const unitedMasters = 'https://unitedmasters.com/a/millo-aura';
const spotify = 'https://open.spotify.com/search/WETT%20Girls';
const apple = 'https://music.apple.com/us/search?term=WETT%20Girls';

const releases = [
  { name: 'LIQUID ASSETS', note: 'The debut statement', count: '30 TRACKS', year: '2026', art: 'liquid', text: 'Thirty records. A whole world of moods, stories, pressure, confidence and possibility.' },
  { name: '880', note: 'The late-night ride', count: 'EP', year: '2026', art: 'eight', text: 'After-hours energy, the Bay Area, and the road that keeps moving.' },
  { name: 'EROS', note: 'The softer frequency', count: 'EP', year: '2026', art: 'eros', text: 'A different side of the duo — intimacy, tension and feeling.' },
];

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const playerRef = useRef<HTMLAudioElement>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const player = playerRef.current;
    if (!player) return;
    const sync = () => setProgress(player.duration ? (player.currentTime / player.duration) * 100 : 0);
    const ended = () => setPlaying(false);
    player.addEventListener('timeupdate', sync);
    player.addEventListener('ended', ended);
    return () => { player.removeEventListener('timeupdate', sync); player.removeEventListener('ended', ended); player.pause(); };
  }, []);

  async function togglePlay() {
    const player = playerRef.current;
    if (!player) return;
    if (playing) { player.pause(); setPlaying(false); return; }
    try { await player.play(); setPlaying(true); } catch { setPlaying(false); }
  }

  async function copyLink() {
    try { await navigator.clipboard.writeText(window.location.href); setCopied(true); window.setTimeout(() => setCopied(false), 1800); }
    catch { window.prompt('Copy the artist page URL:', window.location.href); }
  }

  return (
    <div className="wg-site">
      <a className="wg-skip" href="#music">Skip to the music</a>
      <header className="wg-header">
        <a href="#top" className="wg-brand" aria-label="WETT Girls — home">
          <span className="wg-brand-symbol">W<span>✦</span>G</span>
          <span>WETT <strong>GIRLS</strong><small>MILLO MY &amp; AURA HALL</small></span>
        </a>
        <nav className={'wg-nav ' + (menuOpen ? 'is-open' : '')} aria-label="Main navigation">
          <a href="#artists" onClick={() => setMenuOpen(false)}>The girls</a>
          <a href="#music" onClick={() => setMenuOpen(false)}>Music</a>
          <a href="#story" onClick={() => setMenuOpen(false)}>Our story</a>
          <a href="#challenge" onClick={() => setMenuOpen(false)}>30 days</a>
          <a href={instagram} target="_blank" rel="noreferrer" className="wg-nav-follow">Follow <ArrowUpRight size={15}/></a>
        </nav>
        <button className="wg-mobile-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={menuOpen}>{menuOpen ? <X/> : <Menu/>}</button>
      </header>

      <main>
        <section id="top" className="wg-hero">
          <div className="wg-hero-picture wg-hero-millo"><img src={img('Millo Main Image.jpg')} alt="Millo My, one half of WETT Girls" fetchPriority="high"/></div>
          <div className="wg-hero-picture wg-hero-aura"><img src={img('Aura Hall Main Image.jpg')} alt="Aura Hall, one half of WETT Girls" fetchPriority="high"/></div>
          <div className="wg-hero-shade"/>
          <div className="wg-hero-inner">
            <div className="wg-eyebrow"><span className="wg-dot"/> EAST OAKLAND ROOTS · A NEW MUSIC REALITY</div>
            <h1>WETT<br/><em>GIRLS.</em></h1>
            <p className="wg-hero-names">MILLO MY <span>×</span> AURA HALL</p>
            <p className="wg-hero-copy">Two distinct voices. One fearless vision. Original music, cinematic identities and a new kind of artist story born in the Bay.</p>
            <div className="wg-actions">
              <a className="wg-btn wg-btn-primary" href="#music">Hear the music <ArrowUpRight size={19}/></a>
              <a className="wg-btn wg-btn-line" href="#story">Meet the vision <ArrowRight size={19}/></a>
            </div>
          </div>
          <a href="#artists" className="wg-scroll"><ArrowDown size={15}/> SCROLL TO MEET THE GIRLS</a>
          <span className="wg-vertical">THE NEW AGE TOWN SOUND / 2026</span>
        </section>

        <div className="wg-ticker" aria-label="WETT Girls message"><div>NOT JUST A SOUND <span>✦</span> A WHOLE NEW WAY TO BE AN ARTIST <span>✦</span> MILLO MY + AURA HALL <span>✦</span> OAKLAND TO EVERYWHERE <span>✦</span></div></div>

        <section id="artists" className="wg-section wg-artists">
          <div className="wg-section-heading">
            <p className="wg-kicker">01 / THE ARTISTS</p>
            <h2>Different energy.<br/><em>Same frequency.</em></h2>
            <p>One duo. Two unmistakable personalities. Discover the women behind the music.</p>
          </div>
          <div className="wg-artist-grid">
            <article className="wg-artist-card wg-artist-one">
              <img src={img('Millo Main Image.jpg')} alt="Millo My portrait" loading="lazy"/>
              <div className="wg-artist-shade"/>
              <div className="wg-artist-copy">
                <span>01 / QUIET POWER</span>
                <h3>MILLO<br/>MY.</h3>
                <p>The understated force. Smoky intimacy, restrained confidence and a voice that can say everything without saying too much.</p>
              </div>
            </article>
            <article className="wg-artist-card wg-artist-two">
              <img src={img('Aura Hall Main Image.jpg')} alt="Aura Hall portrait" loading="lazy"/>
              <div className="wg-artist-shade"/>
              <div className="wg-artist-copy">
                <span>02 / BOLD PRESENCE</span>
                <h3>AURA<br/>HALL.</h3>
                <p>The fearless voice. Direct, outspoken, commanding — bringing sharp perspective and undeniable attitude to every record.</p>
              </div>
            </article>
          </div>
        </section>

        <section id="music" className="wg-section wg-music">
          <div className="wg-section-heading wg-row-heading">
            <div><p className="wg-kicker">02 / DISCOGRAPHY</p><h2>Press play.<br/><em>Meet the music.</em></h2></div>
            <p>From late-night anthems to unfiltered conversations about real life, every release reveals another side of WETT Girls.</p>
          </div>
          <div className="wg-release-grid">
            {releases.map(r => <article className="wg-release" key={r.name}>
              <div className={'wg-release-art ' + r.art}>
                <span className="wg-art-watermark">WG</span>
                <span className="wg-art-label">WETT GIRLS</span>
                <strong>{r.name}</strong>
                <span className="wg-art-caption">{r.count}</span>
              </div>
              <div className="wg-release-info"><div><span>{r.year} · {r.note}</span><h3>{r.name}</h3></div><span>{r.count}</span></div>
              <p>{r.text}</p>
              <div className="wg-release-links"><a href={unitedMasters} target="_blank" rel="noreferrer">Stream release <ArrowUpRight size={15}/></a>{r.name === 'LIQUID ASSETS' && <a href={direct} target="_blank" rel="noreferrer">Buy directly <ArrowUpRight size={15}/></a>}</div>
            </article>)}
          </div>
          <div className="wg-listen-panel">
            <div><span className="wg-kicker">LISTEN YOUR WAY</span><h3>Find your next favorite.</h3><p>Stream on your platform of choice or support independent music directly from the artist.</p></div>
            <div className="wg-platforms">
              <a href={unitedMasters} target="_blank" rel="noreferrer">All releases · UnitedMasters <ArrowUpRight size={16}/></a>
              <a href={spotify} target="_blank" rel="noreferrer">Search Spotify <ArrowUpRight size={16}/></a>
              <a href={apple} target="_blank" rel="noreferrer">Search Apple Music <ArrowUpRight size={16}/></a>
              <a href={direct} target="_blank" rel="noreferrer">Buy Liquid Assets directly <ArrowUpRight size={16}/></a>
            </div>
          </div>
          <div className="wg-sample">
            <div className="wg-sample-art"><img src={img('Receipts Single Cover.png')} alt="Receipts single cover" loading="lazy"/></div>
            <div className="wg-sample-copy"><span>FROM THE WETT GIRLS SOUND</span><strong>RECEIPTS</strong><p>Hear a preview.</p></div>
            <button onClick={togglePlay} className="wg-play" aria-label={playing ? 'Pause Receipts preview' : 'Play Receipts preview'}>{playing ? <Pause fill="currentColor"/> : <Play fill="currentColor"/>}</button>
            <div className="wg-progress"><div style={{width:progress + '%'}}/></div>
            <Volume2 size={20} className="wg-sample-volume"/>
            <audio ref={playerRef} preload="none" src={img('Receipts Hook.mp3')}/>
          </div>
        </section>

        <section id="story" className="wg-story">
          <div className="wg-story-image"><img src={img('hero-banner.jpg')} alt="WETT Girls creative universe" loading="lazy"/></div>
          <div className="wg-story-content">
            <p className="wg-kicker">03 / THE ORIGIN</p>
            <h2>Made in the Bay.<br/><em>Built for what's next.</em></h2>
            <p>WETT Girls are Millo My and Aura Hall, two AI-presented artists with a sound rooted in Oakland, California. Their personalities and performances are digital, but their songwriting and creative direction begin with a human: Jamal King Hall, known as Bay Hef, The Curator.</p>
            <p>Bay Hef writes the lyrics and orchestrates the music. He uses years of experience creating beats, engineering, recording and producing to direct each sound, rhythm, arrangement and vocal delivery through AI music technology. The AI performs his creative vision; the songwriting and musical decisions come from the artist behind the system.</p>
            <p>These women were created to help change the narrative around AI music and modern music alike. Millo and Aura can be funny, fearless and outspoken while telling stories about relationships, respecting a partner, smart decisions, business, independence, confidence and living well. They aim to reach young listeners with music they recognize and a positive perspective they can grow with.</p>
            <p>WETT Girls are proof that years of musical knowledge still matter in a technology-driven era. The art is still the art. The future simply gives creators another instrument.</p>
            <blockquote>“The art is still the art. We are just part of the future.”</blockquote>
            <span className="wg-story-signature">JAMAL KING HALL · BAY HEF, THE CURATOR · SONGWRITER &amp; CREATIVE DIRECTOR</span>
          </div>
        </section>

        <section className="wg-manifesto">
          <p className="wg-kicker">04 / THE POINT OF IT ALL</p>
          <h2>THEY LOOK DIFFERENT.<br/>THEY SOUND <em>DIFFERENT.</em><br/>THE STORIES FEEL REAL.</h2>
          <p>The next chapter of music isn't only about how an artist is made. It's about the emotion, culture and community that make people care.</p>
          <a href="#music">Hear it for yourself <ArrowUpRight size={18}/></a>
        </section>

        <section id="challenge" className="wg-section wg-challenge">
          <div className="wg-challenge-copy">
            <p className="wg-kicker">05 / THE MUSIC MOVEMENT</p>
            <h2>30 days.<br/><em>30 songs.</em></h2>
            <p>One new song at a time, WETT Girls are opening the doors to their sound. Behind-the-scenes introductions, original cover art, new perspectives and music made to be experienced — not just scrolled past.</p>
            <div className="wg-challenge-label"><span className="wg-dot"/> FOLLOW THE 30-DAY SONG CHALLENGE ON INSTAGRAM</div>
            <a href={instagram} target="_blank" rel="noreferrer" className="wg-btn wg-btn-primary"><Instagram size={18}/> Follow @millo_aura <ArrowUpRight size={18}/></a>
          </div>
          <div className="wg-challenge-visual">
            <div className="wg-30">30<span>×</span></div><div>SONGS.<br/>STORIES.<br/>ONE NEW ERA.</div>
            <p>FOLLOW THE JOURNEY</p>
          </div>
        </section>

        <section className="wg-final-cta">
          <span className="wg-kicker">DON'T JUST WATCH THE FUTURE</span>
          <h2>BE PART<br/>OF IT.</h2>
          <p>Hear the music, share the sound, follow the women and help shape what comes next.</p>
          <div className="wg-actions">
            <a className="wg-btn wg-btn-primary" href={instagram} target="_blank" rel="noreferrer">Follow the girls <Instagram size={18}/></a>
            <a className="wg-btn wg-btn-line" href={direct} target="_blank" rel="noreferrer">Buy Liquid Assets <Disc3 size={18}/></a>
            <button className="wg-btn wg-btn-ghost" onClick={copyLink}>{copied ? 'Link copied!' : 'Share this page'} <ArrowUpRight size={17}/></button>
          </div>
        </section>
      </main>

      <footer className="wg-footer"><a className="wg-footer-logo" href="#top">WETT GIRLS<span>✦</span></a><p>Millo My &amp; Aura Hall · Original music. Human vision. New possibilities.</p><div><a href={instagram} target="_blank" rel="noreferrer">Instagram</a><a href="#music">Music</a><a href="#story">The story</a></div><small>CREATED &amp; CURATED BY BAY HEF · WETT ENTERTAINMENT</small></footer>
    </div>
  );
}
export default App;
