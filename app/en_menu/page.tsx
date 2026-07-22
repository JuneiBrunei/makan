'use client';

import { useEffect, useRef, useState, type MouseEvent as ReactMouseEvent } from 'react';
import Link from 'next/link';
import { Cormorant_Garamond, Manrope } from 'next/font/google';

/**
 * MAKAN — "Menu" page
 * =========================================================================
 * Reuses the same header/footer/design system as the main page (page.tsx):
 * dark background, gold accents, Cormorant Garamond + Manrope fonts.
 *
 * Data from PDF menus (kitchen + bar) translated into English.
 * Currency is displayed in ₸ (tenge).
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

const ADDRESS = '67 Gagarina St, Talgar';
const PHONE = '+7 708 605 9354';
const PHONE_HREF = 'tel:+77086059354';
const INSTAGRAM = 'https://www.instagram.com/makan_talgar/';
const WHATSAPP = 'https://wa.me/77086059354';

const hours = [
  { day: 'Monday — Thursday', time: '10:00 — 23:00' },
  { day: 'Friday — Saturday', time: '10:00 — 23:00' },
  { day: 'Sunday', time: '10:00 — 23:00' },
];

const navLinks = [
  { href: '/en_main', label: 'Home' },
  { href: '/en_menu', label: 'Menu' },
  { href: '/en_gallery', label: 'Gallery' },
  { href: '/en_history', label: 'History' },
  { href: '/en_main#contacts', label: 'Contacts' },
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
        setStatus({ open: true, text: `Open · until ${formatHour(close)}` });
      } else {
        const nextOpen = t < open ? open : WEEKLY_HOURS[(day + 1) % 7][0];
        setStatus({ open: false, text: `Closed · opens at ${formatHour(nextOpen)}` });
      }
    };
    compute();
    const id = setInterval(compute, 60000);
    return () => clearInterval(id);
  }, []);

  return status;
}

/** Swash line SVG flourish */
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
   MENU DATA — Translated into English
   ========================================================================= */

type MenuItem = { name: string; price: string };
type MenuGroup = { subtitle?: string; items: MenuItem[] };
type MenuCategory = { title: string; note?: string; groups: MenuGroup[] };

function items(...pairs: [string, string][]): MenuGroup[] {
  return [{ items: pairs.map(([name, price]) => ({ name, price })) }];
}

