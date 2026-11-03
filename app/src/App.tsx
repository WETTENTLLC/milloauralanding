import { useEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowRight, ArrowUpRight, Disc3, Instagram, Menu, Pause, Play, Volume2, X } from 'lucide-react';
import './App.css';

const base = import.meta.env.BASE_URL;
const img = (name: string) => base + encodeURIComponent(name);
const instagram = 'https://www.instagram.com/millo_aura/';
const direct = 'https://wettentertainment.gumroad.com/l/milloaura2026';
const unitedMasters = 'https://unitedmasters.com/a/millo-aura';
const songInquiry = 'mailto:millomy2@gmail.com';
const spotify = 'https://open.spotify.com/search/WETT%20Girls';
const apple = 'https://music.apple.com/us/search?term=WETT%20Girls';
const officialLogo = 'https://d2ol7oe51mr4n9.cloudfront.net/user_30zhnNWOXaygqeYTbhEO5mnIHNL/1db060d6-e115-4967-99da-a7f37bd63d96.webp';
const official880 = 'https://d2ol7oe51mr4n9.cloudfront.net/user_30zhnNWOXaygqeYTbhEO5mnIHNL/b3e04655-ec07-4b50-b959-a85210ced4f3.png';
const officialEros = 'https://d2ol7oe51mr4n9.cloudfront.net/user_30zhnNWOXaygqeYTbhEO5mnIHNL/13719639-9f4a-4958-9341-75f75a71e43d.png';

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
          <img className="wg-official-brand" src={officialLogo} alt="WETT Girls official artist logo" />
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
          <div className="wg-hero-noir" aria-hidden="true"><span className="wg-hero-halo"/></div>
          <div className="wg-hero-shade"/>
          <div className="wg-hero-inner">
            <div className="wg-eyebrow"><span className="wg-dot"/> EAST OAKLAND ROOTS · A NEW MUSIC REALITY</div>
            <div className="wg-hero-monogram" aria-label="Official MA monogram for Millo My and Aura Hall"><img src={officialLogo} alt="Official metallic gold MA monogram of Millo My and Aura Hall" /></div><h1 className="wg-accessible-title">WETT Girls — Millo My and Aura Hall</h1>
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
          <div className="wg-deep-bios">
            <article className="wg-bio wg-bio-millo">
              <span className="wg-kicker">THE HEART / THE SILENT SIREN</span>
              <h3>Millo My —<br/><em>the angelic assassin.</em></h3>
              <p>In her story, Millo's journey begins in Detroit and finds its polish in San Francisco. Her Cambodian, Brazilian and Black roots shape a perspective that is both multicultural and unmistakably her own. The 5'4" self-described “Hood Princess” brings ripped denim, lingerie-inspired fashion, layered gold jewelry and a quiet confidence that never needs an announcement.</p>
              <p>Disciplined, mysterious and “too shy to be so fine,” Millo moves between a sweet smile and a knowing smirk. Her warm, smoky mezzo carries the melody; her stretched R&amp;B runs and emotional vibrato give way to witty, closely observed rap. She is the heart of the duo — the voice that feels what the world puts people through, and tells the story of surviving it.</p>
              <span className="wg-bio-signature">THE SOUL · EMOTION · STREET WISDOM</span>
            </article>
            <article className="wg-bio wg-bio-aura">
              <span className="wg-kicker">THE MIND / THE MATRIARCH</span>
              <h3>Aura Hall —<br/><em>the operating system.</em></h3>
              <p>Written into existence from East Oakland, Aura is the duo's strategic mind: street instinct refined into boardroom precision. Her aesthetic is minimalist luxury — a structured blazer, confident monochrome styling and a flash of gold — with the poise of someone who already knows her next move.</p>
              <p>At 5'7" in her character story, Aura is sharp, measured and impossible to rattle. She delivers verdicts, not arguments. Her lower, authoritative talk-rap and deliberate consonants land like a gavel, challenging Millo's smoky melodic hooks with rhythmic precision. If Millo feels the weight of a moment, Aura sees its structure and makes the decision.</p>
              <span className="wg-bio-signature">THE LOGIC · STRATEGY · BOUNDARIES</span>
            </article>
          </div>
          <div className="wg-duo-dynamic">
            <span className="wg-kicker">TWO MINDS. ONE SOUND.</span>
            <h3>Logic meets soul.</h3>
            <p>Aura examines the engine. Millo tells the story of the driver. Together they turn lived emotion and strategic clarity into one sound — music that can be beautiful, sharp, vulnerable and unapologetically independent.</p>
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
                {r.name === '880' && <img className="wg-release-cover" src={official880} alt="Official 880 EP cover by WETT Girls" loading="lazy"/>}
                {r.name === 'EROS' && <img className="wg-release-cover" src={officialEros} alt="Official Eros EP cover by WETT Girls" loading="lazy"/>}
                {r.name === 'LIQUID ASSETS' && <span className="wg-art-watermark">WG</span>}
                {r.name === 'LIQUID ASSETS' && <span className="wg-art-label">WETT GIRLS</span>}
                {r.name === 'LIQUID ASSETS' && <strong>{r.name}</strong>}
                {r.name === 'LIQUID ASSETS' && <span className="wg-art-caption">{r.count}</span>}
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
          <div className="wg-story-image wg-story-artists"><img src={img('Millo Main Image.jpg')} alt="Millo My, WETT Girls artist portrait" loading="lazy"/><img src={img('Aura Hall Main Image.jpg')} alt="Aura Hall, WETT Girls artist portrait" loading="lazy"/></div>
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
            <aside className="wg-inquiry-card" aria-label="WETT Girls song and collaboration inquiries">
              <span className="wg-kicker">BEHIND THE MUSIC</span>
              <h3>Want a song? Let's talk.</h3>
              <p>Hear something in the 30-day challenge you want before release? Interested in a custom song or a collaboration? Reach the songwriter and creative director, Bay Hef.</p>
              <div className="wg-inquiry-links">
                <a href="mailto:millomy2@gmail.com?subject=Unreleased%20WETT%20Girls%20song%20inquiry">Unreleased song <ArrowUpRight size={16}/></a>
                <a href="mailto:millomy2@gmail.com?subject=Custom%20song%20request">Custom song <ArrowUpRight size={16}/></a>
                <a href="mailto:millomy2@gmail.com?subject=WETT%20Girls%20collaboration">Collaborate <ArrowUpRight size={16}/></a>
              </div>
              <small>All inquiries: <a href={songInquiry}>millomy2@gmail.com</a>. Availability, permissions and terms are discussed individually.</small>
            </aside>
          </div>
          <div className="wg-challenge-visual">
            <div className="wg-30">30<span>×</span></div><div>SONGS.<br/>STORIES.<br/>ONE NEW ERA.</div>
            <p>FOLLOW THE JOURNEY</p>
          </div>
        </section>

        <section className="wg-section wg-faq" id="questions" aria-label="WETT Girls artist questions">
          <p className="wg-kicker">THE ARTISTS / EXPLAINED</p>
          <h2>Real vision. <em>New music.</em></h2>
          <div className="wg-faq-grid">
            <article><h3>Who are WETT Girls?</h3><p>Millo My and Aura Hall are an Oakland-rooted, AI-presented female hip-hop and R&amp;B duo.</p></article>
            <article><h3>Who writes their music?</h3><p>Jamal King Hall, also known as Bay Hef, writes the lyrics and directs the sound, production and AI-assisted performances.</p></article>
            <article><h3>Which albums and EPs are out?</h3><p>Liquid Assets is the 30-track album. Eros and 880 are EPs. Find the releases through UnitedMasters.</p></article>
            <article><h3>Can I collaborate or request a song?</h3><p>For songwriting, unreleased music or collaborations, email millomy2@gmail.com.</p></article>
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

      <footer className="wg-footer"><a className="wg-footer-logo" href="#top"><img className="wg-footer-brand" src={officialLogo} alt="WETT Girls official logo"/> WETT GIRLS</a><p>Millo My &amp; Aura Hall · Original music. Human vision. New possibilities.</p><div><a href={instagram} target="_blank" rel="noreferrer">Instagram</a><a href="#music">Music</a><a href="#story">The story</a></div><small>CREATED &amp; CURATED BY BAY HEF · WETT ENTERTAINMENT</small></footer>
    </div>
  );
}
export default App;
