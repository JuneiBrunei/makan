'use client';

import { useEffect, useRef, useState, type MouseEvent as ReactMouseEvent, type ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Cormorant_Garamond, Manrope } from 'next/font/google';

/**
 * MAKAN — главная страница
 * =========================================================================
 * СТРУКТУРА (сверху вниз, каждая секция отвечает на один вопрос гостя):
 *  1. Hero        — что это за место, с первого взгляда
 *  2. О нас        — атмосфера и характер места (+ цитата)
 *  3. Атмосфера     — состав зала как визуальное уравнение (фото + фото + фото = MAKAN)
 *  4. Галерея       — "стол" с разбросанными карточками-фото, на мобильных — лента со скролл-снапом
 *  5. Контакты      — адрес, телефон, часы, карта
 *  6. Дальше по сайту — переходы на Меню / Галерею / Историю
 *  7. Footer
 *
 * ФОТОГРАФИИ — ЗАМЕНИТЕ ПЕРЕД ПУБЛИКАЦИЕЙ:
 *  Раньше здесь были ссылки на /public/images/makan-interior.jpg и
 *  makan-interior-detail-1.jpg — этих файлов физически не было в проекте,
 *  из-за чего сайт падал с ошибкой "isn't a valid image". Временно везде
 *  подставлены рабочие стоковые фото (см. список ниже). Как только появятся
 *  реальные кадры зала MAKAN — положите их в /public/images/ и верните
 *  локальные пути вместо STOCK.hero / STOCK.detail.
 *
 *  Временные стоковые (Unsplash, лицензия позволяет использовать бесплатно,
 *  но это ЧУЖОЙ интерьер — только для демонстрации вёрстки, вставьте свои):
 *   - about:    Kris Tian, "Cozy cafe interior with brick and light"
 *   - feature1: Raymond Yeung, "A cozy restaurant interior with string lights"
 *   - feature2: Andy Kennedy, "Luxurious bar interior with red velvet seating"
 *   - gallery:  Nimal Mathew, "Cozy booth seating with warm lighting in a cafe"
 *   - menu-teaser: Shafia Rizvi, "Coffee with latte art, spoon and napkin"
 *   - hero / detail: временно переиспользуют about и feature1 (см. STOCK ниже)
 *  (все — Unsplash License, unsplash.com/license)
 *
 * ВАЖНО: next/image используется и для стоковых фото с images.unsplash.com —
 * добавьте домен в next.config.js, иначе будет ошибка сборки:
 *   const nextConfig = {
 *     images: { remotePatterns: [{ protocol: 'https', hostname: 'images.unsplash.com' }] },
 *   };
 * Когда замените стоки на свои локальные фото — эту настройку можно убрать.
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
const MAP_QUERY = encodeURIComponent('Талгар, ул. Гагарина 67');

// Временные стоковые фото (см. комментарий вверху файла — заменить на свои)
const STOCK = {
  about: 'https://images.unsplash.com/photo-1753873555674-1d6698c7537b?q=80&w=1400&auto=format&fit=crop',
  feature1: 'https://images.unsplash.com/photo-1744561249162-c597c1670032?q=80&w=1200&auto=format&fit=crop',
  feature2: 'https://images.unsplash.com/photo-1770541025973-dfc3c4c23fad?q=80&w=1200&auto=format&fit=crop',
  gallerySide: 'https://images.unsplash.com/photo-1759301495161-31027c795358?q=80&w=1200&auto=format&fit=crop',
  menuTeaser: 'https://images.unsplash.com/photo-1743034193060-8332b1fec210?q=80&w=1200&auto=format&fit=crop',
  // Временная замена для отсутствующих локальных файлов makan-interior*.jpg —
  // как появятся реальные фото зала, замените на локальные пути.
  hero: 'https://images.unsplash.com/photo-1744561249162-c597c1670032?q=80&w=1600&auto=format&fit=crop',
  detail: 'https://images.unsplash.com/photo-1753873555674-1d6698c7537b?q=80&w=1400&auto=format&fit=crop',
};

/** Волнистая линия из логотипа — единственный узнаваемый узор страницы. Используется точечно. */
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

/** Плавное появление секций при скролле, без внешних зависимостей */
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