const FOOD_CATEGORIES: MenuCategory[] = [
  {
    title: 'Breakfast',
    groups: items(
      ['Georgian Breakfast (sausages, fried eggs, vegetable omelet, greens, beans)', '2599 ₸'],
      ['Syrniki / Cottage Cheese Pancakes (jam, honey, sour cream on request)', '2299 ₸'],
      ['Oatmeal with Seasonal Fruit', '1199 ₸'],
      ['Shakshuka (eggs, tomatoes, bell peppers, onions, spices)', '2299 ₸'],
      ['Crepes with Cottage Cheese', '1599 ₸'],
      ['Crepes with Minced Meat', '1799 ₸'],
      ['Turkish Breakfast (feta cheese, olives, boiled eggs, cherry tomatoes, cucumbers, greens)', '1599 ₸']
    ),
  },
  {
    title: 'Appetizers',
    groups: items(
      ['Caucasian Platter (tomatoes, cucumbers, feta cheese, black olives, green onions, dill, cilantro, lemon, bell peppers)', '3499 ₸'],
      ['Assorted Pickles (pickled cucumbers, tomatoes, sauerkraut, spicy peppers)', '3299 ₸'],
      ['Horse Meat Platter (zhaya, kazy, horse tongue)', '6599 ₸'],
      ['Fish Platter', '5499 ₸'],
      ['Eggplant Rolls with Walnut Filling', '2799 ₸'],
      ['Russian Appetizer (herring, potatoes, pickled cucumbers, onions, lemon, sauerkraut)', '3399 ₸']
    ),
  },
  {
    title: 'Soups',
    groups: items(
      ['Kharcho (beef, rice, Georgian spices, walnuts)', '1550 ₸'],
      ['Lentil Soup', '1350 ₸'],
      ['Homemade Chicken Noodle Soup', '1299 ₸'],
      ['Shorpa (lamb, potatoes, bell peppers, onions, tomatoes, spices)', '2099 ₸'],
      ['Homemade Pelmeni (beef dumplings, onions, dough, sour cream, spices)', '1699 ₸'],
      ['Beshbarmak / Kazakh Meat (beef/horsemeat, kazy, pasta sheets, broth, onion sauce)', '1899 ₸'],
      ['Khash — Traditional Caucasian Soup (beef feet, garlic, herbs, broth, lavash)', '2499 ₸'],
      ['Tom Yum (shrimp, mushrooms, cherry tomatoes, onions, coconut milk, tom yum paste, lime, cilantro, chili optional)', '3499 ₸']
    ),
  },
  {
    title: 'Salads',
    groups: items(
      ['Signature "Makan" Salad (crispy eggplant in sweet and sour sauce, salad mix, beef, cherry tomatoes, spices)', '2799 ₸'],
      ['Salmon Caesar (iceberg lettuce, salmon, cherry tomatoes, parmesan, croutons, egg, Caesar dressing)', '2899 ₸'],
      ['Chicken Caesar (iceberg lettuce, crispy chicken fillet, cherry tomatoes, parmesan, croutons, Caesar dressing, egg)', '2299 ₸'],
      ['Greek Salad (tomatoes, cucumbers, bell peppers, olives, lemon, salad leaves, red onion, olive oil, feta)', '1999 ₸'],
      ['Spicy "Arzu" Salad (cucumbers, sweet peppers, red onion, garlic, beef, hot pepper, soy sauce, oil)', '2199 ₸'],
      ['Georgian "Tsitsibeli" Salad (mushrooms, chicken fillet, cucumbers, shoe-string potatoes, sauce)', '2699 ₸'],
      ['Chef\'s Special Salad (seared feta, cherry tomatoes, mushrooms, garlic, oil)', '2499 ₸'],
      ['Turmeric Salad (cauliflower, broccoli, bell peppers, cherry tomatoes, chicken fillet, turmeric dressing)', '2199 ₸'],
      ['"Tbilisi" Salad (beef, red kidney beans, bell pepper, cilantro, walnuts, lemon juice, oil)', '2799 ₸'],
      ['Caucasian Salad (tomatoes, cucumbers, red onion, cilantro, basil, oil)', '2199 ₸'],
      ['Fresh Garden Salad (tomatoes, cucumbers, onions)', '1199 ₸']
    ),
  },
  {
    title: 'Hot Appetizers',
    groups: items(
      ['Spicy Chicken Wings', '2499 ₸'],
      ['Garlic Butter Shrimp', '3099 ₸'],
      ['Mini Meat Chebureks', '3 pcs — 1399 ₸ · 5 pcs — 2199 ₸'],
      ['Mini Cheese & Herb Chebureks', '3 pcs — 1399 ₸ · 5 pcs — 1999 ₸'],
      ['Sausage Platter (beef, horsemeat, lamb, chicken)', '12499 ₸ · single portion 3799 ₸'],
      ['Mini Meat Samsa', '5 pcs — 2199 ₸'],
      ['Chicken Nuggets', '6 pcs — 1399 ₸']
    ),
  },
  {
    title: 'Fresh Bakery',
    groups: items(
      ['Megrelian Khachapuri', '3099 ₸'],
      ['Imeretian Khachapuri', '2799 ₸'],
      ['Meat Khychins', '1899 ₸'],
      ['Adjaruli Khachapuri', '2999 ₸'],
      ['Cheese & Potato Khychins', '1599 ₸']
    ),
  },
  {
    title: 'Main Courses',
    groups: items(
      ['Sizzling Beef Skillet', '2599 ₸'],
      ['Thai-Style Sizzling Beef (beef, bell peppers, onions, garlic, chili on request, soy sauce)', '2399 ₸'],
      ['Meat Khinkali (Georgian Dumplings)', '2599 ₸'],
      ['Georgian-Style Lamb (lamb, bell peppers, tomato paste, Georgian spices, onions)', '2499 ₸'],
      ['Beef Stroganoff (beef, onions, cream; side dish separate)', '2199 ₸'],
      ['Chakhokhbili (stewed chicken, bell peppers, Georgian spices, onions)', '2599 ₸'],
      ['Sizzling Chicken Skillet (chicken fillet, bell peppers, herbs, spices)', '2599 ₸'],
      ['Ojdakhuri (meat, onions, potatoes, tomatoes, herbs, spices)', '2599 ₸'],
      ['Creamy Mushroom Chicken Breast', '2899 ₸'],
      ['Homemade Meat Patties, 2 pcs (side dish separate)', '1599 ₸'],
      ['Dolma (stuffed grape leaves)', '2399 ₸']
    ),
  },
  {
    title: 'Oriental Cuisine',
    groups: items(
      ['Tsomian (Pan-fried Lagman noodles)', '1799 ₸'],
      ['Guyru Lagman', '2499 ₸'],
      ['Steamed Manti Dumplings', '1999 ₸'],
      ['Kuyrdak (roasted organ meats and meat with potatoes)', '3499 ₸'],
      ['Syrne (slow-cooked tender lamb)', '3499 ₸']
    ),
  },
  {
    title: 'Pizza',
    groups: items(
      ['Pepperoni Pizza', '2599 ₸'],
      ['Margherita Pizza', '2399 ₸'],
      ['Chicken Pizza', '3299 ₸'],
      ['Four Seasons Pizza', '2799 ₸'],
      ['Caesar Pizza', '3399 ₸']
    ),
  },
  {
    title: 'Bread Basket',
    groups: items(
      ['Baursaks (fried dough puffs)', '999 ₸'],
      ['Bread Basket', '1499 ₸'],
      ['Lavash Flatbread', '299 ₸'],
      ['Traditional Tandoor Bread', '299 ₸']
    ),
  },
  {
    title: 'Shashlik / Kebabs',
    groups: items(
      ['Lamb Kebab', '1650 ₸'],
      ['Lamb Rib Kebab / Chops', '2800 ₸'],
      ['Minced Lamb Lyulya Kebab', '1500 ₸'],
      ['Caucasian Kebab', '2400 ₸'],
      ['Chicken Thigh Kebab', '1200 ₸'],
      ['Chicken Wing Kebab', '1300 ₸'],
      ['Duck Kebab', '1400 ₸'],
      ['Wrapped Beef Liver Kebab', '1600 ₸'],
      ['Grilled Mushrooms', '1600 ₸'],
      ['Grilled Vegetables', '1200 ₸']
    ),
  },
  {
    title: 'Sharing Platters (Group Meals)',
    groups: items(
      ['Traditional Beshbarmak', 'for 6 pers. — 18999 ₸ · for 4 pers. — 13999 ₸'],
      ['Lamb Kuyrdak', 'for 6 pers. — 19499 ₸ · for 4 pers. — 13499 ₸'],
      ['Syrne (Slow-cooked Lamb)', 'for 6 pers. — 19499 ₸ · for 4 pers. — 14499 ₸'],
      ['Dapanji with Rice (spicy chicken stew)', 'for 6 pers. — 13999 ₸ · for 4 pers. — 10999 ₸'],
      ['Festive Beef Plov (Pilaf)', 'for 6 pers. — 16999 ₸ · for 4 pers. — 12999 ₸'],
      ['Steamed Manti Dumplings', 'for 6 pers. — 10499 ₸'],
      ['Koktal (Smoked Whole Fish)', '27999 ₸']
    ),
  },
  {
    title: 'Sauces',
    groups: items(
      ['Homemade Adjika', '499 ₸'],
      ['Garlic Sauce', '399 ₸'],
      ['White Herb Sauce', '399 ₸'],
      ['Red Herb Sauce', '399 ₸'],
      ['Cheese Sauce', '399 ₸'],
      ['Ketchup', '299 ₸'],
      ['Mayonnaise', '299 ₸'],
      ['Soy Sauce', '350 ₸']
    ),
  },
  {
    title: 'Fish Dishes',
    groups: items(
      ['Trout in Cream Sauce', '3599 ₸'],
      ['Pan-seared Pike-perch (served over mashed potatoes)', '3599 ₸'],
      ['Dorado in Sweet and Sour Sauce', '4599 ₸']
    ),
  },
  {
    title: 'Sets for 8 Persons',
    groups: items(
      ['Meat Set (lamb ribs, chops, beef medallions, chicken thighs, grilled horsemeat sausages, dolma, grilled vegetables, baked potatoes, sauces)', '27999 ₸'],
      ['Seafood Platter (trout, salmon, pike-perch fillet, lemons, grilled vegetables, rice)', '33999 ₸'],
      ['Poultry Set (chicken thighs, wings, fillet, duck, greens, french fries)', '22999 ₸']
    ),
  },
  {
    title: 'Desserts',
    groups: items(
      ['Honey Cake (Medovik)', '1599 ₸'],
      ['Napoleon Cake', '1599 ₸'],
      ['Baklava', '1899 ₸']
    ),
  },
  {
    title: 'Steaks',
    groups: items(
      ['Ribeye Steak with Grilled Vegetables', '6099 ₸'],
      ['T-Bone Steak with Vegetables', '5799 ₸'],
      ['Trout Steak', '4799 ₸'],
      ['Salmon Steak', '4799 ₸']
    ),
  },
  {
    title: 'Pasta',
    groups: items(
      ['Fettuccine Alfredo with Salmon', '3599 ₸'],
      ['Fettuccine Alfredo with Chicken', '2199 ₸'],
      ['Fettuccine Alfredo with Shrimp', '3099 ₸'],
      ['Spaghetti Bolognese', '2199 ₸']
    ),
  },
  {
    title: 'Side Dishes',
    groups: items(
      ['French Fries', '799 ₸'],
      ['Steamed Rice', '599 ₸'],
      ['Grilled Vegetables', '899 ₸'],
      ['Potato Wedges', '799 ₸'],
      ['Mashed Potatoes', '599 ₸'],
      ['Combo Side Dish', '799 ₸']
    ),
  },
  {
    title: 'Tableware Damage Fees',
    note: 'just in case',
    groups: items(
      ['Shot glass, drinking glass, teacup, saucer', '999 ₸'],
      ['Medium plates, beer mug, sugar bowl, wine glasses, bowls, ice cream bowl', '1999 ₸'],
      ['Large plates, teapot, pitcher, carafe, fruit bowl, ceramic dishware', '3999 ₸'],
      ['Property cleaning fee', '4999 ₸'],
      ['Property damage', 'at full market value']
    ),
  },
];

