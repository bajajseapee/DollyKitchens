import { useMemo, useState, type FormEvent } from 'react';
import { Calendar, CheckCircle2, MessageCircle, Minus, Plus, Users } from 'lucide-react';
import { BULK_ORDER_ITEMS } from '../data/menuData';
import { UI_COPY, useLanguage } from '../context/LanguageContext';
import { PartyEnquiryFormState } from '../types/menu';
import {
  buildPartyEnquiryMessage,
  buildQuickBulkDishUrl,
  buildWhatsAppUrl,
} from '../utils/whatsapp';
import { DietaryBadge } from './DietaryBadge';
import { FoodImage } from './FoodImage';

const BULK_GROUPS: Array<'Royal Biryanis' | 'Fragrant Pulaos' | 'Specialties & Curries'> = [
  'Royal Biryanis',
  'Fragrant Pulaos',
  'Specialties & Curries',
];

const GUEST_PRESETS = [
  { guests: 15, label: '15 Guests', recKg: 3, suggestion: '2 kg Biryani + 1 kg Curry' },
  { guests: 30, label: '30 Guests', recKg: 5, suggestion: '3 kg Biryani + 2 kg Curry' },
  { guests: 50, label: '50 Guests', recKg: 8, suggestion: '5 kg Biryani + 3 kg Curry' },
  { guests: 75, label: '75+ Guests', recKg: 12, suggestion: '8 kg Biryani + 4 kg Curry' },
];

