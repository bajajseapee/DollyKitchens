import { Flame, ShieldCheck, Sparkles, UtensilsCrossed } from 'lucide-react';
import { BUSINESS_INFO } from '../data/menuData';

export function AboutSection() {
  return (
    <section id="about" className="py-16 sm:py-20 border-t border-[#E5A93C]/15 bg-[#161214]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Signboard Visual */}
          <div className="lg:col-span-6">
            <div className="rounded-xl overflow-hidden border border-[#E5A93C]/35 bg-[#2A060C] shadow-[0_16px_36px_-10px_rgba(0,0,0,0.7)]">
              <img
                src={BUSINESS_INFO.signboardImage}
                alt="Dolly's Kitchen (डॉलीज़ किचन) restaurant signboard showcasing Chinese, Indian and Tandoor specialties"
                loading="lazy"
                className="w-full h-auto object-cover block"
              />
            </div>
          </div>

          {/* Right Brand Story & Pillars */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <p className="text-xs sm:text-sm font-semibold text-[#E5A93C] tracking-wide mb-2">
                About Dolly&apos;s Kitchen · {BUSINESS_INFO.hindiName}
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#FFF8EE] text-balance leading-tight">
                {BUSINESS_INFO.tagline}
              </h2>
            </div>

            <p className="text-base text-[#F5EBE1]/85 leading-relaxed">
              Serving Lonavala every evening from {BUSINESS_INFO.hours}, Dolly&apos;s Kitchen (
              {BUSINESS_INFO.hindiName}) brings together three beloved culinary traditions under one
              roof: wok-fired Indo-Chinese favourites, rich homestyle Indian curries and biryanis,
              and smoky charcoal-grilled Tandoor starters.
            </p>

            {/* Heritage Parchment Callout echoing the signboard */}
            <div className="rounded-lg bg-[#FFF8EE] text-[#4A0D17] p-4 border border-[#D4901C]">
              <div className="border border-[#D4901C]/60 rounded px-4 py-3 text-center">
                <p className="font-display text-base sm:text-lg font-bold tracking-tight">
                  We Accept Orders For All Types Of Meals, As Well As Online Orders.
                </p>
              </div>
            </div>

            {/* Three Kitchen Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="rounded-lg bg-[#1F191B] border border-[#E5A93C]/15 p-4">
                <Flame className="w-5 h-5 text-[#F4C430] mb-2.5" aria-hidden="true" />
                <h3 className="font-display text-base font-semibold text-[#FFF8EE]">
                  Freshly Prepared
                </h3>
                <p className="text-xs text-[#F5EBE1]/75 mt-1 leading-relaxed">
                  Every dish is cooked fresh to order over high-flame woks and glowing tandoors.
                </p>
              </div>

              <div className="rounded-lg bg-[#1F191B] border border-[#E5A93C]/15 p-4">
                <Sparkles className="w-5 h-5 text-[#F4C430] mb-2.5" aria-hidden="true" />
                <h3 className="font-display text-base font-semibold text-[#FFF8EE]">
                  Homestyle Spices
                </h3>
                <p className="text-xs text-[#F5EBE1]/75 mt-1 leading-relaxed">
                  Balanced spice blends for comforting dals, handis, biryanis, and Gavran curries.
                </p>
              </div>

              <div className="rounded-lg bg-[#1F191B] border border-[#E5A93C]/15 p-4">
                <ShieldCheck className="w-5 h-5 text-[#F4C430] mb-2.5" aria-hidden="true" />
                <h3 className="font-display text-base font-semibold text-[#FFF8EE]">
                  Hygienic Packing
                </h3>
                <p className="text-xs text-[#F5EBE1]/75 mt-1 leading-relaxed">
                  Carefully packed for quick Lonavala takeaway and warm home delivery.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-1 text-sm text-[#F5EBE1]/80">
              <UtensilsCrossed className="w-4 h-4 text-[#E5A93C] shrink-0" aria-hidden="true" />
              <span>Vegetarian &amp; Non-Vegetarian dishes cooked to order.</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
