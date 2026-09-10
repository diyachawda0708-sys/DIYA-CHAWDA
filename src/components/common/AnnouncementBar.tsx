import React, { useState } from 'react';
import { useEcommerce } from '../../context/EcommerceContext';
import { ShieldCheck, Sparkles, Truck, X } from 'lucide-react';

export const AnnouncementBar: React.FC = () => {
  const { isFreeShipping, amountToFreeShipping, navigate } = useEcommerce();
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <aside
      id="announcement-bar"
      aria-label="Promotional Announcement"
      className="bg-stone-900 text-stone-200 text-xs font-medium py-2 px-4 transition-colors"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="hidden md:flex items-center gap-2 text-stone-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Carbon-Neutral Delivery & 14-Day Hassle-Free Returns</span>
        </div>

        <div className="flex-1 text-center flex items-center justify-center gap-2">
          {isFreeShipping ? (
            <span className="inline-flex items-center gap-1.5 text-emerald-300 font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>You have unlocked Free Express Shipping!</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5 text-amber-400" />
              <span>
                Free shipping on orders over <strong className="text-white">₹1,499</strong>. Add{' '}
                <strong className="text-amber-300">₹{amountToFreeShipping.toLocaleString('en-IN')}</strong> to qualify!
              </span>
            </span>
          )}
          <button
            onClick={() => navigate('/shop')}
            className="underline underline-offset-2 ml-1 text-stone-300 hover:text-white transition-colors cursor-pointer"
          >
            Shop Now
          </button>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden lg:inline text-stone-400 text-[11px]">EN / INR (₹)</span>
          <button
            onClick={() => setIsVisible(false)}
            aria-label="Dismiss Announcement"
            className="text-stone-400 hover:text-white transition-colors p-0.5 rounded focus:outline-none focus:ring-1 focus:ring-stone-400"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
};