export function PartyBulkSection() {
  const { lang } = useLanguage();
  const copy = UI_COPY[lang].party;

  const [selectedGuests, setSelectedGuests] = useState<number | null>(null);
  const [kgById, setKgById] = useState<Record<string, number>>({});
  const [form, setForm] = useState<PartyEnquiryFormState>({
    customerName: '',
    contactNumber: '',
    eventDate: '',
    approximateQuantity: '',
    foodRequirements: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof PartyEnquiryFormState, string>>>({});
  const [generatedUrl, setGeneratedUrl] = useState<string | null>(null);

  const selectedEntries = useMemo(
    () =>
      BULK_ORDER_ITEMS.filter((item) => (kgById[item.id] ?? 0) > 0).map((item) => ({
        item,
        kg: kgById[item.id],
      })),
    [kgById]
  );

  const totalSelectedKg = useMemo(
    () => selectedEntries.reduce((sum, entry) => sum + entry.kg, 0),
    [selectedEntries]
  );

  const syncEstimatorToForm = (nextKgMap: Record<string, number>, guests: number | null) => {
    const chosen = BULK_ORDER_ITEMS.filter((item) => (nextKgMap[item.id] ?? 0) > 0).map(
      (item) => `${item.name} (${nextKgMap[item.id]} kg)`
    );
    const totalKg = BULK_ORDER_ITEMS.reduce((sum, item) => sum + (nextKgMap[item.id] ?? 0), 0);

    setForm((prev) => ({
      ...prev,
      approximateQuantity:
        totalKg > 0 && guests
          ? `${totalKg} kg total for ~${guests} guests`
          : totalKg > 0
            ? `${totalKg} kg total (~${totalKg * 6}–${totalKg * 7} servings)`
            : guests
              ? `Approx. ${guests} guests`
              : prev.approximateQuantity,
      foodRequirements: chosen.length > 0 ? chosen.join(', ') : prev.foodRequirements,
    }));
  };

  const adjustDishKg = (id: string, delta: number) => {
    setKgById((prev) => {
      const current = prev[id] ?? 0;
      const next = Math.max(0, Math.min(25, current + delta));
      const updated = { ...prev, [id]: next };
      syncEstimatorToForm(updated, selectedGuests);
      return updated;
    });
  };

  const applyGuestPreset = (preset: (typeof GUEST_PRESETS)[number]) => {
    setSelectedGuests(preset.guests);
    // Pre-select Chicken Biryani + Veg Pulao / Curry proportions if empty
    const hasExisting = Object.values(kgById).some((qty) => qty > 0);
    if (!hasExisting) {
      const biryaniKg = Math.max(2, Math.round(preset.recKg * 0.65));
      const curryKg = Math.max(1, preset.recKg - biryaniKg);
      const nextMap: Record<string, number> = {
        'bulk-chicken-dum-biryani': biryaniKg,
        'bulk-chicken-curry-gavran': curryKg,
      };
      setKgById(nextMap);
      syncEstimatorToForm(nextMap, preset.guests);
    } else {
      syncEstimatorToForm(kgById, preset.guests);
    }
  };

  const validate = (): boolean => {
    const nextErrors: Partial<Record<keyof PartyEnquiryFormState, string>> = {};
    if (!form.customerName.trim()) {
      nextErrors.customerName = 'Please enter your name.';
    }
    if (!form.contactNumber.trim() || form.contactNumber.trim().length < 7) {
      nextErrors.contactNumber = 'Please enter a valid contact number.';
    }
    if (!form.eventDate.trim()) {
      nextErrors.eventDate = 'Please choose an event date.';
    }
    if (!form.approximateQuantity.trim()) {
      nextErrors.approximateQuantity = 'Please specify approximate quantity (e.g. 5 kg or 30 guests).';
    }
    if (!form.foodRequirements.trim()) {
      nextErrors.foodRequirements = 'Please list the dishes you are interested in.';
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const message = buildPartyEnquiryMessage(form);
    const url = buildWhatsAppUrl(message);
    setGeneratedUrl(url);

    // Trigger anchor navigation without window.open
    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section
      id="party-orders"
      className="py-16 sm:py-20 border-t border-[#E5A93C]/15 bg-[#1F191B]/60"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        {/* Header */}
        <div className="max-w-3xl mb-10">
          <p className="text-xs sm:text-sm font-semibold text-[#E5A93C] tracking-wide mb-2">
            {copy.kicker}
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#FFF8EE] text-balance">
            {copy.title}
          </h2>
          <p className="text-base text-[#F5EBE1]/85 mt-3 leading-relaxed">{copy.subtitle}</p>
          <p className="text-xs sm:text-sm text-[#F4C430] font-medium mt-3">{copy.note}</p>
        </div>

        {/* Interactive Villa & Party Quantity Estimator Bar */}
        <div className="rounded-xl bg-[#2A060C] border border-[#E5A93C]/30 p-5 sm:p-6 mb-10">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
            <div className="max-w-xl">
              <h3 className="font-display text-xl sm:text-2xl font-bold text-[#FFF8EE]">
                {copy.plannerTitle}
              </h3>
              <p className="text-xs sm:text-sm text-[#F5EBE1]/80 mt-1 leading-relaxed">
                {copy.plannerSubtitle}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {GUEST_PRESETS.map((preset) => {
                const active = selectedGuests === preset.guests;
                return (
                  <button
                    key={preset.guests}
                    type="button"
                    onClick={() => applyGuestPreset(preset)}
                    aria-pressed={active}
                    className={`px-3.5 py-2 min-h-[40px] rounded-lg text-xs sm:text-sm font-semibold border transition-colors whitespace-nowrap cursor-pointer ${
                      active
                        ? 'bg-[#F4C430] text-[#161214] border-[#F4C430]'
                        : 'bg-[#161214] text-[#FFF8EE] border-[#E5A93C]/25 hover:border-[#F4C430]'
                    }`}
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>
          </div>

          {(totalSelectedKg > 0 || selectedGuests !== null) && (
            <div className="mt-4 pt-4 border-t border-[#E5A93C]/20 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
              <div className="text-[#F5EBE1] tabular-nums">
                <span className="font-semibold text-[#E5A93C]">{copy.recommendedLabel}:</span>{' '}
                {totalSelectedKg > 0 ? (
                  <>
                    <strong className="text-[#FFF8EE]">{totalSelectedKg} kg</strong> (~
                    {totalSelectedKg * 6}–{totalSelectedKg * 7} servings)
                    {selectedEntries.length > 0 && (
                      <span className="text-[#F5EBE1]/75">
                        {' '}
                        · {selectedEntries.map((e) => `${e.item.name} (${e.kg} kg)`).join(', ')}
                      </span>
                    )}
                  </>
                ) : (
                  <span>
                    {GUEST_PRESETS.find((p) => p.guests === selectedGuests)?.suggestion}
                  </span>
                )}
              </div>

              <button
                type="button"
                onClick={() => {
                  const formEl = document.getElementById('party-enquiry-form');
                  formEl?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }}
                className="text-xs font-bold text-[#F4C430] underline cursor-pointer whitespace-nowrap"
              >
                {lang === 'hi' ? 'नीचे फॉर्म देखें' : 'Review Enquiry Form'}
              </button>
            </div>
          )}
        </div>

        {/* Main Grid: Left Per-Kg Dishes with Kg Steppers | Right Enquiry Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Left: Per Kg Dishes */}
          <div className="lg:col-span-7 space-y-8">
            {BULK_GROUPS.map((group) => {
              const groupItems = BULK_ORDER_ITEMS.filter((item) => item.subCategory === group);
              return (
                <div
                  key={group}
                  className="rounded-xl bg-[#2A060C] border border-[#E5A93C]/20 p-5 sm:p-6"
                >
                  <div className="flex items-center justify-between gap-4 border-b border-[#E5A93C]/20 pb-3 mb-4">
                    <h3 className="font-display text-xl sm:text-2xl font-bold text-[#FFF8EE]">
                      {group}
                    </h3>
                    <span className="text-xs font-semibold text-[#E5A93C]">Per Kg Basis</span>
                  </div>

                  <div className="divide-y divide-[#E5A93C]/12">
                    {groupItems.map((item) => {
                      const kgCount = kgById[item.id] ?? 0;
                      return (
                        <div
                          key={item.id}
                          className="py-3.5 first:pt-1 last:pb-1 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 border border-[#E5A93C]/20 bg-[#1F191B]">
                              <FoodImage
                                src={item.image}
                                alt={`${item.name} bulk order`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <DietaryBadge dietary={item.dietary} />
                                <span className="font-display text-base sm:text-lg font-semibold text-[#FFF8EE] truncate">
                                  {item.name}
                                </span>
                              </div>
                              <p className="text-xs text-[#E5A93C] font-medium mt-0.5">
                                Ask for Rates · 1 kg serves ~6–7
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <div className="inline-flex items-center rounded-lg bg-[#161214] border border-[#E5A93C]/30">
                              <button
                                type="button"
                                onClick={() => adjustDishKg(item.id, -1)}
                                aria-label={`Decrease ${item.name} kilos`}
                                className="w-8 h-8 inline-flex items-center justify-center text-[#F5EBE1] hover:text-[#F4C430] transition-colors cursor-pointer"
                              >
                                <Minus className="w-3.5 h-3.5" aria-hidden="true" />
                              </button>
                              <span className="min-w-[46px] text-center text-xs font-bold text-[#FFF8EE] tabular-nums px-1">
                                {kgCount} kg
                              </span>
                              <button
                                type="button"
                                onClick={() => adjustDishKg(item.id, 1)}
                                aria-label={`Increase ${item.name} kilos`}
                                className="w-8 h-8 inline-flex items-center justify-center text-[#F5EBE1] hover:text-[#F4C430] transition-colors cursor-pointer"
                              >
                                <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                              </button>
                            </div>

                            <a
                              href={buildQuickBulkDishUrl(
                                kgCount > 0 ? `${item.name} (${kgCount} kg)` : item.name
                              )}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F4C430] hover:bg-[#E5A93C] text-[#161214] text-xs font-bold transition-colors whitespace-nowrap"
                            >
                              <MessageCircle className="w-3.5 h-3.5" aria-hidden="true" />
                              <span>WhatsApp</span>
                            </a>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right: Party & Bulk Enquiry Form */}
          <div className="lg:col-span-5 lg:sticky lg:top-24">
            <form
              id="party-enquiry-form"
              onSubmit={handleSubmit}
              noValidate
              className="rounded-xl bg-[#1F191B] border border-[#E5A93C]/30 p-5 sm:p-7 space-y-5 shadow-[0_16px_36px_-10px_rgba(0,0,0,0.6)]"
            >
              <div>
                <h3 className="font-display text-2xl font-bold text-[#FFF8EE]">
                  Bulk Catering Enquiry
                </h3>
                <p className="text-xs sm:text-sm text-[#F5EBE1]/75 mt-1">
                  Share your event details below to send a pre-filled WhatsApp enquiry for per-kg
                  rates and advance booking confirmation.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#F5EBE1]/80 bg-[#161214] rounded-lg p-3 border border-[#E5A93C]/15">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#F4C430] shrink-0" aria-hidden="true" />
                  <span>Family &amp; Group Meals</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#F4C430] shrink-0" aria-hidden="true" />
                  <span>Advance Booking Required</span>
                </div>
              </div>

              <div>
                <label
                  htmlFor="party-name"
                  className="block text-xs font-semibold text-[#F5EBE1] mb-1.5"
                >
                  Customer Name <span className="text-[#F4C430]">*</span>
                </label>
                <input
                  id="party-name"
                  type="text"
                  value={form.customerName}
                  onChange={(e) => {
                    setForm({ ...form, customerName: e.target.value });
                    if (errors.customerName) setErrors({ ...errors, customerName: undefined });
                  }}
                  placeholder="Enter your full name"
                  className="w-full px-3.5 py-2.5 min-h-[42px] rounded-lg bg-[#161214] border border-[#E5A93C]/25 focus:border-[#F4C430] focus:outline-none text-sm text-[#FFF8EE] placeholder:text-[#F5EBE1]/40"
                />
                {errors.customerName && (
                  <p className="text-xs text-[#ffb4ab] mt-1">{errors.customerName}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="party-phone"
                    className="block text-xs font-semibold text-[#F5EBE1] mb-1.5"
                  >
                    Contact Number <span className="text-[#F4C430]">*</span>
                  </label>
                  <input
                    id="party-phone"
                    type="tel"
                    value={form.contactNumber}
                    onChange={(e) => {
                      setForm({ ...form, contactNumber: e.target.value });
                      if (errors.contactNumber) setErrors({ ...errors, contactNumber: undefined });
                    }}
                    placeholder="10-digit mobile number"
                    className="w-full px-3.5 py-2.5 min-h-[42px] rounded-lg bg-[#161214] border border-[#E5A93C]/25 focus:border-[#F4C430] focus:outline-none text-sm text-[#FFF8EE] placeholder:text-[#F5EBE1]/40"
                  />
                  {errors.contactNumber && (
                    <p className="text-xs text-[#ffb4ab] mt-1">{errors.contactNumber}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="party-date"
                    className="block text-xs font-semibold text-[#F5EBE1] mb-1.5"
                  >
                    Event Date <span className="text-[#F4C430]">*</span>
                  </label>
                  <input
                    id="party-date"
                    type="date"
                    value={form.eventDate}
                    onChange={(e) => {
                      setForm({ ...form, eventDate: e.target.value });
                      if (errors.eventDate) setErrors({ ...errors, eventDate: undefined });
                    }}
                    className="w-full px-3.5 py-2.5 min-h-[42px] rounded-lg bg-[#161214] border border-[#E5A93C]/25 focus:border-[#F4C430] focus:outline-none text-sm text-[#FFF8EE]"
                  />
                  {errors.eventDate && (
                    <p className="text-xs text-[#ffb4ab] mt-1">{errors.eventDate}</p>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="party-quantity"
                  className="block text-xs font-semibold text-[#F5EBE1] mb-1.5"
                >
                  Approximate Quantity / Guests <span className="text-[#F4C430]">*</span>
                </label>
                <input
                  id="party-quantity"
                  type="text"
                  value={form.approximateQuantity}
                  onChange={(e) => {
                    setForm({ ...form, approximateQuantity: e.target.value });
                    if (errors.approximateQuantity)
                      setErrors({ ...errors, approximateQuantity: undefined });
                  }}
                  placeholder="e.g. 5 kg Biryani / 35 guests"
                  className="w-full px-3.5 py-2.5 min-h-[42px] rounded-lg bg-[#161214] border border-[#E5A93C]/25 focus:border-[#F4C430] focus:outline-none text-sm text-[#FFF8EE] placeholder:text-[#F5EBE1]/40"
                />
                {errors.approximateQuantity && (
                  <p className="text-xs text-[#ffb4ab] mt-1">{errors.approximateQuantity}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="party-requirements"
                  className="block text-xs font-semibold text-[#F5EBE1] mb-1.5"
                >
                  Food Requirements <span className="text-[#F4C430]">*</span>
                </label>
                <textarea
                  id="party-requirements"
                  rows={3}
                  value={form.foodRequirements}
                  onChange={(e) => {
                    setForm({ ...form, foodRequirements: e.target.value });
                    if (errors.foodRequirements)
                      setErrors({ ...errors, foodRequirements: undefined });
                  }}
                  placeholder="e.g. Chicken Biryani (4 kg), Veg Pulao (2 kg), Chicken Curry Gavran"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#161214] border border-[#E5A93C]/25 focus:border-[#F4C430] focus:outline-none text-sm text-[#FFF8EE] placeholder:text-[#F5EBE1]/40"
                />
                {errors.foodRequirements && (
                  <p className="text-xs text-[#ffb4ab] mt-1">{errors.foodRequirements}</p>
                )}
              </div>

              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 min-h-[46px] rounded-lg bg-[#F4C430] hover:bg-[#E5A93C] text-[#161214] font-bold text-sm sm:text-base transition-colors cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" aria-hidden="true" />
                <span>{copy.sendEstimate}</span>
              </button>

              {generatedUrl && (
                <div className="rounded-lg bg-[#161214] border border-[#12803B]/60 p-3.5 text-xs text-[#F5EBE1] space-y-2">
                  <div className="flex items-start gap-2">
                    <CheckCircle2
                      className="w-4 h-4 text-[#4ade80] shrink-0 mt-0.5"
                      aria-hidden="true"
                    />
                    <p>
                      WhatsApp has been prepared with your enquiry. Please tap Send in WhatsApp to
                      confirm rates and advance booking directly with Dolly&apos;s Kitchen.
                    </p>
                  </div>
                  <a
                    href={generatedUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block font-semibold text-[#F4C430] underline"
                  >
                    Open WhatsApp Enquiry Again
                  </a>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
