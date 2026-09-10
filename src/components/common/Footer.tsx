import React, { useState } from 'react';
import { useEcommerce } from '../../context/EcommerceContext';
import { analytics } from '../../services/analytics';
import {
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Check,
  Mail,
  Lock,
} from 'lucide-react';
import { CATEGORIES } from '../../data/products';

export const Footer: React.FC = () => {
  const { navigate, addToast, applyCoupon } = useEcommerce();
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      addToast('Please enter a valid email address', 'error');
      return;
    }
    analytics.newsletterSignup('footer');
    setIsSubscribed(true);
    applyCoupon('WELCOME10');
    addToast('Welcome! Your 10% discount coupon WELCOME10 has been automatically unlocked!', 'success');
  };

  return (
    <footer id="main-footer" className="bg-stone-900 text-stone-300 pt-16 pb-12 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Trust Badges Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-12 border-b border-stone-800">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-lg bg-stone-800 text-amber-400 shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Free Express Shipping</h4>
              <p className="text-xs text-stone-400 mt-0.5">Complimentary on all orders above ₹1,499</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-lg bg-stone-800 text-emerald-400 shrink-0">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">14-Day Free Returns</h4>
              <p className="text-xs text-stone-400 mt-0.5">Hassle-free doorstep exchanges and pickups</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-lg bg-stone-800 text-sky-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Lifetime Guarantee</h4>
              <p className="text-xs text-stone-400 mt-0.5">Free hardware and seam repair program</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-lg bg-stone-800 text-stone-300 shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Plastic-Free Packaging</h4>
              <p className="text-xs text-stone-400 mt-0.5">100% recycled biodegradable unboxing</p>
            </div>
          </div>
        </div>

        {/* Newsletter & Retention Section */}
        <div className="py-12 border-b border-stone-800 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6 space-y-2">
            <span className="text-xs uppercase tracking-widest text-amber-400 font-bold">
              Join The Collective
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl text-white font-bold tracking-tight">
              Enjoy 10% off your inaugural order.
            </h3>
            <p className="text-sm text-stone-400 max-w-md">
              Receive thoughtful buying guides, exclusive small-batch drop notices, and architectural care advice. Zero spam.
            </p>
          </div>

          <div className="lg:col-span-6">
            {isSubscribed ? (
              <div className="p-4 bg-stone-800/80 rounded-lg border border-emerald-500/40 flex items-center gap-3 text-emerald-300">
                <Check className="w-5 h-5 shrink-0 text-emerald-400" />
                <span className="text-sm font-medium">
                  Welcome to VERVE! Code <strong className="text-white font-bold">WELCOME10</strong> is saved to your cart.
                </span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2 max-w-md">
                <div className="relative flex-1">
                  <Mail className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address..."
                    required
                    className="w-full pl-10 pr-4 py-3 bg-stone-800 border border-stone-700 rounded-lg text-sm text-white placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all"
                  />
                </div>
                <button
                  type="submit"
                  className="px-6 py-3 bg-stone-100 hover:bg-white text-stone-900 font-semibold text-sm rounded-lg transition-colors flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
                >
                  <span>Subscribe</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}
            <div className="flex items-center gap-1.5 text-[11px] text-stone-500 mt-2">
              <Lock className="w-3 h-3" />
              <span>We value your privacy. Unsubscribe anytime in one click.</span>
            </div>
          </div>
        </div>

        {/* Main Navigation Links Grid */}
        <div className="py-12 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {/* Col 1: Shop */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-wider font-bold text-white">Catalog</h4>
            <ul className="space-y-2 text-sm text-stone-400">
              <li>
                <button onClick={() => navigate('/shop')} className="hover:text-white transition-colors">
                  All Products
                </button>
              </li>
              {CATEGORIES.map((cat) => (
                <li key={cat.id}>
                  <button onClick={() => navigate(`/shop/${cat.slug}`)} className="hover:text-white transition-colors">
                    {cat.name}
                  </button>
                </li>
              ))}
              <li>
                <button onClick={() => navigate('/collections/sale')} className="text-amber-400 hover:text-amber-300 transition-colors">
                  Archive Sale
                </button>
              </li>
            </ul>
          </div>

          {/* Col 2: Collections */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-wider font-bold text-white">Collections</h4>
            <ul className="space-y-2 text-sm text-stone-400">
              <li>
                <button onClick={() => navigate('/collections/new-arrivals')} className="hover:text-white transition-colors">
                  New Arrivals
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/collections/best-sellers')} className="hover:text-white transition-colors">
                  Best Sellers
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/collections/minimalist-travel')} className="hover:text-white transition-colors">
                  Minimalist Travel
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/journal')} className="hover:text-white transition-colors">
                  Editorial Journal
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Customer Care & Trust */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-wider font-bold text-white">Support & Trust</h4>
            <ul className="space-y-2 text-sm text-stone-400">
              <li>
                <button onClick={() => navigate('/shipping')} className="hover:text-white transition-colors">
                  Shipping Policy
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/returns')} className="hover:text-white transition-colors">
                  Returns & Exchanges
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/faq')} className="hover:text-white transition-colors">
                  Frequently Asked Questions
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/contact')} className="hover:text-white transition-colors">
                  Contact Customer Care
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: About & Ethos */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-wider font-bold text-white">Company</h4>
            <ul className="space-y-2 text-sm text-stone-400">
              <li>
                <button onClick={() => navigate('/about')} className="hover:text-white transition-colors">
                  Our Story & Ethos
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/about#materials')} className="hover:text-white transition-colors">
                  Material Transparency
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/about#carbon')} className="hover:text-white transition-colors">
                  Carbon Neutrality
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/account')} className="hover:text-white transition-colors">
                  My Orders & Account
                </button>
              </li>
            </ul>
          </div>

          {/* Col 5: Brand Identity */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1 space-y-3">
            <span className="font-serif text-2xl font-bold text-white tracking-tight">
              VERVE
            </span>
            <p className="text-xs text-stone-400 leading-relaxed">
              Precision lifestyle gear crafted for durability, conscious reduction, and timeless utility.
            </p>
            <div className="text-xs text-stone-500 pt-2">
              <span>Bengaluru Studio • Ships Globally</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Payment Security */}
        <div className="pt-8 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <div>
            © {new Date().getFullYear()} VERVE Modern Goods Inc. All rights reserved. Built for high performance & conversion.
          </div>

          <div className="flex items-center gap-3">
            <span className="px-2 py-1 bg-stone-800 rounded text-[11px] text-stone-400 font-mono">UPI / NetBanking</span>
            <span className="px-2 py-1 bg-stone-800 rounded text-[11px] text-stone-400 font-mono">Visa / Mastercard</span>
            <span className="px-2 py-1 bg-stone-800 rounded text-[11px] text-stone-400 font-mono">256-Bit SSL</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
