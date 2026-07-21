'use client';

import { useEffect, useRef, useState, type MouseEvent as ReactMouseEvent } from 'react';
import Link from 'next/link';
import { Cormorant_Garamond, Manrope } from 'next/font/google';

/**
 * MAKAN — «Мәзір» парақшасы
 * =========================================================================
 * Басты парақшадағыдай навигация, футер және дизайн жүйесін қайталап қолданады
 * (page.tsx қараңыз): күңгірт фон, алтын түс, Cormorant Garamond + Manrope.
 *
 * Деректер — жүктелген екі PDF (асхана + бар) бойынша өзгеріссіз көшірілген.
 * Валюта PDF-тегі "т" орнына ₸ (теңге) ретінде көрсетілген.
 *
 * ҚҰРЫЛЫМЫ:
 *  1. Навигация + мобильді мәзір
 *  2. Парақша тақырыбы
 *  3. "Тағамдар / Бар" ауыстырғышы + санаттарға жылдам сілтемелер
 *  4. Мәзір санаттары — бірнеше баған бойынша (CSS columns)
 *  5. Футер
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

const hours = [
  { day: 'Дүйсенбі — бейсенбі', time: '10:00 — 23:00' },
  { day: 'Жұма — сенбі', time: '10:00 — 23:00' },
  { day: 'Жексенбі', time: '10:00 — 23:00' },
];

const navLinks = [
  { href: '/kz_main', label: 'Басты бет' },
  { href: '/kz_menu', label: 'Мәзір' },
  { href: '/kz_gallery', label: 'Галерея' },
  { href: '/kz_history', label: 'Тарихы' },
  { href: '/kz_main#contacts', label: 'Байланыс' },
];

const WEEKLY_HOURS: Record<number, [number, number]> = {
  0: [10, 22],
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

function useOpenStatus() {
  const [status, setStatus] = useState<{ open: boolean; text: string } | null>(null);

  useEffect(() => {
    const compute = () => {
      const now = new Date();
      const day = now.getDay();
      const t = now.getHours() + now.getMinutes() / 60;
      const [open, close] = WEEKLY_HOURS[day];
      if (t >= open && t < close) {
        setStatus({ open: true, text: `Ашық · ${formatHour(close)} дейін` });
      } else {
        const nextOpen = t < open ? open : WEEKLY_HOURS[(day + 1) % 7][0];
        setStatus({ open: false, text: `Жабық · ${formatHour(nextOpen)} бастап` });
      }
    };
    compute();
    const id = setInterval(compute, 60000);
    return () => clearInterval(id);
  }, []);

  return status;
}

/** Логотиптегі толқынды сызық. */
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

/* =========================================================================
   МӘЗІР ДЕРЕКТЕРІ — PDF-тен (асхана + бар) аударылған
   ========================================================================= */

type MenuItem = { name: string; price: string };
type MenuGroup = { subtitle?: string; items: MenuItem[] };
type MenuCategory = { title: string; note?: string; groups: MenuGroup[] };

function items(...pairs: [string, string][]): MenuGroup[] {
  return [{ items: pairs.map(([name, price]) => ({ name, price })) }];
}