const BAR_CATEGORIES: MenuCategory[] = [
  {
    title: 'Cocktails',
    note: '250 ml',
    groups: items(
      ['Tequila Sunrise', '2100 ₸'],
      ['Sex on the Beach', '2000 ₸'],
      ['Long Island Iced Tea', '2500 ₸'],
      ['Aperol Spritz', '2500 ₸'],
      ['Mojito', '2400 ₸'],
      ['Blue Lagoon', '2500 ₸'],
      ['Gin & Tonic', '2300 ₸'],
      ['Pina Colada', '2300 ₸']
    ),
  },
  {
    title: 'Spirits',
    note: '50 ml',
    groups: [
      {
        subtitle: 'Whiskey',
        items: [
          { name: 'William Lawson\'s', price: '1050 ₸' },
          { name: 'Jameson', price: '1450 ₸' },
          { name: "Ballantine's", price: '1000 ₸' },
          { name: "Jack Daniel's", price: '1855 ₸' },
          { name: 'Chivas Regal 12 YO', price: '2900 ₸' },
        ],
      },
      {
        subtitle: 'Tequila',
        items: [
          { name: 'Olmeca Silver', price: '1100 ₸' },
          { name: 'Olmeca Gold', price: '1300 ₸' },
        ],
      },
      {
        subtitle: 'Gin',
        items: [{ name: 'Beefeater', price: '1050 ₸' }],
      },
      {
        subtitle: 'Rum',
        items: [
          { name: 'Bacardi Carta Negra', price: '950 ₸' },
          { name: 'Bacardi Carta Blanca', price: '950 ₸' },
          { name: 'Oakheart', price: '950 ₸' },
        ],
      },
      {
        subtitle: 'Cognac & Brandy',
        items: [
          { name: 'Askaneli 3 Stars', price: '850 ₸' },
          { name: 'Kazakhstan 3*', price: '700 ₸' },
          { name: 'Kazakhstan 5*', price: '1050 ₸' },
          { name: 'Ararat 5*', price: '1300 ₸' },
        ],
      },
      {
        subtitle: 'Vodka',
        items: [
          { name: 'Stolichnaya Excellent', price: '650 ₸' },
          { name: 'Tsarskaya Special', price: '1000 ₸' },
          { name: 'Tsarskaya Gold', price: '1200 ₸' },
          { name: 'Bulbash Special', price: '500 ₸' },
          { name: 'Finlandia', price: '1100 ₸' },
          { name: 'Kyzylzhar', price: '600 ₸' },
          { name: 'Grey Goose', price: '1900 ₸' },
        ],
      },
    ],
  },
  {
    title: 'Wine',
    note: '0.75 L bottle',
    groups: [
      {
        subtitle: 'White Dry',
        items: [
          { name: 'Valleys of Georgia Tbilisi', price: '7050 ₸' },
          { name: 'Carmen Insigne Sauvignon Blanc', price: '7500 ₸' },
        ],
      },
      {
        subtitle: 'White Semi-Dry',
        items: [
          { name: 'Valleys of Georgia Sachino', price: '7400 ₸' },
          { name: 'Chateau Vartely Chardonnay', price: '5900 ₸' },
        ],
      },
      {
        subtitle: 'White Semi-Sweet',
        items: [
          { name: 'Alazani Valley Kvareli', price: '5300 ₸' },
          { name: 'Alazani Valley Teliani Valley', price: '6750 ₸' },
        ],
      },
      {
        subtitle: 'Red Semi-Dry',
        items: [
          { name: 'Pirosmani Kvareli', price: '7200 ₸' },
          { name: 'Chateau Vartely Cabernet Sauvignon', price: '5900 ₸' },
        ],
      },
      {
        subtitle: 'Red Semi-Sweet',
        items: [
          { name: 'Alazani Valley Kvareli', price: '6500 ₸' },
          { name: 'Valleys of Georgia Kindzmarauli', price: '12200 ₸' },
        ],
      },
      {
        subtitle: 'Sparkling Wine',
        items: [{ name: 'Martini Asti', price: '14000 ₸' }],
      },
    ],
  },
  {
    title: 'Champagne',
    groups: items(
      ['Soviet Champagne', '5500 ₸'],
      ['Diana Champagne', '5400 ₸']
    ),
  },
  {
    title: 'Beer',
    groups: items(
      ['Bud 5% (0.44 L)', '1700 ₸'],
      ['Heineken Cider 4.7% (0.5 L)', '1100 ₸'],
      ['Non-Alcoholic Beer', '1100 ₸'],
      ['Praga (Draft)', '1100 ₸']
    ),
  },
  {
    title: 'Limonades',
    note: 'pitcher / glass',
    groups: items(
      ['Berry Mix', '1790 ₸ / 500 ₸'],
      ['Mango-Passion Fruit', '1790 ₸ / 500 ₸'],
      ['Passion Fruit-Orange', '1790 ₸ / 500 ₸'],
      ['Kiwi-Apple', '1790 ₸ / 500 ₸'],
      ['Kiwi-Tarragon', '1790 ₸ / 500 ₸'],
      ['Tarragon', '1790 ₸ / 500 ₸'],
      ['Strawberry-Passion Fruit', '1790 ₸ / 500 ₸'],
      ['Classic Mojito', '1990 ₸ / 600 ₸'],
      ['Pomegranate Mojito', '1990 ₸ / 600 ₸'],
      ['Ice Tea', '1790 ₸ / 500 ₸']
    ),
  },
  {
    title: 'Soft Drinks',
    groups: items(
      ['Still / Sparkling Water', '600 ₸'],
      ['Coca-Cola / Zero (1 L)', '1200 ₸'],
      ['Coca-Cola (0.25 L)', '800 ₸'],
      ['Red Bull (0.25 L)', '1100 ₸'],
      ['Schweppes (0.33 L)', '1300 ₸'],
      ['Borjomi Mineral Water (0.25 L)', '1100 ₸'],
      ['Natural Juice (1 L)', '1300 ₸']
    ),
  },
  {
    title: 'Aperitifs',
    note: '100 ml',
    groups: items(['Aperol', '1500 ₸'], ['Martini Bianco', '1500 ₸']),
  },
  {
    title: 'Tea & Coffee',
    groups: items(
      ['Black Tea', '300 ₸ / 950 ₸'],
      ['Green Tea', '300 ₸ / 900 ₸'],
      ['Milk Tea', '400 ₸ / 1100 ₸'],
      ['Tashkent Tea (Citrus & Mint)', '1700 ₸'],
      ['Moroccan Mint Tea', '1990 ₸'],
      ['Instant Coffee 3-in-1', 'ask for price']
    ),
  },
  {
    title: 'Tea Additions',
    groups: items(
      ['Honey', '500 ₸'],
      ['Lemon', '500 ₸'],
      ['Milk', '300 ₸'],
      ['Kazakhstan Chocolate Bar', '1500 ₸'],
      ['Alpen Gold Chocolate', '1500 ₸']
    ),
  },
  {
    title: 'Beer Snacks',
    groups: items(
      ['Peanuts', '1100 ₸'],
      ['Garlic Croutons', '900 ₸'],
      ['Pistachios', '1390 ₸'],
      ['Chechil Smoked Cheese', '950 ₸'],
      ['Lay\'s Potato Chips', '1100 ₸']
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
            MAKAN <span>cafe</span>
          </Link>
          <nav className="nav__links" aria-label="Main navigation">
            <Link href="/en_main" className="nav__link">Home</Link>
            <Link href="/en_menu" className="nav__link nav__link--active">Menu</Link>
            <Link href="/en_gallery" className="nav__link">Gallery</Link>
            <Link href="/en_history" className="nav__link">History</Link>
            <a href="/en_main#contacts" className="nav__link nav__link--cta">Contacts</a>
            <div className="nav__lang" aria-label="Select language">
              <Link href="/kz_menu" className="nav__lang-btn">ҚАЗ</Link>
              <span className="nav__lang-dot" aria-hidden="true">·</span>
              <Link href="/menu" className="nav__lang-btn">РУС</Link>
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
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
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
        <nav className="mobile-menu__links" aria-label="Mobile navigation">
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
            <Link href="/menu" className="mobile-menu__lang-btn" onClick={() => setMenuOpen(false)}>РУС</Link>
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

      {/* PAGE HEADER */}
      <section className="menu-hero">
        <div className="menu-hero__inner">
          <p className="eyebrow eyebrow--center">MAKAN</p>
          <h1 className="menu-hero__title">Menu</h1>
          <p className="menu-hero__text">
            Kitchen, bar, and everything served in our main hall. Prices are in KZT, 10% service charge is excluded.
          </p>
          <Swash className="menu-hero__swash" />
        </div>
      </section>

      {/* Marquee */}
      <div className="marquee" aria-hidden="true">
        <div className="marquee__track">
          {Array.from({ length: 2 }).map((_, rep) => (
            <span className="marquee__group" key={rep}>
              {['MAKAN', 'Shashlik', 'Georgian Cuisine', 'Bar', 'Cocktails', 'Lemonades'].map((w) => (
                <span className="marquee__item" key={w}>
                  {w}
                  <Swash className="marquee__swash" />
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* FOOD / BAR SWITCHER */}
      <div className="menu-tabs">
        <button
          type="button"
          className={`menu-tab ${tab === 'food' ? 'menu-tab--active' : ''}`}
          onClick={() => setTab('food')}
        >
          Kitchen
        </button>
        <button
          type="button"
          className={`menu-tab ${tab === 'bar' ? 'menu-tab--active' : ''}`}
          onClick={() => setTab('bar')}
        >
          Bar
        </button>
      </div>

      {/* QUICK CATEGORY LINKS */}
      <nav className="menu-toc" aria-label="Menu categories" key={tab}>
        {categories.map((c) => (
          <a key={c.title} href={`#${slugify(c.title)}`} className="menu-toc__chip">
            {c.title}
          </a>
        ))}
      </nav>

      {/* MENU CATEGORIES */}
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
      
      {/* DISCLAIMER */}
      <section className="disclaimer">
        <p className="disclaimer__text">
          The cafe administration is not responsible for guests' personal belongings,
          nor for power outages occurring due to circumstances beyond the administration's control.
        </p>
      </section>

      <footer className="footer">
        <div className="footer__inner">
          <div className="footer__col">
            <div className="footer__mark">
              MAKAN <span>cafe</span>
            </div>
            <p className="footer__tag">Delicious food and an atmosphere that makes you want to stay</p>
          </div>

          <div className="footer__col footer__col--meta">
            <p>{ADDRESS}</p>
            <p><a href={PHONE_HREF}>{PHONE}</a></p>
            <p>Daily, 10:00 — 23:00</p>
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