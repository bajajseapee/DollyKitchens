import { useMemo, useState } from 'react';
import { Bot, RotateCcw, ShoppingBag, X } from 'lucide-react';
import { MENU_ITEMS } from '../data/menuData';
import { CartItem, MenuItem } from '../types/menu';
import { formatINR } from '../utils/whatsapp';
import { DietaryBadge } from './DietaryBadge';
import { FoodImage } from './FoodImage';

type DietaryPreference = 'all' | 'veg' | 'non-veg';
type BudgetRange = 'any' | 'under-200' | 'under-350' | '350-plus';

interface DksDishFinderProps {
  cartItems: CartItem[];
  onAddToCart: (item: MenuItem, quantity: number) => void;
  onOpenCart: () => void;
  hasMobileCartBar: boolean;
}

const INGREDIENT_OPTIONS = [
  'Paneer',
  'Chicken',
  'Mutton',
  'Mushroom',
  'Egg',
  'Noodles & Rice',
  'Biryani',
  'Roti & Naan',
  'Soup',
] as const;

const BUDGET_OPTIONS: Array<{ id: BudgetRange; label: string }> = [
  { id: 'any', label: 'Any' },
  { id: 'under-200', label: 'Under ₹200' },
  { id: 'under-350', label: 'Under ₹350' },
  { id: '350-plus', label: '₹350+' },
];

const QUICK_PRESETS: Array<{
  label: string;
  dietary: DietaryPreference;
  budget: BudgetRange;
  ingredients: string[];
  craving: string;
}> = [
  {
    label: 'Spicy Chicken under ₹350',
    dietary: 'non-veg',
    budget: 'under-350',
    ingredients: ['Chicken'],
    craving: 'chilli',
  },
  {
    label: 'Paneer & Naan',
    dietary: 'veg',
    budget: 'any',
    ingredients: ['Paneer', 'Roti & Naan'],
    craving: '',
  },
  {
    label: 'Light Meal under ₹200',
    dietary: 'veg',
    budget: 'under-200',
    ingredients: ['Soup', 'Noodles & Rice'],
    craving: '',
  },
];

function matchesIngredient(item: MenuItem, ingredient: string): boolean {
  const haystack = `${item.name} ${item.subCategory} ${item.category}`.toLowerCase();
  switch (ingredient) {
    case 'Paneer':
      return haystack.includes('paneer');
    case 'Chicken':
      return haystack.includes('chicken') || haystack.includes('lollipop');
    case 'Mutton':
      return haystack.includes('mutton');
    case 'Mushroom':
      return haystack.includes('mushroom');
    case 'Egg':
      return haystack.includes('egg');
    case 'Noodles & Rice':
      return (
        haystack.includes('noodle') ||
        haystack.includes('fried rice') ||
        haystack.includes('schezwan rice') ||
        haystack.includes('triple rice') ||
        haystack.includes('manchurian rice') ||
        haystack.includes('steamed rice') ||
        haystack.includes('jeera rice') ||
        haystack.includes('curd rice') ||
        haystack.includes('khichdi')
      );
    case 'Biryani':
      return haystack.includes('biryani') || haystack.includes('pulao');
    case 'Roti & Naan':
      return item.category === 'roti-naan';
    case 'Soup':
      return item.category === 'soups';
    default:
      return haystack.includes(ingredient.toLowerCase());
  }
}

function matchesBudget(price: number, budget: BudgetRange): boolean {
  switch (budget) {
    case 'under-200':
      return price <= 200;
    case 'under-350':
      return price <= 350;
    case '350-plus':
      return price >= 350;
    default:
      return true;
  }
}

