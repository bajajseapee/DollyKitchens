import { BUSINESS_INFO } from '../data/menuData';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-[#E5A93C]/20 bg-[#110d0f] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-[#E5A93C]/15">
          <div className="md:col-span-5 space-y-3">
            <a
              href="#home"
              className="font-display text-2xl font-bold text-[#F4C430] inline-block"
            >
              {BUSINESS_INFO.name} <span className="text-lg font-medium text-[#FFF8EE]/85">· {BUSINESS_INFO.hindiName}</span>
            </a>
            <p className="text-sm text-[#F5EBE1]/80 max-w-sm leading-relaxed">
              {BUSINESS_INFO.tagline} Freshly prepared Chinese, Indian &amp; Tandoor food in{' '}
              {BUSINESS_INFO.location}.
            </p>
            <p className="text-xs text-[#E5A93C] tabular-nums">
              Open Daily: {BUSINESS_INFO.hours} · Takeaway &amp; Home Delivery
            </p>
          </div>

          <div className="md:col-span-3 space-y-2.5">
            <h3 className="text-xs font-bold tracking-wide text-[#E5A93C]">Quick Links</h3>
            <ul className="space-y-2 text-sm text-[#F5EBE1]/80">
              <li>
                <a href="#home" className="hover:text-[#F4C430] transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-[#F4C430] transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#menu" className="hover:text-[#F4C430] transition-colors">
                  Food Menu
                </a>
              </li>
              <li>
                <a href="#party-orders" className="hover:text-[#F4C430] transition-colors">
                  Party &amp; Bulk Orders
                </a>
              </li>
              <li>
                <a href="#gallery" className="hover:text-[#F4C430] transition-colors">
                  Food Gallery
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-[#F4C430] transition-colors">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          <div className="md:col-span-4 space-y-2.5">
            <h3 className="text-xs font-bold tracking-wide text-[#E5A93C]">Direct Orders</h3>
            <ul className="space-y-2 text-sm text-[#F5EBE1]/80">
              <li>
                Phone:{' '}
                <a
                  href={BUSINESS_INFO.phoneHref}
                  className="text-[#FFF8EE] font-semibold hover:text-[#F4C430] tabular-nums"
                >
                  {BUSINESS_INFO.phone}
                </a>
              </li>
              <li>
                WhatsApp:{' '}
                <a
                  href={BUSINESS_INFO.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#FFF8EE] font-semibold hover:text-[#F4C430] tabular-nums"
                >
                  {BUSINESS_INFO.whatsappDisplay}
                </a>
              </li>
              <li>
                Email:{' '}
                <a
                  href={BUSINESS_INFO.emailHref}
                  className="text-[#FFF8EE] hover:text-[#F4C430] break-all"
                >
                  {BUSINESS_INFO.email}
                </a>
              </li>
              <li className="text-xs text-[#F5EBE1]/65 pt-1">
                {BUSINESS_INFO.address}
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#F5EBE1]/60">
          <p>
            &copy; {year} {BUSINESS_INFO.name}, Lonavala. All rights reserved.
          </p>
          <p>Orders confirmed directly via WhatsApp (+91 8888010822).</p>
        </div>
      </div>
    </footer>
  );
}
