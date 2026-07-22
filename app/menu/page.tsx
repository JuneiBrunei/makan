'use client';

import { useEffect, useRef, useState, type MouseEvent as ReactMouseEvent } from 'react';
import Link from 'next/link';
import { Cormorant_Garamond, Manrope } from 'next/font/google';

/**
 * MAKAN — страница «Меню»
 * =========================================================================
 * Переиспользует ту же шапку/подвал/дизайн-систему, что и главная страница
 * (см. page.tsx): тёмный фон, золото, Cormorant Garamond + Manrope.
 *
 * Данные — из двух загруженных PDF (кухня + бар), перенесены как есть, без
 * выдумывания новых позиций. Валюта указана как ₸ (тенге) вместо "т" из PDF.
 *
 * СТРУКТУРА:
 *  1. Шапка + мобильное меню (как на главной)
 *  2. Заголовок страницы
 *  3. Переключатель "Кухня / Бар" + быстрые ссылки на категории
 *  4. Категории меню — плиткой в несколько колонок (CSS columns),
 *     внутри — точечные лидеры "название .... цена", как в самом PDF
 *  5. Footer
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

const hours = [
  { day: 'Понедельник — четверг', time: '10:00 — 23:00' },
  { day: 'Пятница — суббота', time: '10:00 — 23:00' },
  { day: 'Воскресенье', time: '10:00 — 23:00' },
];

const navLinks = [
  { href: '/', label: 'Главная' },
  { href: '/menu', label: 'Меню' },
  { href: '/gallery', label: 'Галерея' },
  { href: '/history', label: 'История' },
  { href: '#contacts', label: 'Контакты' },
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

/** Волнистая линия из логотипа — единственный узнаваемый узор страницы. */
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
   ДАННЫЕ МЕНЮ — перенесены из загруженных PDF (кухня + бар)
   ========================================================================= */

type MenuItem = { name: string; price: string };
type MenuGroup = { subtitle?: string; items: MenuItem[] };
type MenuCategory = { title: string; note?: string; groups: MenuGroup[] };

function items(...pairs: [string, string][]): MenuGroup[] {
  return [{ items: pairs.map(([name, price]) => ({ name, price })) }];
}

