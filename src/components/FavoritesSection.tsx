import { useMemo } from 'react';
import { ShoppingBag, Utensils } from 'lucide-react';
import { MENU_ITEMS } from '../data/menuData';
import { UI_COPY, useLanguage } from '../context/LanguageContext';
import { CartItem, MenuItem } from '../types/menu';
import { formatINR } from '../utils/whatsapp';
import { DietaryBadge } from './DietaryBadge';
import { FoodImage } from './FoodImage';

interface FavoritesSectionProps {
  cartItems: CartItem[];
  onAddToCart: (item: MenuItem, quantity: number) => void;
  onAddCombo: (entries: Array<{ item: MenuItem; quantity: number }>, label: string) => void;
  onOpenCart: () => void;
}

interface FeaturedEntry {
  id: string;
  title: string;
  titleHi: string;
  subtitle: string;
  subtitleHi: string;
  dietary: 'veg' | 'non-veg';
  image: string;
  price: number;
  isCombo?: boolean;
  items: Array<{ item: MenuItem; quantity: number }>;
}

export function FavoritesSection({
  cartItems,
  onAddToCart,
  onAddCombo,
  onOpenCart,
}: FavoritesSectionProps) {
  const { lang } = useLanguage();
  const copy = UI_COPY[lang].favorites;

  const cartQtyById = useMemo(() => {
    const map: Record<string, number> = {};
    for (const entry of cartItems) {
      map[entry.item.id] = entry.quantity;
    }
    return map;
  }, [cartItems]);

  const featuredEntries = useMemo<FeaturedEntry[]>(() => {
    const byId: Record<string, MenuItem> = {};
    for (const item of MENU_ITEMS) {
      byId[item.id] = item;
    }

    const tandooriHalf = byId['tan-chicken-tandoori-half'];
    const garlicNaan = byId['bread-garlic-naan'];
    const tripleRice = byId['chi-chicken-triple-rice'];
    const paneerTikkaMasala = byId['ind-paneer-tikka-masala'];
    const chickenChilli = byId['chi-chicken-chilli'];

    const entries: FeaturedEntry[] = [];

    if (tandooriHalf && garlicNaan) {
      entries.push({
        id: 'combo-tandoori-naan',
        title: 'Tandoori Chicken + 2 Garlic Naan',
        titleHi: 'तंदूरी चिकन + 2 गार्लिक नान कॉम्बो',
        subtitle: 'Charcoal half tandoori with 2 buttered garlic naans',
        subtitleHi: 'हाफ चिकन तंदूरी और 2 गरम बटर गार्लिक नान',
        dietary: 'non-veg',
        image: tandooriHalf.image,
        price: tandooriHalf.price + garlicNaan.price * 2,
        isCombo: true,
        items: [
          { item: tandooriHalf, quantity: 1 },
          { item: garlicNaan, quantity: 2 },
        ],
      });
    }

    if (tripleRice) {
      entries.push({
        id: tripleRice.id,
        title: tripleRice.name,
        titleHi: 'चिकन ट्रिपल राइस',
        subtitle: 'Wok fried rice, crispy noodles & spicy gravy',
        subtitleHi: 'फ्राइड राइस, क्रिस्पी नूडल्स और स्पाइसी ग्रेवी',
        dietary: 'non-veg',
        image: tripleRice.image,
        price: tripleRice.price,
        items: [{ item: tripleRice, quantity: 1 }],
      });
    }

    if (paneerTikkaMasala) {
      entries.push({
        id: paneerTikkaMasala.id,
        title: paneerTikkaMasala.name,
        titleHi: 'पनीर टिक्का मसाला',
        subtitle: 'Charcoal paneer cubes in rich homestyle gravy',
        subtitleHi: 'तंदूरी पनीर के टुकड़े मसालेदार होमस्टाइल ग्रेवी में',
        dietary: 'veg',
        image: paneerTikkaMasala.image,
        price: paneerTikkaMasala.price,
        items: [{ item: paneerTikkaMasala, quantity: 1 }],
      });
    }

    if (chickenChilli) {
      entries.push({
        id: chickenChilli.id,
        title: chickenChilli.name,
        titleHi: 'चिकन चिली',
        subtitle: 'High-flame tossed with peppers & green chillies',
        subtitleHi: 'शिमला मिर्च और हरी मिर्च के साथ वोक-टॉस्ड',
        dietary: 'non-veg',
        image: chickenChilli.image,
        price: chickenChilli.price,
        items: [{ item: chickenChilli, quantity: 1 }],
      });
    }

    return entries;
  }, []);

  if (featuredEntries.length === 0) return null;

  return (
    <section
      aria-label="Lonavala Evening Favorites"
      className="py-12 sm:py-16 border-t border-[#E5A93C]/15 bg-[#1F191B]/45"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div className="max-w-2xl">
            <p className="text-xs sm:text-sm font-semibold text-[#E5A93C] tracking-wide mb-2">
              {copy.kicker}
            </p>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#FFF8EE] text-balance">
              {copy.title}
            </h2>
            <p className="text-sm text-[#F5EBE1]/80 mt-1.5 leading-relaxed">
              {copy.subtitle}
            </p>
          </div>
          <a
            href="#menu"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#F4C430] hover:underline whitespace-nowrap shrink-0"
          >
            <Utensils className="w-4 h-4" aria-hidden="true" />
            <span>{lang === 'hi' ? 'पूरा मेनू नीचे देखें' : 'Jump to Full Menu'}</span>
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {featuredEntries.map((entry) => {
            const primaryInCart = cartQtyById[entry.items[0].item.id] ?? 0;

            return (
              <article
                key={entry.id}
                className="group flex flex-col rounded-xl bg-[#2A060C] border border-[#E5A93C]/22 hover:border-[#F4C430]/55 transition-all duration-200 overflow-hidden"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#161214]">
                  <FoodImage
                    src={entry.image}
                    alt={entry.title}
                    className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                  />
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-t from-[#2A060C] via-transparent to-black/25"
                  />
                  <div className="absolute top-3 right-3">
                    <DietaryBadge dietary={entry.dietary} />
                  </div>
                </div>

                <div className="flex-1 flex flex-col justify-between p-4 gap-3.5">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-display text-base sm:text-lg font-bold text-[#FFF8EE] leading-snug">
                        {lang === 'hi' ? entry.titleHi : entry.title}
                      </h3>
                      <span className="text-base font-bold text-[#F4C430] tabular-nums shrink-0">
                        {formatINR(entry.price)}
                      </span>
                    </div>
                    <p className="text-xs text-[#F5EBE1]/75 mt-1 leading-relaxed">
                      {lang === 'hi' ? entry.subtitleHi : entry.subtitle}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-[#E5A93C]/15 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        if (entry.isCombo) {
                          onAddCombo(entry.items, entry.title);
                        } else {
                          onAddToCart(entry.items[0].item, 1);
                        }
                      }}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 px-3.5 py-2 min-h-[40px] rounded-lg bg-[#F4C430] hover:bg-[#E5A93C] text-[#161214] text-xs font-bold transition-colors whitespace-nowrap cursor-pointer"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>{entry.isCombo ? copy.addCombo : copy.addDish}</span>
                    </button>

                    {primaryInCart > 0 && (
                      <button
                        type="button"
                        onClick={onOpenCart}
                        className="px-2.5 py-2 min-h-[40px] rounded-lg border border-[#E5A93C]/35 text-xs font-semibold text-[#F4C430] hover:bg-[#161214] transition-colors whitespace-nowrap cursor-pointer"
                      >
                        {lang === 'hi' ? 'कार्ट' : 'Cart'} ({primaryInCart})
                      </button>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
