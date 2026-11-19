import { useEffect, useRef, useState } from 'react';
import {
  ArrowRight,
  Clock,
  MapPin,
  MessageCircle,
  Pause,
  Play,
  ShoppingBag,
} from 'lucide-react';
import { BUSINESS_INFO } from '../data/menuData';

export function HeroSection() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);

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
      {/* Full-Bleed Edge-to-Edge Looping Hero Video (Nkora-inspired viewport canvas) */}
      <div className="relative min-h-[76vh] sm:min-h-[84vh] w-full flex items-end overflow-hidden bg-[#161214]">
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

        {/* Measured Contrast Scrims for WCAG AA Text Legibility Over Flame & Smoke */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-[#161214] via-[#161214]/55 to-[#161214]/35 pointer-events-none"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-[#161214]/85 via-[#161214]/45 to-transparent pointer-events-none"
        />

        {/* Editorial Hero Overlay Copy */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pt-24 pb-12 sm:pt-32 sm:pb-16">
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
                {BUSINESS_INFO.heroHeadline}
              </h1>

              <p className="text-base sm:text-lg text-[#F5EBE1]/90 leading-relaxed max-w-xl mb-8">
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

            {/* Subtle Playback Control */}
            <button
              type="button"
              onClick={togglePlayback}
              aria-label={isPlaying ? 'Pause kitchen showcase video' : 'Play kitchen showcase video'}
              className="self-start sm:self-end inline-flex items-center gap-2 px-3.5 py-2 min-h-[40px] rounded-lg bg-[#161214]/75 hover:bg-[#2A060C] border border-[#E5A93C]/35 text-xs font-medium text-[#F5EBE1] hover:text-[#F4C430] transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F4C430]"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-3.5 h-3.5 text-[#F4C430]" aria-hidden="true" />
                  <span>Pause Video</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 text-[#F4C430]" aria-hidden="true" />
                  <span>Play Video</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Full-Width Business Information Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 rounded-xl bg-[#1F191B] border border-[#E5A93C]/20 p-4 sm:p-5">
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
