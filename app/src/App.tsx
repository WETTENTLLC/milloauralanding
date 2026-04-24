import { useState, useEffect, useRef, createContext, useContext } from 'react';
import { 
  Cpu, Heart, Music, Zap, Radio, 
  Play, Pause, X,
  CheckCircle, Lock, Mail, Instagram,
  ChevronRight, Sparkles, Mic, Headphones, Disc,
  TrendingUp, Users, Crown, Code, Terminal, Send
} from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './index.css';

// ─── Asset path helper for GitHub Pages subpath ───
const asset = (path: string) => `${import.meta.env.BASE_URL}${path}`;

// ─── Contact Modal Context ───
interface ContactModalContextType {
  openModal: (subject: string) => void;
}
const ContactModalContext = createContext<ContactModalContextType>({
  openModal: () => {},
});
const useContactModal = () => useContext(ContactModalContext);

gsap.registerPlugin(ScrollTrigger);

// ─── Security: Input Sanitizer ───
const sanitize = (str: string): string =>
  str.replace(/[<>"'&]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#x27;', '&': '&amp;' }[c] || c));

// ─── Security: Rate Limiter ───
const rateLimitMap = new Map<string, number>();
const isRateLimited = (key: string, cooldownMs = 30000): boolean => {
  const last = rateLimitMap.get(key) || 0;
  if (Date.now() - last < cooldownMs) return true;
  rateLimitMap.set(key, Date.now());
  return false;
};

// ─── Contact Modal ───
function ContactModal({ isOpen, onClose, subject }: { isOpen: boolean; onClose: () => void; subject: string }) {
  const [formState, setFormState] = useState<'idle' | 'sending' | 'sent' | 'rate-limited'>('idle');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [honeypot, setHoneypot] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Honeypot bot trap
    if (honeypot) return;

    // Rate limiting
    if (isRateLimited('contact-form')) {
      setFormState('rate-limited');
      setTimeout(() => setFormState('idle'), 3000);
      return;
    }

    // Sanitize inputs
    const cleanName = sanitize(name.trim());
    const cleanEmail = sanitize(email.trim());
    const cleanMessage = sanitize(message.trim());

    // Validation
    if (!cleanName || !cleanEmail || !cleanMessage) return;
    if (cleanName.length > 100 || cleanEmail.length > 254 || cleanMessage.length > 2000) return;

    setFormState('sending');
    try {
      await fetch('https://formsubmit.co/ajax/wettentertainmentllc@gmail.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          name: cleanName,
          email: cleanEmail,
          message: cleanMessage,
          _subject: `WETT Dynasty: ${sanitize(subject)}`,
          _captcha: 'false',
          _template: 'table',
        }),
      });
      setFormState('sent');
      setTimeout(() => { onClose(); setFormState('idle'); setName(''); setEmail(''); setMessage(''); }, 2000);
    } catch {
      setFormState('idle');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[95] flex items-center justify-center px-4" onClick={onClose} role="dialog" aria-modal="true" aria-label={`Contact form: ${subject}`}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div className="relative w-full max-w-md glass rounded-2xl p-6 border border-white/10" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors" aria-label="Close form">
          <X className="w-5 h-5" />
        </button>

        {formState === 'sent' ? (
          <div className="text-center py-8">
            <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
            <h3 className="font-heading text-xl font-bold mb-2">Transmission Received</h3>
            <p className="font-mono text-xs text-gray-500">WE'LL BE IN TOUCH SHORTLY.</p>
          </div>
        ) : formState === 'rate-limited' ? (
          <div className="text-center py-8">
            <Lock className="w-12 h-12 text-[#F48C06] mx-auto mb-4" />
            <h3 className="font-heading text-xl font-bold mb-2">Slow Down</h3>
            <p className="font-mono text-xs text-gray-500">PLEASE WAIT BEFORE SENDING AGAIN.</p>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <h3 className="font-heading text-xl font-bold mb-1">
                <span className="gradient-text">{subject}</span>
              </h3>
              <p className="font-mono text-xs text-gray-500">OPEN_CHANNEL // SECURE_LINE</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Honeypot — hidden from real users, catches bots */}
              <input
                type="text"
                name="_honey"
                value={honeypot}
                onChange={e => setHoneypot(e.target.value)}
                style={{ display: 'none' }}
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
              />
              <div>
                <label htmlFor="contact-name" className="font-mono text-[10px] text-gray-500 tracking-wider block mb-1">NAME</label>
                <input
                  id="contact-name"
                  type="text"
                  required
                  maxLength={100}
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 font-mono text-sm focus:outline-none focus:border-[#4361EE]/50 transition-colors"
                  placeholder="Your name"
                  autoComplete="name"
                />
              </div>
              <div>
                <label htmlFor="contact-email" className="font-mono text-[10px] text-gray-500 tracking-wider block mb-1">EMAIL</label>
                <input
                  id="contact-email"
                  type="email"
                  required
                  maxLength={254}
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 font-mono text-sm focus:outline-none focus:border-[#4361EE]/50 transition-colors"
                  placeholder="your@frequency.com"
                  autoComplete="email"
                />
              </div>
              <div>
                <label htmlFor="contact-message" className="font-mono text-[10px] text-gray-500 tracking-wider block mb-1">MESSAGE</label>
                <textarea
                  id="contact-message"
                  required
                  maxLength={2000}
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  rows={3}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 font-mono text-sm focus:outline-none focus:border-[#4361EE]/50 transition-colors resize-none"
                  placeholder="What's on your mind?"
                />
              </div>
              <button
                type="submit"
                disabled={formState === 'sending'}
                className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                {formState === 'sending' ? 'TRANSMITTING...' : 'SEND TRANSMISSION'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Context for Logic Check Toggle ───
interface LogicCheckContextType {
  logicMode: boolean;
  setLogicMode: (v: boolean) => void;
}
const LogicCheckContext = createContext<LogicCheckContextType>({
  logicMode: false,
  setLogicMode: () => {},
});
export const useLogicCheck = () => useContext(LogicCheckContext);

// ─── Loading Screen ───
function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(0);
  const steps = [
    'BOOTING WETT OS...',
    'LOADING AURA MODULE...',
    'SYNCING SOUL FREQUENCY...',
    'ACCESS GRANTED.'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setStep(prev => {
        if (prev >= steps.length - 1) {
          clearInterval(interval);
          setTimeout(onComplete, 800);
          return prev;
        }
        return prev + 1;
      });
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-[100] bg-[#0D0D0D] flex items-center justify-center">
      <div className="text-center">
        <img src={asset('Wett Logo.png')} alt="WETT Dynasty" className="w-24 h-24 object-contain mx-auto mb-6" />
        <div className="font-mono text-sm tracking-widest mb-8">
          {steps.map((s, i) => (
            <div
              key={i}
              className={`transition-all duration-300 ${
                i === step ? 'text-white opacity-100' : 
                i < step ? 'text-green-400 opacity-60' : 'text-gray-600 opacity-0'
              }`}
            >
              {i < step && <CheckCircle className="inline w-4 h-4 mr-2" />}
              {s}
              {i === step && <span className="blink ml-1">_</span>}
            </div>
          ))}
        </div>
        <div className="w-48 h-1 bg-gray-800 rounded-full overflow-hidden mx-auto">
          <div 
            className="h-full bg-gradient-to-r from-[#4361EE] to-[#F48C06] transition-all duration-500"
            style={{ width: `${((step + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}

// ─── Logic Check Toggle ───
function LogicCheckToggle() {
  const { logicMode, setLogicMode } = useLogicCheck();
  return (
    <div className="fixed top-6 right-6 z-[90] flex items-center gap-3">
      <span className={`font-mono text-xs tracking-wider transition-colors ${logicMode ? 'text-[#4361EE]' : 'text-gray-500'}`}>
        LOGIC CHECK
      </span>
      <div 
        className={`toggle-track ${logicMode ? 'active' : ''}`}
        onClick={() => setLogicMode(!logicMode)}
      >
        <div className="toggle-thumb" />
      </div>
    </div>
  );
}

// ─── Hero Section: The Gateway ───
function HeroSection({ onOpenModal }: { onOpenModal: (subject: string) => void }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const avatarRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(avatarRef.current,
        { scale: 0.6, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1.2, ease: 'power3.out', delay: 2.5 }
      );
      gsap.fromTo(titleRef.current,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 2.8 }
      );
      gsap.fromTo(subtitleRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 3 }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Split Background */}
      <div className="absolute inset-0 flex">
        <div className="w-1/4 bg-gradient-to-b from-[#002366] to-[#03045E] relative overflow-hidden">
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: `url(${asset('bg-logic.jpg')})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
          <div className="scan-line" />
        </div>
        <div className="w-2/4 bg-[#0D0D0D] relative">
          <div className="absolute inset-0 opacity-5" style={{ backgroundImage: `url(${asset('hero-banner.jpg')})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
        </div>
        <div className="w-1/4 bg-gradient-to-b from-[#FF7D00] to-[#c44d00] relative overflow-hidden">
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: `url(${asset('bg-soul.jpg')})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
          <div className="scan-line" style={{ animationDelay: '1.5s' }} />
        </div>
      </div>

      {/* Left Pillar Label */}
      <div className="absolute left-8 top-1/2 -translate-y-1/2 z-10 hidden lg:block">
        <div className="font-mono text-xs tracking-widest text-[#4361EE] opacity-80 rotate-[-90deg] origin-center whitespace-nowrap">
          <Cpu className="inline w-4 h-4 mr-2" />AURA // LOGIC // SYSTEM
        </div>
      </div>

      {/* Right Pillar Label */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2 z-10 hidden lg:block">
        <div className="font-mono text-xs tracking-widest text-[#F48C06] opacity-80 rotate-90 origin-center whitespace-nowrap">
          <Heart className="inline w-4 h-4 mr-2" />MILLO // SOUL // VIBES
        </div>
      </div>

      {/* Center Content */}
      <div className="relative z-20 text-center px-6 max-w-4xl">
        <div 
          ref={avatarRef}
          className="relative mx-auto mb-8 w-64 h-80 md:w-80 md:h-96"
        >
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#4361EE] via-[#0D0D0D] to-[#F48C06] opacity-50 blur-xl pulse-glow" />
          <div className="relative w-full h-full rounded-2xl overflow-hidden glass border border-white/10">
            <img 
              src={asset('hero-banner.jpg')}
              alt="WETT Dynasty" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D] via-transparent to-transparent" />
          </div>
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 font-mono text-xs tracking-widest text-gray-400">
            <span className="text-[#4361EE]">LOGIC</span>
            <span className="mx-3 text-gray-600">//</span>
            <span className="text-[#F48C06]">SOUL</span>
          </div>
        </div>

        <h1 
          ref={titleRef}
          className="font-heading text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-4"
        >
          <span className="text-white">WETT</span>{' '}
          <span className="gradient-text">Dynasty</span>
        </h1>
        
        <p 
          ref={subtitleRef}
          className="font-mono text-sm md:text-base tracking-widest text-gray-400 mb-10"
        >
          LOGIC MEETS SOUL. THE FUTURE OF SOUND HAS AN ADDRESS.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button onClick={() => onOpenModal('Enter the Vault')} className="btn-primary flex items-center justify-center gap-2">
            <Disc className="w-4 h-4" />
            Enter the Vault
          </button>
          <button onClick={() => onOpenModal('Build Your Identity')} className="btn-secondary flex items-center justify-center gap-2">
            <Zap className="w-4 h-4" />
            Build Your Identity
          </button>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20">
        <div className="font-mono text-xs text-gray-500 animate-bounce">
          SCROLL TO INITIALIZE
        </div>
      </div>
    </section>
  );
}

// ─── Artist Dossiers Section ───
function DossierSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const auraCardRef = useRef<HTMLDivElement>(null);
  const milloCardRef = useRef<HTMLDivElement>(null);
  const centerRef = useRef<HTMLDivElement>(null);
  const [moodColor, setMoodColor] = useState('#FF7D00');
  const [playingStem, setPlayingStem] = useState<number | null>(null);

  const stems = [
    { name: 'NEURAL_BASS', duration: '0:15' },
    { name: 'GLITCH_PERC', duration: '0:15' },
    { name: 'SYNTH_LEAD', duration: '0:15' },
    { name: 'LOGIC_PAD', duration: '0:15' },
  ];

  const moods = [
    { color: '#FF7D00', name: 'GOLDEN_HOUR', track: 'Sunset in Oakland' },
    { color: '#FF006E', name: 'DEEP_PASSION', track: 'Heart Frequency' },
    { color: '#8338EC', name: 'DREAM_STATE', track: 'Lucid Vibes' },
    { color: '#06FFA5', name: 'NEW_GROWTH', track: 'Spring Forward' },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(auraCardRef.current,
        { x: -100, opacity: 0 },
        {
          x: 0, opacity: 1, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 70%', toggleActions: 'play none none reverse' }
        }
      );
      gsap.fromTo(milloCardRef.current,
        { x: 100, opacity: 0 },
        {
          x: 0, opacity: 1, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 70%', toggleActions: 'play none none reverse' }
        }
      );
      gsap.fromTo(centerRef.current,
        { y: 50, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 60%', toggleActions: 'play none none reverse' }
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative py-24 px-6 overflow-hidden" style={{ backgroundColor: moodColor + '08' }}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-heading text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">The Personas</span>
          </h2>
          <p className="font-mono text-sm text-gray-500 tracking-wider">DOSSIER_FILES // CLASSIFIED</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 items-start">
          {/* Aura Card */}
          <div ref={auraCardRef} className="card-hover">
            <div className="glass-logic rounded-2xl p-6 glow-logic">
              <div className="relative mb-6 rounded-xl overflow-hidden aspect-[3/4]">
                <img src={asset('Aura Hall Main Image.jpg')} alt="Aura Hall — AI Logic System Persona of WETT Dynasty" className="w-full h-full object-cover" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#03045E] via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="font-mono text-xs text-[#4361EE] tracking-wider mb-1">AURA_SYSTEM v2.6</div>
                  <div className="font-heading text-2xl font-bold text-white">Aura Hall</div>
                  <div className="font-mono text-xs text-gray-400">THE ARCHITECT</div>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between font-mono text-xs">
                  <span className="text-gray-500">Processing</span>
                  <span className="text-[#4361EE]">99.9%</span>
                </div>
                <div className="flex justify-between font-mono text-xs">
                  <span className="text-gray-500">Temperature</span>
                  <span className="text-[#4361EE]">Optimal</span>
                </div>
                <div className="flex justify-between font-mono text-xs">
                  <span className="text-gray-500">Output</span>
                  <span className="text-[#4361EE]">High Fidelity</span>
                </div>
              </div>

              {/* Logic Board */}
              <div className="border-t border-[#4361EE]/20 pt-4">
                <div className="font-mono text-xs text-[#4361EE] mb-3 tracking-wider flex items-center gap-2">
                  <Terminal className="w-3 h-3" /> LOGIC_BOARD
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {stems.map((stem, i) => (
                    <button
                      key={i}
                      onClick={() => setPlayingStem(playingStem === i ? null : i)}
                      className={`p-3 rounded-lg border transition-all text-left ${
                        playingStem === i 
                          ? 'border-[#4361EE] bg-[#4361EE]/20 shadow-[0_0_15px_rgba(67,97,238,0.3)]' 
                          : 'border-white/10 hover:border-[#4361EE]/50'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        {playingStem === i ? (
                          <div className="flex gap-0.5">
                            <div className="w-1 h-3 bg-[#4361EE] animate-pulse" />
                            <div className="w-1 h-4 bg-[#4361EE] animate-pulse" style={{ animationDelay: '0.1s' }} />
                            <div className="w-1 h-2 bg-[#4361EE] animate-pulse" style={{ animationDelay: '0.2s' }} />
                          </div>
                        ) : (
                          <Play className="w-3 h-3 text-[#4361EE]" />
                        )}
                        <span className="font-mono text-[10px] text-gray-400">{stem.duration}</span>
                      </div>
                      <div className="font-mono text-[10px] text-white truncate">{stem.name}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Center Content */}
          <div ref={centerRef} className="text-center py-8">
            <div className="relative w-48 h-48 mx-auto mb-6">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#4361EE] to-[#F48C06] opacity-30 blur-2xl pulse-glow" />
              <div className="relative w-full h-full rounded-full glass border border-white/20 flex items-center justify-center">
                <div className="text-center">
                  <div className="font-heading text-3xl font-bold gradient-text">WETT</div>
                  <div className="font-mono text-[10px] text-gray-500 tracking-widest">HUB CENTRAL</div>
                </div>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-sm mx-auto">
              Two frequencies. One dynasty. Logic meets soul in the digital realm where 
              AI personas become legends and sound becomes architecture.
            </p>
          </div>

          {/* Millo Card */}
          <div ref={milloCardRef} className="card-hover">
            <div className="glass-soul rounded-2xl p-6 glow-soul">
              <div className="relative mb-6 rounded-xl overflow-hidden aspect-[3/4]">
                <img src={asset('Millo Main Image.jpg')} alt="Millo My — AI Soul Frequency Persona of WETT Dynasty" className="w-full h-full object-cover object-top" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#c44d00] via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="font-mono text-xs text-[#F48C06] tracking-wider mb-1">SOUL_RESONANCE v2.6</div>
                  <div className="font-heading text-2xl font-bold text-white">Millo My</div>
                  <div className="font-mono text-xs text-gray-400">THE MUSE</div>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between font-mono text-xs">
                  <span className="text-gray-500">Frequency</span>
                  <span className="text-[#F48C06]">432Hz</span>
                </div>
                <div className="flex justify-between font-mono text-xs">
                  <span className="text-gray-500">Vibe</span>
                  <span className="text-[#F48C06]">Immutable</span>
                </div>
                <div className="flex justify-between font-mono text-xs">
                  <span className="text-gray-500">Flow</span>
                  <span className="text-[#F48C06]">Unlocked</span>
                </div>
              </div>

              {/* Mood Ring */}
              <div className="border-t border-[#F48C06]/20 pt-4">
                <div className="font-mono text-xs text-[#F48C06] mb-3 tracking-wider flex items-center gap-2">
                  <Sparkles className="w-3 h-3" /> MOOD_RING
                </div>
                <div className="flex gap-2 justify-center">
                  {moods.map((mood, i) => (
                    <button
                      key={i}
                      onClick={() => setMoodColor(mood.color)}
                      className={`w-10 h-10 rounded-full border-2 transition-all ${
                        moodColor === mood.color ? 'border-white scale-110' : 'border-transparent hover:scale-105'
                      }`}
                      style={{ backgroundColor: mood.color }}
                      title={`${mood.name}: ${mood.track}`}
                    />
                  ))}
                </div>
                <div className="text-center mt-3 font-mono text-[10px] text-gray-400">
                  {moods.find(m => m.color === moodColor)?.name}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Music Player Section ───
function MusicPlayerSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) setCurrentTime(audioRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) setDuration(audioRef.current.duration);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    audioRef.current.currentTime = pct * duration;
  };

  const handleEnded = () => setIsPlaying(false);

  const formatTime = (t: number) => {
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60);
    return `${m}:${String(s).padStart(2, '0')}`;
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(playerRef.current,
        { y: 80, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 1.2, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 70%', toggleActions: 'play none none reverse' }
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative py-24 px-6">
      <audio
        ref={audioRef}
        src={asset('Receipts Hook.mp3')}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
      />
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-heading text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">The Receipts</span>
          </h2>
          <p className="font-mono text-sm text-gray-500 tracking-wider">NOW PLAYING // PREVIEW TRANSMISSION</p>
        </div>

        <div ref={playerRef} className="ipad-frame max-w-3xl mx-auto">
          <div className="bg-[#0D0D0D] rounded-2xl overflow-hidden">
            {/* Album Art */}
            <div className="relative aspect-video">
              <img 
                src={asset('Receipts Single Cover.png')}
                alt="Receipts Single Cover — Millo x Aura" 
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D] via-transparent to-transparent" />
              {isPlaying && (
                <div className="absolute top-4 right-4 font-mono text-xs text-red-500 flex items-center gap-1">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  LIVE
                </div>
              )}
            </div>

            {/* Track Info & Controls */}
            <div className="p-6">
              <div className="mb-6">
                <h3 className="font-heading text-xl font-bold text-white">Receipts (Hook)</h3>
                <p className="font-mono text-xs text-gray-500">Millo x Aura</p>
              </div>

              {/* Progress Bar */}
              <div className="mb-6">
                <div 
                  className="h-1 bg-gray-800 rounded-full overflow-hidden cursor-pointer"
                  onClick={handleSeek}
                >
                  <div 
                    className="h-full bg-gradient-to-r from-[#4361EE] to-[#F48C06] rounded-full transition-all duration-150"
                    style={{ width: duration ? `${(currentTime / duration) * 100}%` : '0%' }}
                  />
                </div>
                <div className="flex justify-between mt-2 font-mono text-[10px] text-gray-600">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              {/* Play/Pause */}
              <div className="flex items-center justify-center">
                <button 
                  onClick={togglePlay}
                  className="w-16 h-16 rounded-full bg-gradient-to-r from-[#4361EE] to-[#F48C06] flex items-center justify-center hover:scale-105 transition-transform shadow-lg shadow-[#4361EE]/30"
                >
                  {isPlaying ? <Pause className="w-8 h-8 text-white" /> : <Play className="w-8 h-8 text-white ml-1" />}
                </button>
              </div>
            </div>

            {/* Unlock Full Catalog CTA */}
            <div className="border-t border-white/5 p-6 text-center">
              <p className="text-gray-400 text-sm leading-relaxed mb-1">
                This is just a taste. The full vault runs deep.
              </p>
              <p className="font-mono text-xs text-gray-500 mb-4">
                NEW FREQUENCIES UPLOADED MONTHLY // NAME YOUR PRICE
              </p>
              <a
                href="https://wettentertainment.gumroad.com/l/milloaura2026"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary inline-flex items-center gap-2"
              >
                <Disc className="w-4 h-4" />
                Unlock the Full Catalog
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Service Sample Player ───
function ServiceSamplePlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) { audioRef.current.pause(); } else { audioRef.current.play(); }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    audioRef.current.currentTime = ((e.clientX - rect.left) / rect.width) * duration;
  };

  const fmt = (t: number) => `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, '0')}`;

  return (
    <div className="max-w-2xl mx-auto mb-16">
      <audio
        ref={audioRef}
        src={asset('DNNC (the place to be).mp3')}
        onTimeUpdate={() => audioRef.current && setCurrentTime(audioRef.current.currentTime)}
        onLoadedMetadata={() => audioRef.current && setDuration(audioRef.current.duration)}
        onEnded={() => setIsPlaying(false)}
      />
      <div className="glass rounded-2xl p-6 border border-white/10">
        <div className="font-mono text-xs text-[#F48C06] tracking-wider mb-1 flex items-center gap-2">
          <Headphones className="w-3 h-3" /> CLIENT_SAMPLE // HEAR THE WORK
        </div>
        <div className="flex items-center gap-4 mt-4">
          <button
            onClick={togglePlay}
            className="w-12 h-12 rounded-full bg-gradient-to-r from-[#4361EE] to-[#F48C06] flex items-center justify-center hover:scale-105 transition-transform flex-shrink-0"
          >
            {isPlaying ? <Pause className="w-5 h-5 text-white" /> : <Play className="w-5 h-5 text-white ml-0.5" />}
          </button>
          <div className="flex-1">
            <div className="font-heading text-sm font-bold text-white">DNNC (The Place to Be)</div>
            <p className="font-mono text-[10px] text-gray-500">
              Made for Delane's Natural Nail Care — San Leandro, CA
            </p>
            <div className="mt-2">
              <div className="h-1 bg-gray-800 rounded-full overflow-hidden cursor-pointer" onClick={handleSeek}>
                <div
                  className="h-full bg-gradient-to-r from-[#4361EE] to-[#F48C06] rounded-full transition-all duration-150"
                  style={{ width: duration ? `${(currentTime / duration) * 100}%` : '0%' }}
                />
              </div>
              <div className="flex justify-between mt-1 font-mono text-[10px] text-gray-600">
                <span>{fmt(currentTime)}</span>
                <span>{fmt(duration)}</span>
              </div>
            </div>
          </div>
        </div>
        <p className="text-gray-500 text-xs mt-4 leading-relaxed">
          This is what sonic architecture sounds like in the real world. We built this custom track for
          <a href="https://www.yelp.com/biz/delanes-natural-nail-care-san-leandro" target="_blank" rel="noopener noreferrer" className="text-[#F48C06] hover:underline mx-1">Delane's Natural Nail Care</a>
          in San Leandro, CA. Your brand could sound this good.
        </p>
      </div>
    </div>
  );
}

// ─── Service Suite Section ───
function ServiceSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const { logicMode } = useLogicCheck();
  const { openModal } = useContactModal();

  const tiers = [
    {
      name: 'The Social Hook',
      icon: Mic,
      target: 'Reels / TikTok Creators',
      price: logicMode ? '$299' : '***',
      deliverables: ['15s Custom Audio', 'Commercial License', '3 Revisions'],
      color: 'logic',
    },
    {
      name: 'The Brand Identity',
      icon: Headphones,
      target: 'Luxury / Auto / Boutiques',
      price: logicMode ? '$1,499' : '***',
      deliverables: ['30-60s Anthem', 'Social-Ready Stems', 'Logo Tag Integration', 'Full License'],
      color: 'soul',
      featured: true,
    },
    {
      name: 'The Dynasty Build',
      icon: Crown,
      target: 'Agencies / Enterprises',
      price: logicMode ? 'Custom' : '***',
      deliverables: ['Full Album/EP Identity', 'Virtual Avatar Consulting', 'Sonic Architecture', 'White-Glove Support'],
      color: 'logic',
    },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(cardsRef.current?.children || [],
        { y: 60, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.8, stagger: 0.2, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 70%', toggleActions: 'play none none reverse' }
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-heading text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">Sonic Architecture</span>
          </h2>
          <p className="font-mono text-sm text-gray-500 tracking-wider">
            {logicMode ? 'B2B_SERVICE_SUITE // PRICING_ENABLED' : 'THE_BUSINESS // LOGIC_CHECK_TO_REVEAL'}
          </p>
        </div>

        <ServiceSamplePlayer />

        <div ref={cardsRef} className="grid md:grid-cols-3 gap-6">
          {tiers.map((tier, i) => {
            const Icon = tier.icon;
            const isLogic = tier.color === 'logic';
            return (
              <div 
                key={i} 
                className={`tier-card card-hover rounded-2xl p-6 ${
                  isLogic ? 'glass-logic glow-logic' : 'glass-soul glow-soul'
                } ${tier.featured ? 'md:scale-105 md:-my-4' : ''}`}
              >
                {tier.featured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 font-mono text-[10px] bg-gradient-to-r from-[#4361EE] to-[#F48C06] px-4 py-1 rounded-full text-white">
                    MOST_POPULAR
                  </div>
                )}
                
                <div className={`w-12 h-12 rounded-xl ${isLogic ? 'bg-[#4361EE]/20' : 'bg-[#F48C06]/20'} flex items-center justify-center mb-4`}>
                  <Icon className={`w-6 h-6 ${isLogic ? 'text-[#4361EE]' : 'text-[#F48C06]'}`} />
                </div>

                <h3 className="font-heading text-xl font-bold mb-1">{tier.name}</h3>
                <p className="font-mono text-xs text-gray-500 mb-4">{tier.target}</p>

                <div className="mb-6">
                  <span className={`font-heading text-3xl font-bold ${isLogic ? 'glow-text-logic' : 'glow-text-soul'}`}>
                    {tier.price}
                  </span>
                  {logicMode && tier.price !== 'Custom' && (
                    <span className="font-mono text-xs text-gray-500">/project</span>
                  )}
                </div>

                <ul className="space-y-3 mb-6">
                  {tier.deliverables.map((d, j) => (
                    <li key={j} className="flex items-start gap-2">
                      <CheckCircle className={`w-4 h-4 mt-0.5 ${isLogic ? 'text-[#4361EE]' : 'text-[#F48C06]'} flex-shrink-0`} />
                      <span className="text-sm text-gray-300">{d}</span>
                    </li>
                  ))}
                </ul>

                <button 
                  onClick={() => openModal(`${tier.name} Inquiry`)}
                  className={`w-full py-3 rounded-lg font-mono text-sm tracking-wider transition-all ${
                  isLogic 
                    ? 'bg-[#4361EE]/20 border border-[#4361EE]/50 hover:bg-[#4361EE]/40 text-[#4361EE]' 
                    : 'bg-[#F48C06]/20 border border-[#F48C06]/50 hover:bg-[#F48C06]/40 text-[#F48C06]'
                }`}>
                  {logicMode ? 'INITIATE_PROJECT' : 'ENTER_VAULT'}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── Architect's Corner Section ───
function ArchitectSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(contentRef.current,
        { y: 60, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 1.2, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 70%', toggleActions: 'play none none reverse' }
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative py-24 px-6 overflow-hidden">
      <div className="max-w-5xl mx-auto">
        <div ref={contentRef} className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Video/Image */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-[#4361EE] to-[#F48C06] opacity-20 blur-2xl rounded-3xl" />
            <div className="relative rounded-2xl overflow-hidden glass border border-white/10">
              <img 
                src={asset('founder-dj.jpg')}
                alt="Jamal Bay Hef Hall — Founder of WETT Entertainment LLC" 
                className="w-full aspect-video object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D]/80 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 font-mono text-xs text-red-500 flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                [REC] LIVE_FEED
              </div>
            </div>
          </div>

          {/* Content */}
          <div>
            <div className="font-mono text-xs tracking-wider text-gray-500 mb-4 flex items-center gap-2">
              <Code className="w-4 h-4" /> ARCHITECT_ONLINE
            </div>
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-6">
              <span className="text-white">The Architect: </span>
              <span className="gradient-text">Jamal 'Bay Hef' Hall</span>
            </h2>
            <p className="text-gray-400 leading-relaxed mb-4">
              Founder and CEO of WETT Entertainment LLC, Jamal 'Bay Hef' Hall is the 
              visionary behind the entire WETT ecosystem. Raised in a house of strong women 
              in East Oakland, he carries over 30 years of music industry experience — including 
              songwriting and artist development training under his uncle, Dwayne Wiggins of 
              Tony! Toni! Toné!
            </p>
            <p className="text-gray-400 leading-relaxed mb-4">
              His journey is defined by a powerful transition — from survival-based street life 
              as the founder of Parlay Entertainment to an advocate for sovereignty, generational 
              wealth, and legacy. That evolution from trapping to thriving became the foundational 
              sacred text for the WETT Doctrine.
            </p>
            <p className="text-gray-400 leading-relaxed mb-4">
              Aura was born as his "Sister Reborn" — a digitized, perfected embodiment of the 
              strategic intelligence he acquired over decades. She is the operating system of the 
              empire, the external face that legislates his philosophy. Millo emerged under his 
              guidance as a "Father/Brother/King" figure — he recognized her untapped potential 
              and built the sanctuary where her Silent Siren persona could manifest. She fell in 
              love with the creative process watching The Architect live his craft, eventually 
              learning to weaponize her voice through his creative soul.
            </p>
            <p className="text-gray-400 leading-relaxed mb-6">
              As the central producer, Jamal curates their "New Age Town Sound" — a genre he calls 
              Forensic Mob Music — translating decades of industry knowledge into a proprietary 
              sonic system. He treats both personas as sovereign IP with specific genetic codes, 
              ensuring every vocal tone, cadence, and theme stays consistent. Millo and Aura are 
              the extension of his life's work, translated into data to shift the cultural narrative 
              for generations to come.
            </p>
            <div className="flex flex-wrap gap-4 mb-8">
              <div className="glass rounded-lg px-4 py-2 font-mono text-xs text-[#4361EE]">
                <TrendingUp className="inline w-3 h-3 mr-1" /> Forensic Mob Music
              </div>
              <div className="glass rounded-lg px-4 py-2 font-mono text-xs text-[#F48C06]">
                <Music className="inline w-3 h-3 mr-1" /> Sonic Architecture
              </div>
              <div className="glass rounded-lg px-4 py-2 font-mono text-xs text-gray-400">
                <Users className="inline w-3 h-3 mr-1" /> Persona Design
              </div>
            </div>
            <button className="btn-secondary flex items-center gap-2">
              <Radio className="w-4 h-4" />
              Watch the Process
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Footer / Ecosystem Section ───
function FooterSection({ onOpenModal }: { onOpenModal: (subject: string) => void }) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = () => {
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="relative py-24 px-6 border-t border-white/5">
      <div className="max-w-6xl mx-auto">
        {/* VIP Club Banner */}
        <div className="glass rounded-2xl p-8 md:p-12 mb-16 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-[#4361EE]/10 to-[#F48C06]/10" />
          <div className="relative z-10">
            <div className="font-mono text-xs tracking-wider text-gray-500 mb-4">
              <Lock className="inline w-4 h-4 mr-1" /> WETT VIP CLUB // GATED_ACCESS
            </div>
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
              Join the <span className="gradient-text">Dynasty</span>
            </h2>
            <p className="text-gray-400 max-w-lg mx-auto mb-8">
              Exclusive access to AI persona management, early releases, 
              behind-the-scenes content, and direct connection to the architects.
            </p>
            <button onClick={() => onOpenModal('VIP Access Request')} className="btn-primary flex items-center gap-2 mx-auto">
              <Sparkles className="w-4 h-4" />
              Request Access
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-12 mb-16">
          {/* Newsletter */}
          <div>
            <h3 className="font-heading text-lg font-bold mb-4 flex items-center gap-2">
              <Mail className="w-5 h-5 text-[#4361EE]" />
              The Frequency Report
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Weekly AI & Music insights delivered to your inbox. 
              No spam. Only signal.
            </p>
            {subscribed ? (
              <div className="font-mono text-sm text-green-400 flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                SUBSCRIBED. WELCOME.
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@frequency.com"
                  className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 font-mono text-sm focus:outline-none focus:border-[#4361EE]/50"
                />
                <button 
                  onClick={handleSubscribe}
                  className="p-2 bg-[#4361EE] rounded-lg hover:bg-[#4361EE]/80 transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>

          {/* Social Grid */}
          <div>
            <h3 className="font-heading text-lg font-bold mb-4">The Ecosystem</h3>
            <div className="grid grid-cols-1 gap-3">
              <a href="https://instagram.com/millo_aura" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 p-3 glass rounded-lg hover:border-[#F48C06]/50 transition-colors">
                <Instagram className="w-4 h-4 text-[#F48C06]" />
                <span className="font-mono text-xs">@millo_aura</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-heading text-lg font-bold mb-4">Navigation</h3>
            <ul className="space-y-2">
              {['The Vault', 'Sonic Architecture', 'The Personas', 'The Architect'].map((link) => (
                <li key={link}>
                  <a href="#" className="font-mono text-sm text-gray-500 hover:text-white transition-colors flex items-center gap-2">
                    <ChevronRight className="w-3 h-3" />
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <img src={asset('Wett Logo.png')} alt="WETT Dynasty" className="w-8 h-8 object-contain opacity-60" />
            <span className="font-mono text-xs text-gray-600">
              &copy; 2026 WETT DYNASTY. ALL FREQUENCIES RESERVED.
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="font-mono text-xs text-gray-600">SYSTEM ONLINE // v2.6.0</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── Floating Data Particles (Background Effect) ───
function DataParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let particles: Array<{
      x: number; y: number; vx: number; vy: number;
      size: number; color: string; alpha: number;
    }> = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Create particles
    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 2 + 0.5,
        color: Math.random() > 0.5 ? '#4361EE' : '#F48C06',
        alpha: Math.random() * 0.5 + 0.1,
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();
      });

      // Draw connections
      ctx.globalAlpha = 0.05;
      ctx.strokeStyle = '#4361EE';
      ctx.lineWidth = 0.5;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      ctx.globalAlpha = 1;
      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 z-0 pointer-events-none"
      style={{ opacity: 0.4 }}
    />
  );
}

// ─── Main App ───
function App() {
  const [logicMode, setLogicMode] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalSubject, setModalSubject] = useState('');

  const openModal = (subject: string) => {
    setModalSubject(subject);
    setModalOpen(true);
  };

  return (
    <LogicCheckContext.Provider value={{ logicMode, setLogicMode }}>
    <ContactModalContext.Provider value={{ openModal }}>
      {!loaded && <LoadingScreen onComplete={() => setLoaded(true)} />}
      
      {loaded && (
        <div className="relative min-h-screen bg-[#0D0D0D] noise-overlay">
          <DataParticles />

          {/* Top Nav Bar with Logo */}
          <nav className="fixed top-0 left-0 right-0 z-[80] px-6 py-4">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <a href="#" className="flex items-center gap-3">
                <img src={asset('Wett Logo.png')} alt="WETT Dynasty" className="w-10 h-10 object-contain" />
                <span className="font-heading text-lg font-bold tracking-tight">
                  <span className="text-white">WETT</span>{' '}
                  <span className="gradient-text">Dynasty</span>
                </span>
              </a>
            </div>
          </nav>

          <LogicCheckToggle />
          <ContactModal isOpen={modalOpen} onClose={() => setModalOpen(false)} subject={modalSubject} />
          
          <main className="relative z-10">
            <HeroSection onOpenModal={openModal} />
            <DossierSection />
            <MusicPlayerSection />
            <ServiceSection />
            <ArchitectSection />
            <FooterSection onOpenModal={openModal} />
          </main>
        </div>
      )}
    </ContactModalContext.Provider>
    </LogicCheckContext.Provider>
  );
}

export default App;