export function DksDishFinder({
  cartItems,
  onAddToCart,
  onOpenCart,
  hasMobileCartBar,
}: DksDishFinderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [dietary, setDietary] = useState<DietaryPreference>('all');
  const [budget, setBudget] = useState<BudgetRange>('any');
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [craving, setCraving] = useState('');

  const cartQuantityMap = useMemo(() => {
    const map: Record<string, number> = {};
    for (const entry of cartItems) {
      map[entry.item.id] = entry.quantity;
    }
    return map;
  }, [cartItems]);

  const toggleIngredient = (ingredient: string) => {
    setSelectedIngredients((prev) =>
      prev.includes(ingredient)
        ? prev.filter((entry) => entry !== ingredient)
        : [...prev, ingredient]
    );
  };

  const handleReset = () => {
    setDietary('all');
    setBudget('any');
    setSelectedIngredients([]);
    setCraving('');
  };

  const applyPreset = (preset: (typeof QUICK_PRESETS)[number]) => {
    setDietary(preset.dietary);
    setBudget(preset.budget);
    setSelectedIngredients(preset.ingredients);
    setCraving(preset.craving);
  };

  const matchedDishes = useMemo(() => {
    const terms = craving
      .trim()
      .toLowerCase()
      .split(/[\s,]+/)
      .filter((t) => t.length >= 2);

    const scored: Array<{ item: MenuItem; score: number; matchNote: string }> = [];

    for (const item of MENU_ITEMS) {
      if (dietary === 'veg' && item.dietary === 'non-veg') continue;
      if (dietary === 'non-veg' && item.dietary !== 'non-veg') continue;
      if (!matchesBudget(item.price, budget)) continue;

      const haystack = `${item.name} ${item.subCategory} ${item.category}`.toLowerCase();

      let score = 0;
      const reasons: string[] = [];

      if (selectedIngredients.length > 0) {
        const matchedIngs = selectedIngredients.filter((ing) => matchesIngredient(item, ing));
        if (matchedIngs.length === 0) continue;
        score += matchedIngs.length * 10;
        reasons.push(matchedIngs.join(' + '));
      }

      if (terms.length > 0) {
        const matchedTerms = terms.filter((term) => haystack.includes(term));
        if (matchedTerms.length === 0) continue;
        score += matchedTerms.length * 8;
        reasons.push(`Matches "${matchedTerms.join(' ')}"`);
      }

      if (score === 0) {
        // Default curation weighting when browsing by dietary/budget alone
        if (item.category === 'tandoor' || item.category === 'chinese') score += 4;
        if (item.category === 'indian-main' || item.category === 'rice-biryani') score += 3;
        if (item.price >= 120) score += 2;
        reasons.push(item.subCategory);
      }

      scored.push({
        item,
        score,
        matchNote: reasons.join(' · '),
      });
    }

    scored.sort((a, b) => b.score - a.score || a.item.price - b.item.price);

    // Deduplicate Half/Full variants so results show varied dishes first
    const seenGroups = new Set<string>();
    const uniqueTop: Array<{ item: MenuItem; matchNote: string }> = [];
    for (const entry of scored) {
      const groupKey = entry.item.groupId ?? entry.item.id;
      if (seenGroups.has(groupKey)) continue;
      seenGroups.add(groupKey);
      uniqueTop.push({ item: entry.item, matchNote: entry.matchNote });
      if (uniqueTop.length >= 6) break;
    }

    return uniqueTop;
  }, [dietary, budget, selectedIngredients, craving]);

  const hasActiveFilters =
    dietary !== 'all' || budget !== 'any' || selectedIngredients.length > 0 || craving.trim() !== '';

  return (
    <>
      {/* Persistent Bottom-Right Floating Launcher */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          aria-label="Open DK's Dish Finder"
          className={`fixed right-4 sm:right-6 z-40 inline-flex items-center gap-2.5 pl-3 pr-4 py-2.5 min-h-[48px] rounded-xl bg-[#2A060C] hover:bg-[#4A0D17] border-2 border-[#F4C430] text-[#FFF8EE] shadow-[0_12px_30px_rgba(0,0,0,0.65)] transition-all duration-200 hover:-translate-y-0.5 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F4C430] ${
            hasMobileCartBar ? 'bottom-16 md:bottom-6' : 'bottom-4 sm:bottom-6'
          }`}
        >
          <span className="w-8 h-8 rounded-lg bg-[#F4C430] text-[#161214] inline-flex items-center justify-center shrink-0">
            <Bot className="w-5 h-5" aria-hidden="true" />
          </span>
          <span className="text-left leading-tight">
            <span className="block text-sm font-bold text-[#F4C430] whitespace-nowrap">
              DK&apos;s Dish Finder
            </span>
            <span className="hidden sm:block text-[11px] text-[#F5EBE1]/80 whitespace-nowrap">
              Pick by Veg, Budget &amp; Taste
            </span>
          </span>
        </button>
      )}

      {/* Interactive Bottom-Right Drawer / Widget */}
      {isOpen && (
        <section
          role="dialog"
          aria-modal="false"
          aria-label="DK's Dish Finder"
          className={`fixed right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[410px] max-h-[82vh] flex flex-col rounded-xl bg-[#1F191B] border border-[#E5A93C]/45 shadow-[0_20px_50px_rgba(0,0,0,0.85)] overflow-hidden ${
            hasMobileCartBar ? 'bottom-16 md:bottom-6' : 'bottom-4 sm:bottom-6'
          }`}
        >
          {/* Header with Bot Logo */}
          <div className="bg-[#2A060C] border-b border-[#E5A93C]/25 px-4 py-3.5 flex items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="w-9 h-9 rounded-lg bg-[#F4C430] text-[#161214] inline-flex items-center justify-center shrink-0">
                <Bot className="w-5 h-5" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <h2 className="font-display text-base sm:text-lg font-bold text-[#FFF8EE] leading-tight truncate">
                  DK&apos;s Dish Finder
                </h2>
                <p className="text-[11px] text-[#E5A93C] truncate">
                  Filter by dietary, budget &amp; ingredient
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={handleReset}
                  aria-label="Reset dish finder filters"
                  className="p-2 rounded-lg text-[#F5EBE1]/75 hover:text-[#F4C430] hover:bg-[#1F191B] transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" aria-hidden="true" />
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close DK's Dish Finder"
                className="p-2 rounded-lg text-[#F5EBE1]/80 hover:text-[#FFF8EE] hover:bg-[#1F191B] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* Scrollable Filter Controls & Instant Results */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Quick Presets */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs text-[#F5EBE1]/70">
              <span className="mr-0.5">Quick picks:</span>
              {QUICK_PRESETS.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => applyPreset(preset)}
                  className="px-2 py-1 rounded-md bg-[#161214] border border-[#E5A93C]/20 hover:border-[#F4C430] text-[11px] font-medium text-[#F5EBE1] hover:text-[#F4C430] transition-colors cursor-pointer whitespace-nowrap"
                >
                  {preset.label}
                </button>
              ))}
            </div>

            {/* Dietary Selector */}
            <div className="space-y-1.5">
              <span className="block text-xs font-semibold text-[#F5EBE1]/80">
                Dietary Preference
              </span>
              <div
                role="group"
                aria-label="Dietary preference"
                className="grid grid-cols-3 gap-1 p-1 rounded-lg bg-[#161214] border border-[#E5A93C]/20"
              >
                <button
                  type="button"
                  onClick={() => setDietary('all')}
                  className={`px-2 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                    dietary === 'all'
                      ? 'bg-[#7A1224] text-[#F4C430] border border-[#F4C430]/50'
                      : 'text-[#F5EBE1]/75 hover:text-[#FFF8EE] border border-transparent'
                  }`}
                >
                  All
                </button>
                <button
                  type="button"
                  onClick={() => setDietary('veg')}
                  className={`inline-flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                    dietary === 'veg'
                      ? 'bg-[#7A1224] text-[#F4C430] border border-[#F4C430]/50'
                      : 'text-[#F5EBE1]/75 hover:text-[#FFF8EE] border border-transparent'
                  }`}
                >
                  <DietaryBadge dietary="veg" />
                  <span>Veg</span>
                </button>
                <button
                  type="button"
                  onClick={() => setDietary('non-veg')}
                  className={`inline-flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                    dietary === 'non-veg'
                      ? 'bg-[#7A1224] text-[#F4C430] border border-[#F4C430]/50'
                      : 'text-[#F5EBE1]/75 hover:text-[#FFF8EE] border border-transparent'
                  }`}
                >
                  <DietaryBadge dietary="non-veg" />
                  <span>Non-Veg</span>
                </button>
              </div>
            </div>

            {/* Budget Selector */}
            <div className="space-y-1.5">
              <span className="block text-xs font-semibold text-[#F5EBE1]/80">Budget per Dish</span>
              <div
                role="group"
                aria-label="Budget preference"
                className="grid grid-cols-4 gap-1.5"
              >
                {BUDGET_OPTIONS.map((option) => {
                  const active = budget === option.id;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setBudget(option.id)}
                      aria-pressed={active}
                      className={`px-2 py-1.5 rounded-lg text-[11px] font-semibold border transition-colors cursor-pointer tabular-nums whitespace-nowrap ${
                        active
                          ? 'bg-[#7A1224] text-[#F4C430] border-[#F4C430]'
                          : 'bg-[#161214] text-[#F5EBE1]/80 border-[#E5A93C]/20 hover:border-[#E5A93C]/45'
                      }`}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Ingredients / Dish Style */}
            <div className="space-y-1.5">
              <span className="block text-xs font-semibold text-[#F5EBE1]/80">
                Ingredient or Style
              </span>
              <div className="flex flex-wrap gap-1.5">
                {INGREDIENT_OPTIONS.map((ingredient) => {
                  const active = selectedIngredients.includes(ingredient);
                  return (
                    <button
                      key={ingredient}
                      type="button"
                      onClick={() => toggleIngredient(ingredient)}
                      aria-pressed={active}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-colors cursor-pointer whitespace-nowrap ${
                        active
                          ? 'bg-[#F4C430] text-[#161214] border-[#F4C430]'
                          : 'bg-[#161214] text-[#F5EBE1]/80 border-[#E5A93C]/20 hover:border-[#E5A93C]/45'
                      }`}
                    >
                      {ingredient}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Keyword / Craving Filter */}
            <div>
              <input
                type="search"
                value={craving}
                onChange={(e) => setCraving(e.target.value)}
                placeholder="Type keyword (e.g. butter, tikka, chilli, handi, lassi)..."
                aria-label="Filter dishes by keyword or ingredient"
                className="w-full px-3 py-2 min-h-[40px] rounded-lg bg-[#161214] border border-[#E5A93C]/25 focus:border-[#F4C430] focus:outline-none text-xs text-[#FFF8EE] placeholder:text-[#F5EBE1]/45"
              />
            </div>

            {/* Instant Matching Dishes */}
            <div className="pt-2 border-t border-[#E5A93C]/15 space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-[#E5A93C]">
                  Top Matches ({matchedDishes.length})
                </span>
                <a
                  href="#menu"
                  onClick={() => setIsOpen(false)}
                  className="text-[11px] font-semibold text-[#F5EBE1]/75 hover:text-[#F4C430] underline"
                >
                  Browse Full Menu
                </a>
              </div>

              {matchedDishes.length === 0 ? (
                <div className="rounded-lg bg-[#161214] border border-[#E5A93C]/20 p-4 text-center space-y-2">
                  <p className="text-xs text-[#F5EBE1]/80">
                    No dishes match that exact combination.
                  </p>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="px-3 py-1.5 rounded-md bg-[#F4C430] text-[#161214] text-xs font-bold cursor-pointer"
                  >
                    Clear Filters
                  </button>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {matchedDishes.map(({ item, matchNote }) => {
                    const inCartQty = cartQuantityMap[item.id] ?? 0;
                    return (
                      <div
                        key={item.id}
                        className="rounded-lg bg-[#2A060C] border border-[#E5A93C]/20 p-2.5 flex items-center gap-3"
                      >
                        <div className="w-14 h-14 rounded-md overflow-hidden shrink-0 bg-[#161214] border border-[#E5A93C]/20">
                          <FoodImage
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            {item.dietary !== 'neutral' && <DietaryBadge dietary={item.dietary} />}
                            <h3 className="font-display text-sm font-bold text-[#FFF8EE] truncate">
                              {item.name}
                            </h3>
                          </div>
                          <p className="text-[11px] text-[#F5EBE1]/70 truncate mt-0.5">
                            {matchNote}
                          </p>
                          <div className="flex items-center justify-between gap-2 mt-1.5">
                            <span className="text-xs font-bold text-[#F4C430] tabular-nums">
                              {formatINR(item.price)}
                            </span>
                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => onAddToCart(item, 1)}
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#F4C430] hover:bg-[#E5A93C] text-[#161214] text-[11px] font-bold transition-colors cursor-pointer whitespace-nowrap"
                              >
                                <ShoppingBag className="w-3 h-3" aria-hidden="true" />
                                <span>{inCartQty > 0 ? `+1 (${inCartQty})` : 'Add'}</span>
                              </button>
                              {inCartQty > 0 && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setIsOpen(false);
                                    onOpenCart();
                                  }}
                                  className="text-[11px] font-semibold text-[#F4C430] underline cursor-pointer"
                                >
                                  Cart
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