const features = [
  {
    title: 'Кирпич и латунь',
    text: 'Тёплая кладка, тёмный потолок и матовая латунь — фон, который не нуждается в объяснениях.',
    image: STOCK.feature1,
    alt: 'Тёплый свет, деревянные балки и латунные светильники в зале',
  },
  {
    title: 'Кожа цвета вина',
    text: 'Глубокий бордо и тёмная зелень диванов — оттенки, которые встречают гостя, а не просто обставляют зал.',
    image: STOCK.feature2,
    alt: 'Диваны цвета вина и тёмно-зелёная обивка в приглушённом свете',
  },
  {
    title: 'Ковры на стенах',
    text: 'Тканые узоры и подвесной свет вместо картин — деталь, которая держит атмосферу, а не украшает её.',
    image: STOCK.detail,
    alt: 'Тканый ковёр на кирпичной стене и подвесной светильник',
  },
];

const gallery = [
  { src: STOCK.hero, alt: 'Общий вид зала MAKAN', caption: 'Столик у окна занимают первым' },
  { src: STOCK.gallerySide, alt: 'Диван и тёплый свет за угловым столиком', caption: 'Здесь задерживаются дольше, чем планировали' },
  { src: STOCK.detail, alt: 'Деталь интерьера: свет и текстиль', caption: 'Ковёр помнит больше разговоров, чем мы' },
  { src: STOCK.feature1, alt: 'Тёплый свет и латунные светильники в зале', caption: 'Свет здесь никогда не бывает резким' },
];

const explore = [
  { label: 'Меню', href: '/menu', text: 'Блюда и напитки, которые мы подаём каждый день.', thumb: STOCK.menuTeaser },
  { label: 'Галерея', href: '/gallery', text: 'Зал, детали интерьера и атмосфера MAKAN.', thumb: STOCK.gallerySide },
  { label: 'История', href: '/history', text: 'Как появилось кафе и почему оно выглядит именно так.', thumb: STOCK.about },
];

const hours = [
  { day: 'Понедельник — Воскресенье', time: '10:00 — 23:00' },
];

const navLinks = [
  { href: '/', label: 'Главная' },
  { href: '/menu', label: 'Меню' },
  { href: '/gallery', label: 'Галерея' },
  { href: '/history', label: 'История' },
  { href: '#contacts', label: 'Контакты' },
];

// Часы работы для живого статуса "открыто/закрыто" — те же данные, что в
// блоке `hours` выше, но по дням недели (0 = вс … 6 = сб) для расчёта в JS.
// close: 24 значит "до полуночи".
const WEEKLY_HOURS: Record<number, [number, number]> = {
  0: [10, 22], // воскресенье
  1: [9, 23],
  2: [9, 23],
  3: [9, 23],
  4: [9, 23],
  5: [9, 24],
  6: [9, 24],
};

function formatHour(h: number) {
  return `${String(h % 24).padStart(2, '0')}:00`;
}

