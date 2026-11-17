import { useState, type FormEvent } from 'react';
import {
  CheckCircle2,
  Copy,
  MessageCircle,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  X,
} from 'lucide-react';
import { CartItem, CheckoutFormState, OrderType } from '../types/menu';
import {
  buildOrderWhatsAppMessage,
  buildWhatsAppUrl,
  formatINR,
} from '../utils/whatsapp';
import { DietaryBadge } from './DietaryBadge';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (itemId: string, newQuantity: number) => void;
  onRemoveItem: (itemId: string) => void;
  onClearCart: () => void;
}

export function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}: CartDrawerProps) {
  const [form, setForm] = useState<CheckoutFormState>({
    customerName: '',
    contactNumber: '',
    orderType: 'Takeaway',
    deliveryAddress: '',
    specialInstructions: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof CheckoutFormState, string>>>({});
  const [whatsAppLaunchedUrl, setWhatsAppLaunchedUrl] = useState<string | null>(null);
  const [copiedMessage, setCopiedMessage] = useState(false);

  if (!isOpen) return null;

  const totalItems = cartItems.reduce((sum, entry) => sum + entry.quantity, 0);
  const subtotal = cartItems.reduce((sum, entry) => sum + entry.item.price * entry.quantity, 0);

  const handleOrderTypeChange = (nextType: OrderType) => {
    setForm((prev) => ({ ...prev, orderType: nextType }));
    if (nextType === 'Takeaway' && errors.deliveryAddress) {
      setErrors((prev) => ({ ...prev, deliveryAddress: undefined }));
    }
  };

  const validateCheckout = (): boolean => {
    const nextErrors: Partial<Record<keyof CheckoutFormState, string>> = {};
    if (!form.customerName.trim()) {
      nextErrors.customerName = 'Please enter your name.';
    }
    if (form.contactNumber.trim() && form.contactNumber.trim().length < 7) {
      nextErrors.contactNumber = 'Please enter a valid contact number or leave it blank.';
    }
    if (form.orderType === 'Home Delivery' && !form.deliveryAddress.trim()) {
      nextErrors.deliveryAddress = 'Delivery address is required for Home Delivery.';
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleCheckoutSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) return;
    if (!validateCheckout()) return;

    const message = buildOrderWhatsAppMessage(cartItems, subtotal, form);
    const url = buildWhatsAppUrl(message);
    setWhatsAppLaunchedUrl(url);

    // Open WhatsApp via anchor element click without window.open
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.target = '_blank';
    anchor.rel = 'noopener noreferrer';
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  };

  const handleCopyMessage = async () => {
    if (!validateCheckout()) return;
    const message = buildOrderWhatsAppMessage(cartItems, subtotal, form);
    try {
      await navigator.clipboard.writeText(message);
      setCopiedMessage(true);
      setTimeout(() => setCopiedMessage(false), 2500);
    } catch {
      // Clipboard may be unavailable in restricted contexts
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Order Cart and WhatsApp Checkout"
      className="fixed inset-0 z-50 flex justify-end bg-black/75 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg h-full bg-[#1F191B] border-l border-[#E5A93C]/30 flex flex-col shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="px-5 py-4 border-b border-[#E5A93C]/20 bg-[#2A060C] flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-5 h-5 text-[#F4C430]" aria-hidden="true" />
            <div>
              <h2 className="font-display text-xl font-bold text-[#FFF8EE]">Your Order Cart</h2>
              <p className="text-xs text-[#F5EBE1]/75 tabular-nums">
                {totalItems} {totalItems === 1 ? 'item' : 'items'} · Subtotal{' '}
                {formatINR(subtotal)}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close Order Cart"
            className="w-9 h-9 rounded-lg border border-[#E5A93C]/30 bg-[#161214] text-[#FFF8EE] hover:text-[#F4C430] inline-flex items-center justify-center cursor-pointer"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-6">
          {cartItems.length === 0 ? (
            <div className="py-16 text-center space-y-4">
              <div className="w-14 h-14 mx-auto rounded-xl bg-[#2A060C] border border-[#E5A93C]/25 flex items-center justify-center">
                <ShoppingBag className="w-7 h-7 text-[#E5A93C]" aria-hidden="true" />
              </div>
              <div>
                <h3 className="font-display text-2xl font-bold text-[#FFF8EE]">
                  Your cart is empty
                </h3>
                <p className="text-sm text-[#F5EBE1]/75 mt-1 max-w-xs mx-auto">
                  Explore our Chinese, Indian, and Tandoor menu to add dishes to your order.
                </p>
              </div>
              <a
                href="#menu"
                onClick={onClose}
                className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-[#F4C430] hover:bg-[#E5A93C] text-[#161214] text-sm font-bold transition-colors"
              >
                Browse Menu
              </a>
            </div>
          ) : (
            <>
              {/* Itemized List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold tracking-wide text-[#E5A93C]">
                    Order Summary
                  </h3>
                  <button
                    type="button"
                    onClick={() => {
                      onClearCart();
                      setWhatsAppLaunchedUrl(null);
                    }}
                    className="inline-flex items-center gap-1 text-xs text-[#F5EBE1]/70 hover:text-[#ffb4ab] transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Clear Cart</span>
                  </button>
                </div>

                <div className="divide-y divide-[#E5A93C]/15 rounded-xl bg-[#161214] border border-[#E5A93C]/20 px-4">
                  {cartItems.map(({ item, quantity }) => (
                    <div key={item.id} className="py-3.5 flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <DietaryBadge dietary={item.dietary} />
                          <p className="text-sm font-semibold text-[#FFF8EE] leading-snug">
                            {item.name}
                          </p>
                        </div>
                        <p className="text-xs text-[#F5EBE1]/70 mt-1 tabular-nums">
                          {formatINR(item.price)} each
                        </p>
                      </div>

                      <div className="flex flex-col items-end gap-2 shrink-0">
                        <span className="text-sm font-bold text-[#F4C430] tabular-nums">
                          {formatINR(item.price * quantity)}
                        </span>

                        <div className="inline-flex items-center rounded-md bg-[#1F191B] border border-[#E5A93C]/25">
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(item.id, quantity - 1)}
                            aria-label={`Decrease ${item.name} quantity`}
                            className="w-7 h-7 inline-flex items-center justify-center text-[#F5EBE1] hover:text-[#F4C430] cursor-pointer"
                          >
                            <Minus className="w-3 h-3" aria-hidden="true" />
                          </button>
                          <span className="w-7 text-center text-xs font-bold text-[#FFF8EE] tabular-nums">
                            {quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(item.id, quantity + 1)}
                            aria-label={`Increase ${item.name} quantity`}
                            className="w-7 h-7 inline-flex items-center justify-center text-[#F5EBE1] hover:text-[#F4C430] cursor-pointer"
                          >
                            <Plus className="w-3 h-3" aria-hidden="true" />
                          </button>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => onRemoveItem(item.id)}
                        aria-label={`Remove ${item.name} from cart`}
                        className="p-1 text-[#F5EBE1]/50 hover:text-[#ffb4ab] transition-colors cursor-pointer"
                      >
                        <X className="w-4 h-4" aria-hidden="true" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Subtotal Row */}
                <div className="rounded-xl bg-[#2A060C] border border-[#E5A93C]/25 px-4 py-3 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-[#F5EBE1]/75 tabular-nums">
                      Total Items: {totalItems}
                    </p>
                    <p className="text-sm font-bold text-[#FFF8EE]">Order Subtotal</p>
                  </div>
                  <p className="text-xl font-bold text-[#F4C430] tabular-nums">
                    {formatINR(subtotal)}
                  </p>
                </div>
              </div>

              {/* Checkout Form */}
              <form id="whatsapp-checkout-form" onSubmit={handleCheckoutSubmit} noValidate className="space-y-4">
                <h3 className="text-xs font-bold tracking-wide text-[#E5A93C]">
                  Checkout Details
                </h3>

                {/* Order Type Segmented Toggle */}
                <div>
                  <span className="block text-xs font-semibold text-[#F5EBE1] mb-1.5">
                    Order Type <span className="text-[#F4C430]">*</span>
                  </span>
                  <div className="grid grid-cols-2 gap-2 p-1 rounded-lg bg-[#161214] border border-[#E5A93C]/20">
                    {(['Takeaway', 'Home Delivery'] as OrderType[]).map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => handleOrderTypeChange(type)}
                        className={`py-2 px-3 rounded-md text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
                          form.orderType === type
                            ? 'bg-[#7A1224] text-[#F4C430] border border-[#F4C430]/50'
                            : 'text-[#F5EBE1]/75 hover:text-[#FFF8EE] border border-transparent'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Customer Name */}
                <div>
                  <label
                    htmlFor="checkout-name"
                    className="block text-xs font-semibold text-[#F5EBE1] mb-1.5"
                  >
                    Customer Name <span className="text-[#F4C430]">*</span>
                  </label>
                  <input
                    id="checkout-name"
                    type="text"
                    value={form.customerName}
                    onChange={(e) => {
                      setForm({ ...form, customerName: e.target.value });
                      if (errors.customerName) setErrors({ ...errors, customerName: undefined });
                    }}
                    placeholder="Enter your name"
                    className="w-full px-3.5 py-2.5 min-h-[42px] rounded-lg bg-[#161214] border border-[#E5A93C]/25 focus:border-[#F4C430] focus:outline-none text-sm text-[#FFF8EE] placeholder:text-[#F5EBE1]/40"
                  />
                  {errors.customerName && (
                    <p className="text-xs text-[#ffb4ab] mt-1">{errors.customerName}</p>
                  )}
                </div>

                {/* Contact Number (Optional) */}
                <div>
                  <label
                    htmlFor="checkout-phone"
                    className="block text-xs font-semibold text-[#F5EBE1] mb-1.5"
                  >
                    Contact Number <span className="text-[#F5EBE1]/55">(Optional)</span>
                  </label>
                  <input
                    id="checkout-phone"
                    type="tel"
                    value={form.contactNumber}
                    onChange={(e) => {
                      setForm({ ...form, contactNumber: e.target.value });
                      if (errors.contactNumber) setErrors({ ...errors, contactNumber: undefined });
                    }}
                    placeholder="10-digit phone number"
                    className="w-full px-3.5 py-2.5 min-h-[42px] rounded-lg bg-[#161214] border border-[#E5A93C]/25 focus:border-[#F4C430] focus:outline-none text-sm text-[#FFF8EE] placeholder:text-[#F5EBE1]/40"
                  />
                  {errors.contactNumber && (
                    <p className="text-xs text-[#ffb4ab] mt-1">{errors.contactNumber}</p>
                  )}
                </div>

                {/* Delivery Address (Required for Home Delivery) */}
                {form.orderType === 'Home Delivery' && (
                  <div>
                    <label
                      htmlFor="checkout-address"
                      className="block text-xs font-semibold text-[#F5EBE1] mb-1.5"
                    >
                      Delivery Address in Lonavala <span className="text-[#F4C430]">*</span>
                    </label>
                    <textarea
                      id="checkout-address"
                      rows={2}
                      value={form.deliveryAddress}
                      onChange={(e) => {
                        setForm({ ...form, deliveryAddress: e.target.value });
                        if (errors.deliveryAddress)
                          setErrors({ ...errors, deliveryAddress: undefined });
                      }}
                      placeholder="House/Villa name, street, landmark in Lonavala"
                      className="w-full px-3.5 py-2.5 rounded-lg bg-[#161214] border border-[#E5A93C]/25 focus:border-[#F4C430] focus:outline-none text-sm text-[#FFF8EE] placeholder:text-[#F5EBE1]/40"
                    />
                    {errors.deliveryAddress && (
                      <p className="text-xs text-[#ffb4ab] mt-1">{errors.deliveryAddress}</p>
                    )}
                  </div>
                )}

                {/* Special Instructions */}
                <div>
                  <label
                    htmlFor="checkout-instructions"
                    className="block text-xs font-semibold text-[#F5EBE1] mb-1.5"
                  >
                    Special Instructions <span className="text-[#F5EBE1]/55">(Optional)</span>
                  </label>
                  <textarea
                    id="checkout-instructions"
                    rows={2}
                    value={form.specialInstructions}
                    onChange={(e) => setForm({ ...form, specialInstructions: e.target.value })}
                    placeholder="Spice preference, cutlery request, or pickup timing"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#161214] border border-[#E5A93C]/25 focus:border-[#F4C430] focus:outline-none text-sm text-[#FFF8EE] placeholder:text-[#F5EBE1]/40"
                  />
                </div>

                {/* Submit / WhatsApp Launch Notice */}
                <div className="space-y-3 pt-1">
                  <button
                    type="submit"
                    className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 min-h-[48px] rounded-lg bg-[#F4C430] hover:bg-[#E5A93C] text-[#161214] font-bold text-sm sm:text-base transition-colors cursor-pointer"
                  >
                    <MessageCircle className="w-5 h-5" aria-hidden="true" />
                    <span>Order on WhatsApp · {formatINR(subtotal)}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleCopyMessage}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-[#E5A93C]/30 hover:border-[#F4C430] text-xs font-semibold text-[#F5EBE1] hover:text-[#F4C430] transition-colors cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>{copiedMessage ? 'Order Message Copied' : 'Copy Order Message'}</span>
                  </button>
                </div>

                {whatsAppLaunchedUrl && (
                  <div className="rounded-lg bg-[#161214] border border-[#12803B]/60 p-3.5 text-xs text-[#F5EBE1] space-y-2">
                    <div className="flex items-start gap-2">
                      <CheckCircle2
                        className="w-4 h-4 text-[#4ade80] shrink-0 mt-0.5"
                        aria-hidden="true"
                      />
                      <p className="leading-relaxed">
                        WhatsApp opened with your pre-filled order. Please tap{' '}
                        <strong className="text-[#FFF8EE]">Send</strong> in WhatsApp so our
                        kitchen can receive and confirm your order. Your cart remains saved below.
                      </p>
                    </div>
                    <a
                      href={whatsAppLaunchedUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block font-semibold text-[#F4C430] underline"
                    >
                      Open WhatsApp Again
                    </a>
                  </div>
                )}
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
