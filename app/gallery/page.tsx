'use client';

import { useEffect, useRef, useState, type MouseEvent as ReactMouseEvent, type ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Cormorant_Garamond, Manrope } from 'next/font/google';

/**
 * MAKAN — страница «Галерея»
 * =========================================================================
 * Сделана в той же визуальной системе, что и главная страница (page.tsx):
 * тот же тёмный фон, золото/бордо, тёплый свет, шрифты Cormorant Garamond
 * + Manrope, компоненты Reveal / Swash, живой статус «открыто/закрыто»,
 * та же навигация и футер.
 *
 * СТРУКТУРА:
 *  1. Hero        — короткий, фото на весь экран + заголовок
 *  2. Бегущая строка — как на главной, для паузы между блоками
 *  3. Фильтр + масонри-сетка — фотографии зала с категориями
 *  4. Лайтбокс     — открытие фото на весь экран, стрелки, Esc
 *  5. Дальше по сайту — переходы на Меню / Историю / Контакты
 *  6. Footer
 *
 * ФОТОГРАФИИ — ЗАМЕНИТЕ ПЕРЕД ПУБЛИКАЦИЕЙ:
 *  Как и на главной, ниже стоят временные стоковые фото с Unsplash (те же,
 *  что уже использовались на главной странице, чтобы стиль совпадал).
 *  Как только будут готовы реальные фото зала MAKAN — положите их в
 *  /public/images/gallery/ и замените ссылки в массиве `photos` на
 *  локальные пути вида '/images/gallery/hall-1.jpg'.
 *
 *  ВАЖНО про next/image + fill:
 *  У каждой карточки в сетке контейнер с фото — это обычный <div>,
 *  написанный прямо в этом файле (а не переданный как className в Reveal).
 *  Если обернуть <Image fill> в компонент Reveal через проп className,
 *  scoped-стили styled-jsx не применятся к обёртке Reveal (она рендерится
 *  в другом компоненте), и фото схлопнется в высоту 0. Поэтому Reveal
 *  здесь используется только для текстовых блоков, а не для фото.
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

const ADDRESS = 'г. Талгар, ул. Гагарина 67';
const PHONE = '+7 708 605 9354';
const PHONE_HREF = 'tel:+77086059354';
const INSTAGRAM = 'https://www.instagram.com/makan_talgar/';
const WHATSAPP = 'https://wa.me/77086059354';

// Временные стоковые фото — те же источники, что и на главной странице,
// чтобы визуально всё было в одном стиле. Замените на реальные кадры зала.
const STOCK = {
  hero: '/images/makan-hero1.jpg',
  about: 'https://images.unsplash.com/photo-1753873555674-1d6698c7537b?q=80&w=1400&auto=format&fit=crop',
  feature1: 'https://images.unsplash.com/photo-1744561249162-c597c1670032?q=80&w=1200&auto=format&fit=crop',
  feature2: 'https://images.unsplash.com/photo-1770541025973-dfc3c4c23fad?q=80&w=1200&auto=format&fit=crop',
  gallerySide: 'https://images.unsplash.com/photo-1759301495161-31027c795358?q=80&w=1200&auto=format&fit=crop',
  menuTeaser: 'https://images.unsplash.com/photo-1743034193060-8332b1fec210?q=80&w=1200&auto=format&fit=crop',
};

const HERO_IMAGE_FOCUS = 'center 30%';

type Category = 'hall' | 'details' | 'table';

const categories: { key: Category | 'all'; label: string }[] = [
  { key: 'all', label: 'Все' },
  { key: 'hall', label: 'Зал' },
  { key: 'details', label: 'Детали' },
  { key: 'table', label: 'На столе' },
];

// aspect — задаёт «рост» карточки в масонри-сетке, чтобы ряд не выглядел
// типовой плиткой; чередование форматов имитирует разложенные снимки.
const photos: {
  src: string;
  alt: string;
  caption: string;
  category: Category;
  aspect: string;
}[] = [
  { src: STOCK.hero, alt: 'Общий вид зала MAKAN', caption: 'Столик у окна занимают первым', category: 'hall', aspect: '4 / 5' },
  { src: STOCK.feature1, alt: 'Тёплый свет и латунные светильники в зале', caption: 'Свет здесь никогда не бывает резким', category: 'hall', aspect: '1 / 1' },
  { src: STOCK.feature2, alt: 'Диваны цвета вина и тёмно-зелёная обивка', caption: 'Кожа цвета вина встречает гостя с порога', category: 'hall', aspect: '3 / 4' },
  { src: STOCK.about, alt: 'Кирпичная стена и тёплый свет в интерьере', caption: 'Кирпич и латунь — фон, который не объясняют', category: 'details', aspect: '4 / 3' },
  { src: STOCK.gallerySide, alt: 'Диван и тёплый свет за угловым столиком', caption: 'Здесь задерживаются дольше, чем планировали', category: 'details', aspect: '1 / 1' },
  { src: STOCK.menuTeaser, alt: 'Кофе с латте-артом на столе', caption: 'Утро начинается с этой чашки', category: 'table', aspect: '4 / 5' },
  { src: STOCK.feature1, alt: 'Деталь потолка и подвесной свет', caption: 'Свет расставлен так же тщательно, как стол', category: 'details', aspect: '3 / 4' },
  { src: STOCK.about, alt: 'Ковёр на кирпичной стене', caption: 'Ковёр помнит больше разговоров, чем мы', category: 'details', aspect: '1 / 1' },
  { src: STOCK.gallerySide, alt: 'Сервированный стол у окна', caption: 'Стол накрыт для тех, кто никуда не спешит', category: 'table', aspect: '4 / 3' },
  { src: STOCK.feature2, alt: 'Тёмно-зелёная обивка кресла крупным планом', caption: 'Оттенки, которые не просто обставляют зал', category: 'hall', aspect: '4 / 5' },
  { src: STOCK.menuTeaser, alt: 'Десерт и напиток на столе', caption: 'Ради этого сюда возвращаются', category: 'table', aspect: '1 / 1' },
  { src: STOCK.hero, alt: 'Зал MAKAN вечером', caption: 'Вечер, который не хочется торопить', category: 'hall', aspect: '3 / 4' },
];

const explore = [
  { label: 'Меню', href: '/menu', text: 'Блюда и напитки, которые мы подаём каждый день.' },
  { label: 'История', href: '/history', text: 'Как появилось кафе и почему оно выглядит именно так.' },
  { label: 'Контакты', href: '/#contacts', text: 'Адрес, часы работы и как до нас добраться.' },
];

const navLinks = [
  { href: '/', label: 'Главная' },
  { href: '/menu', label: 'Меню' },
  { href: '/gallery', label: 'Галерея' },
  { href: '/history', label: 'История' },
  { href: '/#contacts', label: 'Контакты' },
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
        setStatus({ open: true, text: `Открыто · до ${formatHour(close)}` });
      } else {
        const nextOpen = t < open ? open : WEEKLY_HOURS[(day + 1) % 7][0];
        setStatus({ open: false, text: `Закрыто · с ${formatHour(nextOpen)}` });
      }
    };
    compute();
    const id = setInterval(compute, 60000);
    return () => clearInterval(id);
  }, []);

  return status;
}

/** Волнистая линия из логотипа — тот же узнаваемый узор, что и на главной. */
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

