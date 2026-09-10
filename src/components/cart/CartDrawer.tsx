import React, { useState } from 'react';
import { useEcommerce } from '../../context/EcommerceContext';
import { analytics } from '../../services/analytics';
import { PRODUCTS } from '../../data/products';
import {
  X,
  ShoppingBag,
  Trash2,
  Bookmark,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Tag,
  Plus,
} from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    subtotal,
    cartCount,
    updateQuantity,
    removeFromCart,
    moveToWishlist,
    freeShippingProgress,
    amountToFreeShipping,
    isFreeShipping,
    appliedCoupon,
    discountAmount,
    applyCoupon,
    removeCoupon,
    addToCart,
    navigate,
  } = useEcommerce();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');

  if (!isCartOpen) return null;

  const shippingCost = isFreeShipping ? 0 : 150;
  const estimatedTotal = Math.max(0, subtotal - discountAmount + (cart.length > 0 ? shippingCost : 0));

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    if (!couponInput) return;
    const res = applyCoupon(couponInput);
    if (!res.success) {
      setCouponError(res.message);
    } else {
      setCouponInput('');
    }
  };

  const handleCheckout = () => {
    analytics.beginCheckout(cart, estimatedTotal);
    setIsCartOpen(false);
    navigate('/checkout');
  };

  // Cross-sell recommendations: pick 2 products not currently in cart
  const cartProductIds = cart.map((i) => i.product.id);
  const crossSellProducts = PRODUCTS.filter(
    (p) => !cartProductIds.includes(p.id) && (p.category === 'Accessories' || p.category === 'Home & Living')
  ).slice(0, 2);

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cart-drawer-heading"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-stone-950/60 backdrop-blur-xs transition-opacity duration-300"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-stone-50 shadow-2xl flex flex-col justify-between border-l border-stone-200">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-stone-200 bg-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-stone-900" />
              <h2 id="cart-drawer-heading" className="text-base sm:text-lg font-bold text-stone-900">
                Your Cart
              </h2>
              <span className="text-xs font-semibold bg-stone-100 text-stone-700 px-2 py-0.5 rounded-full">
                {cartCount} {cartCount === 1 ? 'item' : 'items'}
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 text-stone-400 hover:text-stone-900 rounded-lg hover:bg-stone-100 transition-colors"
              aria-label="Close cart drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="bg-stone-100/90 px-4 py-3 border-b border-stone-200">
            <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
              {isFreeShipping ? (
                <span className="text-emerald-700 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  Unlocked Free Express Delivery!
                </span>
              ) : (
                <span className="text-stone-700">
                  Add <strong className="text-amber-800">₹{amountToFreeShipping.toLocaleString('en-IN')}</strong> for Free Shipping
                </span>
              )}
              <span className="text-stone-500 font-normal">{freeShippingProgress}%</span>
            </div>
            <div className="w-full bg-stone-200 rounded-full h-1.5 overflow-hidden">
              <div
                className={`h-full transition-all duration-500 rounded-full ${
                  isFreeShipping ? 'bg-emerald-600' : 'bg-amber-600'
                }`}
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 bg-stone-200/70 rounded-full flex items-center justify-center mx-auto text-stone-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-stone-800">Your cart is currently empty</h3>
                  <p className="text-xs text-stone-500 mt-1 max-w-xs mx-auto">
                    Explore our collection of durable everyday essentials and minimalist travel goods.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    navigate('/shop');
                  }}
                  className="px-5 py-2.5 bg-stone-900 text-white rounded-lg text-xs font-semibold hover:bg-stone-800 transition-colors cursor-pointer"
                >
                  Start Browsing
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-3 bg-white p-3 rounded-xl border border-stone-200 shadow-2xs"
                  >
                    {/* Thumbnail */}
                    <div className="w-20 h-20 bg-stone-100 rounded-lg overflow-hidden shrink-0">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-1">
                          <h4
                            onClick={() => {
                              setIsCartOpen(false);
                              navigate(`/products/${item.product.slug}`);
                            }}
                            className="text-xs font-semibold text-stone-900 line-clamp-1 hover:underline cursor-pointer"
                          >
                            {item.product.name}
                          </h4>
                          <span className="text-xs font-bold text-stone-900 shrink-0">
                            ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                          </span>
                        </div>

                        <div className="text-[11px] text-stone-500 mt-0.5 space-x-1">
                          <span>{item.selectedColor}</span>
                          {item.selectedSize && <span>/ {item.selectedSize}</span>}
                        </div>
                      </div>

                      {/* Controls: Stepper & Remove/Wishlist */}
                      <div className="flex items-center justify-between mt-2 pt-1 border-t border-stone-100">
                        <div className="flex items-center border border-stone-300 rounded-md bg-stone-50">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="px-2 py-0.5 text-xs text-stone-600 hover:bg-stone-200 rounded-l-md"
                            aria-label="Decrease quantity"
                          >
                            -
                          </button>
                          <span className="px-2 py-0.5 text-xs font-semibold text-stone-900">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="px-2 py-0.5 text-xs text-stone-600 hover:bg-stone-200 rounded-r-md"
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>

                        <div className="flex items-center gap-1 text-stone-400">
                          <button
                            onClick={() => moveToWishlist(item.id)}
                            className="p-1 hover:text-stone-900 transition-colors"
                            title="Save for later"
                            aria-label="Move item to wishlist"
                          >
                            <Bookmark className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="p-1 hover:text-rose-600 transition-colors"
                            title="Remove from cart"
                            aria-label="Remove item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Cross-Sell Recommendations */}
            {cart.length > 0 && crossSellProducts.length > 0 && (
              <div className="pt-4 border-t border-stone-200">
                <span className="text-xs uppercase tracking-wider font-bold text-stone-500 block mb-2">
                  Frequently Added Together
                </span>
                <div className="space-y-2">
                  {crossSellProducts.map((rec) => (
                    <div
                      key={rec.id}
                      className="flex items-center justify-between p-2.5 bg-stone-100/80 rounded-lg border border-stone-200/80"
                    >
                      <div className="flex items-center gap-2.5">
                        <img
                          src={rec.images[0]}
                          alt={rec.name}
                          className="w-10 h-10 object-cover rounded-md bg-stone-200"
                        />
                        <div>
                          <p className="text-xs font-medium text-stone-900 line-clamp-1">{rec.name}</p>
                          <span className="text-[11px] font-bold text-stone-700">
                            ₹{rec.price.toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          analytics.recommendationClick(rec, 'cart_cross_sell');
                          addToCart(rec, rec.colors[0]?.name || 'Standard', undefined, 1);
                        }}
                        className="px-2.5 py-1 text-[11px] font-semibold bg-white hover:bg-stone-900 hover:text-white text-stone-900 border border-stone-300 rounded-md transition-colors flex items-center gap-1 shadow-2xs"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Add</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer & Checkout Action */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-5 bg-white border-t border-stone-200 space-y-3">
              {/* Coupon Code Accordion / Input */}
              <div className="space-y-1.5">
                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-2 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-900">
                    <div className="flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-emerald-600" />
                      <span>
                        Code <strong className="font-bold">{appliedCoupon}</strong> applied (
                        {appliedCoupon === 'WELCOME10' ? '10% off' : 'Discount'})
                      </span>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-emerald-700 hover:text-emerald-900 font-semibold underline"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      placeholder="Promo code (e.g. WELCOME10)"
                      className="flex-1 px-3 py-1.5 text-xs bg-stone-50 border border-stone-300 rounded-lg text-stone-900 placeholder-stone-400 uppercase"
                    />
                    <button
                      type="submit"
                      className="px-3 py-1.5 bg-stone-800 text-white rounded-lg text-xs font-semibold hover:bg-stone-900 transition-colors"
                    >
                      Apply
                    </button>
                  </form>
                )}
                {couponError && (
                  <p className="text-[11px] text-rose-600">{couponError}</p>
                )}
              </div>

              {/* Financial Calculation */}
              <div className="space-y-1.5 text-xs text-stone-600 pt-2 border-t border-stone-100">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-stone-900">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Discount</span>
                    <span className="font-semibold">-₹{discountAmount.toLocaleString('en-IN')}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Estimated Shipping</span>
                  {isFreeShipping ? (
                    <span className="font-semibold text-emerald-600 uppercase text-[11px]">Free</span>
                  ) : (
                    <span className="font-semibold text-stone-900">₹{shippingCost}</span>
                  )}
                </div>

                <div className="flex justify-between text-sm font-bold text-stone-900 pt-2 border-t border-stone-200">
                  <span>Estimated Total</span>
                  <span>₹{estimatedTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Primary Checkout CTA */}
              <button
                onClick={handleCheckout}
                className="w-full py-3.5 px-4 bg-stone-900 hover:bg-stone-800 text-white font-semibold text-sm rounded-xl transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-stone-500">
                <ShieldCheck className="w-3.5 h-3.5 text-stone-400" />
                <span>Encrypted 256-Bit SSL Checkout • 14-Day Free Returns</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
