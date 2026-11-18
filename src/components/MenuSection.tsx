import { useMemo, useState } from 'react';
import { Minus, Plus, Search, ShoppingBag, Sparkles, X } from 'lucide-react';
import { MENU_CATEGORIES, MENU_ITEMS } from '../data/menuData';
import { CartItem, MenuCategoryId, MenuItem } from '../types/menu';
import { formatINR } from '../utils/whatsapp';
import { DietaryBadge } from './DietaryBadge';
import { FoodImage } from './FoodImage';

type DietaryFilter = 'all' | 'veg' | 'non-veg';

interface MenuCardGroup {
  cardKey: string;
  title: string;
  variants: MenuItem[];
}

interface MenuSectionProps {
  cartItems: CartItem[];
  onAddToCart: (item: MenuItem, quantity: number) => void;
  onUpdateCartQuantity: (itemId: string, newQuantity: number) => void;
  onOpenCart: () => void;
}

function buildCardGroups(items: MenuItem[]): MenuCardGroup[] {
  const groupsByKey = new Map<string, MenuCardGroup>();
  const orderedKeys: string[] = [];

  for (const item of items) {
    const key = item.groupId ?? item.id;
    const existing = groupsByKey.get(key);
    if (existing) {
      existing.variants.push(item);
    } else {
      orderedKeys.push(key);
      groupsByKey.set(key, {
        cardKey: key,
        title: item.groupTitle ?? item.name,
        variants: [item],
      });
    }
  }

  return orderedKeys.map((key) => groupsByKey.get(key)!);
}

const TOTAL_DISH_CARDS = buildCardGroups(MENU_ITEMS).length;

