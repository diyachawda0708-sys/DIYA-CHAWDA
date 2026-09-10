import React, { useState, useEffect, useMemo } from 'react';
import { useEcommerce } from '../context/EcommerceContext';
import { analytics } from '../services/analytics';
import { PRODUCTS, REVIEWS } from '../data/products';
import { ProductCard } from '../components/product/ProductCard';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { Rating } from '../components/common/Rating';
import { SEOHead } from '../components/seo/SEOHead';
import { Review } from '../types';
import {
  Truck,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Heart,
  Share2,
  ChevronDown,
  ChevronUp,
  Check,
  CheckCircle2,
  Plus,
  HelpCircle,
  Clock,
  Ruler,
} from 'lucide-react';

interface ProductDetailPageProps {
  slug: string;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ slug }) => {
  const {
    currentPath,
    navigate,
    addToCart,
    toggleWishlist,
    isInWishlist,
    trackViewedProduct,
    getRelatedProducts,
    recentlyViewed,
    addToast,
  } = useEcommerce();

  const product = useMemo(() => {
    return PRODUCTS.find((p) => p.slug === slug) || PRODUCTS[0];
  }, [slug]);

  // Gallery state
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Variant selections
  const [selectedColor, setSelectedColor] = useState(product.colors[0]?.name || 'Standard');
  const [selectedSize, setSelectedSize] = useState<string | undefined>(
    product.sizes ? product.sizes[0] : undefined
  );
  const [quantity, setQuantity] = useState(1);

  // Accordion & Tabs states
  const [activeTab, setActiveTab] = useState<'desc' | 'specs' | 'shipping' | 'faqs'>('desc');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);

  // Mobile Sticky Add to Cart visibility
  const [showStickyBar, setShowStickyBar] = useState(false);

  // Review submission state
  const [productReviews, setProductReviews] = useState<Review[]>(() => {
    return REVIEWS.filter((r) => r.productId === product.id);
  });
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [newReviewAuthor, setNewReviewAuthor] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewTitle, setNewReviewTitle] = useState('');
  const [newReviewComment, setNewReviewComment] = useState('');

  // Track PDP view & history
  useEffect(() => {
    trackViewedProduct(product);
    analytics.viewItem(product);
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [product]);

  // Track scroll for sticky mobile Add-to-Cart
  useEffect(() => {
    const handleScroll = () => {
      const buyBox = document.getElementById('pdp-buy-box');
      if (buyBox) {
        const rect = buyBox.getBoundingClientRect();
        setShowStickyBar(rect.bottom < 0);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isWishlisted = isInWishlist(product.id);
  const relatedProducts = getRelatedProducts(product, 4);

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = () => {
    addToCart(product, selectedColor, selectedSize, quantity);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.shortDescription,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      addToast('Product link copied to clipboard!', 'success');
    }
    analytics.share('product', product.id);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewAuthor || !newReviewTitle || !newReviewComment) {
      addToast('Please fill out all review fields', 'error');
      return;
    }
    const newRev: Review = {
      id: `rev_user_${Date.now()}`,
      productId: product.id,
      author: newReviewAuthor,
      rating: newReviewRating,
      date: 'Just now',
      title: newReviewTitle,
      comment: newReviewComment,
      verifiedPurchase: true,
      helpfulCount: 0,
    };
    setProductReviews((prev) => [newRev, ...prev]);
    setIsReviewModalOpen(false);
    setNewReviewAuthor('');
    setNewReviewTitle('');
    setNewReviewComment('');
    addToast('Thank you for reviewing! Your feedback is now live.', 'success');
  };

  const breadcrumbs = [
    { label: 'Shop', path: '/shop' },
    { label: product.category, path: `/shop/${product.categorySlug}` },
    { label: product.name },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 space-y-12">
      <SEOHead
        title={`${product.name} | VERVE`}
        description={product.shortDescription}
        canonicalPath={currentPath}
        ogImage={product.images[0]}
        ogType="product"
        product={product}
        breadcrumbs={breadcrumbs}
      />

      {/* Breadcrumbs */}
      <Breadcrumbs items={breadcrumbs} />

      {/* Main PDP Grid: Gallery (Left) + Buy Box (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left: Product Gallery */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative aspect-square sm:aspect-4/3 w-full rounded-2xl overflow-hidden bg-stone-100 border border-stone-200 shadow-xs">
            <img
              src={product.images[activeImageIndex] || product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover object-center transition-all duration-300"
              fetchPriority="high"
            />

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-1.5 z-10">
              {product.badge && (
                <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider bg-stone-900 text-white rounded-md shadow-xs">
                  {product.badge}
                </span>
              )}
              {discountPercent > 0 && (
                <span className="px-2.5 py-0.5 text-xs font-bold bg-rose-100 text-rose-800 rounded-md border border-rose-200">
                  Save {discountPercent}%
                </span>
              )}
            </div>

            {/* Wishlist & Share Top Right */}
            <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
              <button
                onClick={() => toggleWishlist(product)}
                className={`p-2.5 rounded-full shadow-md backdrop-blur-xs transition-all ${
                  isWishlisted
                    ? 'bg-rose-50 text-rose-600'
                    : 'bg-white/90 text-stone-700 hover:bg-white hover:text-stone-900'
                }`}
                aria-label={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-rose-600' : ''}`} />
              </button>
              <button
                onClick={handleShare}
                className="p-2.5 rounded-full bg-white/90 hover:bg-white text-stone-700 hover:text-stone-900 shadow-md backdrop-blur-xs transition-all"
                aria-label="Share product"
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Thumbnails Row */}
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`aspect-square rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                    activeImageIndex === idx
                      ? 'border-stone-900 ring-2 ring-stone-900/20'
                      : 'border-stone-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={img}
                    alt={`${product.name} thumbnail view ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Key Product Benefits List */}
          <div className="p-5 bg-white rounded-2xl border border-stone-200 space-y-3 mt-6">
            <h3 className="text-xs uppercase tracking-wider font-bold text-stone-900">
              Engineered Advantages
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm text-stone-600">
              {product.benefits.map((benefit, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right: Buy Box */}
        <div id="pdp-buy-box" className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <button
                onClick={() => navigate(`/shop/${product.categorySlug}`)}
                className="text-xs uppercase tracking-wider font-bold text-amber-700 hover:underline"
              >
                {product.category}
              </button>
              <span className="text-xs text-stone-400 font-mono">SKU: {product.sku}</span>
            </div>

            <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-stone-900 tracking-tight leading-snug">
              {product.name}
            </h1>

            {/* Rating Anchor */}
            <div className="flex items-center gap-3 pt-1">
              <Rating value={product.rating} count={product.reviewCount} size="md" />
              <a
                href="#customer-reviews"
                className="text-xs text-stone-500 hover:text-stone-900 underline"
              >
                Read all verified reviews
              </a>
            </div>
          </div>

          {/* Price Box */}
          <div className="p-4 bg-stone-100/70 rounded-xl border border-stone-200/80 space-y-1.5">
            <div className="flex items-baseline gap-3">
              <span className="text-2xl sm:text-3xl font-bold text-stone-900">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {product.originalPrice && (
                <span className="text-base text-stone-400 line-through">
                  ₹{product.originalPrice.toLocaleString('en-IN')}
                </span>
              )}
              {discountPercent > 0 && (
                <span className="px-2 py-0.5 text-xs font-bold text-rose-700 bg-rose-100 rounded">
                  Save ₹{(product.originalPrice! - product.price).toLocaleString('en-IN')} ({discountPercent}%)
                </span>
              )}
            </div>
            <p className="text-xs text-stone-500">
              Tax included. Free express shipping automatically applied on this order.
            </p>
          </div>

          {/* Variant: Colors */}
          {product.colors && product.colors.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-stone-900">
                  Color: <strong className="text-stone-700 font-normal">{selectedColor}</strong>
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                {product.colors.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => {
                      setSelectedColor(c.name);
                      if (c.imageIndex < product.images.length) {
                        setActiveImageIndex(c.imageIndex);
                      }
                    }}
                    title={c.name}
                    className={`w-8 h-8 rounded-full border-2 p-0.5 flex items-center justify-center transition-all ${
                      selectedColor === c.name
                        ? 'border-stone-900 scale-110 shadow-xs ring-1 ring-stone-900/30'
                        : 'border-transparent hover:scale-105'
                    }`}
                  >
                    <span
                      className="w-full h-full rounded-full border border-stone-300"
                      style={{ backgroundColor: c.hex }}
                    />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Variant: Sizes */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-stone-900">
                  Size: <strong className="text-stone-700 font-normal">{selectedSize}</strong>
                </span>
                <button
                  onClick={() => setIsSizeGuideOpen(true)}
                  className="text-stone-500 hover:text-stone-900 underline flex items-center gap-1"
                >
                  <Ruler className="w-3.5 h-3.5" />
                  <span>Size & Dimensions Guide</span>
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setSelectedSize(sz)}
                    className={`px-4 py-2 text-xs font-semibold rounded-lg border transition-all ${
                      selectedSize === sz
                        ? 'bg-stone-900 text-white border-stone-900 shadow-xs'
                        : 'bg-stone-50 text-stone-800 border-stone-300 hover:border-stone-500'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Stock Indicator */}
          <div className="flex items-center gap-2 text-xs">
            <span
              className={`w-2 h-2 rounded-full ${
                product.inStock ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'
              }`}
            />
            <span className="font-medium text-stone-700">
              {product.inStock
                ? `In Stock • Only ${product.stockCount} units available from current batch`
                : 'Temporarily Sold Out'}
            </span>
          </div>

          {/* Quantity and Add-to-Cart Buttons */}
          <div className="space-y-3 pt-2">
            <div className="flex gap-3">
              {/* Stepper */}
              <div className="flex items-center border border-stone-300 rounded-xl bg-white shrink-0">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3.5 py-3 text-stone-600 hover:bg-stone-100 rounded-l-xl text-base"
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <span className="px-4 py-3 text-sm font-bold text-stone-900 min-w-10 text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3.5 py-3 text-stone-600 hover:bg-stone-100 rounded-r-xl text-base"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              {/* Main Add-To-Cart CTA */}
              <button
                id="main-add-to-cart-btn"
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className={`flex-1 py-3.5 px-6 rounded-xl text-sm font-semibold shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  product.inStock
                    ? 'bg-stone-900 hover:bg-stone-800 text-white'
                    : 'bg-stone-300 text-stone-500 cursor-not-allowed'
                }`}
              >
                <span>Add to Cart</span>
                <span>•</span>
                <span>₹{(product.price * quantity).toLocaleString('en-IN')}</span>
              </button>
            </div>

            {/* Quick Buy Trust Row */}
            <div className="grid grid-cols-3 gap-2 text-center text-[11px] text-stone-600 pt-3 border-t border-stone-100">
              <div className="flex flex-col items-center gap-1">
                <Truck className="w-4 h-4 text-stone-500" />
                <span>Free Express Delivery</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <RotateCcw className="w-4 h-4 text-stone-500" />
                <span>14-Day Free Returns</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-stone-500" />
                <span>2-Year Warranty</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs & Deep Information Section */}
      <section className="pt-8 border-t border-stone-200 space-y-6">
        {/* Navigation Tabs */}
        <div className="flex border-b border-stone-200 overflow-x-auto space-x-6">
          {[
            { id: 'desc', label: 'Description & Craft' },
            { id: 'specs', label: 'Technical Specifications' },
            { id: 'shipping', label: 'Shipping & Free Returns' },
            { id: 'faqs', label: 'Care & FAQs' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`pb-3 text-sm font-bold tracking-tight transition-colors border-b-2 whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-stone-900 text-stone-950'
                  : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content 1: Description */}
        {activeTab === 'desc' && (
          <div className="max-w-3xl space-y-4 text-sm text-stone-700 leading-relaxed">
            <p>{product.description}</p>
            <div className="p-4 bg-stone-100 rounded-xl border border-stone-200/80 space-y-2">
              <h4 className="font-bold text-xs uppercase tracking-wider text-stone-900">
                Ethical Materials Transparency
              </h4>
              <p className="text-xs text-stone-600">
                Crafted using {product.materials.join(', ')}. All raw fibers and hides are fully traceable to verified ethical mills that practice non-toxic dye reclamation and fair wage standard certifications.
              </p>
            </div>
          </div>
        )}

        {/* Tab Content 2: Technical Specifications */}
        {activeTab === 'specs' && (
          <div className="max-w-3xl">
            <div className="border border-stone-200 rounded-xl overflow-hidden">
              <dl className="divide-y divide-stone-200">
                {Object.entries(product.specs).map(([label, val], idx) => (
                  <div
                    key={label}
                    className={`px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 text-xs sm:text-sm ${
                      idx % 2 === 0 ? 'bg-white' : 'bg-stone-50'
                    }`}
                  >
                    <dt className="font-semibold text-stone-900">{label}</dt>
                    <dd className="mt-1 sm:mt-0 sm:col-span-2 text-stone-600">{val}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        )}

        {/* Tab Content 3: Shipping & Returns */}
        {activeTab === 'shipping' && (
          <div className="max-w-3xl space-y-4 text-xs sm:text-sm text-stone-700 leading-relaxed">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-stone-200 bg-white space-y-2">
                <div className="flex items-center gap-2 font-bold text-stone-900">
                  <Truck className="w-4 h-4 text-stone-900" />
                  <span>Domestic Express Delivery</span>
                </div>
                <p className="text-xs text-stone-600">
                  Dispatched within 24 hours from our Bengaluru studio. Metro cities receive orders within 2 to 3 business days. Real-time SMS & WhatsApp tracking provided.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-stone-200 bg-white space-y-2">
                <div className="flex items-center gap-2 font-bold text-stone-900">
                  <RotateCcw className="w-4 h-4 text-emerald-700" />
                  <span>14-Day Free Exchanges</span>
                </div>
                <p className="text-xs text-stone-600">
                  Unworn goods with original tags qualify for free home pickup returns and instant sizing exchanges. Refunds credited directly to your original payment method.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content 4: FAQs */}
        {activeTab === 'faqs' && (
          <div className="max-w-3xl space-y-3">
            {product.faqs.map((faq, index) => {
              const isExpanded = expandedFaq === index;
              return (
                <div
                  key={index}
                  className="border border-stone-200 rounded-xl overflow-hidden bg-white"
                >
                  <button
                    onClick={() => setExpandedFaq(isExpanded ? null : index)}
                    className="w-full text-left px-4 py-3.5 text-xs sm:text-sm font-semibold text-stone-900 flex items-center justify-between hover:bg-stone-50"
                  >
                    <span>{faq.question}</span>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-stone-500" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-stone-500" />
                    )}
                  </button>
                  {isExpanded && (
                    <div className="px-4 pb-4 pt-1 text-xs sm:text-sm text-stone-600 border-t border-stone-100">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Customer Reviews Section */}
      <section id="customer-reviews" className="pt-12 border-t border-stone-200 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs uppercase tracking-widest text-stone-500 font-bold">
              Community Ratings
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
              Customer Reviews ({productReviews.length})
            </h2>
            <div className="flex items-center gap-3 mt-2">
              <Rating value={product.rating} count={product.reviewCount} size="lg" />
              <span className="text-xs text-stone-500">98% of buyers recommend this product</span>
            </div>
          </div>

          <button
            onClick={() => setIsReviewModalOpen(true)}
            className="px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer self-start sm:self-auto"
          >
            Write a Review
          </button>
        </div>

        {/* Reviews List */}
        <div className="space-y-4">
          {productReviews.length === 0 ? (
            <div className="py-8 text-center text-xs text-stone-500 bg-stone-50 rounded-xl">
              Be the first to share your thoughts on the {product.name}.
            </div>
          ) : (
            productReviews.map((rev) => (
              <div
                key={rev.id}
                className="p-5 bg-white rounded-xl border border-stone-200 space-y-2 shadow-2xs"
              >
                <div className="flex items-center justify-between">
                  <Rating value={rev.rating} showCount={false} size="sm" />
                  <span className="text-xs text-stone-400">{rev.date}</span>
                </div>
                <h4 className="text-sm font-bold text-stone-900">{rev.title}</h4>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">{rev.comment}</p>
                <div className="pt-2 flex items-center gap-2 text-[11px] text-stone-500">
                  <span className="font-semibold text-stone-800">{rev.author}</span>
                  <span>•</span>
                  {rev.verifiedPurchase && (
                    <span className="text-emerald-700 font-medium flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Verified Purchase
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Write Review Modal */}
      {isReviewModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs"
          role="dialog"
        >
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-200 space-y-4">
            <h3 className="text-lg font-bold text-stone-900">Write a Review</h3>
            <form onSubmit={handleReviewSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-stone-700 block mb-1">Your Name</label>
                <input
                  type="text"
                  value={newReviewAuthor}
                  onChange={(e) => setNewReviewAuthor(e.target.value)}
                  placeholder="e.g. Maya R."
                  required
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg"
                />
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">Rating</label>
                <select
                  value={newReviewRating}
                  onChange={(e) => setNewReviewRating(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg bg-white"
                >
                  <option value={5}>5 Stars - Exceptional</option>
                  <option value={4}>4 Stars - Very Good</option>
                  <option value={3}>3 Stars - Average</option>
                  <option value={2}>2 Stars - Subpar</option>
                  <option value={1}>1 Star - Dissatisfied</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">Review Headline</label>
                <input
                  type="text"
                  value={newReviewTitle}
                  onChange={(e) => setNewReviewTitle(e.target.value)}
                  placeholder="e.g. Unbelievable comfort and build quality"
                  required
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg"
                />
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">Your Feedback</label>
                <textarea
                  value={newReviewComment}
                  onChange={(e) => setNewReviewComment(e.target.value)}
                  rows={4}
                  placeholder="Share details about the fit, texture, functionality..."
                  required
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg"
                />
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsReviewModalOpen(false)}
                  className="w-1/2 py-2.5 rounded-lg border border-stone-300 font-semibold text-stone-700 hover:bg-stone-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 rounded-lg bg-stone-900 text-white font-semibold hover:bg-stone-800"
                >
                  Submit Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Size Guide Modal */}
      {isSizeGuideOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs"
          role="dialog"
        >
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="text-base font-bold text-stone-900">Sizing & Fit Guide</h3>
              <button
                onClick={() => setIsSizeGuideOpen(false)}
                className="text-stone-400 hover:text-stone-900 text-sm font-bold"
              >
                Close
              </button>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              All VERVE apparel cuts feature relaxed architectural draping. Measure across your chest flat to find your optimal silhouette.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border border-stone-200">
                <thead className="bg-stone-100 uppercase text-stone-600">
                  <tr>
                    <th className="p-2 border-b">Size</th>
                    <th className="p-2 border-b">Chest (Inches)</th>
                    <th className="p-2 border-b">Length (Inches)</th>
                    <th className="p-2 border-b">Shoulder</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200 text-stone-800">
                  <tr><td className="p-2 font-bold">XS</td><td className="p-2">36 - 38</td><td className="p-2">27</td><td className="p-2">17.5</td></tr>
                  <tr><td className="p-2 font-bold">S</td><td className="p-2">38 - 40</td><td className="p-2">28</td><td className="p-2">18.2</td></tr>
                  <tr><td className="p-2 font-bold">M</td><td className="p-2">40 - 42</td><td className="p-2">29</td><td className="p-2">19.0</td></tr>
                  <tr><td className="p-2 font-bold">L</td><td className="p-2">42 - 44</td><td className="p-2">30</td><td className="p-2">19.8</td></tr>
                  <tr><td className="p-2 font-bold">XL</td><td className="p-2">44 - 47</td><td className="p-2">31</td><td className="p-2">20.5</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Related Products Recommendation Carousel */}
      {relatedProducts.length > 0 && (
        <section className="pt-12 border-t border-stone-200 space-y-6">
          <div className="flex items-end justify-between">
            <div>
              <span className="text-xs uppercase tracking-widest text-stone-500 font-bold">
                Curated Recommendations
              </span>
              <h2 className="font-serif text-2xl font-bold text-stone-900 mt-1">
                Complete The Look
              </h2>
            </div>
            <button
              onClick={() => navigate(`/shop/${product.categorySlug}`)}
              className="text-xs font-semibold text-stone-900 hover:underline"
            >
              View More in {product.category}
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} listName="Related Products" />
            ))}
          </div>
        </section>
      )}

      {/* Recently Viewed Goods */}
      {recentlyViewed.length > 1 && (
        <section className="pt-12 border-t border-stone-200 space-y-6">
          <span className="text-xs uppercase tracking-widest text-stone-500 font-bold block">
            Your Transit History
          </span>
          <h2 className="font-serif text-2xl font-bold text-stone-900">
            Recently Viewed
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            {recentlyViewed
              .filter((p) => p.id !== product.id)
              .slice(0, 4)
              .map((p) => (
                <ProductCard key={p.id} product={p} listName="Recently Viewed" />
              ))}
          </div>
        </section>
      )}

      {/* MOBILE STICKY ADD TO CART BAR (Requirement: On mobile, make Add to Cart sticky where appropriate) */}
      {showStickyBar && (
        <div
          id="mobile-sticky-add-to-cart"
          className="lg:hidden fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-stone-200 p-3 z-40 shadow-xl flex items-center justify-between gap-3 animate-in slide-in-from-bottom duration-200"
        >
          <div className="min-w-0">
            <h4 className="text-xs font-bold text-stone-900 truncate">{product.name}</h4>
            <div className="text-xs text-stone-600 font-medium">
              ₹{product.price.toLocaleString('en-IN')}
              {selectedSize && <span className="text-stone-400 ml-1">/ {selectedSize}</span>}
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className={`py-2.5 px-5 rounded-xl text-xs font-bold shadow-md flex items-center gap-1.5 shrink-0 transition-all ${
              product.inStock
                ? 'bg-stone-900 text-white hover:bg-stone-800'
                : 'bg-stone-300 text-stone-500 cursor-not-allowed'
            }`}
          >
            <span>Add to Cart</span>
          </button>
        </div>
      )}
    </div>
  );
};
