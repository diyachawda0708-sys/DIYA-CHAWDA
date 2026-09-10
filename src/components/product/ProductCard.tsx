import React, { useState } from 'react';
import { Product } from '../../types';
import { useEcommerce } from '../../context/EcommerceContext';
import { analytics } from '../../services/analytics';
import { Rating } from '../common/Rating';
import { Heart, Plus, Eye, Check } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  listName?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  listName = 'Product Grid',
}) => {
  const {
    navigate,
    toggleWishlist,
    isInWishlist,
    addToCart,
    setQuickViewProduct,
  } = useEcommerce();

  const [isHovered, setIsHovered] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string | undefined>(
    product.sizes ? product.sizes[0] : undefined
  );
  const [showQuickSelect, setShowQuickSelect] = useState(false);
  const [isAddedRecently, setIsAddedRecently] = useState(false);

  const isWishlisted = isInWishlist(product.id);
  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleProductClick = () => {
    analytics.selectItem(product, listName);
    navigate(`/products/${product.slug}`);
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (product.sizes && product.sizes.length > 1 && !showQuickSelect) {
      setShowQuickSelect(true);
      return;
    }

    addToCart(product, product.colors[0]?.name || 'Default', selectedSize, 1);
    setIsAddedRecently(true);
    setShowQuickSelect(false);
    setTimeout(() => setIsAddedRecently(false), 2000);
  };

  const handleSelectSizeAndAdd = (size: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedSize(size);
    addToCart(product, product.colors[0]?.name || 'Default', size, 1);
    setIsAddedRecently(true);
    setShowQuickSelect(false);
    setTimeout(() => setIsAddedRecently(false), 2000);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.stopPropagation();
    analytics.productQuickView(product);
    setQuickViewProduct(product);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <div
      id={`product-card-${product.id}`}
      className="group relative flex flex-col bg-white rounded-xl border border-stone-200/80 hover:border-stone-300 hover:shadow-md transition-all duration-200 overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setShowQuickSelect(false);
      }}
    >
      {/* Image Container with Badges and Overlays */}
      <div
        className="relative aspect-square w-full overflow-hidden bg-stone-100 cursor-pointer"
        onClick={handleProductClick}
      >
        <img
          src={isHovered && product.images[1] ? product.images[1] : product.images[0]}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
        />

        {/* Badges: Top Left */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
          {product.badge && (
            <span
              className={`px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider rounded-md shadow-xs ${
                product.badge === 'Best Seller'
                  ? 'bg-stone-900 text-white'
                  : product.badge === 'New'
                  ? 'bg-amber-500 text-stone-950'
                  : product.badge === 'Sustainable'
                  ? 'bg-emerald-700 text-white'
                  : product.badge === 'Sale'
                  ? 'bg-rose-700 text-white'
                  : 'bg-stone-700 text-white'
              }`}
            >
              {product.badge}
            </span>
          )}

          {discountPercent > 0 && (
            <span className="px-2 py-0.5 text-[10px] font-semibold bg-rose-100 text-rose-800 rounded-md border border-rose-200">
              Save {discountPercent}%
            </span>
          )}
        </div>

        {/* Action Buttons: Top Right */}
        <div className="absolute top-2.5 right-2.5 flex flex-col gap-1.5 z-10">
          <button
            type="button"
            onClick={handleWishlistToggle}
            className={`p-2 rounded-full transition-all shadow-xs ${
              isWishlisted
                ? 'bg-rose-50 text-rose-600'
                : 'bg-white/90 text-stone-700 hover:bg-white hover:text-stone-900'
            }`}
            aria-label={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
          >
            <Heart
              className={`w-4 h-4 ${isWishlisted ? 'fill-rose-600' : ''}`}
            />
          </button>

          <button
            type="button"
            onClick={handleQuickView}
            className="p-2 rounded-full bg-white/90 text-stone-700 hover:bg-white hover:text-stone-900 transition-all shadow-xs opacity-0 group-hover:opacity-100 focus:opacity-100 hidden sm:flex items-center justify-center"
            aria-label={`Quick view ${product.name}`}
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>

        {/* Inline Size Selector Drawer on Card */}
        {showQuickSelect && product.sizes && (
          <div
            className="absolute inset-x-0 bottom-0 bg-stone-900/95 text-white p-3 z-20 animate-in slide-in-from-bottom duration-150 backdrop-blur-xs"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-[11px] uppercase tracking-wider text-stone-300 font-semibold mb-2">
              Select Size:
            </div>
            <div className="flex flex-wrap gap-1.5">
              {product.sizes.map((sz) => (
                <button
                  key={sz}
                  type="button"
                  onClick={(e) => handleSelectSizeAndAdd(sz, e)}
                  className="px-2.5 py-1 text-xs font-semibold bg-stone-800 hover:bg-white hover:text-stone-900 border border-stone-700 rounded transition-colors"
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Quick Add overlay button on desktop */}
        {!showQuickSelect && (
          <div className="absolute inset-x-3 bottom-3 z-10 hidden sm:block opacity-0 group-hover:opacity-100 transition-all duration-200">
            <button
              type="button"
              onClick={handleQuickAdd}
              disabled={!product.inStock}
              className={`w-full py-2.5 px-3 rounded-lg text-xs font-semibold shadow-md flex items-center justify-center gap-1.5 transition-all ${
                isAddedRecently
                  ? 'bg-emerald-600 text-white'
                  : product.inStock
                  ? 'bg-stone-900 hover:bg-stone-800 text-white'
                  : 'bg-stone-300 text-stone-500 cursor-not-allowed'
              }`}
            >
              {isAddedRecently ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-200" />
                  <span>Added to Cart</span>
                </>
              ) : product.inStock ? (
                <>
                  <Plus className="w-3.5 h-3.5" />
                  <span>
                    {product.sizes && product.sizes.length > 1
                      ? 'Select Size & Add'
                      : 'Quick Add'}
                  </span>
                </>
              ) : (
                <span>Out of Stock</span>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Details Container */}
      <div className="p-3 sm:p-4 flex flex-col flex-1 justify-between gap-2">
        <div className="space-y-1">
          {/* Category & Color Swatches */}
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/shop/${product.categorySlug}`);
              }}
              className="text-[11px] uppercase tracking-wider font-semibold text-stone-500 hover:text-stone-900 transition-colors"
            >
              {product.category}
            </button>

            {product.colors && product.colors.length > 1 && (
              <div className="flex items-center gap-1">
                {product.colors.slice(0, 4).map((c, i) => (
                  <span
                    key={i}
                    title={c.name}
                    className="w-2.5 h-2.5 rounded-full border border-stone-300 shadow-2xs"
                    style={{ backgroundColor: c.hex }}
                  />
                ))}
                {product.colors.length > 4 && (
                  <span className="text-[10px] text-stone-500">
                    +{product.colors.length - 4}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Product Title */}
          <h3
            onClick={handleProductClick}
            className="text-sm sm:text-base font-semibold text-stone-900 line-clamp-1 hover:text-stone-600 transition-colors cursor-pointer"
            title={product.name}
          >
            {product.name}
          </h3>

          {/* Star Rating */}
          <div className="pt-0.5">
            <Rating value={product.rating} count={product.reviewCount} size="sm" />
          </div>
        </div>

        {/* Pricing & Mobile Quick Add */}
        <div className="pt-2 flex items-center justify-between border-t border-stone-100">
          <div className="flex items-baseline gap-2">
            <span className="text-base sm:text-lg font-bold text-stone-900">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-stone-400 line-through">
                ₹{product.originalPrice.toLocaleString('en-IN')}
              </span>
            )}
          </div>

          {/* Mobile Instant Add Button */}
          <button
            type="button"
            onClick={handleQuickAdd}
            aria-label={`Quick add ${product.name} to cart`}
            className="sm:hidden p-2 rounded-lg bg-stone-900 text-white hover:bg-stone-800 transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
