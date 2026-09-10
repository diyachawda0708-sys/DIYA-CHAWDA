import React from 'react';
import { useEcommerce } from '../context/EcommerceContext';
import { SEOHead } from '../components/seo/SEOHead';
import { CheckCircle2, Truck, Package, Calendar, ArrowRight, ShieldCheck } from 'lucide-react';

interface OrderConfirmationPageProps {
  orderId: string;
}

export const OrderConfirmationPage: React.FC<OrderConfirmationPageProps> = ({ orderId }) => {
  const { currentOrder, navigate } = useEcommerce();

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 pb-24 space-y-8">
      <SEOHead
        title="Order Confirmed | VERVE Modern Goods"
        description="Your order is confirmed and currently being prepared in our Bengaluru workshop."
        canonicalPath={`/order-confirmation/${orderId}`}
      />

      {/* Success Banner */}
      <div className="text-center space-y-3 bg-white p-8 rounded-3xl border border-stone-200 shadow-xs">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-2">
          <CheckCircle2 className="w-9 h-9" />
        </div>
        <span className="text-xs uppercase tracking-widest text-emerald-800 font-bold">
          Order Verified & Confirmed
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
          Thank you for your order.
        </h1>
        <p className="text-sm text-stone-600 max-w-md mx-auto">
          We have dispatched confirmation and tracking links to your registered email. Your handcrafted items are now being inspected for dispatch.
        </p>

        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-stone-100 rounded-lg text-xs font-mono text-stone-800 mt-2">
          <span>Order Number:</span>
          <strong>{orderId}</strong>
        </div>
      </div>

      {/* Estimated Delivery Timeline Box */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-stone-900 text-sm">
            <Truck className="w-4 h-4 text-stone-700" />
            <span>Estimated Delivery Schedule</span>
          </div>
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
            On Track
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs pt-2">
          <div className="p-3 bg-stone-50 rounded-xl">
            <span className="text-stone-400 block mb-1">Status</span>
            <strong className="text-stone-900">Preparing in Studio</strong>
          </div>
          <div className="p-3 bg-stone-50 rounded-xl">
            <span className="text-stone-400 block mb-1">Carrier Transit</span>
            <strong className="text-stone-900">Bluedart Express Carbon-Neutral</strong>
          </div>
          <div className="p-3 bg-stone-50 rounded-xl">
            <span className="text-stone-400 block mb-1">Estimated Arrival</span>
            <strong className="text-stone-900">Within 2–3 Business Days</strong>
          </div>
        </div>
      </div>

      {/* Retention / Member Sign-up Prompt (Growth Loop Requirement) */}
      <div className="p-6 bg-stone-900 text-white rounded-2xl space-y-3">
        <span className="text-xs uppercase tracking-wider text-amber-300 font-bold">
          Unlock Exclusive Perks
        </span>
        <h3 className="font-serif text-lg font-bold">
          Save your preferences for 1-click repeat orders
        </h3>
        <p className="text-xs text-stone-300 max-w-lg leading-relaxed">
          Create a VERVE profile to unlock lifetime repair registration, real-time SMS tracking updates, and earn 10% credit towards your subsequent purchase.
        </p>
        <button
          onClick={() => navigate('/account')}
          className="px-5 py-2.5 bg-white text-stone-900 rounded-xl text-xs font-bold hover:bg-stone-100 transition-colors cursor-pointer"
        >
          Activate Free Member Account
        </button>
      </div>

      {/* Actions */}
      <div className="text-center pt-4">
        <button
          onClick={() => navigate('/shop')}
          className="px-8 py-3.5 bg-stone-900 text-white text-xs font-bold rounded-xl hover:bg-stone-800 transition-colors inline-flex items-center gap-2 cursor-pointer"
        >
          <span>Continue Exploring Catalog</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
