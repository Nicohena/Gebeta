"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useLocale } from "@/context/LocaleContext";
import { usePriceFormatter } from "@/hooks/usePriceFormatter";
import { useFavorites } from "@/context/FavoritesContext";
import { submitFeedback } from "@/lib/supabase";
import type { MenuItem, DrinkItem } from "@/types/menu";

interface ItemDetailModalProps {
  item: MenuItem | DrinkItem | null;
  onClose: () => void;
}

const HeartIcon = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
  </svg>
);

const CheckIcon = () => (
  <svg className="w-4 h-4 text-emerald-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
  </svg>
);

const PlusIcon = () => (
  <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.5v15m7.5-7.5h-15" />
  </svg>
);

const StarIcon = ({ filled, onClick }: { filled: boolean; onClick?: () => void }) => (
  <svg
    onClick={onClick}
    className={`w-8 h-8 cursor-pointer transition-colors ${filled ? "text-amber-400" : "text-gray-300 dark:text-neutral-600"}`}
    fill="currentColor"
    viewBox="0 0 20 20"
  >
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

export default function ItemDetailModal({ item, onClose }: ItemDetailModalProps) {
  const { locale } = useLocale();
  const { format } = usePriceFormatter();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [visible, setVisible] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackSent, setFeedbackSent] = useState(false);

  useEffect(() => {
    if (item) {
      // Small delay to trigger CSS transition
      requestAnimationFrame(() => setVisible(true));
      document.body.style.overflow = "hidden";
    } else {
      setVisible(false);
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [item]);

  const handleClose = () => {
    setVisible(false);
    setTimeout(() => {
      setShowFeedback(false);
      setFeedbackSent(false);
      setRating(0);
      setComment("");
      setCustomerName("");
      onClose();
    }, 300);
  };

  const handleFeedbackSubmit = async () => {
    if (rating === 0 || !item) return;
    setIsSubmitting(true);
    await submitFeedback({
      item_id: item.id,
      rating,
      comment,
      customer_name: customerName
    });
    setIsSubmitting(false);
    setFeedbackSent(true);
  };

  if (!item) return null;

  const name = item.name[locale] || item.name.en;
  const description = item.description[locale] || item.description.en;
  const isDrink = "sizes" in item;

  return (
    <div className="fixed inset-0 z-[200]" onClick={handleClose}>
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          visible ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Modal Sheet */}
      <div
        className={`absolute bottom-0 left-0 right-0 max-h-[92vh] bg-white dark:bg-[#1A1A1A] rounded-t-3xl overflow-hidden transition-transform duration-300 ease-out ${
          visible ? "translate-y-0" : "translate-y-full"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag Handle */}
        <div className="sticky top-0 z-10 flex justify-center pt-3 pb-1 bg-white dark:bg-[#1A1A1A]">
          <div className="w-10 h-1 rounded-full bg-gray-300 dark:bg-neutral-600" />
        </div>

        <div className="overflow-y-auto max-h-[88vh] pb-8">
          {/* Hero Image */}
          <div className="relative w-full h-56 sm:h-72 bg-gray-100 dark:bg-neutral-800">
            <Image
              src={item.image}
              alt={name}
              fill
              className="object-cover"
              sizes="100vw"
              priority
            />
            {/* Gradient overlay at bottom */}
            <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white dark:from-[#1A1A1A] to-transparent" />
          </div>

          {/* Content */}
          <div className="px-6 -mt-6 relative">
            {/* Name + Price Row */}
            <div className="flex items-start justify-between gap-4 mb-2">
              <h2
                className="font-bold text-2xl text-[#1A1A1A] dark:text-white leading-tight flex-1"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                {name}
              </h2>
              <div className="flex items-center gap-3 shrink-0">
                <span className="font-bold text-lg text-[#1A1A1A] dark:text-white">
                  {format(item.priceUSD)}
                </span>
                <button
                  onClick={() => toggleFavorite(item.id)}
                  className={`transition-colors ${isFavorite(item.id) ? "text-red-500" : "text-gray-300 dark:text-neutral-500"}`}
                >
                  <svg className="w-6 h-6" fill={isFavorite(item.id) ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Description */}
            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-6">
              {description}
            </p>

            {/* Drink Sizes */}
            {isDrink && (item as DrinkItem).sizes && (
              <div className="mb-6">
                <h3 className="font-semibold text-base text-[#1A1A1A] dark:text-white mb-3">Sizes</h3>
                <div className="flex gap-3">
                  {(item as DrinkItem).sizes!.map((s) => (
                    <div
                      key={s.label}
                      className="flex-1 bg-gray-50 dark:bg-neutral-800 rounded-2xl py-3 px-4 text-center border border-gray-100 dark:border-neutral-700"
                    >
                      <span className="block text-xs font-semibold text-gray-400 uppercase mb-1">{s.label}</span>
                      <span className="block text-sm font-bold text-[#F97316]">{format(s.priceUSD)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Ingredients */}
            {item.ingredients && item.ingredients.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold text-base text-[#1A1A1A] dark:text-white mb-3">Ingredients:</h3>
                <div className="space-y-2.5">
                  {item.ingredients.map((ing) => (
                    <div key={ing} className="flex items-center gap-2.5">
                      <CheckIcon />
                      <span className="text-sm text-gray-600 dark:text-gray-300">{ing}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Nutrition Info */}
            {item.nutrition && (
              <div className="mb-6">
                <div className="bg-[#1A1A1A] dark:bg-neutral-800 rounded-2xl p-4 flex items-center justify-between">
                  <div className="text-center flex-1">
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">KCAL</span>
                    <span className="block text-sm font-bold text-white">{item.nutrition.kcal.toFixed(2)}</span>
                  </div>
                  <div className="w-px h-8 bg-neutral-700" />
                  <div className="text-center flex-1">
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">P</span>
                    <span className="block text-sm font-bold text-white">{item.nutrition.protein.toFixed(2)}g</span>
                  </div>
                  <div className="w-px h-8 bg-neutral-700" />
                  <div className="text-center flex-1">
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">F</span>
                    <span className="block text-sm font-bold text-white">{item.nutrition.fat.toFixed(2)}g</span>
                  </div>
                  <div className="w-px h-8 bg-neutral-700" />
                  <div className="text-center flex-1">
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">C</span>
                    <span className="block text-sm font-bold text-white">{item.nutrition.carbs.toFixed(2)}g</span>
                  </div>
                </div>
              </div>
            )}

            {/* Add-Ons */}
            {item.addOns && item.addOns.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold text-base text-[#1A1A1A] dark:text-white mb-3">Add-Ons</h3>
                <div className="space-y-1">
                  {item.addOns.map((addon) => (
                    <div
                      key={addon.name}
                      className="flex items-center justify-between py-2.5 group cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <PlusIcon />
                        <span className="text-sm text-gray-600 dark:text-gray-300 group-hover:text-[#1A1A1A] dark:group-hover:text-white transition-colors">
                          {addon.name}
                        </span>
                      </div>
                      <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                        {format(addon.priceUSD)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Feedback Section */}
            {feedbackSent ? (
              <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-2xl text-center mb-4 mt-4">
                <p className="text-emerald-600 dark:text-emerald-400 font-semibold text-sm">Thank you for your feedback!</p>
              </div>
            ) : showFeedback ? (
              <div className="bg-gray-50 dark:bg-neutral-800 p-5 rounded-3xl mt-4 mb-4">
                <h3 className="font-bold text-[#1A1A1A] dark:text-white mb-4 text-center">Rate this item</h3>
                <div className="flex justify-center gap-2 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <StarIcon key={star} filled={rating >= star} onClick={() => setRating(star)} />
                  ))}
                </div>
                <input
                  type="text"
                  placeholder="Your Name (optional)"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-xl px-4 py-3 text-sm mb-3 focus:outline-none focus:border-[#F97316] dark:text-white"
                />
                <textarea
                  placeholder="Tell us what you thought..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-xl px-4 py-3 text-sm mb-4 h-24 resize-none focus:outline-none focus:border-[#F97316] dark:text-white"
                />
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowFeedback(false)}
                    className="flex-1 py-3.5 rounded-xl font-semibold text-sm bg-gray-200 dark:bg-neutral-700 text-gray-700 dark:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleFeedbackSubmit}
                    disabled={rating === 0 || isSubmitting}
                    className="flex-1 py-3.5 rounded-xl font-semibold text-sm bg-[#1A1A1A] dark:bg-white text-white dark:text-[#1A1A1A] disabled:opacity-50"
                  >
                    {isSubmitting ? "Sending..." : "Submit"}
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowFeedback(true)}
                className="w-full bg-[#1A1A1A] dark:bg-white text-white dark:text-[#1A1A1A] font-semibold text-sm py-4 rounded-2xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity mt-2"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Give us feedback
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
