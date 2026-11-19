import { useState } from 'react';
import { Expand, X } from 'lucide-react';
import { GALLERY_ITEMS } from '../data/menuData';
import { UI_COPY, useLanguage } from '../context/LanguageContext';
import { GalleryItem } from '../types/menu';
import { FoodImage } from './FoodImage';

const HUDCO_STORY_ITEMS: GalleryItem[] = [
  {
    id: 'story-stall-gravy',
    title: 'Steaming Gravy Bowl at the Stall',
    cuisine: 'Hudco Colony Kitchen',
    caption: 'Served piping hot right outside Dolly\'s Kitchen in Hudco Colony, Lonavala.',
    image: '/assets/aistudio/IMG-20261118-WA0009_541708f8.jpg',
  },
  {
    id: 'story-wok-packing',
    title: 'Open-Flame Wok & Foil Packing',
    cuisine: 'Takeaway Craft',
    caption: 'High-flame noodle tossing and sealed foil containers packed fresh for takeaway.',
    image: '/assets/aistudio/IMG-20261118-WA0007_9f159218.jpg',
  },
  {
    id: 'story-hakka-counter',
    title: 'Freshly Tossed Hakka Noodles',
    cuisine: 'Evening Counter',
    caption: 'Crispy spring onions, carrots, and wok-charred noodles straight off the burner.',
    image: '/assets/aistudio/IMG-20261118-WA0006_e55cd289.jpg',
  },
];

export function GallerySection() {
  const { lang } = useLanguage();
  const copy = UI_COPY[lang].gallery;
  const [activeItem, setActiveItem] = useState<GalleryItem | null>(null);

  return (
    <section
      id="gallery"
      className="py-16 sm:py-20 border-t border-[#E5A93C]/15 bg-[#161214]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <p className="text-xs sm:text-sm font-semibold text-[#E5A93C] tracking-wide mb-2">
              {copy.kicker}
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#FFF8EE] text-balance">
              {copy.title}
            </h2>
            <p className="text-sm sm:text-base text-[#F5EBE1]/80 mt-2 max-w-2xl">
              {copy.subtitle}
            </p>
          </div>
          <p className="text-xs text-[#F5EBE1]/55 max-w-xs">
            Tap any photo to inspect full screen.
          </p>
        </div>

        {/* Local Hudco Colony Night-Kitchen Story Strip */}
        <div className="mb-12 rounded-xl bg-[#1F191B] border border-[#E5A93C]/22 p-5 sm:p-6">
          <div className="mb-5">
            <h3 className="font-display text-xl sm:text-2xl font-bold text-[#FFF8EE]">
              {copy.stripTitle}
            </h3>
            <p className="text-xs sm:text-sm text-[#F5EBE1]/75 mt-1">{copy.stripSubtitle}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {HUDCO_STORY_ITEMS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveItem(item)}
                className="group text-left rounded-xl overflow-hidden bg-[#161214] border border-[#E5A93C]/20 hover:border-[#F4C430]/55 transition-all duration-200 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F4C430]"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#161214]">
                  <FoodImage
                    src={item.image}
                    alt={`${item.title} — ${item.caption}`}
                    className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                  />
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-t from-[#161214]/85 via-transparent to-transparent"
                  />
                  <span className="absolute top-3 right-3 w-8 h-8 rounded-lg bg-[#161214]/75 border border-[#E5A93C]/30 inline-flex items-center justify-center text-[#FFF8EE] opacity-80 group-hover:opacity-100 transition-opacity">
                    <Expand className="w-4 h-4" aria-hidden="true" />
                  </span>
                </div>
                <div className="p-4">
                  <p className="text-xs font-semibold text-[#E5A93C]">{item.cuisine}</p>
                  <h4 className="font-display text-lg font-bold text-[#FFF8EE] mt-0.5">
                    {item.title}
                  </h4>
                  <p className="text-xs text-[#F5EBE1]/75 mt-1 leading-relaxed">{item.caption}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Category Food Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {GALLERY_ITEMS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveItem(item)}
              className="group text-left rounded-xl overflow-hidden bg-[#2A060C] border border-[#E5A93C]/20 hover:border-[#F4C430]/50 transition-all duration-200 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F4C430]"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#1F191B]">
                <FoodImage
                  src={item.image}
                  alt={`${item.title} — ${item.caption}`}
                  className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-300"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-[#161214]/90 via-transparent to-transparent"
                />
                <span className="absolute top-3 right-3 w-8 h-8 rounded-lg bg-[#161214]/75 border border-[#E5A93C]/30 inline-flex items-center justify-center text-[#FFF8EE] opacity-80 group-hover:opacity-100 transition-opacity">
                  <Expand className="w-4 h-4" aria-hidden="true" />
                </span>
              </div>

              <div className="p-4 sm:p-5">
                <p className="text-xs font-semibold text-[#E5A93C]">{item.cuisine}</p>
                <h3 className="font-display text-xl font-bold text-[#FFF8EE] mt-1">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#F5EBE1]/75 mt-1">{item.caption}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Lightbox Dialog */}
      {activeItem && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={activeItem.title}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setActiveItem(null)}
        >
          <div
            className="relative max-w-3xl w-full rounded-xl overflow-hidden bg-[#1F191B] border border-[#E5A93C]/40 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setActiveItem(null)}
              aria-label="Close image preview"
              className="absolute top-3 right-3 z-10 w-10 h-10 rounded-lg bg-[#161214]/85 border border-[#E5A93C]/40 text-[#FFF8EE] hover:text-[#F4C430] inline-flex items-center justify-center cursor-pointer"
            >
              <X className="w-5 h-5" aria-hidden="true" />
            </button>
            <div className="aspect-[4/3] w-full bg-[#161214]">
              <FoodImage
                src={activeItem.image}
                alt={`${activeItem.title} — ${activeItem.caption}`}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-5 sm:p-6">
              <p className="text-xs font-semibold text-[#E5A93C]">{activeItem.cuisine}</p>
              <h3 className="font-display text-2xl font-bold text-[#FFF8EE] mt-1">
                {activeItem.title}
              </h3>
              <p className="text-sm text-[#F5EBE1]/80 mt-1">{activeItem.caption}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