const FOOD_CATEGORIES: MenuCategory[] = [
  {
    title: 'Таңғы астар',
    groups: items(
      ['Грузинше таңғы ас (шұжықтар, шұжықты жұмыртқа, көкөніс қосылған омлет, көкөністер, бұршақ)', '2599 ₸'],
      ['Сырниктер (тосап, бал, қаймақ қалауыңызша)', '2299 ₸'],
      ['Жемістер қосылған сұлы ботқасы (маусымдық жемістер)', '1199 ₸'],
      ['Шакшука (жұмыртқа, қызанақ, бұрыш, пияз, дәмдеуіштер)', '2299 ₸'],
      ['Ірімшік қосылған құймақтар', '1599 ₸'],
      ['Ет қосылған құймақтар', '1799 ₸'],
      ['Түрікше таңғы ас (брынза, зәйтүн, қайнатылған жұмыртқа, черри, қияр, көкөністер)', '1599 ₸']
    ),
  },
  {
    title: 'Закускалар мен дәмдеуіштер',
    groups: items(
      ['Кавказша дәмдік ассорти (қызанақ, қияр, брынза, зәйтүн, жас пияз, ақжелкен, кинза, лимон, тәтті бұрыш)', '3499 ₸'],
      ['Тұздалған өнімдер ассортиі (тұздалған қияр, тұздалған қызанақ, ашытылған орамжапырақ, ащы бұрыш)', '3299 ₸'],
      ['Жылқы еті ассортиі (жая, қазы, тіл)', '6599 ₸'],
      ['Балық ассортиі', '5499 ₸'],
      ['Жаңғақ қосылған баклажан орамалары', '2799 ₸'],
      ['Орысша дәмдік ассорти (майшабақ, картоп, тұздалған қияр, пияз, лимон, ашытылған орамжапырақ)', '3399 ₸']
    ),
  },
  {
    title: 'Сорпалар',
    groups: items(
      ['Харчо (сиыр еті, күріш, грузин дәмдеуіштері, грек жаңғағы)', '1550 ₸'],
      ['Ямық сорпасы (чечевица)', '1350 ₸'],
      ['Үй кеспесі (тауық еті, кеспе, дәмдеуіштер)', '1299 ₸'],
      ['Сорпа (қой еті, картоп, тәтті бұрыш, пияз, қызанақ, дәмдеуіштер)', '2099 ₸'],
      ['Үй тұшпарасы (сиыр тартылған еті, пияз, қамыр, қаймақ, дәмдеуіштер)', '1699 ₸'],
      ['Қазақша ет (ет, қазы, қамыр, сорпа, тұздық)', '1899 ₸'],
      ['Хаш — дәстүрлі кавказ сорпасы (сиыр сирақтары, сарымсақ, көкөніс, сорпа, лаваш)', '2499 ₸'],
      ['Том-ям (сегізаяқ/шаян, шампиньон, черри, пияз, кокос сүті, том-ям пастасы, лайм, кинза, ащы бұрыш қалауыңызша)', '3499 ₸']
    ),
  },
  {
    title: 'Салаттар',
    groups: items(
      ['«Макан» фирмалық салаты (қышқыл-тәтті соустағы қытырлақ баклажан, салат миксі, сиыр еті, черри, дәмдеуіштер)', '2799 ₸'],
      ['Сёмга қосылған Цезарь (айсберг, сёмга, черри, пармезан, сухари, жұмыртқа, «цезарь» соусы)', '2899 ₸'],
      ['Тауық қосылған Цезарь (айсберг, клярдағы тауық филесі, черри, пармезан, сухари, «цезарь» соусы, жұмыртқа)', '2299 ₸'],
      ['Грек салаты (қызанақ, қияр, бұрыш, зәйтүн, лимон, салат жапырағы, қызыл пияз, май, брынза)', '1999 ₸'],
      ['«Арзу» ащы салаты (қияр, тәтті бұрыш, қызыл пияз, сарымсақ, сиыр еті, ащы бұрыш, соя соусы, май)', '2199 ₸'],
      ['«Цицибели» грузин салаты (шампиньондар, тауық филесі, қияр, картоп пай, соус)', '2699 ₸'],
      ['Шефтен салат (қуырылған брынза, черри, шампиньондар, сарымсақ, май)', '2499 ₸'],
      ['Куркума қосылған салат (гүлді орамжапырақ, брокколи, бұрыш, черри, тауық филесі, куркума соусы)', '2199 ₸'],
      ['«Тбилиси» салаты (сиыр еті, қызыл бұршақ, тәтті бұрыш, кинза, грек жаңғағы, лимон шырыны, май)', '2799 ₸'],
      ['Кавказ салаты (қызанақ, қияр, қызыл пияз, кинза, райхан, май)', '2199 ₸'],
      ['Балғын салат (қызанақ, қияр, пияз)', '1199 ₸']
    ),
  },
  {
    title: 'Ыстық баптар',
    groups: items(
      ['Ащы қанатшалар', '2499 ₸'],
      ['Сарымсақ соусындағы шаяндар', '3099 ₸'],
      ['Ет қосылған шағын чебуректер', '3 дана — 1399 ₸ · 5 дана — 2199 ₸'],
      ['Брынза мен шөптер қосылған шағын чебуректер', '3 дана — 1399 ₸ · 5 дана — 1999 ₸'],
      ['Шұжықтар ассортиі (сиыр, жылқы, қой, тауық)', '12499 ₸ · бөлек 3799 ₸'],
      ['Ет қосылған шағын самса', '5 дана — 2199 ₸'],
      ['Наггетстер', '6 дана — 1399 ₸']
    ),
  },
  {
    title: 'Ыстық пісірмелер',
    groups: items(
      ['Мегрельше хачапури', '3099 ₸'],
      ['Имеретинше хачапури', '2799 ₸'],
      ['Хычиндар (етпен)', '1899 ₸'],
      ['Аджарша хачапури', '2999 ₸'],
      ['Ірімшік пен картоп қосылған хычиндар', '1599 ₸']
    ),
  },
  {
    title: 'Негізгі тағамдар',
    groups: items(
      ['Сиыр етінен жасалған таба (жаровня)', '2599 ₸'],
      ['Табада тайша дайындалған ет (сиыр еті, тәтті бұрыш, пияз, сарымсақ, ащы бұрыш қалауыңызша, соя соусы)', '2399 ₸'],
      ['Ет косылған хинкали', '2599 ₸'],
      ['Грузинше қой еті (қой еті, тәтті бұрыш, томат пастасы, грузин дәмдеуіштері, пияз)', '2499 ₸'],
      ['Бефстроганов (сиыр еті, пияз, қаймақ; гарнир бөлек)', '2199 ₸'],
      ['Чахохбили (тауық еті, тәтті бұрыш, грузин дәмдеуіштері, пияз)', '2599 ₸'],
      ['Тауық етінен жасалған таба (тауық филесі, тәтті бұрыш, көкөніс, дәмдеуіштер)', '2599 ₸'],
      ['Оджахури (ет филесі, пияз, картоп, қызанақ, көкөніс, дәмдеуіштер)', '2599 ₸'],
      ['Сұйық қаймақ соусындағы саңырауқұлақ қосылған тауық төсі', '2899 ₸'],
      ['Үй котлеттері, 2 дана (гарнир бөлек)', '1599 ₸'],
      ['Долма', '2399 ₸']
    ),
  },
  {
    title: 'Шығыс асханасы',
    groups: items(
      ['Цомян', '1799 ₸'],
      ['Гуйру лағман', '2499 ₸'],
      ['Манты', '1999 ₸'],
      ['Қуырдақ', '3499 ₸'],
      ['Сірне', '3499 ₸']
    ),
  },
  {
    title: 'Пицца',
    groups: items(
      ['Пепперони пиццасы', '2599 ₸'],
      ['Маргарита пиццасы', '2399 ₸'],
      ['Тауық пиццасы', '3299 ₸'],
      ['«4 жыл мезгілі» пиццасы', '2799 ₸'],
      ['«Цезарь» пиццасы', '3399 ₸']
    ),
  },
  {
    title: 'Нан өнімдері',
    groups: items(
      ['Бауырсақтар', '999 ₸'],
      ['Нан себеті', '1499 ₸'],
      ['Лаваш', '299 ₸'],
      ['Тандыр нан', '299 ₸']
    ),
  },
  {
    title: 'Кәуаптар',
    groups: items(
      ['Қой еті', '1499 ₸'],
      ['Қой етінен жасалған антрекот', '2499 ₸'],
      ['Қой етінен жасалған люля', '1499 ₸'],
      ['Кавказша кәуап', '2399 ₸'],
      ['Тауық сирақтары (окорочка)', '1199 ₸'],
      ['Тауық қанатшалары', '1299 ₸'],
      ['Үйрек етінен кәуап', '1299 ₸'],
      ['Қабықшадағы бауыр', '1399 ₸'],
      ['Саңырауқұлақтар', '1599 ₸'],
      ['Көкөністер', '1199 ₸']
    ),
  },
  {
    title: 'Топқа арналған тағамдар',
    groups: items(
      ['Дәстүрлі бешбармақ', '6 адамға — 18999 ₸ · 4 адамға — 13999 ₸'],
      ['Қой етінен жасалған қуырдақ', '6 адамға — 19499 ₸ · 4 адамға — 13499 ₸'],
      ['Сірне', '6 адамға — 19499 ₸ · 4 адамға — 14499 ₸'],
      ['Күріш қосылған Дапанджи', '6 адамға — 13999 ₸ · 4 адамға — 10999 ₸'],
      ['Сиыр еті қосылған мерекелік палау', '6 адамға — 16999 ₸ · 4 адамға — 12999 ₸'],
      ['Манты', '6 адамға — 10499 ₸'],
      ['Көктал', '27999 ₸']
    ),
  },
  {
    title: 'Тұздықтар (Соустар)',
    groups: items(
      ['Үй аджикасы', '499 ₸'],
      ['Сарымсақ соусы', '399 ₸'],
      ['Көкөніс қосылған ақ соус', '399 ₸'],
      ['Көкөніс қосылған қызыл соус', '399 ₸'],
      ['Ірімшік соусы', '399 ₸'],
      ['Кетчуп', '299 ₸'],
      ['Майонез', '299 ₸'],
      ['Соя соусы', '350 ₸']
    ),
  },
  {
    title: 'Балық тағамдары',
    groups: items(
      ['Қаймақ соусындағы ақбалық (Форель)', '3599 ₸'],
      ['Қуырылған көксерке (картоп пюресімен)', '3599 ₸'],
      ['Қышқыл-тәтті соустағы Дорадо', '4599 ₸']
    ),
  },
  {
    title: '8 адамға арналған сеттер',
    groups: items(
      ['Ет сеті (қой қабырғалары, антрекоттар, сиыр медальондары, тауық аяқтары, грильдегі жылқы шұжығы, долма, грильдегі көкөністер, пісірілген картоп, соустар)', '27999 ₸'],
      ['Балық платосы (форель, лосось, көксерке филесі, лимондар, грильдегі көкөністер, күріш)', '33999 ₸'],
      ['Құс етінен жасалған сет (тауық аяқтары, қанаттары, филе, үйрек еті, көкөністер, фри картобы)', '22999 ₸']
    ),
  },
  {
    title: 'Десерттер',
    groups: items(
      ['Медовик', '1599 ₸'],
      ['Наполеон', '1599 ₸'],
      ['Пахлава', '1899 ₸']
    ),
  },
  {
    title: 'Стейктер',
    groups: items(
      ['Грильдегі көкөністер қосылған Рибай', '6099 ₸'],
      ['Көкөністер қосылған Тибон', '5799 ₸'],
      ['Ақбалықтан жасалған стейк (Форель)', '4799 ₸'],
      ['Лососьтен жасалған стейк', '4799 ₸']
    ),
  },
  {
    title: 'Паста',
    groups: items(
      ['Сёмга қосылған Феттучини альфредо', '3599 ₸'],
      ['Тауық қосылған Феттучини альфредо', '2199 ₸'],
      ['Шаяндар қосылған Феттучини альфредо', '3099 ₸'],
      ['Болоньезе', '2199 ₸']
    ),
  },
  {
    title: 'Гарнирлер',
    groups: items(
      ['Картоп фри', '799 ₸'],
      ['Күріш', '599 ₸'],
      ['Гриль көкөністері', '899 ₸'],
      ['Ауылша картоп', '799 ₸'],
      ['Пюре', '599 ₸'],
      ['Күрделі гарнир', '799 ₸']
    ),
  },
  {
    title: 'Ыдыс-аяқтың сынуы',
    note: 'әр сәтте болуы мүмкін жағдайлар үшін',
    groups: items(
      ['Рюмка, стақан, шәй шыныаяғы, тәрелкеше', '999 ₸'],
      ['Орташа тәрелкелер, сыра кружкасы, қант салғыш, бокалдар, тостағандар, креманка', '1999 ₸'],
      ['Үлкен тәрелкелер, шәйнек, құмыра, графин, жеміс салғыш, керамикалық ыдыс', '3999 ₸'],
      ['Мүлікті тазалау', '4999 ₸'],
      ['Мүлікті бүлдіру', 'мүліктің өзіндік құны бойынша']
    ),
  },
];

