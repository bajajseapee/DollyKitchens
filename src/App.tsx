/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useMemo, useState } from 'react';
import { ShoppingBag } from 'lucide-react';
import { AboutSection } from './components/AboutSection';
import { CartDrawer } from './components/CartDrawer';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { GallerySection } from './components/GallerySection';
import { HeroSection } from './components/HeroSection';
import { MenuSection } from './components/MenuSection';
import { Navbar } from './components/Navbar';
import { PartyBulkSection } from './components/PartyBulkSection';
import { MENU_ITEMS } from './data/menuData';
import { CartItem, MenuItem } from './types/menu';
import { formatINR } from './utils/whatsapp';

const CART_STORAGE_KEY = 'dolly_kitchens_cart_v1';

function loadPersistedCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Array<{ id: string; quantity: number }>;
    if (!Array.isArray(parsed)) return [];

    const itemMap = new Map(MENU_ITEMS.map((m) => [m.id, m]));
    const hydrated: CartItem[] = [];

    for (const entry of parsed) {
      if (!entry || typeof entry.id !== 'string' || typeof entry.quantity !== 'number') {
        continue;
      }
      const matched = itemMap.get(entry.id);
      if (matched && entry.quantity > 0) {
        hydrated.push({
          item: matched,
          quantity: Math.min(99, Math.floor(entry.quantity)),
        });
      }
    }
    return hydrated;
  } catch {
    return [];
  }
}

export default function App() {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => loadPersistedCart());
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [addedBanner, setAddedBanner] = useState<string | null>(null);

  useEffect(() => {
    try {
      const compact = cartItems.map((entry) => ({
        id: entry.item.id,
        quantity: entry.quantity,
      }));
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(compact));
    } catch {
      // Ignore storage quota errors
    }
  }, [cartItems]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isCartOpen) {
        setIsCartOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCartOpen]);

  useEffect(() => {
    if (!addedBanner) return;
    const timer = window.setTimeout(() => setAddedBanner(null), 2600);
    return () => window.clearTimeout(timer);
  }, [addedBanner]);

  const totalCartCount = useMemo(
    () => cartItems.reduce((sum, entry) => sum + entry.quantity, 0),
    [cartItems]
  );

  const cartSubtotal = useMemo(
    () => cartItems.reduce((sum, entry) => sum + entry.item.price * entry.quantity, 0),
    [cartItems]
  );

  const handleAddToCart = (item: MenuItem, quantity: number) => {
    const safeQty = Math.max(1, Math.floor(quantity));
    setCartItems((prev) => {
      const existingIndex = prev.findIndex((entry) => entry.item.id === item.id);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: Math.min(99, updated[existingIndex].quantity + safeQty),
        };
        return updated;
      }
      return [...prev, { item, quantity: safeQty }];
    });
    setAddedBanner(`Added ${item.name} × ${safeQty} to cart`);
  };

  const handleUpdateCartQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      setCartItems((prev) => prev.filter((entry) => entry.item.id !== itemId));
      return;
    }
    setCartItems((prev) =>
      prev.map((entry) =>
        entry.item.id === itemId
          ? { ...entry, quantity: Math.min(99, Math.floor(newQuantity)) }
          : entry
      )
    );
  };

  const handleRemoveItem = (itemId: string) => {
    setCartItems((prev) => prev.filter((entry) => entry.item.id !== itemId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#161214] text-[#FFF8EE]">
      <Navbar cartItemCount={totalCartCount} onOpenCart={() => setIsCartOpen(true)} />

      <main className="flex-1">
        <HeroSection />
        <AboutSection />
        <MenuSection
          cartItems={cartItems}
          onAddToCart={handleAddToCart}
          onUpdateCartQuantity={handleUpdateCartQuantity}
          onOpenCart={() => setIsCartOpen(true)}
        />
        <PartyBulkSection />
        <GallerySection />
        <ContactSection />
      </main>

      <Footer />

      {/* Subtle Add-to-Cart Toast */}
      {addedBanner && !isCartOpen && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-16 md:bottom-6 right-4 sm:right-6 z-40 rounded-lg bg-[#2A060C] border border-[#F4C430]/60 px-4 py-2.5 shadow-xl flex items-center gap-3 text-xs sm:text-sm text-[#FFF8EE]"
        >
          <span>{addedBanner}</span>
          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            className="font-bold text-[#F4C430] hover:underline cursor-pointer whitespace-nowrap"
          >
            View Cart
          </button>
        </div>
      )}

      {/* Mobile Bottom Cart Bar (<= 48px height to respect 15% mobile sticky cap) */}
      {totalCartCount > 0 && !isCartOpen && (
        <div className="md:hidden fixed bottom-0 inset-x-0 z-30 h-12 bg-[#2A060C] border-t border-[#F4C430]/40 px-4 flex items-center justify-between">
          <div className="text-xs font-semibold text-[#FFF8EE] tabular-nums">
            <span>
              {totalCartCount} {totalCartCount === 1 ? 'item' : 'items'}
            </span>
            <span aria-hidden="true" className="mx-1.5 text-[#E5A93C]">
              ·
            </span>
            <span className="text-[#F4C430] font-bold">{formatINR(cartSubtotal)}</span>
          </div>
          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-[#F4C430] text-[#161214] text-xs font-bold cursor-pointer"
          >
            <ShoppingBag className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Checkout on WhatsApp</span>
          </button>
        </div>
      )}

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
      />
    </div>
  );
}
