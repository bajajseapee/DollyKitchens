import { ArrowRight, Clock, MapPin, MessageCircle, ShoppingBag } from 'lucide-react';
import { BUSINESS_INFO, FOOD_IMAGES } from '../data/menuData';
import { FoodImage } from './FoodImage';

export function HeroSection() {
  return (
    <section
      id="home"
      className="relative overflow-hidden bg-gradient-to-b from-[#2A060C]/60 via-[#161214] to-[#161214] pt-8 pb-12 sm:pt-12 sm:pb-16 lg:pt-16 lg:pb-20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        {/* Main 2-column Hero Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
          {/* Left Copy Column */}
          <div className="lg:col-span-6 flex flex-col justify-center py-2 lg:py-6">
            <p className="text-xs sm:text-sm font-medium tracking-wide text-[#E5A93C] mb-4">
              {BUSINESS_INFO.location} <span aria-hidden="true" className="mx-1.5">·</span>{' '}
              {BUSINESS_INFO.cuisines.join(' · ')}
            </p>

            <h1
              className="font-display font-bold text-[#FFF8EE] text-balance tracking-tight mb-5"
              style={{ fontSize: 'clamp(2.25rem, 4vw, 3.65rem)', lineHeight: 1.12 }}
            >
              {BUSINESS_INFO.heroHeadline}
            </h1>

            <p className="text-base sm:text-lg text-[#F5EBE1]/85 leading-relaxed max-w-xl mb-8">
              {BUSINESS_INFO.heroSubtext}
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <a
                href="#menu"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 min-h-[46px] rounded-lg bg-[#F4C430] hover:bg-[#E5A93C] text-[#161214] font-bold text-sm sm:text-base transition-all duration-200 hover:shadow-[0_0_24px_rgba(244,196,48,0.4)] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFF8EE]"
              >
                <span>Explore Our Menu</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </a>

              <a
                href={BUSINESS_INFO.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 min-h-[46px] rounded-lg bg-[#7A1224] hover:bg-[#4A0D17] text-[#FFF8EE] border border-[#D4901C] font-semibold text-sm sm:text-base transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F4C430]"
              >
                <MessageCircle className="w-4 h-4 text-[#F4C430]" aria-hidden="true" />
                <span>Order on WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Right Hero Photography Column */}
          <div className="lg:col-span-6 flex">
            <div className="relative w-full min-h-[280px] sm:min-h-[380px] lg:h-full rounded-xl overflow-hidden border border-[#E5A93C]/25 bg-[#1F191B]">
              <FoodImage
                src={FOOD_IMAGES.heroFeast}
                alt="Illustrative spread of Indian butter chicken, saffron biryani, charred tandoori starters, garlic naan, and wok-tossed noodles"
                loading="eager"
                className="w-full h-full object-cover"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-[#161214]/85 via-[#161214]/20 to-transparent"
              />
              <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 flex flex-wrap items-end justify-between gap-3">
                <div>
                  <p className="font-display text-lg sm:text-xl font-semibold text-[#FFF8EE]">
                    {BUSINESS_INFO.tagline}
                  </p>
                  <p className="text-xs sm:text-sm text-[#F5EBE1]/80 mt-0.5">
                    Freshly prepared to order · Hygienic takeaway packaging
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Full-Width Business Information Bar */}
        <div className="mt-8 sm:mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4 rounded-xl bg-[#1F191B] border border-[#E5A93C]/20 p-4 sm:p-5">
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-[#F4C430] shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <p className="text-xs font-semibold text-[#E5A93C] tracking-wide">Location</p>
              <p className="text-sm sm:text-base font-semibold text-[#FFF8EE] mt-0.5">
                {BUSINESS_INFO.location}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 sm:border-l sm:border-[#E5A93C]/15 sm:pl-5">
            <ShoppingBag className="w-5 h-5 text-[#F4C430] shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <p className="text-xs font-semibold text-[#E5A93C] tracking-wide">Services</p>
              <p className="text-sm sm:text-base font-semibold text-[#FFF8EE] mt-0.5">
                Takeaway &amp; Home Delivery
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 sm:border-l sm:border-[#E5A93C]/15 sm:pl-5">
            <Clock className="w-5 h-5 text-[#F4C430] shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <p className="text-xs font-semibold text-[#E5A93C] tracking-wide">Opening Hours</p>
              <p className="text-sm sm:text-base font-semibold text-[#FFF8EE] mt-0.5 tabular-nums">
                {BUSINESS_INFO.hours}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
