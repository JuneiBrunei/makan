'use client';

import { useEffect, useRef, useState, type MouseEvent as ReactMouseEvent, type ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Cormorant_Garamond, Manrope } from 'next/font/google';

/**
 * MAKAN — страница «История»
 * =========================================================================
 * Та же визуальная система, что на главной и в галерее: тёмный фон,
 * золото/бордо, Cormorant Garamond + Manrope, Reveal / Swash, живой
 * статус «открыто/закрыто», одинаковые nav и footer.
 *
 * ДВЕ УНИКАЛЬНЫЕ ФИЧИ ЭТОЙ СТРАНИЦЫ (их нет ни на главной, ни в галерее):
 *  1. «Письмо» — светлая карточка цвета пергамента на тёмном фоне,
 *     стилизованная под рукописную записку. Единственное на весь сайт
 *     светлое пятно — работает как акцент, а не украшение.
 *  2. Вертикальная хронология (timeline) с чередованием карточек
 *     слева/справа и годами-метками. Нумерация/даты здесь оправданы —
 *     в отличие от остальных секций сайта, история действительно
 *     линейна и хронологична.
 *  3. Слайдер «До / После» — фото до и после ремонта, которое гость
 *     раскрывает перетаскиванием ползунка.
 *
 * СОДЕРЖАНИЕ — ЗАМЕНИТЕ ПЕРЕД ПУБЛИКАЦИЕЙ:
 *  Годы, факты и текст письма ниже — черновая, придуманная канва
 *  («идея → помещение → ремонт → открытие»), чтобы страница не была
 *  пустой. Замените на реальную историю MAKAN: настоящие даты,
 *  реальные детали ремонта и того, что было в здании раньше.
 *  Фото «до» и «после» — временные стоковые (см. STOCK ниже), при
 *  наличии реальных архивных снимков ремонта — замените на них.
 *
 * ВАЖНО про next/image + fill (тот же принцип, что и в gallery/page.tsx):
 *  Каждый контейнер с fill-картинкой — обычный <div>, написанный прямо
 *  в этом файле. Ему НИКОГДА не передаётся критичный для позиционирования
 *  класс через `<Reveal className="...">` — иначе scoped-стили styled-jsx
 *  не применятся (Reveal рендерит свой div в другом компоненте), и фото
 *  схлопнется в высоту 0. Reveal здесь всегда оборачивает уже готовый,
 *  самостоятельно стилизованный блок, а не наоборот.
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

// Временные стоковые фото — те же источники, что и на остальных страницах.
const STOCK = {
  hero: '/images/makan-hero1.jpg',
  before: 'https://images.unsplash.com/photo-1770541025973-dfc3c4c23fad?q=80&w=1400&auto=format&fit=crop',
  after: 'https://images.unsplash.com/photo-1753873555674-1d6698c7537b?q=80&w=1400&auto=format&fit=crop',
};

const HERO_IMAGE_FOCUS = 'center 30%';

// Черновая хронология — замените на реальные даты и факты.
const milestones = [
  {
    year: '2019',
    title: 'Идея',
    text: 'Мысль о месте, где не смотрят на часы, родилась за разговором о кухне, которая объединяет Кавказ, Европу и Восток в одном меню.',
  },
  {
    year: '2020',
    title: 'Помещение',
    text: 'Нашли кирпичное здание в центре Талгара — с высокими потолками и историей, которую не хотелось прятать под штукатуркой.',
  },
  {
    year: '2021',
    title: 'Реставрация',
    text: 'Полгода восстановления: кирпич очищали вручную, латунь и кожаные диваны заказывали по эскизам, ковры искали по всему городу.',
  },
  {
    year: '2022',
    title: 'Открытие',
    text: 'Двери MAKAN открылись для первых гостей — с меню, где встретились шашлык, десерты и авторский кофе.',
  },
  {
    year: 'Сегодня',
    title: 'Продолжение',
    text: 'Место, куда возвращаются не за скоростью, а за атмосферой — и куда каждый год добавляется что-то новое.',
  },
];

const explore = [
  { label: 'Меню', href: '/menu', text: 'Блюда и напитки, которые мы подаём каждый день.' },
  { label: 'Галерея', href: '/gallery', text: 'Зал, детали интерьера и атмосфера MAKAN.' },
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
          <nav className="nav__links" aria-label="Основная навигация">
            <Link href="/" className="nav__link">Главная</Link>
            <Link href="/menu" className="nav__link">Меню</Link>
            <Link href="/gallery" className="nav__link">Галерея</Link>
            <Link href="/history" className="nav__link nav__link--active">История</Link>
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
          alt="Зал кафе MAKAN сегодня: кирпичные стены, кожаные диваны и тёплый свет"
          fill
          priority
          sizes="100vw"
          className="hero__img"
          style={{ objectFit: 'cover', objectPosition: HERO_IMAGE_FOCUS }}
        />
        <div className="hero__scrim" />
        <div className="hero__content">
          <p className="eyebrow">История</p>
          <h1 className="hero__title">
            От <em>пустых стен</em> до места, где задерживаются
          </h1>
          <p className="hero__text">
            Как здание в центре Талгара стало кафе, куда приходят не за скоростью, а за атмосферой.
          </p>
        </div>
      </section>

      <div className="marquee" aria-hidden="true">
        <div className="marquee__track">
          {Array.from({ length: 2 }).map((_, rep) => (
            <span className="marquee__group" key={rep}>
              {['MAKAN', 'С 2022 года', 'Кирпич и латунь', 'Реставрация вручную', 'Гостеприимство'].map((w) => (
                <span className="marquee__item" key={w}>
                  {w}
                  <Swash className="marquee__swash" />
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* 2. ПИСЬМО — единственное светлое пятно на весь сайт */}
      <section className="letter-section">
        <Reveal>
          <div className="letter">
            <span className="letter__seal" aria-hidden="true">M</span>
            <Swash className="letter__swash" />
            <p className="letter__eyebrow">Несколько слов от нас</p>
            <p className="letter__text">
              Мы не хотели открывать ещё одно кафе с типовым интерьером.
              Хотелось места, где кирпич остаётся кирпичом, а не прячется
              за гипсокартоном — и где гостя встречают так, будто он уже
              свой.
            </p>
            <p className="letter__text">
              Дальше — то, как это получилось: от идеи до дверей, которые
              теперь открыты каждый день.
            </p>
            <p className="letter__sign">— команда MAKAN</p>
          </div>
        </Reveal>
      </section>

      {/* 3. ХРОНОЛОГИЯ */}
      <section className="timeline">
        <Reveal>
          <p className="eyebrow eyebrow--center">Хроника</p>
          <h2 className="section-title">Как всё начиналось</h2>
        </Reveal>

        <div className="timeline__list">
          <span className="timeline__line" aria-hidden="true" />
          {milestones.map((m, i) => (
            <div
              className={`timeline__item ${i % 2 === 0 ? 'timeline__item--left' : 'timeline__item--right'}`}
              key={m.year}
            >
              <span className="timeline__dot" aria-hidden="true" />
              <Reveal>
                <div className="timeline__card">
                  <span className="timeline__year">{m.year}</span>
                  <h3 className="timeline__title">{m.title}</h3>
                  <p className="timeline__text">{m.text}</p>
                </div>
              </Reveal>
            </div>
          ))}
        </div>
      </section>

      {/* 4. ДО / ПОСЛЕ */}
      <section className="compare-section">
        <Reveal>
          <p className="eyebrow eyebrow--center">Ремонт</p>
          <h2 className="section-title">Перетащите, чтобы увидеть разницу</h2>
        </Reveal>

        <Reveal>
          <div className="compare">
            <div className="compare__frame">
              <Image
                src={STOCK.before}
                alt="Помещение до ремонта: голые стены и пустое пространство"
                fill
                sizes="(max-width: 900px) 92vw, 800px"
                className="compare__img"
              />
              <div className="compare__after" style={{ clipPath: `inset(0 0 0 ${reveal}%)` }}>
                <Image
                  src={STOCK.after}
                  alt="Тот же зал после ремонта: кирпич, латунь и тёплый свет"
                  fill
                  sizes="(max-width: 900px) 92vw, 800px"
                  className="compare__img"
                />
              </div>

              <span className="compare__label compare__label--before">До</span>
              <span className="compare__label compare__label--after">После</span>

              <span className="compare__handle" style={{ left: `${reveal}%` }} aria-hidden="true">
                <span className="compare__handle-grip">↔</span>
              </span>

              <input
                type="range"
                min={0}
                max={100}
                value={reveal}
                onChange={(e) => setReveal(Number(e.target.value))}
                className="compare__slider"
                aria-label="Ползунок сравнения до и после ремонта"
              />
            </div>
          </div>
        </Reveal>
      </section>

      {/* 5. ДАЛЬШЕ ПО САЙТУ */}
      <section className="explore">
        <Reveal>
          <p className="eyebrow eyebrow--center">Дальше по сайту</p>
          <h2 className="section-title">Погрузитесь глубже</h2>
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

        /* ДО / ПОСЛЕ */
        .compare-section { padding: var(--space-section-sm) 2rem var(--space-section); background: var(--ink-soft); border-top: 1px solid var(--hairline); border-bottom: 1px solid var(--hairline); }
        .compare { display: flex; justify-content: center; }
        .compare__frame {
          position: relative; width: min(100%, 800px); aspect-ratio: 16 / 10;
          overflow: hidden; border: 1px solid var(--hairline); cursor: ew-resize;
          touch-action: pan-y;
        }
        .compare__img { object-fit: cover; filter: saturate(0.88) brightness(0.85); }
        .compare__after { position: absolute; inset: 0; }
        .compare__label {
          position: absolute; top: 1rem; z-index: 2;
          font-size: 0.7rem; letter-spacing: 0.16em; text-transform: uppercase;
          color: var(--parchment); background: rgba(10, 8, 6, 0.55);
          padding: 0.35rem 0.7rem; pointer-events: none;
        }
        .compare__label--before { left: 1rem; }
        .compare__label--after { right: 1rem; }
        .compare__handle {
          position: absolute; top: 0; bottom: 0; z-index: 3;
          width: 2px; background: var(--gold-light); transform: translateX(-50%);
          display: flex; align-items: center; justify-content: center; pointer-events: none;
        }
        .compare__handle-grip {
          width: 2.6rem; height: 2.6rem; border-radius: 50%;
          background: var(--gold-light); color: var(--ink);
          display: flex; align-items: center; justify-content: center;
          font-size: 1rem; box-shadow: 0 6px 16px rgba(0, 0, 0, 0.4);
        }
        .compare__slider {
          position: absolute; inset: 0; width: 100%; height: 100%; z-index: 4;
          margin: 0; opacity: 0; cursor: ew-resize;
          -webkit-appearance: none; appearance: none;
        }
        .compare__slider::-webkit-slider-thumb { -webkit-appearance: none; width: 100%; height: 100%; }
        .compare__slider::-moz-range-thumb { width: 100%; height: 100%; border: 0; background: transparent; }
        @media (max-width: 640px) {
          .compare__frame { aspect-ratio: 4 / 5; }
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