const FOOD_CATEGORIES: MenuCategory[] = [
  {
    title: 'Завтраки',
    groups: items(
      ['Грузинский завтрак (колбаски, яйца-глазунья, омлет с овощами, зелень, фасоль)', '2599 ₸'],
      ['Сырники (варенье, мёд, сметана по желанию)', '2299 ₸'],
      ['Овсянка с фруктами (фрукты по сезону)', '1199 ₸'],
      ['Шакшука (яйцо, помидоры, перец, лук, специи)', '2299 ₸'],
      ['Блинчики с творогом', '1599 ₸'],
      ['Блинчики с мясом', '1799 ₸'],
      ['Турецкий завтрак (брынза, оливки, яйца варёные, черри, огурцы, зелень)', '1599 ₸']
    ),
  },
  {
    title: 'Закуски',
    groups: items(
      ['Кавказская закуска (помидоры, огурцы, брынза, маслины, зелёный лук, укроп, кинза, лимоны, перец болгарский)', '3499 ₸'],
      ['Ассорти солений (огурцы солёные, помидоры солёные, квашеная капуста, перец острый)', '3299 ₸'],
      ['Конская ассорти (жая, казы, язык)', '6599 ₸'],
      ['Рыбная ассорти', '5499 ₸'],
      ['Рулетики из баклажанов с орехами', '2799 ₸'],
      ['Русская закуска (сельдь, картофель, огурцы солёные, лук, лимон, квашеная капуста)', '3399 ₸']
    ),
  },
  {
    title: 'Первые блюда',
    groups: items(
      ['Харчо (говядина, рис, грузинские специи, грецкие орехи)', '1550 ₸'],
      ['Чечевичный суп', '1350 ₸'],
      ['Лапша по-домашнему (курица, лапша, специи)', '1299 ₸'],
      ['Шорпа (баранина, картофель, перец болгарский, лук, помидоры, специи)', '2099 ₸'],
      ['Домашние пельмени (фарш говядины, лук, тесто, сметана, специи)', '1699 ₸'],
      ['Мясо по-казахски (мясо, казы, тесто, бульон, лук)', '1899 ₸'],
      ['Хаш — традиционный кавказский суп (говяжьи ножки, чеснок, зелень, бульон, лаваш)', '2499 ₸'],
      ['Том-ям (креветки, шампиньоны, черри, лук, кокосовое молоко, паста том-ям, лайм, кинза, чили по вкусу)', '3499 ₸']
    ),
  },
  {
    title: 'Салаты',
    groups: items(
      ['Фирменный салат «Макан» (хрустящие баклажаны в кисло-сладком соусе, микс салат, говядина, черри, специи)', '2799 ₸'],
      ['Цезарь с сёмгой (айсберг, сёмга, черри, пармезан, сухарики, яйцо, соус «цезарь»)', '2899 ₸'],
      ['Цезарь с курицей (айсберг, куриное филе в кляре, черри, пармезан, сухарики, соус «цезарь», яйцо)', '2299 ₸'],
      ['Греческий салат (помидоры, огурцы, перец, оливки, лимон, лист салата, красный лук, масло, брынза)', '1999 ₸'],
      ['Острый салат «Арзу» (огурцы, сладкий перец, красный лук, чеснок, говядина, острый перец, соевый соус, масло)', '2199 ₸'],
      ['Грузинский салат «Цицибели» (шампиньоны, куриное филе, огурцы, картофель пай, соус)', '2699 ₸'],
      ['Салат от шефа (жареная брынза, черри, шампиньоны, чеснок, масло)', '2499 ₸'],
      ['Салат с куркумой (цветная капуста, брокколи, перец, черри, куриное филе, соус с куркумой)', '2199 ₸'],
      ['Салат «Тбилиси» (говядина, красная фасоль, болгарский перец, кинза, грецкий орех, лимонный сок, масло)', '2799 ₸'],
      ['Кавказский салат (помидоры, огурцы, красный лук, кинза, базилик, масло)', '2199 ₸'],
      ['Свежий салат (помидоры, огурцы, лук)', '1199 ₸']
    ),
  },
  {
    title: 'Горячие закуски',
    groups: items(
      ['Острые крылышки', '2499 ₸'],
      ['Креветки в чесночном соусе', '3099 ₸'],
      ['Мини чебуреки с мясом', '3 шт — 1399 ₸ · 5 шт — 2199 ₸'],
      ['Мини чебуреки с брынзой и зеленью', '3 шт — 1399 ₸ · 5 шт — 1999 ₸'],
      ['Ассорти колбасок (говядина, конина, баранина, курица)', '12499 ₸ · по отдельности 3799 ₸'],
      ['Мини самса с мясом', '5 шт — 2199 ₸'],
      ['Наггетсы', '6 шт — 1399 ₸']
    ),
  },
  {
    title: 'Горячая выпечка',
    groups: items(
      ['Хачапури по-мегрельски', '3099 ₸'],
      ['Хачапури по-имеретински', '2799 ₸'],
      ['Хычины (с мясом)', '1899 ₸'],
      ['Хачапури по-аджарски', '2999 ₸'],
      ['Хычины с сыром, картофелем', '1599 ₸']
    ),
  },
  {
    title: 'Вторые блюда',
    groups: items(
      ['Жаровня из говядины', '2599 ₸'],
      ['Мясо по-тайски на жаровне (говядина, перец болгарский, лук, чеснок, чили по желанию, соевый соус)', '2399 ₸'],
      ['Хинкали с мясом', '2599 ₸'],
      ['Баранина по-грузински (баранина, болгарский перец, томатная паста, грузинские специи, лук)', '2499 ₸'],
      ['Бефстроганов (говядина, лук, сливки; гарнир отдельно)', '2199 ₸'],
      ['Чахохбили (курица, перец болгарский, грузинские специи, лук)', '2599 ₸'],
      ['Жаровня из курицы (куриное филе, болгарский перец, зелень, специи)', '2599 ₸'],
      ['Оджахури (филе, лук, картофель, помидоры, зелень, специи)', '2599 ₸'],
      ['Куриная грудка с грибами в сливочном соусе', '2899 ₸'],
      ['Котлеты по-домашнему, 2 шт (гарнир отдельно)', '1599 ₸'],
      ['Долма', '2399 ₸']
    ),
  },
  {
    title: 'Восточная кухня',
    groups: items(
      ['Цомян', '1799 ₸'],
      ['Гуйру лагман', '2499 ₸'],
      ['Манты', '1999 ₸'],
      ['Куырдак', '3499 ₸'],
      ['Сырне', '3499 ₸']
    ),
  },
  {
    title: 'Пицца',
    groups: items(
      ['Пицца пепперони', '2599 ₸'],
      ['Пицца маргарита', '2399 ₸'],
      ['Пицца из курицы', '3299 ₸'],
      ['Пицца «4 сезона»', '2799 ₸'],
      ['Пицца «Цезарь»', '3399 ₸']
    ),
  },
  {
    title: 'Хлеб',
    groups: items(
      ['Баурсаки', '999 ₸'],
      ['Хлебная корзина', '1499 ₸'],
      ['Лаваш', '299 ₸'],
      ['Лепёшки', '299 ₸']
    ),
  },
  {
    title: 'Шашлыки',
    groups: items(
      ['Баранина', '1700 ₸'],
      ['Антрекот из баранины', '2800 ₸'],
      ['Люля из баранины', '1500 ₸'],
      ['Кавказский', '2400 ₸'],
      ['Окорочка', '1200 ₸'],
      ['Крылышки', '1300 ₸'],
      ['Шашлык из утки', '1400 ₸'],
      ['Печень в оболочке', '1600 ₸'],
      ['Грибы', '1600 ₸'],
      ['Овощи', '1200 ₸']
    ),
  },
  {
    title: 'Блюда на компанию',
    groups: items(
      ['Традиционный бесбармак', 'на 6 перс. — 18999 ₸ · на 4 перс. — 13999 ₸'],
      ['Куырдак из баранины', 'на 6 перс. — 19499 ₸ · на 4 перс. — 13499 ₸'],
      ['Сырне', 'на 6 перс. — 19499 ₸ · на 4 перс. — 14499 ₸'],
      ['Дапанджи с рисом', 'на 6 перс. — 13999 ₸ · на 4 перс. — 10999 ₸'],
      ['Плов праздничный с говядиной', 'на 6 перс. — 16999 ₸ · на 4 перс. — 12999 ₸'],
      ['Манты', 'на 6 перс. — 10499 ₸'],
      ['Коктал', '27999 ₸']
    ),
  },
  {
    title: 'Соусы',
    groups: items(
      ['Аджика домашняя', '499 ₸'],
      ['Чесночный соус', '399 ₸'],
      ['Белый соус с зеленью', '399 ₸'],
      ['Красный соус с зеленью', '399 ₸'],
      ['Сырный соус', '399 ₸'],
      ['Кетчуп', '299 ₸'],
      ['Майонез', '299 ₸'],
      ['Соевый соус', '350 ₸']
    ),
  },
  {
    title: 'Блюда из рыбы',
    groups: items(
      ['Форель со сливочным соусом', '3599 ₸'],
      ['Жареный судак (на подушке с пюре)', '3599 ₸'],
      ['Дорадо с кисло-сладким соусом', '4599 ₸']
    ),
  },
  {
    title: 'Сеты на 8 персон',
    groups: items(
      ['Мясной сет (бараньи рёбра, антрекоты, говяжьи медальоны, куриные ножки, колбаски на гриле из конины, долма, овощи на гриле, запечённый картофель, соусы)', '27999 ₸'],
      ['Рыбное плато (форель, лосось, филе судака, лимоны, овощи гриль, рис)', '33999 ₸'],
      ['Сет из птицы (куриные ножки, крылья, филе, утка, зелень, картофель фри)', '22999 ₸']
    ),
  },
  {
    title: 'Десерты',
    groups: items(
      ['Медовик', '1599 ₸'],
      ['Наполеон', '1599 ₸'],
      ['Пахлава', '1899 ₸']
    ),
  },
  {
    title: 'Стейки',
    groups: items(
      ['Рибай с овощами гриль', '6099 ₸'],
      ['Тибон с овощами', '5799 ₸'],
      ['Стейк из форели', '4799 ₸'],
      ['Стейк из лосося', '4799 ₸']
    ),
  },
  {
    title: 'Паста',
    groups: items(
      ['Феттучини альфредо с сёмгой', '3599 ₸'],
      ['Феттучини альфредо с курицей', '2199 ₸'],
      ['Феттучини альфредо с креветками', '3099 ₸'],
      ['Болоньезе', '2199 ₸']
    ),
  },
  {
    title: 'Гарниры',
    groups: items(
      ['Фри', '799 ₸'],
      ['Рис', '599 ₸'],
      ['Овощи гриль', '899 ₸'],
      ['Картофель по-деревенски', '799 ₸'],
      ['Пюре', '599 ₸'],
      ['Сложный гарнир', '799 ₸']
    ),
  },
  {
    title: 'Бой посуды',
    note: 'на всякий случай',
    groups: items(
      ['Рюмка, стакан, чайная чашка, блюдце', '999 ₸'],
      ['Тарелки средние, пивная кружка, сахарница, фужеры, миски, кремянка', '1999 ₸'],
      ['Большие тарелки, чайник, кувшин, графин, фруктовница, керамическая посуда', '3999 ₸'],
      ['Чистка имущества', '4999 ₸'],
      ['Порча имущества', 'по стоимости имущества']
    ),
  },
];