const BAR_CATEGORIES: MenuCategory[] = [
  {
    title: 'Коктейльдер',
    note: '250 мл',
    groups: items(
      ['Текила Санрайз', '2100 ₸'],
      ['Секс на пляже', '2000 ₸'],
      ['Лонг-Айленд', '2500 ₸'],
      ['Апероль Шприц', '2500 ₸'],
      ['Мохито', '2400 ₸'],
      ['Голубая лагуна', '2500 ₸'],
      ['Джин Тоник', '2300 ₸'],
      ['Пина Колада', '2300 ₸']
    ),
  },
  {
    title: 'Ащы ішімдіктер',
    note: '50 мл',
    groups: [
      {
        subtitle: 'Виски',
        items: [
          { name: 'William Lawson', price: '1050 ₸' },
          { name: 'Jameson', price: '1450 ₸' },
          { name: "Ballantine's", price: '1000 ₸' },
          { name: "Jack Daniel's", price: '1855 ₸' },
          { name: 'Chivas 12 жылдық', price: '2900 ₸' },
        ],
      },
      {
        subtitle: 'Текила',
        items: [
          { name: 'Olmeca Silver', price: '1100 ₸' },
          { name: 'Olmeca Gold', price: '1300 ₸' },
        ],
      },
      {
        subtitle: 'Джин',
        items: [{ name: 'Beefeater', price: '1050 ₸' }],
      },
      {
        subtitle: 'Ром',
        items: [
          { name: 'Bacardi Carta Negra', price: '950 ₸' },
          { name: 'Bacardi Carta Blanca', price: '950 ₸' },
          { name: 'Oakheart', price: '950 ₸' },
        ],
      },
      {
        subtitle: 'Коньяк',
        items: [
          { name: 'Асканели 3 жылдық', price: '850 ₸' },
          { name: 'Қазақстан 3*', price: '700 ₸' },
          { name: 'Қазақстан 5*', price: '1050 ₸' },
          { name: 'Арарат 5*', price: '1300 ₸' },
        ],
      },
      {
        subtitle: 'Арақ',
        items: [
          { name: 'Столичная Excellent', price: '650 ₸' },
          { name: 'Царская особая', price: '1000 ₸' },
          { name: 'Царская золотая', price: '1200 ₸' },
          { name: 'Бульбашъ особая', price: '500 ₸' },
          { name: 'Finlandia', price: '1100 ₸' },
          { name: 'Қызылжар', price: '600 ₸' },
          { name: 'Grey Goose', price: '1900 ₸' },
        ],
      },
    ],
  },
  {
    title: 'Шарбат (Вино)',
    note: 'бөтелке 0.75 л',
    groups: [
      {
        subtitle: 'Ақ құрғақ',
        items: [
          { name: 'Долины Грузии Тбилиси', price: '7050 ₸' },
          { name: 'Carmen Insigne Sauvignon Blanc', price: '7500 ₸' },
        ],
      },
      {
        subtitle: 'Ақ жартылай құрғақ',
        items: [
          { name: 'Долины Грузии Сачино', price: '7400 ₸' },
          { name: 'Chateau Vartely Chardonnay', price: '5900 ₸' },
        ],
      },
      {
        subtitle: 'Ақ жартылай тәтті',
        items: [
          { name: 'Алазанская Долина Kvareli', price: '5300 ₸' },
          { name: 'Алазанская Долина Teliani Valley', price: '6750 ₸' },
        ],
      },
      {
        subtitle: 'Қызыл жартылай құрғақ',
        items: [
          { name: 'Pirosmani Kvareli', price: '7200 ₸' },
          { name: 'Chateau Vartely Cabernet Sauvignon', price: '5900 ₸' },
        ],
      },
      {
        subtitle: 'Қызыл жартылай тәтті',
        items: [
          { name: 'Алазанская Долина Kvareli', price: '6500 ₸' },
          { name: 'Долины Грузии Киндзмараули', price: '12200 ₸' },
        ],
      },
      {
        subtitle: 'Көпіршікті шәрбат',
        items: [{ name: 'Martini Asti', price: '14000 ₸' }],
      },
    ],
  },
  {
    title: 'Шампанское',
    groups: items(
      ['Совет шампанскоесі', '5500 ₸'],
      ['Diana шампанскоесі', '5400 ₸']
    ),
  },
  {
    title: 'Сыра',
    groups: items(
      ['Bud 5% (0.44 л)', '1700 ₸'],
      ['Heineken сидр 4.7% (0.5 л)', '1100 ₸'],
      ['Алкогольсіз сыра', '1100 ₸'],
      ['Прага (құйылмалы)', '1100 ₸']
    ),
  },
  {
    title: 'Лимонадтар',
    note: 'графин / стақан',
    groups: items(
      ['Жидек миксі', '1790 ₸ / 500 ₸'],
      ['Манго-Маракуйя', '1790 ₸ / 500 ₸'],
      ['Маракуйя-Апельсин', '1790 ₸ / 500 ₸'],
      ['Киви-Яблоко', '1790 ₸ / 500 ₸'],
      ['Киви-Тархун', '1790 ₸ / 500 ₸'],
      ['Тархун', '1790 ₸ / 500 ₸'],
      ['Клубника-Маракуйя', '1790 ₸ / 500 ₸'],
      ['Классикалық мохито', '1990 ₸ / 600 ₸'],
      ['Тарташ Мохито (Гранат)', '1990 ₸ / 600 ₸'],
      ['Ice Tea (Мұзды шәй)', '1790 ₸ / 500 ₸']
    ),
  },
  {
    title: 'Сусындар',
    groups: items(
      ['Газдалған/газсыз су', '600 ₸'],
      ['Coca-Cola / Zero (1 л)', '1200 ₸'],
      ['Coca-Cola (0.25 л)', '800 ₸'],
      ['Red Bull (0.25 л)', '1100 ₸'],
      ['Schweppes (0.33 л)', '1300 ₸'],
      ['Боржоми (0.25 л)', '1100 ₸'],
      ['Табиғи шырын (1 л)', '1300 ₸']
    ),
  },
  {
    title: 'Аперитив',
    note: '100 мл',
    groups: items(['Aperol', '1500 ₸'], ['Martini Bianco', '1500 ₸']),
  },
  {
    title: 'Шәй / Кофе',
    groups: items(
      ['Қара шәй', '300 ₸ / 950 ₸'],
      ['Жасыл шәй', '300 ₸ / 900 ₸'],
      ['Сүт қосылған шәй', '400 ₸ / 1100 ₸'],
      ['Ташкентше шәй', '1700 ₸'],
      ['Мароккоша шәй', '1990 ₸'],
      ['Кофе 3в1', 'бағасын нақтылаңыз']
    ),
  },
  {
    title: 'Шәйға косымша',
    groups: items(
      ['Бал', '500 ₸'],
      ['Лимон', '500 ₸'],
      ['Сүт', '300 ₸'],
      ['Қазақстандық шоколад', '1500 ₸'],
      ['Alpen Gold', '1500 ₸']
    ),
  },
  {
    title: 'Сыраға баптар',
    groups: items(
      ['Жержаңғақ', '1100 ₸'],
      ['Сухарилер (Гренки)', '900 ₸'],
      ['Пісте (Фисташки)', '1390 ₸'],
      ['Чечил ірімшігі', '950 ₸'],
      ['Lays чипстері', '1100 ₸']
    ),
  },
];

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[«»()]/g, '')
    .replace(/[\s/]+/g, '-');
}

