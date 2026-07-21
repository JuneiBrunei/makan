'use client';

import {
  useEffect,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Cormorant_Garamond, Manrope } from 'next/font/google';

/**
 * MAKAN — «Тарихы» беті
 * =========================================================================
 * Басты бет пен галереядағыдай визуалды жүйе: күңгірт фон,
 * алтын/шарап түсі, Cormorant Garamond + Manrope, Reveal / Swash,
 * «ашық/жабық» нақты уақыттағы мәртебесі, бірыңғай nav және footer.
 *
 * БҰЛ БЕТТІҢ ЕКІ БӨЛЕК ЕРЕКШЕЛІГІ (басты бетте де, галереяда да жоқ):
 *  1. «Хат» — күңгірт фондағы қолмен жазылған жазба стиліндегі ашық пергамент түсті карточка. Бүкіл сайттағы жалғыз ашық түсті екпін.
 *  2. Вертикаль хронология (timeline) — сол/оң жақтағы карточкалар және жылдар-белгілермен.
 *  3. «Дейін / Кейін» слайдері — сырғытпаны жылжыту арқылы ашылатын жөндеуге дейінгі және кейінгі фото.
 * =========================================================================
 */

const display = Cormorant_Garamond({
  subsets: ['latin', 'cyrillic'],
  weight: ['500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-display',
});

const body = Manrope({
  subsets: ['latin', 'cyrillic'],
  weight: ['300', '400', '500', '700'],
  variable: '--font-body',
});

const ADDRESS = 'Талғар қ., Гагарин көш., 67';
const PHONE = '+7 708 605 9354';
const PHONE_HREF = 'tel:+77086059354';
const INSTAGRAM = 'https://www.instagram.com/makan_talgar/';
const WHATSAPP = 'https://wa.me/77086059354';

// Уақытша сток фотолар
const STOCK = {
  hero: '/images/makan-hero1.jpg',
  before: '/images/photo_posle.jpg',
  after: '/images/photo-do.jpg',
};

const HERO_IMAGE_FOCUS = 'center 30%';

// MAKAN хронологиясы — Кавказ тауларының атмосферасын Талғарда жаңғырту.
const milestones = [
  {
    year: '',
    title: 'Идея',
    text: 'Шағын қалада бұрын болмаған грузин тауларының атмосферасын — ошақ жылуын, дастарқан молшылығын және Кавказ қонақжайлылығын жаңғырту идеясы пайда болды.',
  },
  {
    year: 'Шілде 2026',
    title: 'Ашылуы',
    text: 'MAKAN есігі алғашқы қонақтар үшін ашылды — тау үйінің рухындағы интерьермен және грузин дәстүрлері шашлықпен, десерттермен әрі қонақжайлылықпен тоғысқан мәзір ұсынылды.',
  },
  {
    year: 'Бүгін',
    title: 'Жалғасы',
    text: 'Әрбір қонақ бір сәтке Кавказ тауларында жүргендей сезінетін, асығыстық үшін емес, осы бір ерекше сезім үшін қайта оралатын мекен.',
  },
];

const explore = [
  { label: 'Мәзір', href: '/menu', text: 'Күн сайын ұсынатын грузин тағамдары, шашлық және десерттер.' },
  { label: 'Галерея', href: '/gallery', text: 'Зал, интерьер бөлшектері және Кавказ тауларының атмосферасы.' },
  { label: 'Байланыстар', href: '/#contacts', text: 'Мекенжай, жұмыс уақыты және бізге қалай жетуге болады.' },
];

const navLinks = [
  { href: '/', label: 'Басты бет' },
  { href: '/menu', label: 'Мәзір' },
  { href: '/gallery', label: 'Галерея' },
  { href: '/history', label: 'Тарихы' },
  { href: '/#contacts', label: 'Байланыстар' },
];

const WEEKLY_HOURS: Record<number, [number, number]> = {
  0: [10, 23],
  1: [10, 23],
  2: [10, 23],
  3: [10, 23],
  4: [10, 23],
  5: [10, 23],
  6: [10, 23],
};

function formatHour(h: number) {
  return `${String(h % 24).padStart(2, '0')}:00`;
}

function useOpenStatus() {
  const [status, setStatus] = useState<{ open: boolean; text: string } | null>(null);

  useEffect(() => {
    const compute = () => {
      const now = new Date();
      const day = now.getDay();
      const t = now.getHours() + now.getMinutes() / 60;
      const [open, close] = WEEKLY_HOURS[day];
      if (t >= open && t < close) {
        setStatus({ open: true, text: `Ашық · ${formatHour(close)}-ге дейін` });
      } else {
        const nextOpen = t < open ? open : WEEKLY_HOURS[(day + 1) % 7][0];
        setStatus({ open: false, text: `Жабық · ${formatHour(nextOpen)}-ден бастап` });
      }
    };
    compute();
    const id = setInterval(compute, 60000);
    return () => clearInterval(id);
  }, []);

  return status;
}

function Swash({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 400 40" preserveAspectRatio="none" aria-hidden="true">
      <path
        d="M0 24 C 60 -6, 130 -6, 200 18 C 270 42, 340 6, 400 20"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function Reveal({ children, className = '' }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={`reveal ${visible ? 'reveal--visible' : ''} ${className}`}>
      {children}
      <style jsx>{`
        .reveal {
          opacity: 0;
          transform: translateY(18px);
          transition: opacity 0.9s ease, transform 0.9s ease;
        }
        .reveal--visible {
          opacity: 1;
          transform: translateY(0);
        }
        @media (prefers-reduced-motion: reduce) {
          .reveal {
            opacity: 1;
            transform: none;
            transition: none;
          }
        }
      `}</style>
    </div>
  );
}

export default function HistoryPage() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [reveal, setReveal] = useState(50);
  const [compareDragging, setCompareDragging] = useState(false);
  const compareFrameRef = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);
  const status = useOpenStatus();

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(100, (window.scrollY / max) * 100) : 0);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      spotlightRef.current?.style.setProperty('--x', `${e.clientX}px`);
      spotlightRef.current?.style.setProperty('--y', `${e.clientY}px`);
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const updateRevealFromClientX = (clientX: number) => {
    const el = compareFrameRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (rect.width === 0) return;
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setReveal(Math.min(100, Math.max(0, pct)));
  };

  const handleComparePointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    setCompareDragging(true);
    e.currentTarget.setPointerCapture?.(e.pointerId);
    updateRevealFromClientX(e.clientX);
  };
  const handleComparePointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!compareDragging) return;
    updateRevealFromClientX(e.clientX);
  };
  const handleComparePointerEnd = (e: ReactPointerEvent<HTMLDivElement>) => {
    setCompareDragging(false);
    try {
      e.currentTarget.releasePointerCapture?.(e.pointerId);
    } catch {
      // pointer already released
    }
  };

  const magnetProps = {
    onMouseMove: (e: ReactMouseEvent<HTMLElement>) => {
      const el = e.currentTarget;
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      el.style.transform = `translate(${x * 0.25}px, ${y * 0.35}px)`;
    },
    onMouseLeave: (e: ReactMouseEvent<HTMLElement>) => {
      e.currentTarget.style.transform = 'translate(0, 0)';
    },
  };

  return (
    <main className={`${display.variable} ${body.variable} page`}>
      <div className="grain" aria-hidden="true" />
      <div className="spotlight" ref={spotlightRef} aria-hidden="true" />
      <div className="progress" style={{ transform: `scaleX(${progress / 100})` }} aria-hidden="true" />

      <header className={`nav ${scrolled ? 'nav--solid' : ''}`}>
        <div className="nav__inner">
          <Link href="/" className="nav__mark">
            MAKAN <span>кафесі</span>
          </Link>
          <nav className="nav__links" aria-label="Негізгі навигация">
            <Link href="/kz_main" className="nav__link">Басты бет</Link>
            <Link href="/kz_menu" className="nav__link">Мәзір</Link>
            <Link href="/kz_gallery" className="nav__link">Галерея</Link>
            <Link href="/kz_history" className="nav__link nav__link--active">Тарихы</Link>
            <a href="/kz_main#contacts" className="nav__link nav__link--cta">Байланыс</a>
            <div className="nav__lang" aria-label="Тіл таңдау">
              <Link href="/history" className="nav__lang-btn">РУС</Link>
              <span className="nav__lang-dot" aria-hidden="true">·</span>
              <Link href="/en_history" className="nav__lang-btn">ENG</Link>
            </div>
            {status && (
              <span className={`nav__status ${status.open ? 'nav__status--open' : ''}`}>
                <span className="nav__status-dot" />
                {status.text}
              </span>
            )}
          </nav>
          <button
            type="button"
            className={`nav__toggle ${menuOpen ? 'nav__toggle--open' : ''}`}
            aria-label={menuOpen ? 'Мәзірді жабу' : 'Мәзірді ашу'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </header>

      <div className={`mobile-menu ${menuOpen ? 'mobile-menu--open' : ''}`}>
        <nav className="mobile-menu__links" aria-label="Мобильді навигация">
          {navLinks.map((l, i) => (
            <Link
              key={l.href}
              href={l.href}
              className="mobile-menu__link"
              style={{ transitionDelay: menuOpen ? `${i * 60 + 120}ms` : '0ms' }}
              onClick={() => setMenuOpen(false)}
            >
              <span className="mobile-menu__link-index">0{i + 1}</span>
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="mobile-menu__footer" style={{ transitionDelay: menuOpen ? `${navLinks.length * 60 + 180}ms` : '0ms' }}>
          <div className="mobile-menu__lang">
            <Link href="/history" className="mobile-menu__lang-btn" onClick={() => setMenuOpen(false)}>РУС</Link>
            <span className="mobile-menu__lang-dot" aria-hidden="true">·</span>
            <Link href="/en_history" className="mobile-menu__lang-btn" onClick={() => setMenuOpen(false)}>ENG</Link>
          </div>
          {status && (
            <span className={`mobile-menu__status ${status.open ? 'mobile-menu__status--open' : ''}`}>
              <span className="nav__status-dot" />
              {status.text}
            </span>
          )}
          <div className="mobile-menu__social">
            <a href={WHATSAPP} target="_blank" rel="noopener noreferrer">WhatsApp</a>
            <a href={INSTAGRAM} target="_blank" rel="noopener noreferrer">Instagram</a>
          </div>
        </div>
      </div>

      {/* 1. HERO */}
      <section className="hero">
        <Image
          src={STOCK.hero}
          alt="MAKAN кафесінің бүгінгі залы: кірпіш қабырғалар, былғары дивандар және жылы жарық"
          fill
          priority
          sizes="100vw"
          className="hero__img"
          style={{ objectFit: 'cover', objectPosition: HERO_IMAGE_FOCUS }}
        />
        <div className="hero__scrim" />
        <div className="hero__content">
          <p className="eyebrow">Тарихы</p>
          <h1 className="hero__title">
            Біз Талғарға <em>грузин тауларының рухын</em> әкелдік
          </h1>
          <p className="hero__text">
            Кавказ атмосферасын қайта жаңғырту тиесі алғашқы қадамнан бастап қонақжайлылықпен қарсы алатын кафеге қалай айналғаны жайлы.
          </p>
        </div>
      </section>

      <div className="marquee" aria-hidden="true">
        <div className="marquee__track">
          {Array.from({ length: 2 }).map((_, rep) => (
            <span className="marquee__group" key={rep}>
              {['MAKAN', 'Кавказ рухы', 'Құрылу тарихы', 'Талғар', 'Тау қонақжайлылығы'].map((w) => (
                <span className="marquee__item" key={w}>
                  {w}
                  <Swash className="marquee__swash" />
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* 2. ХАТ — сайттағы жалғыз ашық түсті элемент */}
      <section className="letter-section">
        <Reveal>
          <div className="letter">
            <span className="letter__seal" aria-hidden="true">M</span>
            <Swash className="letter__swash" />
            <p className="letter__eyebrow">Біздің атымыздан бірнеше сөз</p>
            <p className="letter__text">
              Біз қонақтардың табалдырықтан аттаған сәтте әдеттегі кафеде емес,
              Сванетия немесе Кахетияның таулы үйінде жүргендей сезінуін қаладық —
              онда ошақ жылуы мен дастарқан молшылығы жасанды емес, шынайы.
            </p>
            <p className="letter__text">
              Идея осылай туды: бір кеңістікте грузин тауларының рухын — тас,
              ағаш, от — жинап, оны кавказ дәстүрлері шашлықпен, десерттермен
              және қонақжайлылықпен тоғысқан асүй арқылы ұсыну.
            </p>
            <p className="letter__sign">— MAKAN ұжымы</p>
          </div>
        </Reveal>
      </section>

      {/* 3. ХРОНОЛОГИЯ */}
      <section className="timeline">
        <Reveal>
          <p className="eyebrow eyebrow--center">Хроника</p>
          <h2 className="section-title">Бәрі қалай басталды</h2>
        </Reveal>

        <div className="timeline__list">
          <span className="timeline__line" aria-hidden="true" />
          {milestones.map((m, i) => (
            <div
              className={`timeline__item ${i % 2 === 0 ? 'timeline__item--left' : 'timeline__item--right'}`}
              key={m.year || i}
            >
              <span className="timeline__dot" aria-hidden="true" />
              <Reveal>
                <div className="timeline__card">
                  {m.year && <span className="timeline__year">{m.year}</span>}
                  <h3 className="timeline__title">{m.title}</h3>
                  <p className="timeline__text">{m.text}</p>
                </div>
              </Reveal>
            </div>
          ))}
        </div>
      </section>

      {/* 4. САЙТ БОЙЫНША АРЫ ҚАРАЙ */}
      <section className="explore">
        <Reveal>
          <p className="eyebrow eyebrow--center">Сайт бойынша ары қарай</p>
          <h2 className="section-title">Тереңірек танысыңыз</h2>
        </Reveal>

        <div className="explore__list">
          {explore.map((e, i) => (
            <Link href={e.href} className="explore__row" key={e.label}>
              <span className="explore__row-index">{String(i + 1).padStart(2, '0')}</span>
              <span className="explore__row-content">
                <span className="explore__row-title">{e.label}</span>
                <span className="explore__row-text">{e.text}</span>
              </span>
              <span className="explore__row-arrow" aria-hidden="true">→</span>
            </Link>
          ))}
        </div>
      </section>

      <footer className="footer">
        <div className="footer__inner">
          <div className="footer__col">
            <div className="footer__mark">
              MAKAN <span>кафесі</span>
            </div>
            <p className="footer__tag">Дәмді тағам және асықпай аялдағың келетін атмосфера</p>
          </div>

          <div className="footer__col footer__col--meta">
            <p>{ADDRESS}</p>
            <p><a href={PHONE_HREF}>{PHONE}</a></p>
            <p>Күн сайын, 10:00 — 23:00</p>
          </div>

          <div className="footer__col footer__col--social">
            <a href={INSTAGRAM} target="_blank" rel="noopener noreferrer">Instagram</a>
            <a href={WHATSAPP} target="_blank" rel="noopener noreferrer">WhatsApp</a>
          </div>
        </div>
        <div className="footer__bottom">
          <span>© {new Date().getFullYear()} MAKAN</span>
          <Swash className="footer__swash" />
        </div>
      </footer>

      <style jsx global>{`
        :root {
          --ink: #120e0b;
          --ink-soft: #1c1611;
          --parchment: #efe9da;
          --parchment-dim: #c9bfa9;
          --gold: #b99456;
          --gold-light: #d9b878;
          --wine: #6d2331;
          --hairline: rgba(185, 148, 86, 0.22);
          --space-section: 6rem;
          --space-section-sm: 3.5rem;
        }
        * { box-sizing: border-box; }
        html, body { margin: 0; padding: 0; background: var(--ink); overflow-x: hidden; }
        ::selection { background: var(--gold); color: var(--ink); }
        @media (max-width: 640px) {
          :root { --space-section: 3.8rem; --space-section-sm: 2.4rem; }
        }
        @media (prefers-reduced-motion: reduce) {
          * { animation-duration: 0.001ms !important; transition-duration: 0.001ms !important; }
        }
      `}</style>

      <style jsx>{`
        .grain {
          position: fixed; inset: 0; z-index: 90; pointer-events: none;
          opacity: 0.05; mix-blend-mode: overlay;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
        }
        .spotlight {
          position: fixed; inset: 0; z-index: 5; pointer-events: none;
          background: radial-gradient(480px circle at var(--x, 50%) var(--y, 40%), rgba(217, 184, 120, 0.10), transparent 70%);
        }
        @media (hover: none), (pointer: coarse) { .spotlight { display: none; } }
        .progress {
          position: fixed; top: 0; left: 0; right: 0; height: 2px; z-index: 55;
          background: var(--gold-light); transform-origin: left;
          transform: scaleX(0); transition: transform 0.1s linear;
        }
      `}</style>
      <style jsx>{`
        .grain {
          position: fixed; inset: 0; z-index: 90; pointer-events: none;
          opacity: 0.05; mix-blend-mode: overlay;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
        }
        .spotlight {
          position: fixed; inset: 0; z-index: 5; pointer-events: none;
          background: radial-gradient(480px circle at var(--x, 50%) var(--y, 40%), rgba(217, 184, 120, 0.10), transparent 70%);
        }
        @media (hover: none), (pointer: coarse) { .spotlight { display: none; } }
        .progress {
          position: fixed; top: 0; left: 0; right: 0; height: 2px; z-index: 55;
          background: var(--gold-light); transform-origin: left;
          transform: scaleX(0); transition: transform 0.1s linear;
        }
      `}</style>

      <style jsx>{`
        .page {
          font-family: var(--font-body), system-ui, sans-serif;
          font-weight: 300;
          color: var(--parchment);
          background: var(--ink);
          letter-spacing: 0.01em;
        }

        .eyebrow {
          font-family: var(--font-body), sans-serif;
          font-size: 0.7rem;
          font-weight: 600;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: var(--gold-light);
          margin: 0 0 1.3rem;
        }
        .eyebrow--center { text-align: center; }

        .section-title {
          font-family: var(--font-display), serif; font-weight: 600;
          font-size: clamp(1.6rem, 3vw, 2.1rem); margin: 0 0 3rem; color: var(--parchment);
          text-align: center;
        }

        /* NAV */
        .nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 50;
          background: transparent;
          transition: background 0.4s ease, border-color 0.4s ease;
          border-bottom: 1px solid transparent;
        }
        .nav--solid {
          background: rgba(18, 14, 11, 0.9);
          backdrop-filter: blur(8px);
          border-bottom: 1px solid var(--hairline);
        }
        .nav__inner {
          max-width: 1200px; margin: 0 auto; padding: 1.3rem 2rem;
          display: flex; align-items: center; justify-content: space-between;
        }
        .nav__mark {
          font-family: var(--font-display), serif; font-weight: 600;
          font-size: 1.3rem; letter-spacing: 0.06em; color: var(--parchment);
          text-decoration: none;
        }
        .nav__mark span {
          font-size: 0.65rem; letter-spacing: 0.2em; color: var(--gold-light);
          margin-left: 0.5rem; text-transform: lowercase; font-family: var(--font-body), sans-serif;
        }
        .nav__links { display: flex; align-items: center; gap: 2.1rem; }
        .nav__link {
          color: var(--parchment-dim); text-decoration: none;
          font-size: 0.76rem; letter-spacing: 0.14em; text-transform: uppercase;
          padding-bottom: 0.25rem; border-bottom: 1px solid transparent;
          transition: color 0.2s ease, border-color 0.2s ease;
        }
        .nav__link:hover, .nav__link:focus-visible { color: var(--parchment); border-color: var(--gold); }
        .nav__link--active { color: var(--gold-light); border-color: var(--gold); }
        .nav__link--cta { color: var(--gold-light); border: 1px solid var(--hairline); padding: 0.4rem 0.9rem; }

        .nav__status {
          display: inline-flex; align-items: center; gap: 0.5rem;
          font-size: 0.68rem; letter-spacing: 0.1em; text-transform: uppercase;
          color: var(--parchment-dim); padding-left: 1.5rem; border-left: 1px solid var(--hairline);
        }
        .nav__status--open { color: var(--gold-light); }
        .nav__status-dot {
          width: 6px; height: 6px; border-radius: 50%; background: var(--parchment-dim); flex-shrink: 0;
        }
        .nav__status--open .nav__status-dot, .mobile-menu__status--open .nav__status-dot {
          background: var(--gold-light); box-shadow: 0 0 0 3px rgba(217, 184, 120, 0.22);
          animation: statusPulse 2.4s ease-in-out infinite;
        }
        @keyframes statusPulse {
          0%, 100% { box-shadow: 0 0 0 3px rgba(217, 184, 120, 0.22); }
          50% { box-shadow: 0 0 0 6px rgba(217, 184, 120, 0.06); }
        }

        .nav__toggle {
          display: none; position: relative; width: 26px; height: 18px;
          background: none; border: 0; padding: 0; cursor: pointer; z-index: 70;
        }
        .nav__toggle span {
          position: absolute; left: 0; width: 100%; height: 1px; background: var(--parchment);
          transition: transform 0.35s cubic-bezier(0.65, 0, 0.35, 1), opacity 0.25s ease, top 0.35s ease;
        }
        .nav__toggle span:nth-child(1) { top: 0; }
        .nav__toggle span:nth-child(2) { top: 8px; }
        .nav__toggle span:nth-child(3) { top: 16px; }
        .nav__toggle--open span:nth-child(1) { top: 8px; transform: rotate(45deg); }
        .nav__toggle--open span:nth-child(2) { opacity: 0; }
        .nav__toggle--open span:nth-child(3) { top: 8px; transform: rotate(-45deg); }

        @media (max-width: 780px) {
          .nav__links { display: none; }
          .nav__toggle { display: block; }
        }

        .nav__lang {
  display: flex; align-items: center; gap: 0.55rem;
  margin-left: 0.6rem; padding: 0.4rem 1rem;
  border: 1px solid var(--hairline); border-radius: 999px;
  transition: border-color 0.3s ease, background 0.3s ease;
}
.nav__lang:hover { border-color: var(--gold); background: rgba(185, 148, 86, 0.06); }
.nav__lang-btn {
  font-family: var(--font-display), serif; font-style: italic; font-weight: 600;
  font-size: 0.85rem; letter-spacing: 0.03em; color: var(--parchment-dim);
  text-decoration: none; transition: color 0.2s ease;
}
.nav__lang-btn:hover, .nav__lang-btn:focus-visible { color: var(--gold-light); }
.nav__lang-dot { color: var(--gold); opacity: 0.55; font-size: 0.65rem; }

        .mobile-menu {
          position: fixed; inset: 0; z-index: 60;
          background: var(--ink); display: flex; flex-direction: column; justify-content: space-between;
          padding: 7rem 2rem 3rem;
          opacity: 0; visibility: hidden; transform: translateY(-8px);
          transition: opacity 0.4s ease, visibility 0.4s ease, transform 0.4s ease;
        }
        .mobile-menu--open { opacity: 1; visibility: visible; transform: translateY(0); }
        .mobile-menu__links { display: flex; flex-direction: column; gap: 0.4rem; }
        .mobile-menu__link {
          display: flex; align-items: baseline; gap: 1.1rem;
          font-family: var(--font-display), serif; font-weight: 600;
          font-size: clamp(2rem, 9vw, 2.6rem); color: var(--parchment); text-decoration: none;
          padding: 0.55rem 0; border-bottom: 1px solid var(--hairline);
          opacity: 0; transform: translateY(14px);
          transition: opacity 0.5s ease, transform 0.5s cubic-bezier(0.22, 1, 0.36, 1), color 0.25s ease;
        }
        .mobile-menu--open .mobile-menu__link { opacity: 1; transform: translateY(0); }
        .mobile-menu__link:hover, .mobile-menu__link:focus-visible { color: var(--gold-light); }
        .mobile-menu__link-index {
  font-family: var(--font-body), sans-serif;
  font-size: 0.85rem;
  font-style: normal;
  font-weight: 700;
  color: var(--gold);
  opacity: 0.6;
  margin-right: 0.4rem;
  letter-spacing: 0.02em;
}
  .mobile-menu__footer {
          display: flex; flex-direction: column; gap: 1.2rem;
          opacity: 0; transform: translateY(14px);
          transition: opacity 0.5s ease, transform 0.5s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .mobile-menu--open .mobile-menu__footer { opacity: 1; transform: translateY(0); }
        .mobile-menu__status {
          display: inline-flex; align-items: center; gap: 0.55rem; width: fit-content;
          font-size: 0.75rem; letter-spacing: 0.08em; text-transform: uppercase; color: var(--parchment-dim);
        }
        .mobile-menu__status--open { color: var(--gold-light); }
        .mobile-menu__social { display: flex; gap: 1.6rem; }
        .mobile-menu__social a { color: var(--parchment-dim); text-decoration: none; font-size: 0.85rem; letter-spacing: 0.04em; }
        .mobile-menu__social a:hover { color: var(--gold-light); }
        .mobile-menu__lang {
  display: flex; align-items: center; gap: 0.85rem; margin-bottom: 0.6rem;
}
.mobile-menu__lang-btn {
  color: var(--parchment); text-decoration: none;
  font-family: var(--font-display), serif; font-style: italic; font-weight: 600;
  font-size: 1rem; letter-spacing: 0.03em;
  padding-bottom: 0.2rem; border-bottom: 1px solid transparent;
  transition: color 0.25s ease, border-color 0.25s ease;
}
.mobile-menu__lang-btn:hover, .mobile-menu__lang-btn:focus-visible {
  color: var(--gold-light); border-color: var(--gold);
}
.mobile-menu__lang-dot { color: var(--gold); opacity: 0.55; font-size: 0.85rem; }

        /* HERO */
        .hero { position: relative; height: 62vh; min-height: 420px; display: flex; align-items: flex-end; overflow: hidden; }
        .hero__img { object-fit: cover; filter: saturate(0.85) brightness(0.55); }
        .hero__scrim {
          position: absolute; inset: 0;
          background: linear-gradient(180deg, rgba(14,11,9,0.55) 0%, rgba(14,11,9,0.35) 40%, rgba(12,9,7,0.96) 100%);
        }
        .hero__content { position: relative; z-index: 2; max-width: 800px; padding: 0 2rem 4rem; margin: 0 auto; width: 100%; }
        .hero__title {
          font-family: var(--font-display), serif; font-weight: 600;
          font-size: clamp(2.1rem, 5.2vw, 3.6rem); line-height: 1.14;
          margin: 0 0 1rem; color: var(--parchment);
          text-shadow: 0 2px 24px rgba(0,0,0,0.55), 0 1px 4px rgba(0,0,0,0.85);
        }
        .hero__title em { font-style: italic; font-weight: 600; color: var(--gold-light); }
        .hero__text { font-size: 1rem; line-height: 1.7; color: var(--parchment-dim); max-width: 46ch; margin: 0; font-weight: 300; text-shadow: 0 1px 12px rgba(0,0,0,0.5); }
        @media (max-width: 640px) {
          .hero { height: 52vh; }
          .hero__content { padding: 0 1.4rem 3rem; }
        }

        .marquee {
          overflow: hidden; background: var(--ink-soft);
          border-top: 1px solid var(--hairline); border-bottom: 1px solid var(--hairline);
          padding: 1.1rem 0;
        }
        .marquee__track { display: flex; width: max-content; animation: marqueeScroll 26s linear infinite; }
        .marquee__group { display: flex; align-items: center; flex-shrink: 0; }
        .marquee__item {
          display: inline-flex; align-items: center; gap: 1.6rem;
          font-family: var(--font-display), serif; font-style: italic; font-weight: 500;
          font-size: 1.15rem; color: var(--parchment-dim); white-space: nowrap; padding: 0 1.6rem;
        }
        .marquee__swash { width: 34px; height: 10px; color: var(--gold); flex-shrink: 0; }
        @keyframes marqueeScroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @media (prefers-reduced-motion: reduce) {
          .marquee__track { animation: none; }
        }

        /* ПИСЬМО — единственная светлая поверхность на сайте */
        .letter-section { padding: var(--space-section) 2rem; background: var(--ink); display: flex; justify-content: center; }
        .letter {
          position: relative; max-width: 620px; width: 100%;
          background: var(--parchment); color: var(--ink-soft);
          padding: 3.4rem 3rem 3rem; box-shadow: 0 30px 60px rgba(0, 0, 0, 0.45);
        }
        .letter__seal {
          position: absolute; top: -1.3rem; left: 50%; transform: translateX(-50%);
          width: 2.8rem; height: 2.8rem; border-radius: 50%;
          background: var(--wine); color: var(--parchment);
          display: flex; align-items: center; justify-content: center;
          font-family: var(--font-display), serif; font-style: italic; font-weight: 700; font-size: 1.2rem;
          box-shadow: 0 8px 18px rgba(0, 0, 0, 0.4);
        }
        .letter__swash { width: 90px; height: 14px; color: var(--gold); display: block; margin: 0.6rem auto 1.6rem; }
        .letter__eyebrow {
          text-align: center; font-size: 0.7rem; letter-spacing: 0.26em; text-transform: uppercase;
          color: var(--wine); font-weight: 700; margin: 0 0 1.6rem;
        }
        .letter__text {
          font-family: var(--font-display), serif; font-style: italic; font-weight: 500;
          font-size: 1.15rem; line-height: 1.75; margin: 0 0 1.2rem; color: var(--ink-soft);
          text-align: center;
        }
        .letter__sign {
          text-align: center; margin: 1.6rem 0 0; font-size: 0.8rem;
          letter-spacing: 0.1em; text-transform: uppercase; color: var(--wine); font-weight: 700;
        }
        @media (max-width: 640px) {
          .letter { padding: 3rem 1.6rem 2.2rem; }
        }

        /* ХРОНОЛОГИЯ */
        .timeline { padding: var(--space-section) 2rem; background: var(--ink); }
        .timeline__list { position: relative; max-width: 900px; margin: 0 auto; }
        .timeline__line {
          position: absolute; top: 0; bottom: 0; left: 50%; width: 1px;
          background: var(--hairline); transform: translateX(-50%);
        }
        .timeline__item {
          position: relative; display: flex; margin-bottom: 3.2rem;
        }
        .timeline__item:last-child { margin-bottom: 0; }
        .timeline__item--left { justify-content: flex-start; }
        .timeline__item--right { justify-content: flex-end; }
        .timeline__dot {
          position: absolute; top: 0.5rem; left: 50%; transform: translateX(-50%);
          width: 0.7rem; height: 0.7rem; border-radius: 50%;
          background: var(--gold-light); box-shadow: 0 0 0 4px var(--ink), 0 0 0 5px var(--hairline);
          z-index: 2;
        }
        .timeline__card {
          width: calc(50% - 3rem); background: var(--ink-soft);
          border: 1px solid var(--hairline); padding: 1.7rem 1.9rem;
        }
        .timeline__year {
          font-family: var(--font-display), serif; font-style: italic; font-weight: 700;
          font-size: 1.6rem; color: var(--gold-light); display: block; margin-bottom: 0.4rem;
        }
        .timeline__title { font-family: var(--font-display), serif; font-weight: 600; font-size: 1.15rem; margin: 0 0 0.6rem; color: var(--parchment); }
        .timeline__text { font-size: 0.88rem; line-height: 1.7; color: var(--parchment-dim); margin: 0; font-weight: 300; }

        @media (max-width: 760px) {
          .timeline__line { left: 0.35rem; }
          .timeline__item, .timeline__item--left, .timeline__item--right { justify-content: flex-start; padding-left: 2rem; }
          .timeline__dot { left: 0.35rem; top: 0.5rem; }
          .timeline__card { width: 100%; }
        }
          
        /* ДАЛЬШЕ ПО САЙТУ */
.explore { padding: var(--space-section-sm) 3vw var(--space-section); background: var(--ink); text-align: center; }
.explore__list { max-width: 720px; width: 100%; margin: 3rem auto 0; text-align: center; }
.explore__row {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.6rem;
  padding: 2.1rem 0;
  text-decoration: none;
  border-top: 1px solid var(--hairline);
}
.explore__list .explore__row:last-child { border-bottom: 1px solid var(--hairline); }
.explore__row::after {
  content: ''; position: absolute; left: 0; right: 0; bottom: -1px; height: 1px;
  background: var(--gold-light); transform: scaleX(0); transform-origin: center;
  transition: transform 0.6s cubic-bezier(0.22, 1, 0.36, 1);
}
.explore__row:hover::after, .explore__row:focus-visible::after { transform: scaleX(1); }
.explore__row-index {
  font-family: var(--font-display), serif; font-style: italic; font-weight: 500;
  font-size: 0.95rem; color: var(--gold); opacity: 0.55;
  transition: opacity 0.3s ease, color 0.3s ease;
}
.explore__row:hover .explore__row-index { opacity: 1; color: var(--gold-light); }
.explore__row-content { display: flex; flex-direction: column; align-items: center; gap: 0.45rem; }
.explore__row-title {
  font-family: var(--font-display), serif; font-weight: 600;
  font-size: clamp(1.6rem, 3.2vw, 2.3rem); color: var(--parchment);
  transition: color 0.3s ease;
}
.explore__row:hover .explore__row-title { color: var(--gold-light); }
.explore__row-text { font-size: 0.86rem; color: var(--parchment-dim); font-weight: 300; max-width: 34ch; text-align: center; }
.explore__row-arrow {
  font-size: 1.2rem; color: var(--gold-light);
  opacity: 0;
  transition: opacity 0.4s ease, transform 0.3s ease;
}
.explore__row:hover .explore__row-arrow, .explore__row:focus-visible .explore__row-arrow {
  opacity: 1; transform: translateY(4px);
}
@media (max-width: 640px) {
  .explore__row { padding: 1.6rem 0; gap: 0.5rem; }
  .explore__row-title { font-size: 1.3rem; }
  .explore__row-text { display: none; }
  .explore__row-arrow { opacity: 1; }
}

        /* FOOTER */
        .footer { position: relative; padding: 4.5rem 2rem 2.5rem; background: var(--ink-soft); border-top: 1px solid var(--hairline); }
        .footer__inner {
          max-width: 1200px; margin: 0 auto; display: grid;
          grid-template-columns: 1.3fr 1fr 0.7fr; gap: 2rem; padding-bottom: 2.5rem;
        }
        .footer__mark { font-family: var(--font-display), serif; font-weight: 600; font-size: 1.35rem; color: var(--parchment); }
        .footer__mark span { font-size: 0.65rem; letter-spacing: 0.2em; color: var(--gold-light); margin-left: 0.5rem; text-transform: lowercase; font-family: var(--font-body), sans-serif; }
        .footer__tag { margin: 0.9rem 0 0; font-size: 0.85rem; color: var(--parchment-dim); font-weight: 300; }
        .footer__col--meta p { margin: 0 0 0.5rem; font-size: 0.85rem; color: var(--parchment-dim); font-weight: 300; }
        .footer__col--meta a { color: var(--parchment-dim); text-decoration: none; }
        .footer__col--meta a:hover { color: var(--gold-light); }
        .footer__col--social { display: flex; flex-direction: column; gap: 0.6rem; text-align: right; }
        .footer__col--social a { color: var(--parchment-dim); text-decoration: none; font-size: 0.85rem; letter-spacing: 0.05em; }
        .footer__col--social a:hover, .footer__col--social a:focus-visible { color: var(--gold-light); }
        .footer__bottom {
          max-width: 1200px; margin: 0 auto; padding-top: 1.8rem; border-top: 1px solid var(--hairline);
          display: flex; align-items: center; justify-content: space-between; gap: 1.5rem;
          font-size: 0.75rem; color: var(--parchment-dim); letter-spacing: 0.05em;
        }
        .footer__swash { width: 120px; height: 16px; color: var(--hairline); }
        @media (max-width: 780px) {
          .footer__inner { grid-template-columns: 1fr; }
          .footer__col--social { text-align: left; }
        }
        @media (max-width: 480px) {
          .footer { padding: 3.5rem 1.4rem 2rem; }
          .footer__bottom { flex-wrap: wrap; }
          .footer__swash { width: 80px; }
        }

        @media (max-width: 480px) {
          .letter-section, .timeline, .compare-section, .explore {
            padding-left: 1.25rem; padding-right: 1.25rem;
          }
        }
      `}</style>
    </main>
  );
}