const BAR_CATEGORIES: MenuCategory[] = [
  {
    title: 'Коктейли',
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
    title: 'Крепкий алкоголь',
    note: '50 мл',
    groups: [
      {
        subtitle: 'Виски',
        items: [
          { name: 'William Lawson', price: '1050 ₸' },
          { name: 'Jameson', price: '1450 ₸' },
          { name: "Ballantine's", price: '1000 ₸' },
          { name: "Jack Daniel's", price: '1855 ₸' },
          { name: 'Chivas 12 летний', price: '2900 ₸' },
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
          { name: 'Аскенели 3 года', price: '850 ₸' },
          { name: 'Казахстан 3*', price: '700 ₸' },
          { name: 'Казахстан 5*', price: '1050 ₸' },
          { name: 'Арарат 5*', price: '1300 ₸' },
        ],
      },
      {
        subtitle: 'Водка',
        items: [
          { name: 'Столичная Excellent', price: '650 ₸' },
          { name: 'Царская особая', price: '1000 ₸' },
          { name: 'Царская золотая', price: '1200 ₸' },
          { name: 'Бульбашъ особая', price: '500 ₸' },
          { name: 'Finlandia', price: '1100 ₸' },
          { name: 'Кызылжар', price: '600 ₸' },
          { name: 'Grey Goose', price: '1900 ₸' },
        ],
      },
    ],
  },
  {
    title: 'Вино',
    note: 'бутылка 0.75 л',
    groups: [
      {
        subtitle: 'Белое сухое',
        items: [
          { name: 'Долины Грузии Тбилиси', price: '7050 ₸' },
          { name: 'Carmen Insigne Sauvignon Blanc', price: '7500 ₸' },
        ],
      },
      {
        subtitle: 'Белое полусухое',
        items: [
          { name: 'Долины Грузии Сачино', price: '7400 ₸' },
          { name: 'Chateau Vartely Chardonnay', price: '5900 ₸' },
        ],
      },
      {
        subtitle: 'Белое полусладкое',
        items: [
          { name: 'Алазанская Долина Kvareli', price: '5300 ₸' },
          { name: 'Алазанская Долина Teliani Valley', price: '6750 ₸' },
        ],
      },
      {
        subtitle: 'Красное полусухое',
        items: [
          { name: 'Pirosmani Kvareli', price: '7200 ₸' },
          { name: 'Chateau Vartely Cabernet Sauvignon', price: '5900 ₸' },
        ],
      },
      {
        subtitle: 'Красное полусладкое',
        items: [
          { name: 'Алазанская Долина Kvareli', price: '6500 ₸' },
          { name: 'Долины Грузии Киндзмараули', price: '12200 ₸' },
        ],
      },
      {
        subtitle: 'Вино игристое',
        items: [{ name: 'Martini Asti', price: '14000 ₸' }],
      },
    ],
  },
  {
    title: 'Шампанское',
    groups: items(
      ['Шампанское советское', '5500 ₸'],
      ['Шампанское Diana', '5400 ₸']
    ),
  },
  {
    title: 'Пиво',
    groups: items(
      ['Bud 5% (0.44 л)', '1700 ₸'],
      ['Heineken сидр 4.7% (0.5 л)', '1100 ₸'],
      ['Безалкогольное пиво', '1100 ₸'],
      ['Прага (разливное)', '1100 ₸']
    ),
  },
  {
    title: 'Лимонады',
    note: 'графин / стакан',
    groups: items(
      ['Ягодный микс', '1790 ₸ / 500 ₸'],
      ['Манго-Маракуйя', '1790 ₸ / 500 ₸'],
      ['Маракуйя-Апельсин', '1790 ₸ / 500 ₸'],
      ['Киви-Яблоко', '1790 ₸ / 500 ₸'],
      ['Киви-Тархун', '1790 ₸ / 500 ₸'],
      ['Тархун', '1790 ₸ / 500 ₸'],
      ['Клубника-Маракуйя', '1790 ₸ / 500 ₸'],
      ['Классический мохито', '1990 ₸ / 600 ₸'],
      ['Гранатовый мохито', '1990 ₸ / 600 ₸'],
      ['Ice Tea', '1790 ₸ / 500 ₸']
    ),
  },
  {
    title: 'Напитки',
    groups: items(
      ['Вода с/без газа', '600 ₸'],
      ['Coca-Cola / Zero (1 л)', '1200 ₸'],
      ['Coca-Cola (0.25 л)', '800 ₸'],
      ['Red Bull (0.25 л)', '1100 ₸'],
      ['Schweppes (0.33 л)', '1300 ₸'],
      ['Боржоми (0.25 л)', '1100 ₸'],
      ['Натуральный сок (1 л)', '1300 ₸']
    ),
  },
  {
    title: 'Аперитив',
    note: '100 мл',
    groups: items(['Aperol', '1500 ₸'], ['Martini Bianco', '1500 ₸']),
  },
  {
    title: 'Чай / Кофе',
    groups: items(
      ['Чёрный чай', '300 ₸ / 950 ₸'],
      ['Зелёный чай', '300 ₸ / 900 ₸'],
      ['Чай с молоком', '400 ₸ / 1100 ₸'],
      ['Ташкентский чай', '1700 ₸'],
      ['Марокканский чай', '1990 ₸'],
      ['Кофе 3в1', 'уточнить цену']
    ),
  },
  {
    title: 'К чаю',
    groups: items(
      ['Мёд', '500 ₸'],
      ['Лимон', '500 ₸'],
      ['Молоко', '300 ₸'],
      ['Казахстанский шоколад', '1500 ₸'],
      ['Alpen Gold', '1500 ₸']
    ),
  },
  {
    title: 'К пиву',
    groups: items(
      ['Арахис', '1100 ₸'],
      ['Гренки', '900 ₸'],
      ['Фисташки', '1390 ₸'],
      ['Чечил', '950 ₸'],
      ['Lays', '1100 ₸']
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
          <nav className="nav__links" aria-label="Основная навигация">
            <Link href="/" className="nav__link">Главная</Link>
            <Link href="/menu" className="nav__link nav__link--active">Меню</Link>
            <Link href="/gallery" className="nav__link">Галерея</Link>
            <Link href="/history" className="nav__link">История</Link>
            <a href="/#contacts" className="nav__link nav__link--cta">Контакты</a>
            <div className="nav__lang" aria-label="Выбор языка">
              <Link href="/kz_menu" className="nav__lang-btn">ҚАЗ</Link>
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
          <div className="mobile-menu__lang">
            <Link href="/kz_menu" className="mobile-menu__lang-btn" onClick={() => setMenuOpen(false)}>ҚАЗ</Link>
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

      {/* ЗАГОЛОВОК СТРАНИЦЫ */}
      <section className="menu-hero">
        <div className="menu-hero__inner">
          <p className="eyebrow eyebrow--center">MAKAN</p>
          <h1 className="menu-hero__title">Меню</h1>
          <p className="menu-hero__text">
            Кухня, бар и всё, что подаётся в зале. Цены — в тенге, обслуживание 10% не включено.
          </p>
          <Swash className="menu-hero__swash" />
        </div>
      </section>

      {/* Бегущая строка — тот же приём, что и на главной: короткая пауза для глаза */}
      <div className="marquee" aria-hidden="true">
        <div className="marquee__track">
          {Array.from({ length: 2 }).map((_, rep) => (
            <span className="marquee__group" key={rep}>
              {['MAKAN', 'Шашлык', 'Грузинские блюда', 'Бар', 'Коктейли', 'Лимонады'].map((w) => (
                <span className="marquee__item" key={w}>
                  {w}
                  <Swash className="marquee__swash" />
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* ПЕРЕКЛЮЧАТЕЛЬ КУХНЯ / БАР */}
      <div className="menu-tabs">
        <button
          type="button"
          className={`menu-tab ${tab === 'food' ? 'menu-tab--active' : ''}`}
          onClick={() => setTab('food')}
        >
          Кухня
        </button>
        <button
          type="button"
          className={`menu-tab ${tab === 'bar' ? 'menu-tab--active' : ''}`}
          onClick={() => setTab('bar')}
        >
          Бар
        </button>
      </div>

      {/* БЫСТРЫЕ ССЫЛКИ НА КАТЕГОРИИ */}
      <nav className="menu-toc" aria-label="Категории меню" key={tab}>
        {categories.map((c) => (
          <a key={c.title} href={`#${slugify(c.title)}`} className="menu-toc__chip">
            {c.title}
          </a>
        ))}
      </nav>

      {/* КАТЕГОРИИ МЕНЮ */}
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
      
      {/* ДИСКЛЕЙМЕР */}
<section className="disclaimer">
  <p className="disclaimer__text">
    Администрация кафе не несёт ответственности за сохранность личных вещей гостей,
    а также за перебои электроснабжения, произошедшие по причинам, не зависящим от администрации.
  </p>
</section>

      <footer className="footer">
        <div className="footer__inner">
          <div className="footer__col">
            <div className="footer__mark">
              MAKAN <span>кафесі</span>
            </div>
            <p className="footer__tag">Вкусная еда и атмосфера, в которой хочется задержаться</p>
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