/** Живой статус "открыто/закрыто сейчас", посчитанный по фактическому времени гостя. */
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

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [exploreActive, setExploreActive] = useState<number | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [progress, setProgress] = useState(0);
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

  // Тёплое пятно света, следующее за курсором — как свеча на столе. Только
  // для устройств с мышью: на тач-экранах эффект бессмысленен и отключается CSS-медиа-запросом.
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      spotlightRef.current?.style.setProperty('--x', `${e.clientX}px`);
      spotlightRef.current?.style.setProperty('--y', `${e.clientY}px`);
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  // Блокируем скролл страницы, пока открыто полноэкранное мобильное меню
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  /** Лёгкое "магнитное" притяжение кнопки к курсору — работает только при наведении мышью. */
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
            <Link href="/" className="nav__link nav__link--active">Главная</Link>
            <Link href="/menu" className="nav__link">Меню</Link>
            <Link href="/gallery" className="nav__link">Галерея</Link>
            <Link href="/history" className="nav__link">История</Link>
            <a href="#contacts" className="nav__link nav__link--cta">Контакты</a>
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

      {/* Полноэкранное мобильное меню */}
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

      {/* 1. HERO — что это за место */}
      <section className="hero">
        <Image
          src={STOCK.hero}
          alt="Зал кафе MAKAN: кирпичные стены, кожаные диваны бордового и зелёного цвета, тёплый свет"
          fill
          priority
          sizes="100vw"
          className="hero__img"
        />
        <div className="hero__scrim" />
        <div className="hero__content">
          {status && (
            <span className={`hero__status ${status.open ? 'hero__status--open' : ''}`}>
              <span className="nav__status-dot" />
              {status.text}
            </span>
          )}
          <p className="eyebrow">Кафе в центре Алматы</p>
          <h1 className="hero__title">
            Место, где не смотрят на часы.
            <br />
            <em>Кофе, десерты и вечера, которые не хочется торопить.</em>
          </h1>
          <p className="hero__text">
            Кирпичные стены, тёплый свет и кожаные диваны — атмосфера,
            в которой хочется задержаться подольше.
          </p>
          <div className="hero__actions">
            <Link href="/menu" className="btn btn--solid" {...magnetProps}>Смотреть меню</Link>
            <a href="#contacts" className="btn btn--ghost" {...magnetProps}>Как нас найти</a>
          </div>
        </div>
        <div className="hero__scroll" aria-hidden="true">
          <span />
        </div>
      </section>

      {/* Бегущая строка — короткая пауза для глаза между hero и текстом */}
      <div className="marquee" aria-hidden="true">
        <div className="marquee__track">
          {Array.from({ length: 2 }).map((_, rep) => (
            <span className="marquee__group" key={rep}>
              {['Кирпич', 'Латунь', 'Кожа цвета вина', 'Кофе', 'Десерты', 'MAKAN'].map((w) => (
                <span className="marquee__item" key={w}>
                  {w}
                  <Swash className="marquee__swash" />
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* 2. О НАС — атмосфера и характер места + цитата внутри */}
      <section id="about" className="about">
        <div className="about__grid">
          <Reveal className="about__text-col">
            <p className="eyebrow">О нас</p>
            <h2 className="about__title">Место для тех, кто никуда не спешит</h2>
            <p className="about__text">
              MAKAN — кафе в самом сердце Алматы, где интерьер и подача выросли
              из одной идеи: гостя встречают неторопливо и щедро, будто он уже
              свой. Кирпич, тяжёлая кожа диванов, приглушённый свет и ковры на
              стенах вместо картин — детали, которые держат атмосферу.
            </p>
            <p className="about__text">
              Кофе, десерты и авторское меню — то, ради чего сюда возвращаются
              снова и снова.
            </p>
            <blockquote className="about__quote">
              <Swash className="about__quote-swash" />
              «Хороший стол — это время, которое не хочется торопить.
              Мы просто даём гостю на него столько, сколько нужно».
            </blockquote>
          </Reveal>
          <Reveal className="about__media">
            <Image
              src={STOCK.about}
              alt="Кирпичная стена и тёплый свет в интерьере кафе"
              fill
              sizes="(max-width: 900px) 100vw, 44vw"
              className="about__media-img"
            />
          </Reveal>
        </div>
      </section>

      {/* 3. АТМОСФЕРА — состав зала как визуальное уравнение, а не типовая сетка карточек */}
      <section className="formula">
        <Reveal>
          <p className="eyebrow eyebrow--center">Атмосфера</p>
          <h2 className="features__title">Из чего складывается зал</h2>
        </Reveal>
        <div className="formula__row">
          {features
            .map((f, i) => (
              <Reveal key={f.title} className="formula__item">
                <div className="formula__frame">
                  <Image src={f.image} alt={f.alt} fill sizes="(max-width: 640px) 70vw, 220px" />
                  <span className="formula__index" aria-hidden="true">0{i + 1}</span>
                </div>
                <h3 className="formula__item-title">{f.title}</h3>
                <p className="formula__item-text">{f.text}</p>
              </Reveal>
            ))
            .reduce<ReactNode[]>((acc, item, i) => {
              if (i > 0) {
                acc.push(
                  <span className="formula__op" aria-hidden="true" key={`op-${i}`}>+</span>
                );
              }
              acc.push(item);
              return acc;
            }, [])}
          <span className="formula__op formula__op--eq" aria-hidden="true">=</span>
          <Reveal className="formula__result">
            <Swash className="formula__result-swash" />
            <span className="formula__result-word">MAKAN</span>
            <span className="formula__result-sub">Атмосфера, которую узнаёшь с порога</span>
          </Reveal>
        </div>
      </section>

      {/* 4. ГАЛЕРЕЯ — не витрина, а стол с разбросанными карточками-фото на плёнке "как есть" */}
      <section className="real">
        <Reveal>
          <p className="eyebrow eyebrow--center">Зал</p>
          <h2 className="features__title">Как здесь на самом деле</h2>
        </Reveal>
        <div className="real__board">
          {gallery.map((g, i) => (
            <div className={`real__polaroid real__polaroid--${i + 1}`} key={g.alt}>
              <span className="real__tape" aria-hidden="true" />
              <div className="real__photo">
                <Image src={g.src} alt={g.alt} fill sizes="(max-width: 760px) 78vw, 170px" />
              </div>
              <p className="real__caption">{g.caption}</p>
            </div>
          ))}
        </div>
        <Link href="/gallery" className="real__link">
          Вся галерея →
        </Link>
      </section>

      {/* 5. КОНТАКТЫ */}
      <section id="contacts" className="contacts">
        <div className="contacts__grid">
          <Reveal className="contacts__info">
            <p className="eyebrow">Контакты</p>
            <h2 className="contacts__title">Приходите</h2>

            <dl className="contacts__list">
              <div className="contacts__row">
                <dt>Адрес</dt>
                <dd>{ADDRESS}</dd>
              </div>
              <div className="contacts__row">
                <dt>Телефон</dt>
                <dd>
                  <a href={PHONE_HREF}>{PHONE}</a>
                </dd>
              </div>
              <div className="contacts__row">
                <dt>Часы работы</dt>
                <dd>
                  {hours.map((h) => (
                    <span className="contacts__hours-row" key={h.day}>
                      <span>{h.day}</span>
                      <span>{h.time}</span>
                    </span>
                  ))}
                </dd>
              </div>
            </dl>

            <div className="contacts__actions">
              <a href={WHATSAPP} className="btn btn--solid" target="_blank" rel="noopener noreferrer" {...magnetProps}>
                Написать в WhatsApp
              </a>
              <a href={INSTAGRAM} className="btn btn--ghost" target="_blank" rel="noopener noreferrer" {...magnetProps}>
                Instagram
              </a>
            </div>
          </Reveal>

          <Reveal className="contacts__map-wrap">
            <iframe
              className="contacts__map"
              title="MAKAN на карте"
              src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d46458.795829963325!2d77.19963585900013!3d43.3001328!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38839d5342ea7abf%3A0x55966906347a055c!2z0JrQsNGE0LUgIk1BS0FOIg!5e0!3m2!1sru!2skz!4v1784189106432!5m2!1sru!2skz`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </Reveal>
        </div>
      </section>

      {/* 6. ДАЛЬШЕ ПО САЙТУ */}
      <section className="explore">
        <Reveal>
          <p className="eyebrow eyebrow--center">Дальше по сайту</p>
          <h2 className="features__title">Погрузитесь глубже</h2>
        </Reveal>

        <div className="explore__inner">
          <div className="explore__list" onMouseLeave={() => setExploreActive(null)}>
            {explore.map((e, i) => (
              <Link
                href={e.href}
                className={`explore__row ${exploreActive === i ? 'explore__row--active' : ''}`}
                key={e.label}
                onMouseEnter={() => setExploreActive(i)}
                onFocus={() => setExploreActive(i)}
              >
                <span className="explore__row-index">{String(i + 1).padStart(2, '0')}</span>
                <span className="explore__row-content">
                  <span className="explore__row-title">{e.label}</span>
                  <span className="explore__row-text">{e.text}</span>
                </span>
                <span className="explore__row-thumb">
                  <Image src={e.thumb} alt="" fill sizes="56px" />
                </span>
                <span className="explore__row-arrow" aria-hidden="true">→</span>
              </Link>
            ))}
          </div>

          <div className="explore__panel" aria-hidden="true">
            {explore.map((e, i) => (
              <div
                key={e.label}
                className={`explore__panel-img ${(exploreActive ?? 0) === i ? 'explore__panel-img--visible' : ''}`}
              >
                <Image src={e.thumb} alt="" fill sizes="(max-width: 900px) 0px, 38vw" />
              </div>
            ))}
            <div className="explore__panel-frame" />
          </div>
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
        /* Плёночное зерно поверх всего сайта — убирает "стерильность" стоковых
           градиентов и делает тёмный фон живым, как печатная фактура. */
        .grain {
          position: fixed; inset: 0; z-index: 90; pointer-events: none;
          opacity: 0.05; mix-blend-mode: overlay;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
        }

        /* Тёплое пятно света за курсором — как свеча на столе. Только для
           устройств с точным указателем (мышь); на тач-экранах отключено. */
        .spotlight {
          position: fixed; inset: 0; z-index: 5; pointer-events: none;
          background: radial-gradient(480px circle at var(--x, 50%) var(--y, 40%), rgba(217, 184, 120, 0.10), transparent 70%);
        }
        @media (hover: none), (pointer: coarse) { .spotlight { display: none; } }

        /* Тонкая золотая полоса прогресса прокрутки под шапкой */
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

        /* Живой индикатор "открыто/закрыто" — считается из реальных часов работы */
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

        /* Гамбургер — три линии, морфящиеся в крестик */
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

        /* Полноэкранное мобильное меню */
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
          display: flex; align-items: baseline; gap: 0.9rem;
          font-family: var(--font-display), serif; font-weight: 600;
          font-size: clamp(2rem, 9vw, 2.6rem); color: var(--parchment); text-decoration: none;
          padding: 0.55rem 0; border-bottom: 1px solid var(--hairline);
          opacity: 0; transform: translateY(14px);
          transition: opacity 0.5s ease, transform 0.5s cubic-bezier(0.22, 1, 0.36, 1), color 0.25s ease;
        }
        .mobile-menu--open .mobile-menu__link { opacity: 1; transform: translateY(0); }
        .mobile-menu__link:hover, .mobile-menu__link:focus-visible { color: var(--gold-light); }
        .mobile-menu__link-index { font-size: 0.9rem; font-style: italic; color: var(--gold); opacity: 0.6; }
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
        .hero { position: relative; min-height: 100vh; display: flex; align-items: flex-end; overflow: hidden; }
        .hero__img { object-fit: cover; filter: saturate(0.85) brightness(0.62); }
        .hero__scrim {
          position: absolute; inset: 0;
          background: linear-gradient(180deg, rgba(14,11,9,0.6) 0%, rgba(14,11,9,0.4) 38%, rgba(12,9,7,0.95) 100%);
        }
        .hero__content { position: relative; z-index: 2; max-width: 800px; padding: 0 2rem 7rem; margin: 0 auto; width: 100%; }
        .hero__status {
          display: inline-flex; align-items: center; gap: 0.55rem; margin-bottom: 1.2rem;
          font-size: 0.7rem; letter-spacing: 0.12em; text-transform: uppercase; color: var(--parchment-dim);
          padding: 0.4rem 0.85rem; border: 1px solid var(--hairline); border-radius: 999px;
        }
        .hero__status--open { color: var(--gold-light); border-color: rgba(217, 184, 120, 0.35); }
        .hero__title {
          font-family: var(--font-display), serif; font-weight: 600;
          font-size: clamp(2.3rem, 5.6vw, 4.2rem); line-height: 1.14;
          margin: 0 0 1.4rem; color: var(--parchment);
        }
        .hero__title em { font-style: italic; font-weight: 600; color: var(--gold-light); }
        .hero__text {
          font-size: 1.02rem; line-height: 1.7; color: var(--parchment-dim);
          max-width: 48ch; margin: 0 0 2.3rem; font-weight: 300;
        }
        .hero__actions { display: flex; gap: 1.1rem; flex-wrap: wrap; }
        .hero__actions :global(a) { will-change: transform; }
        @media (max-width: 640px) {
          .hero__content { padding: 0 1.4rem 5rem; }
          .hero__actions { gap: 0.8rem; }
          .hero__actions :global(.btn) { flex: 1 1 auto; justify-content: center; }
        }
        .hero__scroll {
          position: absolute; left: 50%; bottom: 2.2rem; transform: translateX(-50%);
          width: 1px; height: 34px; background: rgba(239,233,218,0.3); z-index: 2;
        }
        .hero__scroll span {
          position: absolute; top: 0; left: -1.5px; width: 4px; height: 4px; border-radius: 50%;
          background: var(--gold-light); animation: scrollDown 2.2s ease-in-out infinite;
        }
        @keyframes scrollDown {
          0% { top: 0; opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { top: 30px; opacity: 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          .hero__scroll span { animation: none; top: 14px; opacity: 0.7; }
        }

        .btn {
          display: inline-flex; align-items: center; gap: 0.5rem;
          padding: 0.9rem 1.9rem; font-size: 0.76rem; letter-spacing: 0.16em;
          text-transform: uppercase; text-decoration: none;
          transition: background 0.25s ease, color 0.25s ease, border-color 0.25s ease, transform 0.25s ease;
        }
        .btn--solid { background: transparent; color: var(--gold-light); border: 1px solid var(--gold); font-weight: 600; }
        .btn--solid:hover, .btn--solid:focus-visible { background: var(--gold); color: var(--ink); transform: translateY(-1px); }
        .btn--ghost { color: var(--parchment-dim); border: 1px solid rgba(239, 233, 218, 0.25); }
        .btn--ghost:hover, .btn--ghost:focus-visible { border-color: var(--gold-light); color: var(--gold-light); }
        .btn:focus-visible { outline: 2px solid var(--gold-light); outline-offset: 2px; }

        /* БЕГУЩАЯ СТРОКА — короткий визуальный акцент между hero и текстом */
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

        /* ABOUT (текст + фото + встроенная цитата) */
        .about { padding: var(--space-section) 2rem; background: var(--ink); }
        .about__grid {
          max-width: 1180px; margin: 0 auto;
          display: grid; grid-template-columns: 1fr 0.9fr; gap: 4rem; align-items: center;
        }
        .about__title {
          font-family: var(--font-display), serif; font-weight: 600;
          font-size: clamp(1.8rem, 3.2vw, 2.4rem); margin: 0 0 1.7rem; color: var(--parchment);
        }
        .about__text { font-size: 1rem; line-height: 1.85; color: var(--parchment-dim); margin: 0 0 1.2rem; font-weight: 300; }
        .about__quote {
          margin: 2rem 0 0; padding: 0 0 0 1.4rem; border-left: 2px solid var(--gold);
          font-family: var(--font-display), serif; font-style: italic; font-weight: 500;
          font-size: 1.2rem; line-height: 1.6; color: var(--gold-light); position: relative;
        }
        .about__quote-swash { display: none; }
        .about__media { position: relative; aspect-ratio: 4 / 5; overflow: hidden; }
        .about__media-img { object-fit: cover; filter: saturate(0.9) brightness(0.85); }
        @media (max-width: 900px) {
          .about__grid { grid-template-columns: 1fr; gap: 2.4rem; }
          .about__media { order: -1; aspect-ratio: 16 / 10; }
        }

        /* FEATURES */
        .features__title {
          font-family: var(--font-display), serif; font-weight: 600;
          font-size: clamp(1.6rem, 3vw, 2.1rem); margin: 0 0 3.5rem; color: var(--parchment);
        }

        /* FORMULA — состав зала как визуальное уравнение: фото + фото + фото = MAKAN */
        .formula { background: var(--ink-soft); padding: var(--space-section) 2rem; text-align: center; border-top: 1px solid var(--hairline); border-bottom: 1px solid var(--hairline); }
        .formula__row {
          max-width: 1100px; margin: 0 auto; display: flex; align-items: center; justify-content: center;
          gap: 0.6rem;
        }
        .formula__item { width: clamp(150px, 18vw, 220px); text-align: left; flex-shrink: 0; }
        .formula__frame { position: relative; width: 100%; aspect-ratio: 1 / 1; overflow: hidden; border: 1px solid var(--hairline); }
        .formula__frame :global(img) { object-fit: cover; filter: saturate(0.85) brightness(0.8); transition: transform 0.7s ease; }
        .formula__item:hover .formula__frame :global(img) { transform: scale(1.07); }
        .formula__index {
          position: absolute; top: -0.7rem; left: -0.7rem; width: 2.3rem; height: 2.3rem; z-index: 2;
          display: flex; align-items: center; justify-content: center; border-radius: 50%;
          background: var(--ink-soft); border: 1px solid var(--gold); color: var(--gold-light);
          font-family: var(--font-display), serif; font-style: italic; font-weight: 600; font-size: 0.95rem;
        }
        .formula__item-title { font-family: var(--font-display), serif; font-size: 1.05rem; font-weight: 600; margin: 1.5rem 0 0.6rem; color: var(--parchment); }
        .formula__item-text { font-size: 0.82rem; line-height: 1.6; color: var(--parchment-dim); margin: 0; font-weight: 300; }
        .formula__op {
          font-family: var(--font-display), serif; font-style: italic; font-weight: 600;
          font-size: clamp(1.8rem, 3vw, 2.6rem); color: var(--gold); flex-shrink: 0; line-height: 1;
          align-self: center; margin: 0 0.1rem;
        }
        .formula__op--eq { color: var(--gold-light); margin-left: 0.3rem; }
        .formula__result {
          width: clamp(150px, 18vw, 220px); flex-shrink: 0; display: flex; flex-direction: column;
          align-items: center; gap: 0.5rem; text-align: center;
        }
        .formula__result-swash { width: 70px; height: 12px; color: var(--gold); }
        .formula__result-word { font-family: var(--font-display), serif; font-style: italic; font-weight: 700; font-size: 1.7rem; color: var(--parchment); letter-spacing: 0.03em; }
        .formula__result-sub { font-size: 0.78rem; color: var(--parchment-dim); max-width: 20ch; font-weight: 300; }
        @media (max-width: 900px) {
          .formula__row { flex-wrap: wrap; row-gap: 2rem; }
        }
        @media (max-width: 640px) {
          .formula__row { flex-direction: column; align-items: center; gap: 1.4rem; }
          .formula__item, .formula__result { width: 100%; max-width: 280px; }
        }

        /* REAL — стол с разбросанными карточками-фото вместо витринной сетки.
           Простой flex-wrap с явной фиксированной шириной карточек — без
           CSS Grid и без анимации на весь блок, чтобы ничего не могло
           схлопнуться в невидимое состояние. */
        .real { position: relative; padding: var(--space-section) 2rem; background: var(--ink); text-align: center; }
        .real__board {
          display: flex; flex-wrap: wrap; align-items: flex-start; justify-content: center;
          gap: 2.2rem 1.6rem; max-width: 900px; margin: 3.4rem auto 3rem;
        }
        .real__polaroid {
          width: 170px; flex: 0 0 170px; background: var(--parchment);
          padding: 0.6rem 0.6rem 2rem; box-shadow: 0 16px 32px rgba(0, 0, 0, 0.45);
          transition: transform 0.45s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.35s ease;
        }
        .real__polaroid:hover, .real__polaroid:focus-within {
          transform: rotate(0deg) translateY(-8px) scale(1.06) !important;
          box-shadow: 0 24px 44px rgba(0, 0, 0, 0.55);
          z-index: 5;
        }
        .real__photo { position: relative; width: 100%; height: 212px; overflow: hidden; background: var(--ink); }
        .real__photo :global(img) { object-fit: cover; filter: saturate(0.9) brightness(0.92); }
        .real__caption {
          margin: 0.7rem 0 0; font-family: var(--font-display), serif; font-style: italic;
          font-weight: 600; font-size: 0.78rem; line-height: 1.3; color: var(--ink); text-align: center;
        }
        .real__tape {
          position: absolute; top: -0.6rem; left: 50%; width: 3.6rem; height: 1.2rem; z-index: 2;
          background: rgba(217, 184, 120, 0.55); transform: translateX(-50%) rotate(-2deg);
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
        }
        .real__polaroid--1 { transform: rotate(-5deg) translateY(8px); }
        .real__polaroid--2 { transform: rotate(4deg) translateY(-12px); }
        .real__polaroid--3 { transform: rotate(-4deg) translateY(-6px); }
        .real__polaroid--4 { transform: rotate(6deg) translateY(10px); }
        .real__link {
          display: inline-block; margin: 0 auto; max-width: 1200px;
          font-size: 0.76rem; letter-spacing: 0.14em; text-transform: uppercase;
          color: var(--gold-light); text-decoration: none; border-bottom: 1px solid var(--hairline);
          padding-bottom: 0.2rem; transition: border-color 0.2s ease;
        }
        .real__link:hover, .real__link:focus-visible { border-color: var(--gold-light); }
        @media (max-width: 760px) {
          .real__board {
            flex-wrap: nowrap; gap: 1.4rem;
            overflow-x: auto; scroll-snap-type: x mandatory; max-width: 100%;
            margin: 2.2rem -1rem 2rem; padding: 0.6rem 1rem 1.2rem;
            -webkit-overflow-scrolling: touch;
          }
          .real__polaroid,
          .real__polaroid--1,
          .real__polaroid--2,
          .real__polaroid--3,
          .real__polaroid--4 {
            transform: none; width: 78vw; max-width: 300px; flex: 0 0 78vw;
            scroll-snap-align: center;
          }
          .real__photo { height: 220px; }
          .real__polaroid:hover, .real__polaroid:focus-within { transform: none !important; box-shadow: 0 14px 28px rgba(0, 0, 0, 0.5); }
        }

        /* CONTACTS */
        .contacts { padding: var(--space-section) 2rem; background: var(--ink); }
        .contacts__grid { max-width: 1180px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1.1fr; gap: 3.5rem; align-items: stretch; }
        .contacts__title { font-family: var(--font-display), serif; font-weight: 600; font-size: clamp(1.8rem, 3.4vw, 2.5rem); margin: 0 0 2.2rem; color: var(--parchment); }
        .contacts__list { margin: 0 0 2.4rem; }
        .contacts__row { display: grid; grid-template-columns: 130px 1fr; gap: 1rem; padding: 1rem 0; border-top: 1px solid var(--hairline); }
        .contacts__row dt { font-size: 0.72rem; letter-spacing: 0.14em; text-transform: uppercase; color: var(--gold-light); font-weight: 600; }
        .contacts__row dd { margin: 0; color: var(--parchment-dim); font-weight: 300; line-height: 1.6; }
        .contacts__row a { color: var(--parchment-dim); text-decoration: none; border-bottom: 1px solid var(--hairline); }
        .contacts__row a:hover, .contacts__row a:focus-visible { color: var(--gold-light); border-color: var(--gold-light); }
        .contacts__hours-row { display: flex; justify-content: space-between; gap: 1rem; margin-bottom: 0.3rem; }
        .contacts__hours-row:last-child { margin-bottom: 0; }
        .contacts__actions { display: flex; gap: 1rem; flex-wrap: wrap; }
        .contacts__map-wrap { min-height: 320px; border: 1px solid var(--hairline); }
        .contacts__map { width: 100%; height: 100%; min-height: 320px; border: 0; filter: grayscale(0.3) contrast(1.05) brightness(0.9); }
        @media (max-width: 640px) {
          .contacts__row { grid-template-columns: 1fr; gap: 0.3rem; }
        }
        @media (max-width: 900px) {
          .contacts__grid { grid-template-columns: 1fr; }
          .contacts__map-wrap { min-height: 280px; }
        }

        /* EXPLORE — редакторский список с изображением, которое подгружается
           сбоку при наведении, вместо типовых карточек с картинкой сверху */
        .explore { padding: var(--space-section-sm) 2rem var(--space-section); background: var(--ink); text-align: center; }
        .explore__inner {
          max-width: 1180px; margin: 3.4rem auto 0; text-align: left;
          display: grid; grid-template-columns: 1.3fr 1fr; gap: 4rem; align-items: start;
        }
        .explore__list { display: flex; flex-direction: column; }
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
        .explore__row:hover::after, .explore__row:focus-visible::after, .explore__row--active::after { transform: scaleX(1); }
        .explore__row-index {
          font-family: var(--font-display), serif; font-style: italic; font-weight: 500;
          font-size: 0.95rem; color: var(--gold); opacity: 0.55;
          transition: opacity 0.3s ease, color 0.3s ease;
        }
        .explore__row:hover .explore__row-index, .explore__row--active .explore__row-index { opacity: 1; color: var(--gold-light); }
        .explore__row-content { display: flex; flex-direction: column; gap: 0.45rem; min-width: 0; }
        .explore__row-title {
          font-family: var(--font-display), serif; font-weight: 600;
          font-size: clamp(1.6rem, 3.2vw, 2.3rem); color: var(--parchment);
          transition: transform 0.5s cubic-bezier(0.22, 1, 0.36, 1), color 0.3s ease;
        }
        .explore__row:hover .explore__row-title, .explore__row--active .explore__row-title {
          transform: translateX(0.55rem); color: var(--gold-light);
        }
        .explore__row-text { font-size: 0.86rem; color: var(--parchment-dim); font-weight: 300; max-width: 34ch; }
        .explore__row-thumb { display: none; }
        .explore__row-arrow {
          font-size: 1.2rem; color: var(--gold-light);
          opacity: 0; transform: translateX(-10px);
          transition: opacity 0.4s ease, transform 0.5s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .explore__row:hover .explore__row-arrow, .explore__row:focus-visible .explore__row-arrow, .explore__row--active .explore__row-arrow {
          opacity: 1; transform: translateX(0);
        }
        .explore__panel { position: sticky; top: 7rem; aspect-ratio: 4 / 5; overflow: hidden; }
        .explore__panel-img { position: absolute; inset: 0; opacity: 0; transform: scale(1.06); transition: opacity 0.8s ease, transform 1.2s ease; }
        .explore__panel-img--visible { opacity: 1; transform: scale(1); }
        .explore__panel-img :global(img) { object-fit: cover; filter: saturate(0.85) brightness(0.75); }
        .explore__panel-frame { position: absolute; inset: 0; border: 1px solid var(--hairline); box-shadow: inset 0 0 90px rgba(0,0,0,0.55); pointer-events: none; }
        @media (max-width: 900px) {
          .explore__inner { grid-template-columns: 1fr; gap: 0; }
          .explore__panel { display: none; }
          .explore__row { grid-template-columns: 2.2rem 1fr auto auto; gap: 1rem; padding: 1.3rem 0; }
          .explore__row-thumb { display: block; position: relative; width: 52px; height: 52px; flex-shrink: 0; overflow: hidden; }
          .explore__row-thumb :global(img) { object-fit: cover; filter: saturate(0.85) brightness(0.8); }
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

        /* Плотнее подгоняем боковые отступы секций на самых узких экранах */
        @media (max-width: 480px) {
          .about, .formula, .real, .contacts, .explore, .hero__content {
            padding-left: 1.25rem; padding-right: 1.25rem;
          }
        }
      `}</style>
    </main>
  );
}