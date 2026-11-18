import { Clock, Mail, MapPin, MessageCircle, Phone, ShoppingBag } from 'lucide-react';
import { BUSINESS_INFO } from '../data/menuData';

export function ContactSection() {
  return (
    <section
      id="contact"
      className="py-16 sm:py-20 border-t border-[#E5A93C]/15 bg-[#1F191B]/50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="max-w-2xl mb-10">
          <p className="text-xs sm:text-sm font-semibold text-[#E5A93C] tracking-wide mb-2">
            Visit or Reach Out
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#FFF8EE] text-balance">
            Contact Dolly's Kitchen
          </h2>
          <p className="text-sm sm:text-base text-[#F5EBE1]/80 mt-2">
            Available daily in Lonavala for freshly prepared Takeaway and Home Delivery.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Contact Details Card */}
          <div className="lg:col-span-7 rounded-xl bg-[#2A060C] border border-[#E5A93C]/25 p-6 sm:p-8 flex flex-col justify-between gap-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#E5A93C]">
                  <MapPin className="w-4 h-4" aria-hidden="true" />
                  <span>Location</span>
                </div>
                <p className="font-display text-lg font-semibold text-[#FFF8EE]">
                  {BUSINESS_INFO.name}
                </p>
                <p className="text-sm text-[#F5EBE1]/85">{BUSINESS_INFO.location}</p>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#E5A93C]">
                  <Clock className="w-4 h-4" aria-hidden="true" />
                  <span>Opening Hours</span>
                </div>
                <p className="text-base font-semibold text-[#FFF8EE] tabular-nums">
                  {BUSINESS_INFO.hours}
                </p>
                <p className="text-xs text-[#F5EBE1]/75 flex items-center gap-1.5">
                  <ShoppingBag className="w-3.5 h-3.5 text-[#E5A93C]" aria-hidden="true" />
                  <span>Takeaway &amp; Home Delivery</span>
                </p>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#E5A93C]">
                  <Phone className="w-4 h-4" aria-hidden="true" />
                  <span>Phone &amp; Orders</span>
                </div>
                <a
                  href={BUSINESS_INFO.phoneHref}
                  className="inline-block text-base font-bold text-[#FFF8EE] hover:text-[#F4C430] transition-colors tabular-nums"
                >
                  {BUSINESS_INFO.phone}
                </a>
                <p className="text-xs text-[#F5EBE1]/70">Tap to call directly</p>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#E5A93C]">
                  <Mail className="w-4 h-4" aria-hidden="true" />
                  <span>Email</span>
                </div>
                <a
                  href={BUSINESS_INFO.emailHref}
                  className="inline-block text-sm sm:text-base font-semibold text-[#FFF8EE] hover:text-[#F4C430] transition-colors break-all"
                >
                  {BUSINESS_INFO.email}
                </a>
                <p className="text-xs text-[#F5EBE1]/70">Tap to send an email</p>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="pt-6 border-t border-[#E5A93C]/20 flex flex-wrap items-center gap-3">
              <a
                href={BUSINESS_INFO.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 min-h-[42px] rounded-lg bg-[#F4C430] hover:bg-[#E5A93C] text-[#161214] text-sm font-bold transition-colors whitespace-nowrap shrink-0"
              >
                <MessageCircle className="w-4 h-4" aria-hidden="true" />
                <span>Chat on WhatsApp ({BUSINESS_INFO.whatsappDisplay})</span>
              </a>

              <a
                href={BUSINESS_INFO.phoneHref}
                className="inline-flex items-center gap-2 px-5 py-2.5 min-h-[42px] rounded-lg bg-[#7A1224] hover:bg-[#4A0D17] border border-[#D4901C] text-[#FFF8EE] text-sm font-semibold transition-colors whitespace-nowrap shrink-0"
              >
                <Phone className="w-4 h-4 text-[#F4C430]" aria-hidden="true" />
                <span>Call {BUSINESS_INFO.phone}</span>
              </a>

              <a
                href={BUSINESS_INFO.emailHref}
                className="inline-flex items-center gap-2 px-5 py-2.5 min-h-[42px] rounded-lg border border-[#E5A93C]/40 hover:border-[#F4C430] text-[#FFF8EE] hover:text-[#F4C430] text-sm font-semibold transition-colors whitespace-nowrap shrink-0"
              >
                <Mail className="w-4 h-4" aria-hidden="true" />
                <span>Email Us</span>
              </a>
            </div>
          </div>

          {/* Map Location Placeholder */}
          <div className="lg:col-span-5 rounded-xl bg-[#1F191B] border border-[#E5A93C]/25 p-6 sm:p-8 flex flex-col justify-center items-center text-center min-h-[280px]">
            <div className="w-12 h-12 rounded-xl bg-[#2A060C] border border-[#E5A93C]/35 flex items-center justify-center mb-4">
              <MapPin className="w-6 h-6 text-[#F4C430]" aria-hidden="true" />
            </div>
            <h3 className="font-display text-xl font-bold text-[#FFF8EE]">
              Lonavala, Maharashtra
            </h3>
            <p className="text-sm text-[#F5EBE1]/75 mt-2 max-w-sm leading-relaxed">
              Google Maps pin will appear here once the exact street address is added. Need
              directions for Takeaway pickup?
            </p>
            <a
              href={`${BUSINESS_INFO.whatsappUrl}?text=${encodeURIComponent(
                "Hello Dolly's Kitchen! Could you please share your exact location pin for Takeaway pickup in Lonavala?"
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-[#E5A93C]/50 hover:bg-[#F4C430] hover:text-[#161214] text-sm font-semibold text-[#F4C430] transition-colors"
            >
              <MessageCircle className="w-4 h-4" aria-hidden="true" />
              <span>Request Location on WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
