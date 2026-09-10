import React from 'react';
import { useEcommerce } from '../context/EcommerceContext';
import { ProductCard } from '../components/product/ProductCard';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { SEOHead } from '../components/seo/SEOHead';
import { Heart, ShoppingBag, ArrowRight } from 'lucide-react';

export const WishlistPage: React.FC = () => {
  const { wishlistProducts, clearWishlist, addToCart, navigate, currentPath } = useEcommerce();

  const breadcrumbs = [
    { label: 'Home', path: '/' },
    { label: 'Saved Items' },
  ];

  const handleMoveAllToCart = () => {
    wishlistProducts.forEach((item) => {
      addToCart(item, item.colors[0]?.name || 'Standard', item.sizes ? item.sizes[0] : undefined, 1);
    });
    clearWishlist();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 space-y-8">
      <SEOHead
        title="Saved Items & Wishlist | VERVE"
        description="Your curated list of mindful everyday carry essentials, organic textiles, and leather goods."
        canonicalPath={currentPath}
        breadcrumbs={breadcrumbs}
      />

      <Breadcrumbs items={breadcrumbs} />

      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-stone-200 pb-6">
        <div>
          <span className="text-xs uppercase tracking-widest text-stone-500 font-bold flex items-center gap-1.5">
            <Heart className="w-3.5 h-3.5 text-rose-600" />
            Curated Vault
          </span>
          <h1 className="font-serif text-3xl font-bold text-stone-900 mt-1">
            Saved Goods ({wishlistProducts.length})
          </h1>
        </div>

        {wishlistProducts.length > 0 && (
          <div className="flex items-center gap-3">
            <button
              onClick={clearWishlist}
              className="text-xs text-stone-500 hover:text-stone-900 underline"
            >
              Clear all
            </button>
            <button
              onClick={handleMoveAllToCart}
              className="px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Move All to Cart</span>
            </button>
          </div>
        )}
      </div>

      {wishlistProducts.length === 0 ? (
        <div className="py-20 text-center space-y-4 bg-white rounded-2xl border border-stone-200 p-8 max-w-md mx-auto">
          <div className="w-14 h-14 bg-stone-100 rounded-full flex items-center justify-center mx-auto text-stone-400">
            <Heart className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-stone-900">Your wishlist is currently empty</h3>
          <p className="text-xs text-stone-500">
            Click the heart icon on any product or guide to save pieces for future contemplation.
          </p>
          <button
            onClick={() => navigate('/shop')}
            className="px-6 py-2.5 bg-stone-900 text-white rounded-xl text-xs font-semibold hover:bg-stone-800"
          >
            Explore Goods
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {wishlistProducts.map((product) => (
            <ProductCard key={product.id} product={product} listName="Wishlist Grid" />
          ))}
        </div>
      )}
    </div>
  );
};
