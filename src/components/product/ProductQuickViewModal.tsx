import React, { useState } from 'react';
import { useEcommerce } from '../../context/EcommerceContext';
import { Rating } from '../common/Rating';
import { X, Check, ArrowRight, ShieldCheck, Truck } from 'lucide-react';

export const ProductQuickViewModal: React.FC = () => {
  const {
    quickViewProduct,
    setQuickViewProduct,
    addToCart,
    navigate,
    toggleWishlist,
    isInWishlist,
  } = useEcommerce();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState(1);

  if (!quickViewProduct) return null;

  const product = quickViewProduct;
  const isWishlisted = isInWishlist(product.id);
  const currentColor = selectedColor || product.colors[0]?.name || 'Standard';
  const currentSize = selectedSize || (product.sizes ? product.sizes[0] : undefined);

  const handleAddToCart = () => {
    addToCart(product, currentColor, currentSize, quantity);
    setQuickViewProduct(null);
  };

  const handleGoToProductPage = () => {
    setQuickViewProduct(null);
    navigate(`/products/${product.slug}`);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-stone-950/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={() => setQuickViewProduct(null)}
      role="dialog"
      aria-modal="true"
      aria-labelledby="quick-view-title"
    >
      <div
        className="bg-white rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl border border-stone-200 grid grid-cols-1 md:grid-cols-2 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left: Gallery & Badges */}
        <div className="relative bg-stone-100 flex flex-col justify-between p-4">
          <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-stone-200">
            <img
              src={product.images[activeImageIndex] || product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {product.badge && (
              <span className="absolute top-3 left-3 px-2.5 py-1 text-xs font-bold uppercase tracking-wider bg-stone-900 text-white rounded shadow-xs">
                {product.badge}
              </span>
            )}
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-14 h-14 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${
                    activeImageIndex === idx
                      ? 'border-stone-900 ring-2 ring-stone-900/20'
                      : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`${product.name} angle ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Details & Buying Actions */}
        <div className="p-6 flex flex-col justify-between">
          <div className="space-y-4">
            {/* Header & Close */}
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs uppercase tracking-wider font-semibold text-stone-500">
                  {product.category}
                </span>
                <h2 id="quick-view-title" className="text-xl font-bold text-stone-900 mt-0.5">
                  {product.name}
                </h2>
              </div>
              <button
                onClick={() => setQuickViewProduct(null)}
                className="p-1 text-stone-400 hover:text-stone-900 rounded-lg hover:bg-stone-100"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Rating */}
            <Rating value={product.rating} count={product.reviewCount} size="md" />

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-2xl font-bold text-stone-900">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-stone-400 line-through">
                  ₹{product.originalPrice.toLocaleString('en-IN')}
                </span>
              )}
            </div>

            <p className="text-sm text-stone-600 line-clamp-2">
              {product.shortDescription}
            </p>

            {/* Color Swatches */}
            {product.colors && product.colors.length > 0 && (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase text-stone-700">
                  Color: <span className="font-normal text-stone-500">{currentColor}</span>
                </label>
                <div className="flex items-center gap-2">
                  {product.colors.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => {
                        setSelectedColor(c.name);
                        if (c.imageIndex < product.images.length) {
                          setActiveImageIndex(c.imageIndex);
                        }
                      }}
                      className={`w-7 h-7 rounded-full border-2 transition-all p-0.5 flex items-center justify-center ${
                        currentColor === c.name
                          ? 'border-stone-900 scale-110 shadow-xs'
                          : 'border-transparent hover:scale-105'
                      }`}
                      title={c.name}
                    >
                      <span
                        className="w-full h-full rounded-full border border-stone-200"
                        style={{ backgroundColor: c.hex }}
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Selector */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase text-stone-700">
                  Size: <span className="font-normal text-stone-500">{currentSize}</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((sz) => (
                    <button
                      key={sz}
                      onClick={() => setSelectedSize(sz)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                        currentSize === sz
                          ? 'bg-stone-900 text-white border-stone-900 shadow-xs'
                          : 'bg-stone-50 text-stone-700 border-stone-200 hover:border-stone-400'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Stepper */}
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold uppercase text-stone-700">Qty:</span>
              <div className="flex items-center border border-stone-300 rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-2.5 py-1 text-sm text-stone-600 hover:bg-stone-100 rounded-l-lg"
                >
                  -
                </button>
                <span className="px-3 py-1 text-xs font-semibold text-stone-900">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-2.5 py-1 text-sm text-stone-600 hover:bg-stone-100 rounded-r-lg"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="space-y-3 pt-6 mt-4 border-t border-stone-100">
            <div className="flex gap-2">
              <button
                onClick={handleAddToCart}
                className="flex-1 py-3 px-4 bg-stone-900 hover:bg-stone-800 text-white font-semibold text-sm rounded-xl transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Add to Cart</span>
                <span>•</span>
                <span>₹{(product.price * quantity).toLocaleString('en-IN')}</span>
              </button>

              <button
                onClick={() => toggleWishlist(product)}
                className={`p-3 rounded-xl border transition-colors ${
                  isWishlisted
                    ? 'border-rose-300 bg-rose-50 text-rose-600'
                    : 'border-stone-300 text-stone-700 hover:bg-stone-50'
                }`}
                aria-label={isWishlisted ? 'Saved in wishlist' : 'Save to wishlist'}
              >
                <Check className={`w-5 h-5 ${isWishlisted ? 'block' : 'hidden'}`} />
                {!isWishlisted && <span className="text-xs font-bold px-1">Save</span>}
              </button>
            </div>

            <button
              onClick={handleGoToProductPage}
              className="w-full text-center text-xs text-stone-500 hover:text-stone-900 font-medium flex items-center justify-center gap-1 transition-colors py-1"
            >
              <span>View full product specifications, reviews & FAQs</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            {/* Perks */}
            <div className="flex items-center justify-between text-[11px] text-stone-500 pt-2">
              <span className="flex items-center gap-1">
                <Truck className="w-3.5 h-3.5 text-stone-400" /> Free Shipping
              </span>
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-stone-400" /> Lifetime Repair
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
