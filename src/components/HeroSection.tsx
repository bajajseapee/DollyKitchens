import { useEffect, useRef, useState } from 'react';
import {
  ArrowRight,
  Clock,
  Languages,
  MapPin,
  MessageCircle,
  Pause,
  Play,
  ShoppingBag,
} from 'lucide-react';
import { BUSINESS_INFO } from '../data/menuData';
import { UI_COPY, useLanguage } from '../context/LanguageContext';
import { getKitchenStatus } from '../utils/kitchenStatus';

export function HeroSection() {
  const { lang, setLang } = useLanguage();
  const copy = UI_COPY[lang].hero;

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [kitchenStatus, setKitchenStatus] = useState(() => getKitchenStatus());

  useEffect(() => {
    const interval = window.setInterval(() => {
      setKitchenStatus(getKitchenStatus());
    }, 60_000);
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      video.pause();
      setIsPlaying(false);
      return;
    }

    const playPromise = video.play();
    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(() => {
        setIsPlaying(false);
      });
    }
  }, []);

  const togglePlayback = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      void video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  return (
    <section id="home" className="bg-[#161214]">
      {/* Full-Bleed Edge-to-Edge Looping Hero Video */}
      <div className="relative min-h-[76vh] sm:min-h-[84vh] w-full flex flex-col justify-between overflow-hidden bg-[#161214]">
        <video
          ref={videoRef}
          src="/assets/hero-tandoor-chinese.mp4"
          poster="/assets/hero-tandoor-chinese-poster.jpg"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />

        {/* Measured Contrast Scrims */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-[#161214] via-[#161214]/55 to-[#161214]/45 pointer-events-none"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-[#161214]/85 via-[#161214]/45 to-transparent pointer-events-none"
        />

        {/* Top Row inside Hero: Language Switch (kept outside Navbar per Top Bar Contract) */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pt-5 flex items-center justify-end">
          <div
            role="group"
            aria-label="Language selection"
            className="inline-flex items-center gap-1 p-1 rounded-lg bg-[#161214]/80 border border-[#E5A93C]/30 backdrop-blur-sm"
          >
            <Languages className="w-3.5 h-3.5 text-[#E5A93C] ml-1.5 mr-0.5" aria-hidden="true" />
            <button
              type="button"
              onClick={() => setLang('en')}
              aria-pressed={lang === 'en'}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                lang === 'en'
                  ? 'bg-[#7A1224] text-[#F4C430] border border-[#F4C430]/50'
                  : 'text-[#F5EBE1]/80 hover:text-[#FFF8EE] border border-transparent'
              }`}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => setLang('hi')}
              aria-pressed={lang === 'hi'}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                lang === 'hi'
                  ? 'bg-[#7A1224] text-[#F4C430] border border-[#F4C430]/50'
                  : 'text-[#F5EBE1]/80 hover:text-[#FFF8EE] border border-transparent'
              }`}
            >
              हिंदी
            </button>
          </div>
        </div>

        {/* Editorial Hero Overlay Copy */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pt-16 pb-12 sm:pt-24 sm:pb-16">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div className="max-w-2xl">
              <p className="text-xs sm:text-sm font-medium tracking-wide text-[#E5A93C] mb-4">
                {BUSINESS_INFO.name} ({BUSINESS_INFO.hindiName}){' '}
                <span aria-hidden="true" className="mx-1.5">·</span> {BUSINESS_INFO.location}{' '}
                <span aria-hidden="true" className="mx-1.5">·</span>{' '}
                {BUSINESS_INFO.cuisines.join(' · ')}
              </p>

              <h1
                className="font-display font-bold text-[#FFF8EE] text-balance tracking-tight mb-5"
                style={{ fontSize: 'clamp(2.25rem, 4.4vw, 3.9rem)', lineHeight: 1.08 }}
              >
                {copy.headline}
              </h1>

              <p className="text-base sm:text-lg text-[#F5EBE1]/90 leading-relaxed max-w-xl mb-8">
                {copy.subtext}
              </p>

              <div className="flex flex-wrap items-center gap-4">
                <a
                  href="#menu"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 min-h-[46px] rounded-lg bg-[#F4C430] hover:bg-[#E5A93C] text-[#161214] font-bold text-sm sm:text-base transition-all duration-200 hover:shadow-[0_0_24px_rgba(244,196,48,0.4)] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFF8EE]"
                >
                  <span>{copy.exploreMenu}</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </a>

                <a
                  href={BUSINESS_INFO.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 min-h-[46px] rounded-lg bg-[#7A1224] hover:bg-[#4A0D17] text-[#FFF8EE] border border-[#D4901C] font-semibold text-sm sm:text-base transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F4C430]"
                >
                  <MessageCircle className="w-4 h-4 text-[#F4C430]" aria-hidden="true" />
                  <span>{copy.orderWhatsApp}</span>
                </a>
              </div>
            </div>

            {/* Subtle Playback Control */}
            <button
              type="button"
              onClick={togglePlayback}
              aria-label={isPlaying ? copy.pauseVideo : copy.playVideo}
              className="self-start sm:self-end inline-flex items-center gap-2 px-3.5 py-2 min-h-[40px] rounded-lg bg-[#161214]/75 hover:bg-[#2A060C] border border-[#E5A93C]/35 text-xs font-medium text-[#F5EBE1] hover:text-[#F4C430] transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F4C430]"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-3.5 h-3.5 text-[#F4C430]" aria-hidden="true" />
                  <span>{copy.pauseVideo}</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 text-[#F4C430]" aria-hidden="true" />
                  <span>{copy.playVideo}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Full-Width Business Information Bar with Live IST Kitchen Status */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 rounded-xl bg-[#1F191B] border border-[#E5A93C]/20 p-4 sm:p-5">
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-[#F4C430] shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <p className="text-xs font-semibold text-[#E5A93C] tracking-wide">
                {copy.locationLabel}
              </p>
              <p className="text-sm sm:text-base font-semibold text-[#FFF8EE] mt-0.5">
                {BUSINESS_INFO.location}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 sm:border-l sm:border-[#E5A93C]/15 sm:pl-5">
            <ShoppingBag className="w-5 h-5 text-[#F4C430] shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <p className="text-xs font-semibold text-[#E5A93C] tracking-wide">
                {copy.servicesLabel}
              </p>
              <p className="text-sm sm:text-base font-semibold text-[#FFF8EE] mt-0.5">
                {copy.servicesValue}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 sm:border-l sm:border-[#E5A93C]/15 sm:pl-5">
            <Clock className="w-5 h-5 text-[#F4C430] shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <p className="text-xs font-semibold text-[#E5A93C] tracking-wide">
                {copy.hoursLabel}
              </p>
              <p className="text-sm sm:text-base font-semibold text-[#FFF8EE] mt-0.5 tabular-nums">
                {BUSINESS_INFO.hours}
              </p>
              <p
                className={`text-xs mt-1 font-medium ${
                  kitchenStatus.isOpen ? 'text-[#4ade80]' : 'text-[#F5EBE1]/75'
                }`}
              >
                {kitchenStatus.isOpen ? copy.statusOpen : copy.statusClosed}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
