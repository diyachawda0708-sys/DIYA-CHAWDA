import React, { useState } from 'react';
import { useEcommerce } from '../context/EcommerceContext';
import { analytics } from '../services/analytics';
import { SEOHead } from '../components/seo/SEOHead';
import { Order } from '../types';
import {
  ShieldCheck,
  Lock,
  Truck,
  CreditCard,
  QrCode,
  Banknote,
  CheckCircle2,
  ArrowRight,
  ChevronRight,
  Tag,
  Sparkles,
  RotateCcw,
} from 'lucide-react';

export const CheckoutPage: React.FC = () => {
  const {
    cart,
    subtotal,
    isFreeShipping,
    appliedCoupon,
    discountAmount,
    applyCoupon,
    removeCoupon,
    clearCart,
    setCurrentOrder,
    addOrder,
    navigate,
    addToast,
  } = useEcommerce();

  // Multi-step: 'shipping' -> 'payment'
  const [step, setStep] = useState<'shipping' | 'payment'>('shipping');

  // Contact & Shipping Info Form State
  const [email, setEmail] = useState('arjun.sharma@example.com');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [firstName, setFirstName] = useState('Arjun');
  const [lastName, setLastName] = useState('Sharma');
  const [address, setAddress] = useState('Flat 402, Oakwood Residences, 12th Main Road');
  const [apartment, setApartment] = useState('Indiranagar');
  const [city, setCity] = useState('Bengaluru');
  const [state, setState] = useState('Karnataka');
  const [postalCode, setPostalCode] = useState('560038');
  const [country, setCountry] = useState('India');
  const [saveInfo, setSaveInfo] = useState(true);

  // Payment Method State
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'cod' | 'netbanking'>('upi');
  const [upiId, setUpiId] = useState('arjun@okhdfcbank');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Coupon State
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');

  const shippingCost = isFreeShipping ? 0 : 150;
  const estimatedTotal = Math.max(0, subtotal - discountAmount + (cart.length > 0 ? shippingCost : 0));

  // If cart is empty, redirect
  if (cart.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center space-y-4">
        <h2 className="text-2xl font-bold text-stone-900">Your Checkout is Empty</h2>
        <p className="text-sm text-stone-500">
          You do not have any goods selected for purchase.
        </p>
        <button
          onClick={() => navigate('/shop')}
          className="px-6 py-3 bg-stone-900 text-white rounded-xl text-xs font-semibold hover:bg-stone-800"
        >
          Return to Shop
        </button>
      </div>
    );
  }

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    if (!couponCode) return;
    const res = applyCoupon(couponCode);
    if (!res.success) {
      setCouponError(res.message);
    } else {
      setCouponCode('');
    }
  };

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !firstName || !lastName || !address || !city || !postalCode) {
      addToast('Please complete all required shipping fields', 'error');
      return;
    }
    setStep('payment');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePlaceOrder = () => {
    setIsProcessing(true);

    setTimeout(() => {
      const orderId = `VRV-${Math.floor(100000 + Math.random() * 900000)}`;
      const newOrder: Order = {
        id: orderId,
        items: [...cart],
        subtotal,
        shipping: shippingCost,
        discount: discountAmount,
        total: estimatedTotal,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        shippingAddress: {
          firstName,
          lastName,
          address,
          apartment,
          city,
          state,
          postalCode,
          country,
          phone,
        },
        paymentMethod:
          paymentMethod === 'upi'
            ? 'UPI (Instant QR / ID)'
            : paymentMethod === 'card'
            ? 'Credit Card'
            : paymentMethod === 'cod'
            ? 'Cash on Delivery'
            : 'Net Banking',
        status: 'Confirmed',
      };

      // Telemetry
      analytics.purchase(newOrder.id, newOrder.items, newOrder.subtotal, 0, newOrder.shipping, newOrder.total);

      // Save order in context and clear cart
      setCurrentOrder(newOrder);
      addOrder(newOrder);
      clearCart();
      setIsProcessing(false);
      navigate(`/order-confirmation/${orderId}`);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-stone-50 pb-20">
      <SEOHead
        title="Secure Checkout | VERVE Modern Goods"
        description="256-bit encrypted checkout. Support for UPI, Cards, Netbanking and Cash on Delivery with carbon-neutral transit."
        canonicalPath="/checkout"
      />

      {/* Trust Checkout Header */}
      <div className="bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div
            onClick={() => navigate('/')}
            className="font-serif text-xl font-bold tracking-tight text-stone-900 cursor-pointer"
          >
            VERVE
          </div>
          <div className="flex items-center gap-2 text-xs text-stone-600">
            <Lock className="w-3.5 h-3.5 text-emerald-600" />
            <span className="font-semibold text-stone-900">256-Bit SSL Encrypted</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Form & Steps */}
          <div className="lg:col-span-7 space-y-6">
            {/* Step Breadcrumb indicator */}
            <div className="flex items-center gap-2 text-xs font-semibold text-stone-500">
              <button
                onClick={() => setStep('shipping')}
                className={step === 'shipping' ? 'text-stone-900' : 'hover:text-stone-700 underline'}
              >
                1. Shipping & Contact
              </button>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className={step === 'payment' ? 'text-stone-900' : ''}>
                2. Payment & Verification
              </span>
            </div>

            {/* Express Checkout Fast Buttons */}
            <div className="p-5 bg-white rounded-2xl border border-stone-200 space-y-3 shadow-2xs">
              <span className="text-xs uppercase tracking-wider font-bold text-stone-400 block text-center">
                Express Checkout
              </span>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setPaymentMethod('upi');
                    setStep('payment');
                  }}
                  className="py-3 px-4 bg-stone-900 hover:bg-stone-800 text-white font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-2"
                >
                  <QrCode className="w-4 h-4 text-emerald-400" />
                  <span>Google Pay / UPI</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setPaymentMethod('card');
                    setStep('payment');
                  }}
                  className="py-3 px-4 bg-stone-100 hover:bg-stone-200 text-stone-900 font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-2"
                >
                  <CreditCard className="w-4 h-4 text-stone-700" />
                  <span>Card Instant</span>
                </button>
              </div>
              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-stone-200" />
                <span className="flex-shrink mx-4 text-[11px] text-stone-400 uppercase font-semibold">
                  Or enter details below
                </span>
                <div className="flex-grow border-t border-stone-200" />
              </div>
            </div>

            {/* STEP 1: Shipping & Contact Form */}
            {step === 'shipping' ? (
              <form onSubmit={handleProceedToPayment} className="p-6 bg-white rounded-2xl border border-stone-200 space-y-5 shadow-2xs">
                <h3 className="text-base font-bold text-stone-900">Contact Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="font-semibold text-stone-700 block mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@domain.com"
                      className="w-full px-3 py-2.5 bg-stone-50 border border-stone-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-stone-700 block mb-1">Mobile Phone *</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full px-3 py-2.5 bg-stone-50 border border-stone-300 rounded-lg"
                    />
                  </div>
                </div>

                <h3 className="text-base font-bold text-stone-900 pt-3 border-t border-stone-100">
                  Shipping Address
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="font-semibold text-stone-700 block mb-1">First Name *</label>
                    <input
                      type="text"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full px-3 py-2.5 bg-stone-50 border border-stone-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-stone-700 block mb-1">Last Name *</label>
                    <input
                      type="text"
                      required
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full px-3 py-2.5 bg-stone-50 border border-stone-300 rounded-lg"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="font-semibold text-stone-700 block mb-1">Street Address *</label>
                    <input
                      type="text"
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="House/flat no, building name, street"
                      className="w-full px-3 py-2.5 bg-stone-50 border border-stone-300 rounded-lg"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="font-semibold text-stone-700 block mb-1">Apartment / Locality (Optional)</label>
                    <input
                      type="text"
                      value={apartment}
                      onChange={(e) => setApartment(e.target.value)}
                      className="w-full px-3 py-2.5 bg-stone-50 border border-stone-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-stone-700 block mb-1">City *</label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-3 py-2.5 bg-stone-50 border border-stone-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-stone-700 block mb-1">State *</label>
                    <input
                      type="text"
                      required
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full px-3 py-2.5 bg-stone-50 border border-stone-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-stone-700 block mb-1">Postal Code (PIN) *</label>
                    <input
                      type="text"
                      required
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      className="w-full px-3 py-2.5 bg-stone-50 border border-stone-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-stone-700 block mb-1">Country</label>
                    <input
                      type="text"
                      disabled
                      value={country}
                      className="w-full px-3 py-2.5 bg-stone-100 border border-stone-300 rounded-lg text-stone-500"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <label className="flex items-center gap-2 text-xs text-stone-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={saveInfo}
                      onChange={(e) => setSaveInfo(e.target.checked)}
                      className="rounded border-stone-300 text-stone-900"
                    />
                    <span>Save this information for seamless 1-click checkout next time</span>
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-stone-900 hover:bg-stone-800 text-white font-semibold text-sm rounded-xl transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer mt-4"
                >
                  <span>Continue to Payment</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            ) : (
              /* STEP 2: Payment Method Selection */
              <div className="p-6 bg-white rounded-2xl border border-stone-200 space-y-6 shadow-2xs">
                {/* Shipping Summary Bar */}
                <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-stone-500 block">Delivering to:</span>
                    <strong className="text-stone-900">
                      {firstName} {lastName}, {address}, {city} - {postalCode}
                    </strong>
                  </div>
                  <button
                    onClick={() => setStep('shipping')}
                    className="text-stone-900 font-semibold underline ml-4"
                  >
                    Edit
                  </button>
                </div>

                <h3 className="text-base font-bold text-stone-900">Select Payment Method</h3>

                <div className="space-y-3">
                  {/* UPI Option */}
                  <label
                    className={`block p-4 rounded-xl border-2 transition-all cursor-pointer ${
                      paymentMethod === 'upi'
                        ? 'border-stone-900 bg-stone-50/50'
                        : 'border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="payment"
                          checked={paymentMethod === 'upi'}
                          onChange={() => setPaymentMethod('upi')}
                          className="accent-stone-900"
                        />
                        <span className="text-xs font-bold text-stone-900">
                          UPI (Instant PhonePe, Google Pay, Paytm, BHIM)
                        </span>
                      </div>
                      <QrCode className="w-4 h-4 text-emerald-600" />
                    </div>

                    {paymentMethod === 'upi' && (
                      <div className="mt-3 pt-3 border-t border-stone-200 text-xs space-y-2">
                        <label className="text-stone-700 font-semibold block">Enter Virtual Payment Address (VPA)</label>
                        <input
                          type="text"
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                          placeholder="e.g. mobile@upi or username@okhdfcbank"
                          className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs"
                        />
                        <p className="text-[11px] text-stone-500">
                          A payment prompt will be sent directly to your preferred UPI app.
                        </p>
                      </div>
                    )}
                  </label>

                  {/* Card Option */}
                  <label
                    className={`block p-4 rounded-xl border-2 transition-all cursor-pointer ${
                      paymentMethod === 'card'
                        ? 'border-stone-900 bg-stone-50/50'
                        : 'border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="payment"
                          checked={paymentMethod === 'card'}
                          onChange={() => setPaymentMethod('card')}
                          className="accent-stone-900"
                        />
                        <span className="text-xs font-bold text-stone-900">
                          Credit / Debit Card (Visa, Mastercard, RuPay)
                        </span>
                      </div>
                      <CreditCard className="w-4 h-4 text-stone-700" />
                    </div>

                    {paymentMethod === 'card' && (
                      <div className="mt-3 pt-3 border-t border-stone-200 text-xs space-y-3">
                        <div>
                          <label className="text-stone-700 font-semibold block mb-1">Card Number</label>
                          <input
                            type="text"
                            placeholder="4111 2222 3333 4444"
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs font-mono"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-stone-700 font-semibold block mb-1">MM/YY</label>
                            <input
                              type="text"
                              placeholder="08/28"
                              value={cardExpiry}
                              onChange={(e) => setCardExpiry(e.target.value)}
                              className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs"
                            />
                          </div>
                          <div>
                            <label className="text-stone-700 font-semibold block mb-1">CVV</label>
                            <input
                              type="password"
                              placeholder="•••"
                              maxLength={4}
                              value={cardCvc}
                              onChange={(e) => setCardCvc(e.target.value)}
                              className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </label>

                  {/* Cash on Delivery (COD) Option */}
                  <label
                    className={`block p-4 rounded-xl border-2 transition-all cursor-pointer ${
                      paymentMethod === 'cod'
                        ? 'border-stone-900 bg-stone-50/50'
                        : 'border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="payment"
                          checked={paymentMethod === 'cod'}
                          onChange={() => setPaymentMethod('cod')}
                          className="accent-stone-900"
                        />
                        <span className="text-xs font-bold text-stone-900">
                          Cash on Delivery (Pay upon doorstep arrival)
                        </span>
                      </div>
                      <Banknote className="w-4 h-4 text-amber-700" />
                    </div>
                  </label>
                </div>

                {/* Submit / Place Order */}
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={handlePlaceOrder}
                  className="w-full py-4 bg-stone-900 hover:bg-stone-800 text-white font-bold text-sm rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isProcessing ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Authorizing Secure Payment...
                    </span>
                  ) : (
                    <span>Complete Order • ₹{estimatedTotal.toLocaleString('en-IN')}</span>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Right Column: Order Summary & Reassurances */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 bg-white rounded-2xl border border-stone-200 space-y-4 shadow-2xs">
              <h3 className="text-base font-bold text-stone-900">Order Summary</h3>

              {/* Items preview */}
              <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-12 h-12 rounded-lg object-cover bg-stone-100 shrink-0"
                    />
                    <div className="flex-1 min-w-0 text-xs">
                      <h4 className="font-semibold text-stone-900 truncate">{item.product.name}</h4>
                      <p className="text-[11px] text-stone-500">
                        Qty: {item.quantity} • {item.selectedColor}
                        {item.selectedSize ? ` / ${item.selectedSize}` : ''}
                      </p>
                    </div>
                    <span className="text-xs font-bold text-stone-900">
                      ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>

              {/* Promo code */}
              <div className="pt-3 border-t border-stone-100">
                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-2 bg-emerald-50 rounded-lg text-xs text-emerald-900">
                    <div className="flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Code <strong>{appliedCoupon}</strong></span>
                    </div>
                    <button onClick={removeCoupon} className="font-semibold underline">
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Coupon Code"
                      className="flex-1 px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs uppercase"
                    />
                    <button
                      type="submit"
                      className="px-3 py-2 bg-stone-900 text-white rounded-lg text-xs font-semibold hover:bg-stone-800"
                    >
                      Apply
                    </button>
                  </form>
                )}
                {couponError && <p className="text-[11px] text-rose-600 mt-1">{couponError}</p>}
              </div>

              {/* Price Calculations */}
              <div className="space-y-2 pt-3 border-t border-stone-100 text-xs text-stone-600">
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
                  <span>Express Shipping</span>
                  {isFreeShipping ? (
                    <span className="font-bold text-emerald-600 uppercase text-[11px]">Free</span>
                  ) : (
                    <span className="font-semibold text-stone-900">₹{shippingCost}</span>
                  )}
                </div>
                <div className="flex justify-between text-base font-bold text-stone-900 pt-3 border-t border-stone-200">
                  <span>Total Due</span>
                  <span>₹{estimatedTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            {/* Trust Reassurance Badges */}
            <div className="p-5 bg-stone-100 rounded-2xl border border-stone-200/80 space-y-3 text-xs text-stone-600">
              <div className="flex items-start gap-3">
                <ShieldCheck className="w-4 h-4 text-stone-900 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-stone-900 block">14-Day Hassle-Free Returns</strong>
                  <span>Free doorstep pickup and instant exchange on all orders.</span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Truck className="w-4 h-4 text-stone-900 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-stone-900 block">Carbon Neutral Dispatch</strong>
                  <span>Track your package via SMS and WhatsApp updates every step of transit.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
