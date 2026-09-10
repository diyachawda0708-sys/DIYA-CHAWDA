import React, { useState } from 'react';
import { useEcommerce } from '../context/EcommerceContext';
import { SEOHead } from '../components/seo/SEOHead';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import {
  User,
  Package,
  ShieldCheck,
  MapPin,
  Clock,
  ArrowRight,
  Sparkles,
  RotateCcw,
  CheckCircle2,
} from 'lucide-react';

export const AccountPage: React.FC = () => {
  const { currentPath, navigate, currentOrder } = useEcommerce();
  const [activeTab, setActiveTab] = useState<'orders' | 'warranty' | 'addresses' | 'rewards'>('orders');

  const breadcrumbs = [
    { label: 'Home', path: '/' },
    { label: 'Member Account' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 space-y-8">
      <SEOHead
        title="Member Account & Orders | VERVE Modern Goods"
        description="Access past orders, activate lifetime repair warranties, and manage address profiles."
        canonicalPath={currentPath}
        breadcrumbs={breadcrumbs}
      />

      <Breadcrumbs items={breadcrumbs} />

      {/* Member Profile Banner */}
      <div className="bg-stone-900 text-white p-6 sm:p-8 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-md">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-stone-800 border-2 border-stone-700 flex items-center justify-center text-xl font-serif font-bold text-amber-300">
            AS
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-2xl font-bold">Arjun Sharma</h1>
              <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-400/30 rounded-full">
                VERVE Tier I Member
              </span>
            </div>
            <p className="text-xs text-stone-400 mt-0.5">
              Member since 2024 • 1,450 Reward Credits Available
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/shop')}
            className="px-5 py-2.5 bg-white text-stone-900 font-bold text-xs rounded-xl hover:bg-stone-100 transition-colors cursor-pointer"
          >
            Explore New Releases
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-stone-200 overflow-x-auto space-x-6">
        {[
          { id: 'orders', label: 'Order History', icon: Package },
          { id: 'warranty', label: 'Lifetime Warranty Registrations', icon: ShieldCheck },
          { id: 'rewards', label: 'Member Perks & Credits', icon: Sparkles },
          { id: 'addresses', label: 'Saved Addresses', icon: MapPin },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`pb-3 text-xs sm:text-sm font-bold tracking-tight transition-colors border-b-2 whitespace-nowrap flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'border-stone-900 text-stone-950'
                  : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab: Orders */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {currentOrder ? (
            <div className="p-6 bg-white rounded-2xl border border-stone-200 space-y-4 shadow-2xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3 text-xs">
                <div>
                  <span className="text-stone-400">Order ID:</span>{' '}
                  <strong className="text-stone-900 font-mono">{currentOrder.id}</strong>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-stone-400">Date:</span>
                  <span className="text-stone-700">{currentOrder.date}</span>
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-semibold text-[11px]">
                    {currentOrder.status}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                {currentOrder.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-14 h-14 rounded-lg object-cover bg-stone-100"
                    />
                    <div className="flex-1 text-xs">
                      <h4 className="font-bold text-stone-900">{item.product.name}</h4>
                      <p className="text-stone-500 text-[11px]">
                        {item.selectedColor} {item.selectedSize ? `/ ${item.selectedSize}` : ''} • Qty: {item.quantity}
                      </p>
                    </div>
                    <span className="text-xs font-bold text-stone-900">
                      ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                <span className="text-stone-500">
                  Total Paid: <strong className="text-stone-900">₹{currentOrder.total.toLocaleString('en-IN')}</strong>
                </span>
                <span className="text-emerald-700 font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Free 14-Day Exchange Eligible
                </span>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center bg-white rounded-2xl border border-stone-200 space-y-3">
              <Package className="w-10 h-10 text-stone-300 mx-auto" />
              <h3 className="text-sm font-bold text-stone-800">No recent orders yet</h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                Once you place an order, live tracking stages, repair certificates, and invoices will show up here.
              </p>
              <button
                onClick={() => navigate('/shop')}
                className="px-5 py-2.5 bg-stone-900 text-white rounded-xl text-xs font-semibold hover:bg-stone-800"
              >
                Browse Catalog
              </button>
            </div>
          )}
        </div>
      )}

      {/* Tab: Lifetime Warranty */}
      {activeTab === 'warranty' && (
        <div className="p-6 bg-white rounded-2xl border border-stone-200 space-y-4">
          <div className="flex items-start gap-4">
            <ShieldCheck className="w-8 h-8 text-emerald-700 shrink-0 mt-1" />
            <div>
              <h3 className="text-base font-bold text-stone-900">VERVE Lifetime Craft Promise</h3>
              <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                All leather hardware, waxed canvas seams, and structural rivets carry lifetime free servicing. If a component ever deteriorates under normal travel, submit a complimentary repair request.
              </p>
              <div className="mt-4 p-4 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-700">
                <strong>Registered Piece:</strong> Waxed Canvas Daypack 24L (Serial: VRV-CP-90218) • Active Warranty Coverage
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Rewards */}
      {activeTab === 'rewards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-6 bg-stone-900 text-white rounded-2xl space-y-3">
            <span className="text-xs uppercase tracking-wider text-amber-400 font-bold">
              Available Credits
            </span>
            <div className="text-3xl font-bold">₹1,450</div>
            <p className="text-xs text-stone-300">
              Redeemable at checkout on any order above ₹3,000. Earn 5% back on every subsequent purchase.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-stone-200 space-y-3">
            <span className="text-xs uppercase tracking-wider text-stone-400 font-bold">
              Refer a Colleague
            </span>
            <h4 className="text-sm font-bold text-stone-900">Give ₹500, Get ₹500</h4>
            <p className="text-xs text-stone-500">
              Share your personal link. When your friend places their first order, you both receive ₹500 in store credits.
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                value="https://vervegoods.com/invite/ARJUNS"
                className="flex-1 px-3 py-1.5 bg-stone-100 border border-stone-300 rounded-lg text-xs font-mono"
              />
              <button
                onClick={() => navigator.clipboard.writeText('https://vervegoods.com/invite/ARJUNS')}
                className="px-3 py-1.5 bg-stone-900 text-white text-xs font-semibold rounded-lg"
              >
                Copy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Addresses */}
      {activeTab === 'addresses' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-5 bg-white rounded-2xl border-2 border-stone-900 space-y-2 text-xs relative">
            <span className="absolute top-4 right-4 px-2 py-0.5 bg-stone-900 text-white rounded text-[10px] font-bold">
              Default
            </span>
            <strong className="text-stone-900 text-sm block">Arjun Sharma (Home)</strong>
            <p className="text-stone-600">
              Flat 402, Oakwood Residences, 12th Main Road, Indiranagar<br />
              Bengaluru, Karnataka - 560038<br />
              Phone: +91 98765 43210
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