export default function MenuPage() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [tab, setTab] = useState<'food' | 'bar'>('food');
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

  const categories = tab === 'food' ? FOOD_CATEGORIES : BAR_CATEGORIES;

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
            <Link href="/kz_menu" className="nav__link nav__link--active">Мәзір</Link>
            <Link href="/kz_gallery" className="nav__link">Галерея</Link>
            <Link href="/kz_history" className="nav__link">Тарихы</Link>
            <a href="/kz_main#contacts" className="nav__link nav__link--cta">Байланыс</a>
            <div className="nav__lang" aria-label="Тіл таңдау">
              <Link href="/menu" className="nav__lang-btn">РУС</Link>
              <span className="nav__lang-dot" aria-hidden="true">·</span>
              <Link href="/en_menu" className="nav__lang-btn">ENG</Link>
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
            <Link href="/menu" className="mobile-menu__lang-btn" onClick={() => setMenuOpen(false)}>РУС</Link>
            <span className="mobile-menu__lang-dot" aria-hidden="true">·</span>
            <Link href="/en_menu" className="mobile-menu__lang-btn" onClick={() => setMenuOpen(false)}>ENG</Link>
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

      {/* ПАРАҚША ТАҚЫРЫБЫ */}
      <section className="menu-hero">
        <div className="menu-hero__inner">
          <p className="eyebrow eyebrow--center">MAKAN</p>
          <h1 className="menu-hero__title">Мәзір</h1>
          <p className="menu-hero__text">
            Асхана, бар және залға ұсынылатын барлық дәм. Бағалар — теңгемен көрсетілген, 10% қызмет көрсету құны енгізілмеген.
          </p>
          <Swash className="menu-hero__swash" />
        </div>
      </section>

      {/* Жүгіртпе жол */}
      <div className="marquee" aria-hidden="true">
        <div className="marquee__track">
          {Array.from({ length: 2 }).map((_, rep) => (
            <span className="marquee__group" key={rep}>
              {['MAKAN', 'Кәуаптар', 'Грузин тағамдары', 'Бар', 'Коктейльдер', 'Лимонадтар'].map((w) => (
                <span className="marquee__item" key={w}>
                  {w}
                  <Swash className="marquee__swash" />
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* ТАҒАМДАР / БАР АУЫСТЫРҒЫШЫ */}
      <div className="menu-tabs">
        <button
          type="button"
          className={`menu-tab ${tab === 'food' ? 'menu-tab--active' : ''}`}
          onClick={() => setTab('food')}
        >
          Тағамдар
        </button>
        <button
          type="button"
          className={`menu-tab ${tab === 'bar' ? 'menu-tab--active' : ''}`}
          onClick={() => setTab('bar')}
        >
          Бар
        </button>
      </div>

      {/* САНАТТАРҒА ЖЫЛДАМ СІЛТЕМЕЛЕР */}
      <nav className="menu-toc" aria-label="Мәзір санаттары" key={tab}>
        {categories.map((c) => (
          <a key={c.title} href={`#${slugify(c.title)}`} className="menu-toc__chip">
            {c.title}
          </a>
        ))}
      </nav>

      {/* МӘЗІР САНАТТАРЫ */}
      <section className="menu-content" key={`content-${tab}`}>
        <div className="menu-columns">
          {categories.map((c, i) => (
            <article className="menu-cat" id={slugify(c.title)} key={c.title}>
              <div className="menu-cat__head">
                <span className="menu-cat__index">{String(i + 1).padStart(2, '0')}</span>
                <h2 className="menu-cat__title">{c.title}</h2>
              </div>
              {c.note && <p className="menu-cat__note">{c.note}</p>}
              {c.groups.map((g, gi) => (
                <div className="menu-cat__group" key={g.subtitle ?? gi}>
                  {g.subtitle && <p className="menu-cat__subtitle">{g.subtitle}</p>}
                  <ul className="menu-cat__list">
                    {g.items.map((item) => (
                      <li className="menu-item" key={item.name}>
                        <span className="menu-item__name">{item.name}</span>
                        <span className="menu-item__price">{item.price}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </article>
          ))}
        </div>
      </section>
      
      {/* ЕСКЕРТУ */}
      <section className="disclaimer">
        <p className="disclaimer__text">
          Кафе әкімшілігі қонақтардың жеке мүлкінің сақталуына, сондай-ақ әкімшілікке байланысты емес себептермен электр энергиясының үзілуіне жауапты емес.
        </p>
      </section>

      <footer className="footer">
        <div className="footer__inner">
          <div className="footer__col">
            <div className="footer__mark">
              MAKAN <span>кафесі</span>
            </div>
            <p className="footer__tag">Дәмді астар мен уақыт өткізгің келетін ерекше атмосфера</p>
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
          font-size: 0.7rem; font-weight: 600; letter-spacing: 0.28em;
          text-transform: uppercase; color: var(--gold-light); margin: 0 0 1.3rem;
        }
        .eyebrow--center { text-align: center; }

        /* NAV — идентично главной странице */
        .nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 50;
          background: transparent; transition: background 0.4s ease, border-color 0.4s ease;
          border-bottom: 1px solid transparent;
        }
        .nav--solid { background: rgba(18, 14, 11, 0.9); backdrop-filter: blur(8px); border-bottom: 1px solid var(--hairline); }
        .nav__inner { max-width: 1200px; margin: 0 auto; padding: 1.3rem 2rem; display: flex; align-items: center; justify-content: space-between; }
        .nav__mark { font-family: var(--font-display), serif; font-weight: 600; font-size: 1.3rem; letter-spacing: 0.06em; color: var(--parchment); text-decoration: none; }
        .nav__mark span { font-size: 0.65rem; letter-spacing: 0.2em; color: var(--gold-light); margin-left: 0.5rem; text-transform: lowercase; font-family: var(--font-body), sans-serif; }
        .nav__links { display: flex; align-items: center; gap: 2.1rem; }
        .nav__link {
          color: var(--parchment-dim); text-decoration: none; font-size: 0.76rem; letter-spacing: 0.14em; text-transform: uppercase;
          padding-bottom: 0.25rem; border-bottom: 1px solid transparent; transition: color 0.2s ease, border-color 0.2s ease;
        }
        .nav__link:hover, .nav__link:focus-visible { color: var(--parchment); border-color: var(--gold); }
        .nav__link--active { color: var(--gold-light); border-color: var(--gold); }
        .nav__link--cta { color: var(--gold-light); border: 1px solid var(--hairline); padding: 0.4rem 0.9rem; }

        .nav__status {
          display: inline-flex; align-items: center; gap: 0.5rem; font-size: 0.68rem; letter-spacing: 0.1em; text-transform: uppercase;
          color: var(--parchment-dim); padding-left: 1.5rem; border-left: 1px solid var(--hairline);
        }
        .nav__status--open { color: var(--gold-light); }
        .nav__status-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--parchment-dim); flex-shrink: 0; }
        .nav__status--open .nav__status-dot, .mobile-menu__status--open .nav__status-dot {
          background: var(--gold-light); box-shadow: 0 0 0 3px rgba(217, 184, 120, 0.22); animation: statusPulse 2.4s ease-in-out infinite;
        }
        @keyframes statusPulse {
          0%, 100% { box-shadow: 0 0 0 3px rgba(217, 184, 120, 0.22); }
          50% { box-shadow: 0 0 0 6px rgba(217, 184, 120, 0.06); }
        }

        .nav__toggle { display: none; position: relative; width: 26px; height: 18px; background: none; border: 0; padding: 0; cursor: pointer; z-index: 70; }
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
          position: fixed; inset: 0; z-index: 60; background: var(--ink); display: flex; flex-direction: column; justify-content: space-between;
          padding: 7rem 2rem 3rem; opacity: 0; visibility: hidden; transform: translateY(-8px);
          transition: opacity 0.4s ease, visibility 0.4s ease, transform 0.4s ease;
        }
        .mobile-menu--open { opacity: 1; visibility: visible; transform: translateY(0); }
        .mobile-menu__links { display: flex; flex-direction: column; gap: 0.4rem; }
        .mobile-menu__link {
          display: flex; align-items: baseline; gap: 1.1rem; font-family: var(--font-display), serif; font-weight: 600;
          font-size: clamp(2rem, 9vw, 2.6rem); color: var(--parchment); text-decoration: none; padding: 0.55rem 0;
          border-bottom: 1px solid var(--hairline); opacity: 0; transform: translateY(14px);
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
          display: flex; flex-direction: column; gap: 1.2rem; opacity: 0; transform: translateY(14px);
          transition: opacity 0.5s ease, transform 0.5s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .mobile-menu--open .mobile-menu__footer { opacity: 1; transform: translateY(0); }
        .mobile-menu__status { display: inline-flex; align-items: center; gap: 0.55rem; width: fit-content; font-size: 0.75rem; letter-spacing: 0.08em; text-transform: uppercase; color: var(--parchment-dim); }
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

        .btn { display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.9rem 1.9rem; font-size: 0.76rem; letter-spacing: 0.16em; text-transform: uppercase; text-decoration: none; transition: background 0.25s ease, color 0.25s ease, border-color 0.25s ease, transform 0.25s ease; }
        .btn--solid { background: transparent; color: var(--gold-light); border: 1px solid var(--gold); font-weight: 600; }
        .btn--solid:hover, .btn--solid:focus-visible { background: var(--gold); color: var(--ink); transform: translateY(-1px); }
        .btn--ghost { color: var(--parchment-dim); border: 1px solid rgba(239, 233, 218, 0.25); }
        .btn--ghost:hover, .btn--ghost:focus-visible { border-color: var(--gold-light); color: var(--gold-light); }
        .btn:focus-visible { outline: 2px solid var(--gold-light); outline-offset: 2px; }

        /* ЗАГОЛОВОК СТРАНИЦЫ МЕНЮ — компактная замена полноэкранному hero */
        .menu-hero { padding: 10rem 2rem 3rem; background: var(--ink); text-align: center; }
        .menu-hero__inner { max-width: 640px; margin: 0 auto; }
        .menu-hero__title {
          font-family: var(--font-display), serif; font-weight: 600; font-style: italic;
          font-size: clamp(2.4rem, 6vw, 3.6rem); margin: 0 0 1rem; color: var(--parchment);
        }
        .menu-hero__text { font-size: 0.95rem; line-height: 1.7; color: var(--parchment-dim); font-weight: 300; margin: 0 auto; max-width: 46ch; }
        :global(.menu-hero__swash) {
          width: 100%;
          max-width: 440px;
          aspect-ratio: 440 / 84;
          height: auto;
          color: white;
          margin: 2rem auto 0;
          display: block;
        }
        
        @media (max-width: 640px) {
          .menu-hero { padding: 7.5rem 1.4rem 2rem; }
        }

        /* БЕГУЩАЯ СТРОКА — тот же приём, что на главной странице */
        .marquee {
          overflow: hidden; background: var(--ink-soft);
          border-top: 1px solid var(--hairline); border-bottom: 1px solid var(--hairline);
          padding: 1.1rem 0; margin-bottom: 3rem;
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

        /* ПЕРЕКЛЮЧАТЕЛЬ КУХНЯ / БАР */
        .menu-tabs { display: flex; justify-content: center; gap: 0.8rem; padding: 0 2rem; margin: 0 0 2.6rem; }
        .menu-tab {
          padding: 0.75rem 2rem; font-family: var(--font-body), sans-serif; font-size: 0.78rem; font-weight: 600;
          letter-spacing: 0.14em; text-transform: uppercase; border: 1px solid var(--hairline);
          background: transparent; color: var(--parchment-dim); cursor: pointer; transition: all 0.25s ease;
        }
        .menu-tab:hover:not(.menu-tab--active) { border-color: var(--gold); color: var(--parchment); }
        .menu-tab--active { color: var(--ink); background: var(--gold-light); border-color: var(--gold-light); }
        .menu-tab:focus-visible { outline: 2px solid var(--gold-light); outline-offset: 2px; }

        /* БЫСТРЫЕ ССЫЛКИ НА КАТЕГОРИИ — горизонтальная лента чипсов */
        .menu-toc {
          display: flex; gap: 0.6rem; overflow-x: auto; max-width: 1200px; margin: 0 auto;
          padding: 0 2rem 3rem; scrollbar-width: none;
        }
        .menu-toc::-webkit-scrollbar { display: none; }
        .menu-toc__chip {
          flex: 0 0 auto; padding: 0.5rem 1.1rem; border: 1px solid var(--hairline); border-radius: 999px;
          font-size: 0.72rem; letter-spacing: 0.08em; text-transform: uppercase; color: var(--parchment-dim);
          text-decoration: none; white-space: nowrap; transition: color 0.2s ease, border-color 0.2s ease;
        }
        .menu-toc__chip:hover, .menu-toc__chip:focus-visible { color: var(--gold-light); border-color: var(--gold); }

        /* КАТЕГОРИИ МЕНЮ — CSS columns вместо grid: контейнер сам считает
           высоту по контенту, поэтому ничего не может "разъехаться" или
           наложиться на соседние блоки. */
        .menu-content { padding: 0 2rem var(--space-section); background: var(--ink); }
        .menu-columns { max-width: 1240px; margin: 0 auto; columns: 3 300px; column-gap: 2.2rem; }
        .menu-cat {
          break-inside: avoid; margin: 0 0 2.2rem; padding: 1.7rem 1.7rem 1.9rem;
          background: var(--ink-soft); border: 1px solid var(--hairline); display: inline-block; width: 100%;
          transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1), border-color 0.3s ease, box-shadow 0.3s ease;
        }
        .menu-cat:hover {
          transform: translateY(-5px); border-color: var(--gold);
          box-shadow: 0 18px 34px rgba(0, 0, 0, 0.4);
        }
        .menu-cat__head { display: flex; align-items: baseline; gap: 0.7rem; position: relative; padding-bottom: 0.65rem; margin: 0 0 0.3rem; }
        .menu-cat__head::after {
          content: ''; position: absolute; left: 0; bottom: 0; width: 2.2rem; height: 2px; background: var(--gold);
          transition: width 0.4s cubic-bezier(0.22, 1, 0.36, 1), background 0.3s ease;
        }
        .menu-cat:hover .menu-cat__head::after { width: 3.4rem; background: var(--gold-light); }
        .menu-cat__index {
          font-family: var(--font-display), serif; font-style: italic; font-weight: 600;
          font-size: 0.85rem; color: var(--gold); opacity: 0.6; flex-shrink: 0;
          transition: opacity 0.3s ease;
        }
        .menu-cat:hover .menu-cat__index { opacity: 1; }
        .menu-cat__title {
          font-family: var(--font-display), serif; font-weight: 600; font-size: 1.25rem; margin: 0; color: var(--parchment);
        }
        .menu-cat__note {
          margin: 0 0 0.6rem; font-size: 0.7rem; letter-spacing: 0.1em; text-transform: uppercase; color: var(--gold-light); font-weight: 600;
        }
        .menu-cat__subtitle {
          margin: 1.1rem 0 0.4rem; font-size: 0.68rem; letter-spacing: 0.12em; text-transform: uppercase; color: var(--gold-light); font-weight: 600;
        }
        .menu-cat__group:first-of-type .menu-cat__subtitle:first-child { margin-top: 0.8rem; }
        .menu-cat__list { list-style: none; margin: 0; padding: 0; }
        .menu-item {
          display: flex; flex-wrap: wrap; align-items: baseline; column-gap: 0.6rem;
          padding: 0.55rem 0; font-size: 0.85rem; color: var(--parchment-dim); font-weight: 300; line-height: 1.4;
          border-bottom: 1px dotted var(--hairline);
        }
        .menu-cat__list .menu-item:last-child { border-bottom: 0; }
        .menu-item__name { flex: 1 1 auto; min-width: 55%; }
        .menu-item__price {
          flex-shrink: 0; margin-left: auto; white-space: nowrap; color: var(--gold-light);
          font-weight: 600; font-family: var(--font-display), serif; font-size: 0.92rem; text-align: right;
        }

        @media (max-width: 900px) {
          .menu-columns { columns: 2 260px; }
        }
        @media (max-width: 640px) {
          .menu-columns { columns: 1; }
          .menu-content { padding: 0 1.25rem var(--space-section); }
          .menu-tabs { padding: 0 1.25rem; }
          .menu-toc { padding: 0 1.25rem 2.4rem; }
          .menu-item__price { white-space: normal; }
        }

          /* ДИСКЛЕЙМЕР — служебный текст перед подвалом, намеренно приглушённый */
.disclaimer {
  padding: 2rem 2rem 2.5rem;
  background: var(--ink);
  border-top: 1px solid var(--hairline);
}
.disclaimer__text {
  max-width: 820px;
  margin: 0 auto;
  padding-top: 2rem;
  font-size: 1rem;
  line-height: 1.7;
  color: var(--parchment-dim);
  opacity: 0.75;
  text-align: center;
  font-weight: 300;
}
@media (max-width: 640px) {
  .disclaimer { padding: 1.5rem 1.25rem 2rem; }
  .disclaimer__text { padding-top: 1.5rem; font-size: 0.8rem; }
}
        /* FOOTER — идентично главной странице */
        .footer { position: relative; padding: 4.5rem 2rem 2.5rem; background: var(--ink-soft); border-top: 1px solid var(--hairline); }
        .footer__inner { max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: 1.3fr 1fr 0.7fr; gap: 2rem; padding-bottom: 2.5rem; }
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
      `}</style>
    </main>
  );
}