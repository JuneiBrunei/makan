'use client';

import { useEffect, useRef, useState, type MouseEvent as ReactMouseEvent, type ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Cormorant_Garamond, Manrope } from 'next/font/google';

/**
 * MAKAN — «Галерея» парақшасы
 * =========================================================================
 * Басты парақшамен (page.tsx) бірдей визуалды стильде жасалған:
 * сондай күңгірт фон, алтын/бордо реңктері, жылы жарық, Cormorant Garamond
 * + Manrope қаріптері, Reveal / Swash компоненттері, жанды «ашық/жабық» мәртебесі,
 * сол навигация мен футер.
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

const STOCK = {
  // ЗАЛ — залының жалпы көрінісі, дивандар, шырақтар
  hall_1: '/images/makan-hero1.jpg',
  hall_2: '/images/makan-photo2.jpg',
  hall_3: '/images/makan-hall2.jpg',
  hall_4: '/images/makan-hall5.jpg',
  hall_5: '/images/makan-hall4.jpg',

  // ДЕТАЛИ — ірі пландар: қабырғалар, жарық, текстуралар, декор
  details_1: '/images/makan-details2.jpg',
  details_2: '/images/makan-details4.jpg',
  details_3: '/images/makan-details3.jpg',
  details_4: '/images/makan-details5.jpg',
  details_5: '/images/makan-details6.jpg',
  details_6: '/images/makan-photo.jpg',

  // НА СТОЛЕ — тағамдар, сусындар, дастарқан сәні
  table_1: '/images/skoro.jpg',
  table_2: '/images/zhuirda.jpg',
};

const HERO_IMAGE_FOCUS = 'center 30%';

type Category = 'hall' | 'details' | 'table';

const categories: { key: Category | 'all'; label: string }[] = [
  { key: 'all', label: 'Барлығы' },
  { key: 'hall', label: 'Зал' },
  { key: 'details', label: 'Бөлшектер' },
  { key: 'table', label: 'Үстел үсті' },
];

const photos: {
  src: string;
  alt: string;
  caption: string;
  category: Category;
  aspect: string;
}[] = [
  // — ЗАЛ —
  { src: STOCK.hall_1, alt: 'MAKAN залының жалпы көрінісі', caption: 'Мұндағы жарық ешқашан тым артық болмайды', category: 'hall', aspect: '4 / 5' },
  { src: STOCK.hall_2, alt: 'Шегіршін түсті дивандар мен күңгірт-жасыл қаптама', caption: 'Терезе жанындағы үстел бірінші болып босайды', category: 'hall', aspect: '3 / 4' },
  { src: STOCK.hall_3, alt: 'MAKAN залы', caption: 'Асықпай өткізгің келетін кеш', category: 'hall', aspect: '3 / 4' },
  { src: STOCK.hall_4, alt: 'MAKAN залы', caption: 'Ұзағырақ аялдағың келетін орын', category: 'hall', aspect: '1 / 1' },
  { src: STOCK.hall_5, alt: 'MAKAN залы кешке', caption: 'Шегіршін мен зүбаржат түсті былғары қонақты босағадан қарсы алады', category: 'hall', aspect: '3 / 4' },

  // — БӨЛШЕКТЕР —
  { src: STOCK.details_1, alt: 'MAKAN интерьерінің бөлшегі', caption: 'Бұрыш сайын қонақтарға жайлылық сыйлаймыз', category: 'details', aspect: '1 / 1' },
  { src: STOCK.details_2, alt: 'MAKAN интерьерінің бөлшегі', caption: 'Мұнда жоспарлағаннан да ұзақ кідіреді', category: 'details', aspect: '4 / 5' },
  { src: STOCK.details_3, alt: 'MAKAN интерьерінің бөлшегі', caption: 'Біз әрбір детальға көңіл бөлеміз', category: 'details', aspect: '4 / 5' },
  { src: STOCK.details_4, alt: 'MAKAN интерьерінің бөлшегі', caption: 'Төсеніш бізге қарағанда көп сырды біледі', category: 'details', aspect: '3 / 4' },
  { src: STOCK.details_5, alt: 'MAKAN интерьерінің бөлшегі', caption: 'Кірпіш пен жез — сөзсіз түсінікті фон', category: 'details', aspect: '1 / 1' },
  { src: STOCK.details_6, alt: 'MAKAN интерьерінің бөлшегі', caption: 'Бірден байқала бермейтін ұсақ-түйектер', category: 'details', aspect: '3 / 4' },
  
  // — ҮСТЕЛ ҮСТІ —
  { src: STOCK.table_1, alt: 'Үстел үстіндегі десерт пен сусын', caption: 'Мұнда осы үшін де қайта оралады', category: 'table', aspect: '4 / 3' },
  { src: STOCK.table_2, alt: 'Үстел үстіндегі латте-арты бар кофе', caption: 'Таң осы шыныаяқтан басталады', category: 'table', aspect: '4 / 3' },
];

const explore = [
  { label: 'Мәзір', href: '/menu', text: 'Күн сайын ұсынатын тағамдарымыз бен сусындарымыз.' },
  { label: 'Тарихы', href: '/history', text: 'Кафе қалай ашылды және неге дәл осылай көрінеді.' },
  { label: 'Байланыс', href: '/#contacts', text: 'Мекенжай, жұмыс уақыты және бізге қалай жетуге болады.' },
];

const navLinks = [
  { href: '/kz_main', label: 'Басты бет' },
  { href: '/kz_menu', label: 'Мәзір' },
  { href: '/kz_gallery', label: 'Галерея' },
  { href: '/kz_history', label: 'Тарихы' },
  { href: '/kz_main#contacts', label: 'Байланыс' },
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

export default function GalleryPage() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [activeCategory, setActiveCategory] = useState<Category | 'all'>('all');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);
  const status = useOpenStatus();

  const filtered = activeCategory === 'all' ? photos : photos.filter((p) => p.category === activeCategory);

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
    document.body.style.overflow = menuOpen || lightboxIndex !== null ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen, lightboxIndex]);

  useEffect(() => {
    if (lightboxIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxIndex(null);
      if (e.key === 'ArrowRight') setLightboxIndex((i) => (i === null ? null : (i + 1) % filtered.length));
      if (e.key === 'ArrowLeft') setLightboxIndex((i) => (i === null ? null : (i - 1 + filtered.length) % filtered.length));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightboxIndex, filtered.length]);

  useEffect(() => {
    setLightboxIndex(null);
  }, [activeCategory]);

  const activePhoto = lightboxIndex !== null ? filtered[lightboxIndex] : null;

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
            <Link href="/kz_gallery" className="nav__link nav__link--active">Галерея</Link>
            <Link href="/kz_history" className="nav__link">Тарихы</Link>
            <a href="/kz_main#contacts" className="nav__link nav__link--cta">Байланыс</a>
            <div className="nav__lang" aria-label="Тіл таңдау">
              <Link href="/gallery" className="nav__lang-btn">РУС</Link>
              <span className="nav__lang-dot" aria-hidden="true">·</span>
              <Link href="/en_gallery" className="nav__lang-btn">ENG</Link>
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
            <Link href="/gallery" className="mobile-menu__lang-btn" onClick={() => setMenuOpen(false)}>РУС</Link>
            <span className="mobile-menu__lang-dot" aria-hidden="true">·</span>
            <Link href="/en_gallery" className="mobile-menu__lang-btn" onClick={() => setMenuOpen(false)}>ENG</Link>
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
          src={STOCK.hall_1}
          alt="MAKAN кафесінің залы: кірпіш қабырғалар, былғары дивандар мен жылы жарық"
          fill
          priority
          sizes="100vw"
          className="hero__img"
          style={{ objectFit: 'cover', objectPosition: HERO_IMAGE_FOCUS }}
        />
        <div className="hero__scrim" />
        <div className="hero__content">
          <p className="eyebrow">Галерея</p>
          <h1 className="hero__title">
            Мұнда <em>шын мәнінде</em> қалай
          </h1>
          <p className="hero__text">
            Ешқандай жасандылықсыз — зал, бөлшектер мен үстел қонақтар күнде көретіндей қалпында.
          </p>
        </div>
      </section>

      <div className="marquee" aria-hidden="true">
        <div className="marquee__track">
          {Array.from({ length: 2 }).map((_, rep) => (
            <span className="marquee__group" key={rep}>
              {['MAKAN', 'Зал', 'Интерьер бөлшектері', 'Жылы жарық', 'Атмосфера'].map((w) => (
                <span className="marquee__item" key={w}>
                  {w}
                  <Swash className="marquee__swash" />
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* 2. СҮЗГІ + СЕТКА */}
      <section className="gallery">
        <Reveal>
          <p className="eyebrow eyebrow--center">Фотосуреттер</p>
          <h2 className="gallery__title">Жақынырақ қарау үшін таңдаңыз</h2>
        </Reveal>

        <Reveal className="gallery__filters-wrap">
          <div className="gallery__filters" role="tablist" aria-label="Фотосурет санаттары">
            {categories.map((c) => (
              <button
                key={c.key}
                type="button"
                role="tab"
                aria-selected={activeCategory === c.key}
                className={`gallery__filter ${activeCategory === c.key ? 'gallery__filter--active' : ''}`}
                onClick={() => setActiveCategory(c.key)}
              >
                {c.label}
              </button>
            ))}
          </div>
        </Reveal>

        <div className="masonry">
          {filtered.map((photo, i) => (
            <button
              type="button"
              key={`${photo.src}-${photo.caption}`}
              className="masonry__item"
              style={{ aspectRatio: photo.aspect }}
              onClick={() => setLightboxIndex(i)}
              aria-label={`Фотоны ашу: ${photo.caption}`}
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                sizes="(max-width: 700px) 90vw, (max-width: 1100px) 45vw, 30vw"
                className="masonry__img"
              />
              <span className="masonry__scrim" aria-hidden="true" />
              <span className="masonry__caption">{photo.caption}</span>
            </button>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="gallery__empty">Бұл санатта әлі фотосуреттер жоқ.</p>
        )}
      </section>

      {/* 3. ЛАЙТБОКС */}
      {activePhoto && (
        <div
          className="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={activePhoto.caption}
          onClick={() => setLightboxIndex(null)}
        >
          <button
            type="button"
            className="lightbox__close"
            aria-label="Жабу"
            onClick={() => setLightboxIndex(null)}
          >
            ✕
          </button>

          <button
            type="button"
            className="lightbox__nav lightbox__nav--prev"
            aria-label="Алдыңғы фото"
            onClick={(e) => {
              e.stopPropagation();
              setLightboxIndex((i) => (i === null ? null : (i - 1 + filtered.length) % filtered.length));
            }}
          >
            ←
          </button>

          <div className="lightbox__frame" onClick={(e) => e.stopPropagation()}>
            <Image
              src={activePhoto.src}
              alt={activePhoto.alt}
              fill
              sizes="90vw"
              className="lightbox__img"
              style={{ objectFit: 'contain' }}
            />
          </div>

          <button
            type="button"
            className="lightbox__nav lightbox__nav--next"
            aria-label="Келесі фото"
            onClick={(e) => {
              e.stopPropagation();
              setLightboxIndex((i) => (i === null ? null : (i + 1) % filtered.length));
            }}
          >
            →
          </button>

          <p className="lightbox__caption">{activePhoto.caption}</p>
        </div>
      )}

      {/* 4. САЙТ БОЙЫНША АРЫ ҚАРАЙ */}
      <section className="explore">
        <Reveal>
          <p className="eyebrow eyebrow--center">Сайт бойынша ары қарай</p>
          <h2 className="gallery__title">Тереңірек бойлаңыз</h2>
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
            <p className="footer__tag">Дәмді тағамдар мен ұзағырақ аялдағың келетін атмосфера</p>
          </div>

          <div className="footer__col footer__col--meta">
            <p>{ADDRESS}</p>
            <p><a href={PHONE_HREF}>{PHONE}</a></p>
            <p>Күнделікті, 10:00 — 23:00</p>
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

        /* NAV — идентична главной странице */
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

        @media (max-width: 780px) {
          .nav__links { display: none; }
          .nav__toggle { display: block; }
        }

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

        /* HERO — короче, чем на главной: страница сразу переходит к делу */
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
        }
        .hero__title em { font-style: italic; font-weight: 600; color: var(--gold-light); }
        .hero__text { font-size: 1rem; line-height: 1.7; color: var(--parchment-dim); max-width: 46ch; margin: 0; font-weight: 300; }
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

        /* ГАЛЕРЕЯ */
        .gallery { padding: var(--space-section) 2rem; background: var(--ink); text-align: center; }
        .gallery__title {
          font-family: var(--font-display), serif; font-weight: 600;
          font-size: clamp(1.6rem, 3vw, 2.1rem); margin: 0 0 2.4rem; color: var(--parchment);
        }

        .gallery__filters-wrap { display: flex; justify-content: center; margin-bottom: 3rem; }
        .gallery__filters {
          display: inline-flex; gap: 0.6rem; padding: 0.35rem;
          border: 1px solid var(--hairline); flex-wrap: wrap; justify-content: center;
        }
        .gallery__filter {
          background: none; border: 0; cursor: pointer;
          padding: 0.55rem 1.2rem; font-family: var(--font-body), sans-serif;
          font-size: 0.74rem; letter-spacing: 0.12em; text-transform: uppercase;
          color: var(--parchment-dim); transition: color 0.2s ease, background 0.2s ease;
        }
        .gallery__filter:hover, .gallery__filter:focus-visible { color: var(--parchment); }
        .gallery__filter--active { color: var(--ink); background: var(--gold-light); }

        /* Масонри-сетка через CSS columns — три колонки на десктопе,
           карточки разной высоты (photo.aspect) создают неровный, живой ряд. */
        .masonry {
          column-count: 3; column-gap: 1.2rem;
          max-width: 1180px; margin: 0 auto; text-align: left;
        }
        .masonry__item {
          position: relative; display: block; width: 100%;
          break-inside: avoid; margin-bottom: 1.2rem;
          border: 0; padding: 0; cursor: zoom-in; background: var(--ink-soft);
          overflow: hidden;
        }
        .masonry__img { object-fit: cover; filter: saturate(0.88) brightness(0.9); transition: transform 0.6s ease, filter 0.4s ease; }
        .masonry__item:hover .masonry__img, .masonry__item:focus-visible .masonry__img {
          transform: scale(1.06); filter: saturate(0.95) brightness(0.75);
        }
        .masonry__scrim {
          position: absolute; inset: 0;
          background: linear-gradient(180deg, transparent 55%, rgba(10,8,6,0.85) 100%);
          opacity: 0; transition: opacity 0.35s ease;
        }
        .masonry__item:hover .masonry__scrim, .masonry__item:focus-visible .masonry__scrim { opacity: 1; }
        .masonry__caption {
          position: absolute; left: 1rem; right: 1rem; bottom: 0.9rem;
          font-family: var(--font-display), serif; font-style: italic; font-weight: 600;
          font-size: 0.92rem; color: var(--parchment);
          opacity: 0; transform: translateY(8px);
          transition: opacity 0.35s ease, transform 0.35s ease;
        }
        .masonry__item:hover .masonry__caption, .masonry__item:focus-visible .masonry__caption {
          opacity: 1; transform: translateY(0);
        }
        .masonry__item:focus-visible { outline: 2px solid var(--gold-light); outline-offset: 2px; }

        .gallery__empty { color: var(--parchment-dim); font-size: 0.95rem; margin-top: 2rem; }

        @media (max-width: 900px) {
          .masonry { column-count: 2; }
        }
        @media (max-width: 560px) {
          .masonry { column-count: 1; }
          .masonry__caption { opacity: 1; transform: none; }
          .masonry__scrim { opacity: 1; }
        }

        /* ЛАЙТБОКС */
        .lightbox {
          position: fixed; inset: 0; z-index: 80;
          background: rgba(8, 6, 5, 0.94);
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          padding: 2.5rem 1.2rem;
          animation: lightboxIn 0.25s ease;
        }
        @keyframes lightboxIn {
          from { opacity: 0; } to { opacity: 1; }
        }
        .lightbox__frame { position: relative; width: min(90vw, 1100px); height: min(75vh, 780px); }
        .lightbox__caption {
          margin: 1.4rem 0 0; font-family: var(--font-display), serif; font-style: italic;
          font-weight: 600; font-size: 1rem; color: var(--gold-light); text-align: center;
        }
        .lightbox__close {
          position: absolute; top: 1.4rem; right: 1.6rem; z-index: 2;
          background: none; border: 1px solid var(--hairline); color: var(--parchment);
          width: 2.6rem; height: 2.6rem; font-size: 1rem; cursor: pointer;
          transition: border-color 0.2s ease, color 0.2s ease;
        }
        .lightbox__close:hover, .lightbox__close:focus-visible { border-color: var(--gold-light); color: var(--gold-light); }
        .lightbox__nav {
          background: none; border: 1px solid var(--hairline); color: var(--parchment);
          width: 3rem; height: 3rem; font-size: 1.1rem; cursor: pointer; flex-shrink: 0;
          transition: border-color 0.2s ease, color 0.2s ease;
          margin: 0 1.2rem;
        }
        .lightbox__nav:hover, .lightbox__nav:focus-visible { border-color: var(--gold-light); color: var(--gold-light); }
        @media (max-width: 640px) {
          .lightbox { padding: 1.5rem 0.6rem; }
          .lightbox__frame { width: 100%; height: 58vh; }
          .lightbox__nav { width: 2.4rem; height: 2.4rem; margin: 0 0.5rem; }
          .lightbox__close { top: 0.8rem; right: 0.8rem; width: 2.3rem; height: 2.3rem; }
        }

        /* ДАЛЬШЕ ПО САЙТУ */
        .explore { padding: var(--space-section-sm) 2rem var(--space-section); background: var(--ink); text-align: center; }
.explore__list { max-width: 720px; margin: 3rem auto 0; text-align: center; }
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

        /* FOOTER — идентичен главной странице */
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
          .gallery, .explore {
            padding-left: 1.25rem; padding-right: 1.25rem;
          }
        }
      `}</style>
    </main>
  );
}