export function MenuSection({
  cartItems,
  onAddToCart,
  onUpdateCartQuantity,
  onOpenCart,
}: MenuSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<MenuCategoryId | 'all'>('all');
  const [dietaryFilter, setDietaryFilter] = useState<DietaryFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [cardQuantities, setCardQuantities] = useState<Record<string, number>>({});
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});

  const cartQuantityMap = useMemo(() => {
    const map: Record<string, number> = {};
    for (const entry of cartItems) {
      map[entry.item.id] = entry.quantity;
    }
    return map;
  }, [cartItems]);

  const filteredItems = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return MENU_ITEMS.filter((item) => {
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }
      if (dietaryFilter === 'veg' && item.dietary === 'non-veg') {
        return false;
      }
      if (dietaryFilter === 'non-veg' && item.dietary !== 'non-veg') {
        return false;
      }
      if (q) {
        const matchesName = item.name.toLowerCase().includes(q);
        const matchesSub = item.subCategory.toLowerCase().includes(q);
        const matchesGroup = item.groupTitle?.toLowerCase().includes(q) ?? false;
        if (!matchesName && !matchesSub && !matchesGroup) {
          return false;
        }
      }
      return true;
    });
  }, [selectedCategory, dietaryFilter, searchQuery]);

  const groupedByCategory = useMemo(() => {
    const categoriesToShow =
      selectedCategory === 'all'
        ? MENU_CATEGORIES
        : MENU_CATEGORIES.filter((cat) => cat.id === selectedCategory);

    return categoriesToShow
      .map((category) => {
        const itemsInCat = filteredItems.filter((item) => item.category === category.id);
        if (itemsInCat.length === 0) return null;

        // Preserve subcategory insertion order
        const subCategoryOrder: string[] = [];
        const subGroups: Record<string, MenuItem[]> = {};
        for (const item of itemsInCat) {
          if (!subGroups[item.subCategory]) {
            subGroups[item.subCategory] = [];
            subCategoryOrder.push(item.subCategory);
          }
          subGroups[item.subCategory].push(item);
        }

        return {
          category,
          subGroups: subCategoryOrder.map((subName) => ({
            subName,
            cards: buildCardGroups(subGroups[subName]),
          })),
        };
      })
      .filter((group): group is NonNullable<typeof group> => group !== null);
  }, [filteredItems, selectedCategory]);

  const visibleDishCount = useMemo(
    () =>
      groupedByCategory.reduce(
        (sum, cat) => sum + cat.subGroups.reduce((subSum, sub) => subSum + sub.cards.length, 0),
        0
      ),
    [groupedByCategory]
  );

  const getCardQty = (id: string) => cardQuantities[id] ?? 1;

  const setCardQty = (id: string, nextQty: number) => {
    const clamped = Math.max(1, Math.min(50, nextQty));
    setCardQuantities((prev) => ({ ...prev, [id]: clamped }));
  };

  const resetFilters = () => {
    setSelectedCategory('all');
    setDietaryFilter('all');
    setSearchQuery('');
  };

  return (
    <section
      id="menu"
      className="py-16 sm:py-20 border-t border-[#E5A93C]/15 bg-[#161214]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        {/* Section Heading */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <div>
            <p className="text-xs sm:text-sm font-semibold text-[#E5A93C] tracking-wide mb-2">
              Complete Takeaway &amp; Delivery Menu
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#FFF8EE] text-balance">
              Explore Our Food Menu
            </h2>
            <p className="text-sm sm:text-base text-[#F5EBE1]/80 mt-2 max-w-2xl">
              Select dishes, portions, and quantities below, then review your order in the cart to
              send it directly to Dolly's Kitchen on WhatsApp. Dish photographs are representative
              kitchen previews.
            </p>
          </div>

          <a
            href="#party-orders"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#2A060C] hover:bg-[#4A0D17] border border-[#D4901C]/50 text-sm font-semibold text-[#F4C430] transition-colors self-start lg:self-auto whitespace-nowrap shrink-0"
          >
            <Sparkles className="w-4 h-4" aria-hidden="true" />
            <span>Looking for Per-Kg Party Orders?</span>
          </a>
        </div>

        {/* Search & Dietary Filter Controls */}
        <div className="rounded-xl bg-[#1F191B] border border-[#E5A93C]/20 p-4 sm:p-5 mb-6 space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
            {/* Search Input */}
            <div className="relative flex-1 max-w-xl">
              <Search
                className="w-4 h-4 text-[#E5A93C] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                aria-hidden="true"
              />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search dishes (e.g. Paneer Tikka, Hakka Noodles, Biryani)..."
                aria-label="Search menu dishes"
                className="w-full pl-10 pr-10 py-2.5 min-h-[44px] rounded-lg bg-[#161214] border border-[#E5A93C]/25 focus:border-[#F4C430] focus:outline-none text-sm text-[#FFF8EE] placeholder:text-[#F5EBE1]/45 transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-[#F5EBE1]/60 hover:text-[#FFF8EE] cursor-pointer"
                >
                  <X className="w-4 h-4" aria-hidden="true" />
                </button>
              )}
            </div>

            {/* Veg / Non-Veg Segmented Control */}
            <div
              role="group"
              aria-label="Dietary preference filter"
              className="inline-flex items-center p-1 rounded-lg bg-[#161214] border border-[#E5A93C]/20 self-start md:self-auto"
            >
              <button
                type="button"
                onClick={() => setDietaryFilter('all')}
                className={`px-3.5 py-2 rounded-md text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  dietaryFilter === 'all'
                    ? 'bg-[#7A1224] text-[#F4C430] border border-[#F4C430]/50'
                    : 'text-[#F5EBE1]/75 hover:text-[#FFF8EE] border border-transparent'
                }`}
              >
                All Items
              </button>
              <button
                type="button"
                onClick={() => setDietaryFilter('veg')}
                className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-md text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  dietaryFilter === 'veg'
                    ? 'bg-[#7A1224] text-[#F4C430] border border-[#F4C430]/50'
                    : 'text-[#F5EBE1]/75 hover:text-[#FFF8EE] border border-transparent'
                }`}
              >
                <DietaryBadge dietary="veg" />
                <span>Veg</span>
              </button>
              <button
                type="button"
                onClick={() => setDietaryFilter('non-veg')}
                className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-md text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  dietaryFilter === 'non-veg'
                    ? 'bg-[#7A1224] text-[#F4C430] border border-[#F4C430]/50'
                    : 'text-[#F5EBE1]/75 hover:text-[#FFF8EE] border border-transparent'
                }`}
              >
                <DietaryBadge dietary="non-veg" />
                <span>Non-Veg</span>
              </button>
            </div>
          </div>

          {/* Category Navigation Bar */}
          <div
            role="tablist"
            aria-label="Menu Categories"
            className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 scrollbar-thin"
          >
            <button
              type="button"
              role="tab"
              aria-selected={selectedCategory === 'all'}
              onClick={() => setSelectedCategory('all')}
              className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer border ${
                selectedCategory === 'all'
                  ? 'bg-[#7A1224] text-[#F4C430] border-[#F4C430]'
                  : 'bg-[#161214] text-[#F5EBE1]/80 border-[#FFF8EE]/10 hover:border-[#E5A93C]/40 hover:text-[#FFF8EE]'
              }`}
            >
              All Categories ({TOTAL_DISH_CARDS})
            </button>

            {MENU_CATEGORIES.map((category) => {
              const isSelected = selectedCategory === category.id;
              return (
                <button
                  key={category.id}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer border ${
                    isSelected
                      ? 'bg-[#7A1224] text-[#F4C430] border-[#F4C430]'
                      : 'bg-[#161214] text-[#F5EBE1]/80 border-[#FFF8EE]/10 hover:border-[#E5A93C]/40 hover:text-[#FFF8EE]'
                  }`}
                >
                  {category.shortLabel}
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Result Count */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-8 text-xs sm:text-sm text-[#F5EBE1]/70">
          <p className="tabular-nums">
            Showing <span className="font-semibold text-[#FFF8EE]">{visibleDishCount}</span>{' '}
            {visibleDishCount === 1 ? 'dish' : 'dishes'}
            {filteredItems.length !== visibleDishCount && (
              <span className="text-[#F5EBE1]/55"> ({filteredItems.length} portion options)</span>
            )}
            {selectedCategory !== 'all' && (
              <>
                {' '}
                in{' '}
                <span className="text-[#E5A93C] font-medium">
                  {MENU_CATEGORIES.find((c) => c.id === selectedCategory)?.label}
                </span>
              </>
            )}
          </p>

          {(selectedCategory !== 'all' || dietaryFilter !== 'all' || searchQuery) && (
            <button
              type="button"
              onClick={resetFilters}
              className="text-xs sm:text-sm font-semibold text-[#F4C430] hover:underline cursor-pointer"
            >
              Reset all filters
            </button>
          )}
        </div>

        {/* Menu Categories & Dish Cards */}
        {groupedByCategory.length === 0 ? (
          <div className="rounded-xl bg-[#1F191B] border border-[#E5A93C]/20 p-10 text-center">
            <p className="font-display text-2xl font-semibold text-[#FFF8EE] mb-2">
              No matching dishes found
            </p>
            <p className="text-sm text-[#F5EBE1]/75 mb-6">
              Try clearing your search term or switching the dietary filter to view all available
              dishes.
            </p>
            <button
              type="button"
              onClick={resetFilters}
              className="px-5 py-2.5 rounded-lg bg-[#F4C430] hover:bg-[#E5A93C] text-[#161214] text-sm font-bold transition-colors cursor-pointer"
            >
              Show Complete Menu
            </button>
          </div>
        ) : (
          <div className="space-y-14">
            {groupedByCategory.map(({ category, subGroups }) => (
              <div key={category.id} className="space-y-8">
                {/* Category Header */}
                <div className="border-b border-[#E5A93C]/25 pb-4">
                  <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#FFF8EE]">
                    {category.label}
                  </h3>
                  <p className="text-sm text-[#F5EBE1]/75 mt-1">{category.description}</p>
                </div>

                {/* Subcategories */}
                <div className="space-y-10">
                  {subGroups.map(({ subName, cards }) => (
                    <div key={subName}>
                      <div className="flex items-center justify-between gap-4 mb-4">
                        <h4 className="text-sm sm:text-base font-bold tracking-wide text-[#E5A93C]">
                          {subName}
                        </h4>
                        <span className="text-xs text-[#F5EBE1]/55 tabular-nums">
                          {cards.length} {cards.length === 1 ? 'item' : 'items'}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                        {cards.map(({ cardKey, title, variants }) => {
                          const selectedId = selectedVariants[cardKey];
                          const activeVariant =
                            variants.find((v) => v.id === selectedId) ?? variants[0];
                          const hasMultipleVariants = variants.length > 1;
                          const qty = getCardQty(activeVariant.id);
                          const inCartQty = cartQuantityMap[activeVariant.id] ?? 0;

                          return (
                            <article
                              key={cardKey}
                              className="group flex flex-col rounded-xl bg-[#2A060C] border border-[#F4C430]/18 hover:border-[#F4C430]/45 transition-all duration-200 overflow-hidden"
                            >
                              {/* Dish Photo */}
                              <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#1F191B]">
                                <FoodImage
                                  src={activeVariant.image}
                                  alt={`${title} — ${activeVariant.subCategory}`}
                                  className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                                />
                                <div
                                  aria-hidden="true"
                                  className="absolute inset-0 bg-gradient-to-t from-[#2A060C] via-transparent to-black/25"
                                />
                                {activeVariant.dietary !== 'neutral' && (
                                  <div className="absolute top-3 right-3">
                                    <DietaryBadge dietary={activeVariant.dietary} />
                                  </div>
                                )}
                              </div>

                              {/* Card Body */}
                              <div className="flex-1 flex flex-col justify-between p-4 sm:p-5 gap-4">
                                <div className="space-y-3">
                                  <div>
                                    <div className="flex items-start justify-between gap-3">
                                      <h5 className="font-display text-lg font-bold text-[#FFF8EE] leading-snug">
                                        {hasMultipleVariants ? title : activeVariant.name}
                                      </h5>
                                      <span className="text-base sm:text-lg font-bold text-[#F4C430] tabular-nums shrink-0">
                                        {formatINR(activeVariant.price)}
                                      </span>
                                    </div>

                                    <p className="text-xs text-[#F5EBE1]/70 mt-1.5">
                                      {activeVariant.subCategory}
                                      {activeVariant.portionNote && (
                                        <>
                                          <span aria-hidden="true" className="mx-1.5">
                                            ·
                                          </span>
                                          <span>{activeVariant.portionNote}</span>
                                        </>
                                      )}
                                    </p>
                                  </div>

                                  {/* Portion Selector for Half/Full & Small/500 ml Variants */}
                                  {hasMultipleVariants && (
                                    <div
                                      role="group"
                                      aria-label={`Choose portion for ${title}`}
                                      className="grid grid-cols-2 gap-2"
                                    >
                                      {variants.map((variant) => {
                                        const isActive = variant.id === activeVariant.id;
                                        const variantInCart = cartQuantityMap[variant.id] ?? 0;
                                        return (
                                          <button
                                            key={variant.id}
                                            type="button"
                                            onClick={() =>
                                              setSelectedVariants((prev) => ({
                                                ...prev,
                                                [cardKey]: variant.id,
                                              }))
                                            }
                                            aria-pressed={isActive}
                                            className={`px-2.5 py-2 rounded-lg text-xs font-semibold border transition-colors cursor-pointer flex items-center justify-between gap-1.5 tabular-nums ${
                                              isActive
                                                ? 'bg-[#7A1224] text-[#F4C430] border-[#F4C430]'
                                                : 'bg-[#161214]/80 text-[#F5EBE1]/80 border-[#E5A93C]/20 hover:border-[#E5A93C]/50 hover:text-[#FFF8EE]'
                                            }`}
                                          >
                                            <span>{variant.variantLabel ?? variant.name}</span>
                                            <span className="font-bold">
                                              {formatINR(variant.price)}
                                              {variantInCart > 0 ? ` (${variantInCart})` : ''}
                                            </span>
                                          </button>
                                        );
                                      })}
                                    </div>
                                  )}
                                </div>

                                {/* Quantity Stepper & Add to Cart */}
                                <div className="space-y-2.5 pt-2 border-t border-[#E5A93C]/15">
                                  <div className="flex items-center justify-between gap-3">
                                    {/* Quantity Stepper */}
                                    <div className="inline-flex items-center rounded-lg bg-[#161214] border border-[#E5A93C]/30">
                                      <button
                                        type="button"
                                        onClick={() => setCardQty(activeVariant.id, qty - 1)}
                                        aria-label={`Decrease quantity for ${activeVariant.name}`}
                                        className="w-9 h-9 inline-flex items-center justify-center text-[#F5EBE1] hover:text-[#F4C430] transition-colors cursor-pointer"
                                      >
                                        <Minus className="w-3.5 h-3.5" aria-hidden="true" />
                                      </button>
                                      <span className="w-8 text-center text-sm font-bold text-[#FFF8EE] tabular-nums">
                                        {qty}
                                      </span>
                                      <button
                                        type="button"
                                        onClick={() => setCardQty(activeVariant.id, qty + 1)}
                                        aria-label={`Increase quantity for ${activeVariant.name}`}
                                        className="w-9 h-9 inline-flex items-center justify-center text-[#F5EBE1] hover:text-[#F4C430] transition-colors cursor-pointer"
                                      >
                                        <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                                      </button>
                                    </div>

                                    {/* Add to Cart Button */}
                                    <button
                                      type="button"
                                      onClick={() => onAddToCart(activeVariant, qty)}
                                      className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2 min-h-[38px] rounded-lg bg-[#F4C430] hover:bg-[#E5A93C] text-[#161214] text-xs sm:text-sm font-bold transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                                    >
                                      <ShoppingBag className="w-3.5 h-3.5" aria-hidden="true" />
                                      <span>Add to Cart</span>
                                    </button>
                                  </div>

                                  {inCartQty > 0 && (
                                    <div className="flex items-center justify-between text-xs text-[#E5A93C] pt-1">
                                      <span className="tabular-nums font-medium">
                                        In cart: {inCartQty} ({formatINR(inCartQty * activeVariant.price)})
                                      </span>
                                      <div className="inline-flex items-center gap-2">
                                        <button
                                          type="button"
                                          onClick={() =>
                                            onUpdateCartQuantity(activeVariant.id, inCartQty - 1)
                                          }
                                          className="underline hover:text-[#FFF8EE] cursor-pointer"
                                        >
                                          Remove 1
                                        </button>
                                        <span aria-hidden="true">·</span>
                                        <button
                                          type="button"
                                          onClick={onOpenCart}
                                          className="font-semibold underline hover:text-[#FFF8EE] cursor-pointer"
                                        >
                                          View Cart
                                        </button>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </article>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
