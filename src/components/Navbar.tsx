import { useState } from 'react';
import { Menu, ShoppingBag, X } from 'lucide-react';
import { UI_COPY, useLanguage } from '../context/LanguageContext';

interface NavbarProps {
  cartItemCount: number;
  onOpenCart: () => void;
}

export function Navbar({ cartItemCount, onOpenCart }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { lang } = useLanguage();
  const navCopy = UI_COPY[lang].nav;

  const navLinks = [
    { href: '#about', label: navCopy.about },
    { href: '#menu', label: navCopy.menu },
    { href: '#party-orders', label: navCopy.party },
    { href: '#gallery', label: navCopy.gallery },
    { href: '#contact', label: navCopy.contact },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#161214]/95 backdrop-blur-md border-b border-[#E5A93C]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single-line Brand Wordmark */}
        <a
          href="#home"
          className="font-display text-xl sm:text-2xl font-bold tracking-tight text-[#F4C430] hover:text-[#FFF8EE] transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#F4C430] rounded-sm"
        >
          {lang === 'hi' ? 'डॉलीज़ किचन' : "Dolly's Kitchen"}
        </a>

        {/* Zone 2: 5 concise single-line text nav links */}
        <nav
          aria-label="Primary Navigation"
          className="hidden md:flex items-center gap-7 text-sm font-medium text-[#F5EBE1]"
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="relative py-1 hover:text-[#F4C430] transition-colors whitespace-nowrap shrink-0 after:absolute after:left-0 after:bottom-0 after:h-[1.5px] after:w-0 after:bg-[#F4C430] hover:after:w-full after:transition-all focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#F4C430] rounded-sm"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Zone 3: Primary Cart Action + Mobile Menu Trigger */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={onOpenCart}
            aria-label={`Open Order Cart, ${cartItemCount} items`}
            className="inline-flex items-center gap-2 px-4 py-2 min-h-[40px] rounded-lg bg-[#F4C430] hover:bg-[#E5A93C] text-[#161214] text-sm font-bold transition-all duration-200 hover:shadow-[0_0_18px_rgba(244,196,48,0.35)] whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFF8EE]"
          >
            <ShoppingBag className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>{navCopy.orderCart}</span>
            {cartItemCount > 0 && (
              <span className="tabular-nums font-bold">({cartItemCount})</span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg border border-[#E5A93C]/30 bg-[#1F191B] text-[#FFF8EE] hover:border-[#F4C430] transition-colors cursor-pointer"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" aria-hidden="true" />
            ) : (
              <Menu className="w-5 h-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Drawer */}
      {mobileMenuOpen && (
        <nav
          aria-label="Mobile Navigation"
          className="md:hidden border-t border-[#E5A93C]/15 bg-[#1F191B] px-4 py-3 space-y-1"
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded-lg text-sm font-medium text-[#FFF8EE] hover:bg-[#2A060C] hover:text-[#F4C430] transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}