/** Плавное появление секций при скролле — используется только для текстовых
 *  блоков (см. комментарий про Reveal + fill в шапке файла). */
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

  // Блокируем скролл страницы, пока открыто мобильное меню или лайтбокс
  useEffect(() => {
    document.body.style.overflow = menuOpen || lightboxIndex !== null ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen, lightboxIndex]);

  // Esc / стрелки для лайтбокса
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

  // Если фильтр меняется, пока лайтбокс открыт, индекс может выйти за
  // пределы нового списка — закрываем, чтобы не показывать не то фото.
  useEffect(() => {
    setLightboxIndex(null);
  }, [activeCategory]);

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
          <nav className="nav__links" aria-label="Основная навигация">
            <Link href="/" className="nav__link">Главная</Link>
            <Link href="/menu" className="nav__link">Меню</Link>
            <Link href="/gallery" className="nav__link nav__link--active">Галерея</Link>
            <Link href="/history" className="nav__link">История</Link>
            <Link href="/#contacts" className="nav__link nav__link--cta">Контакты</Link>
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
            aria-label={menuOpen ? 'Закрыть меню' : 'Открыть меню'}
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
        <nav className="mobile-menu__links" aria-label="Мобильная навигация">
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
          alt="Зал кафе MAKAN: кирпичные стены, кожаные диваны и тёплый свет"
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
            Как здесь <em>на самом деле</em>
          </h1>
          <p className="hero__text">
            Никакой постановки — зал, детали и стол такими, какими их видят гости каждый день.
          </p>
        </div>
      </section>

      <div className="marquee" aria-hidden="true">
        <div className="marquee__track">
          {Array.from({ length: 2 }).map((_, rep) => (
            <span className="marquee__group" key={rep}>
              {['MAKAN', 'Зал', 'Детали интерьера', 'Тёплый свет', 'Атмосфера'].map((w) => (
                <span className="marquee__item" key={w}>
                  {w}
                  <Swash className="marquee__swash" />
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* 2. ФИЛЬТР + СЕТКА */}
      <section className="gallery">
        <Reveal>
          <p className="eyebrow eyebrow--center">Фотографии</p>
          <h2 className="gallery__title">Выберите, что рассмотреть ближе</h2>
        </Reveal>

        <Reveal className="gallery__filters-wrap">
          <div className="gallery__filters" role="tablist" aria-label="Категории фотографий">
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
              aria-label={`Открыть фото: ${photo.caption}`}
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
          <p className="gallery__empty">В этой категории пока нет фотографий.</p>
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
            aria-label="Закрыть"
            onClick={() => setLightboxIndex(null)}
          >
            ✕
          </button>

          <button
            type="button"
            className="lightbox__nav lightbox__nav--prev"
            aria-label="Предыдущее фото"
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
            aria-label="Следующее фото"
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

      {/* 4. ДАЛЬШЕ ПО САЙТУ */}
      <section className="explore">
        <Reveal>
          <p className="eyebrow eyebrow--center">Дальше по сайту</p>
          <h2 className="gallery__title">Погрузитесь глубже</h2>
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
            <p className="footer__tag">Кофе, десерты и атмосфера, в которой хочется задержаться</p>
          </div>

          <div className="footer__col footer__col--meta">
            <p>{ADDRESS}</p>
            <p><a href={PHONE_HREF}>{PHONE}</a></p>
            <p>Ежедневно, 10:00 — 23:00</p>
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
  font-size: 0.9rem;
  font-style: italic;
  color: var(--gold);
  opacity: 0.6;
  margin-right: 0.4rem;
  font-variant-numeric: lining-nums;
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
        .explore__list { max-width: 900px; margin: 3rem auto 0; text-align: left; }
        .explore__row {
          position: relative; display: grid;
          grid-template-columns: 2.8rem 1fr auto; align-items: center; gap: 1.4rem;
          padding: 1.9rem 0; text-decoration: none;
          border-top: 1px solid var(--hairline);
        }
        .explore__list .explore__row:last-child { border-bottom: 1px solid var(--hairline); }
        .explore__row::after {
          content: ''; position: absolute; left: 0; right: 0; bottom: -1px; height: 1px;
          background: var(--gold-light); transform: scaleX(0); transform-origin: left;
          transition: transform 0.6s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .explore__row:hover::after, .explore__row:focus-visible::after { transform: scaleX(1); }
        .explore__row-index {
          font-family: var(--font-display), serif; font-style: italic; font-weight: 500;
          font-size: 0.95rem; color: var(--gold); opacity: 0.55;
          transition: opacity 0.3s ease, color 0.3s ease;
        }
        .explore__row:hover .explore__row-index { opacity: 1; color: var(--gold-light); }
        .explore__row-content { display: flex; flex-direction: column; gap: 0.45rem; min-width: 0; }
        .explore__row-title {
          font-family: var(--font-display), serif; font-weight: 600;
          font-size: clamp(1.6rem, 3.2vw, 2.3rem); color: var(--parchment);
          transition: transform 0.5s cubic-bezier(0.22, 1, 0.36, 1), color 0.3s ease;
        }
        .explore__row:hover .explore__row-title { transform: translateX(0.55rem); color: var(--gold-light); }
        .explore__row-text { font-size: 0.86rem; color: var(--parchment-dim); font-weight: 300; max-width: 34ch; }
        .explore__row-arrow {
          font-size: 1.2rem; color: var(--gold-light);
          opacity: 0; transform: translateX(-10px);
          transition: opacity 0.4s ease, transform 0.5s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .explore__row:hover .explore__row-arrow, .explore__row:focus-visible .explore__row-arrow { opacity: 1; transform: translateX(0); }
        @media (max-width: 640px) {
          .explore__row { grid-template-columns: 2.2rem 1fr auto; gap: 1rem; padding: 1.3rem 0; }
          .explore__row-title { font-size: 1.2rem; }
          .explore__row-text { display: none; }
          .explore__row-arrow { opacity: 1; transform: none; }
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