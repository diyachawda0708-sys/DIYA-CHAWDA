import React, { useState, useMemo } from 'react';
import { useEcommerce } from '../context/EcommerceContext';
import { analytics } from '../services/analytics';
import { PRODUCTS, CATEGORIES, COLLECTIONS } from '../data/products';
import { ProductGrid } from '../components/product/ProductGrid';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { SEOHead } from '../components/seo/SEOHead';
import {
  SlidersHorizontal,
  X,
  ChevronDown,
  RotateCcw,
  Check,
  Star,
} from 'lucide-react';

interface ShopPageProps {
  categorySlug?: string;
  collectionSlug?: string;
  searchQuery?: string;
}

export const ShopPage: React.FC<ShopPageProps> = ({
  categorySlug,
  collectionSlug,
  searchQuery,
}) => {
  const { currentPath, navigate } = useEcommerce();

  // Active Category or Collection context
  const activeCategory = categorySlug
    ? CATEGORIES.find((c) => c.slug === categorySlug)
    : undefined;
  const activeCollection = collectionSlug
    ? COLLECTIONS.find((c) => c.slug === collectionSlug)
    : undefined;

  // Filter States
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    activeCategory ? [activeCategory.name] : []
  );
  const [selectedCollections, setSelectedCollections] = useState<string[]>(
    activeCollection ? [activeCollection.name] : []
  );
  const [priceRange, setPriceRange] = useState<number>(18000);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [minRating, setMinRating] = useState<number>(0);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>('featured');

  // Extract all available facets from product catalog
  const allSizes = useMemo(() => {
    const set = new Set<string>();
    PRODUCTS.forEach((p) => p.sizes?.forEach((s) => set.add(s)));
    return Array.from(set);
  }, []);

  const allColors = useMemo(() => {
    const map = new Map<string, string>();
    PRODUCTS.forEach((p) => p.colors.forEach((c) => map.set(c.name, c.hex)));
    return Array.from(map.entries()).map(([name, hex]) => ({ name, hex }));
  }, []);

  const allMaterials = useMemo(() => {
    const set = new Set<string>();
    PRODUCTS.forEach((p) => p.materials.forEach((m) => set.add(m.split(' ')[0])));
    return Array.from(set).slice(0, 6);
  }, []);

  // Filter and Sort execution
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((p) => {
      // Category filter
      if (categorySlug && p.categorySlug !== categorySlug) return false;
      if (selectedCategories.length > 0 && !selectedCategories.includes(p.category)) return false;

      // Collection filter
      if (collectionSlug && p.collectionSlug !== collectionSlug) return false;
      if (selectedCollections.length > 0 && !selectedCollections.includes(p.collection)) return false;

      // Price filter
      if (p.price > priceRange) return false;

      // Size filter
      if (
        selectedSizes.length > 0 &&
        (!p.sizes || !p.sizes.some((s) => selectedSizes.includes(s)))
      ) {
        return false;
      }

      // Color filter
      if (
        selectedColors.length > 0 &&
        !p.colors.some((c) => selectedColors.includes(c.name))
      ) {
        return false;
      }

      // Rating filter
      if (minRating > 0 && p.rating < minRating) return false;

      // Availability filter
      if (inStockOnly && !p.inStock) return false;

      // Search Query filter
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matches =
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q));
        if (!matches) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating-desc') return b.rating - a.rating;
      if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (sortBy === 'best-selling') return (b.reviewCount || 0) - (a.reviewCount || 0);
      return 0; // 'featured'
    });
  }, [
    categorySlug,
    collectionSlug,
    selectedCategories,
    selectedCollections,
    priceRange,
    selectedSizes,
    selectedColors,
    minRating,
    inStockOnly,
    searchQuery,
    sortBy,
  ]);

  // Reset Filters
  const handleResetFilters = () => {
    setSelectedCategories(activeCategory ? [activeCategory.name] : []);
    setSelectedCollections(activeCollection ? [activeCollection.name] : []);
    setPriceRange(18000);
    setSelectedSizes([]);
    setSelectedColors([]);
    setSelectedMaterials([]);
    setMinRating(0);
    setInStockOnly(false);
    analytics.filterUsed('reset_all', true);
  };

  const hasActiveFilters =
    selectedCategories.length > (activeCategory ? 1 : 0) ||
    selectedCollections.length > (activeCollection ? 1 : 0) ||
    priceRange < 18000 ||
    selectedSizes.length > 0 ||
    selectedColors.length > 0 ||
    selectedMaterials.length > 0 ||
    minRating > 0 ||
    inStockOnly;

  // Breadcrumbs construction
  const breadcrumbItems = [
    { label: 'Shop', path: '/shop' },
    ...(activeCategory
      ? [{ label: activeCategory.name, path: `/shop/${activeCategory.slug}` }]
      : []),
    ...(activeCollection
      ? [{ label: activeCollection.name, path: `/collections/${activeCollection.slug}` }]
      : []),
    ...(searchQuery ? [{ label: `Search: "${searchQuery}"` }] : []),
  ];

  // Dynamic SEO Details
  const pageTitle = activeCategory
    ? activeCategory.seoTitle
    : activeCollection
    ? `${activeCollection.name} Collection | VERVE Modern Goods`
    : searchQuery
    ? `Search Results for "${searchQuery}" | VERVE`
    : 'All Goods & Minimalist Essentials Catalog | VERVE';

  const pageDescription = activeCategory
    ? activeCategory.seoDescription
    : activeCollection
    ? activeCollection.description
    : 'Explore our complete catalog of organic cotton apparel, Japanese waxed canvas daypacks, and Italian leather everyday carry goods.';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-20 space-y-6">
      <SEOHead
        title={pageTitle}
        description={pageDescription}
        canonicalPath={currentPath}
        breadcrumbs={breadcrumbItems}
      />

      {/* Breadcrumbs */}
      <Breadcrumbs items={breadcrumbItems} />

      {/* SEO Title & Description Banner */}
      <div className="border-b border-stone-200 pb-6 space-y-2">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight">
          {activeCategory
            ? activeCategory.name
            : activeCollection
            ? activeCollection.name
            : searchQuery
            ? `Results for "${searchQuery}"`
            : 'All Everyday Goods'}
        </h1>
        <p className="text-sm text-stone-600 max-w-3xl leading-relaxed">
          {activeCategory
            ? activeCategory.description
            : activeCollection
            ? activeCollection.description
            : 'Meticulously engineered essentials crafted from certified organic textiles, waxed canvas, and vegetable-tanned full-grain leather.'}
        </p>
      </div>

      {/* Filter and Sort Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 py-2 border-b border-stone-100">
        <div className="flex items-center gap-2">
          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setIsFilterDrawerOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filters</span>
            {hasActiveFilters && (
              <span className="w-2 h-2 rounded-full bg-stone-900" />
            )}
          </button>

          {hasActiveFilters && (
            <button
              onClick={handleResetFilters}
              className="text-xs text-stone-500 hover:text-stone-900 flex items-center gap-1 underline ml-2"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset all</span>
            </button>
          )}
        </div>

        {/* Product Count & Sort Dropdown */}
        <div className="flex items-center gap-3">
          <span className="text-xs text-stone-500 font-medium">
            Showing <strong className="text-stone-900">{filteredProducts.length}</strong> items
          </span>

          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                analytics.sortUsed(e.target.value);
              }}
              aria-label="Sort products by"
              className="appearance-none pl-3 pr-8 py-2 bg-white border border-stone-200 rounded-lg text-xs font-semibold text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-400 cursor-pointer shadow-2xs"
            >
              <option value="featured">Sort: Featured</option>
              <option value="best-selling">Sort: Best Selling</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating-desc">Highest Rated</option>
              <option value="newest">Newest Additions</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-stone-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Main Layout: Sidebar Filters + Product Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Desktop Collapsible Filter Sidebar */}
        <aside
          aria-label="Product Faceted Filters"
          className="hidden lg:block lg:col-span-1 space-y-6 pr-4 border-r border-stone-200 sticky top-24"
        >
          {/* Categories */}
          {!categorySlug && (
            <div className="space-y-2">
              <h4 className="text-xs uppercase font-bold text-stone-900 tracking-wider">
                Category
              </h4>
              <div className="space-y-1">
                {CATEGORIES.map((c) => (
                  <label
                    key={c.id}
                    className="flex items-center gap-2 text-xs text-stone-700 hover:text-stone-900 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(c.name)}
                      onChange={(e) => {
                        const next = e.target.checked
                          ? [...selectedCategories, c.name]
                          : selectedCategories.filter((cat) => cat !== c.name);
                        setSelectedCategories(next);
                        analytics.filterUsed('category', next);
                      }}
                      className="rounded border-stone-300 text-stone-900 focus:ring-stone-400"
                    />
                    <span>{c.name}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Price Slider */}
          <div className="space-y-2 pt-4 border-t border-stone-100">
            <div className="flex justify-between text-xs font-bold text-stone-900">
              <span className="uppercase tracking-wider">Max Price</span>
              <span>₹{priceRange.toLocaleString('en-IN')}</span>
            </div>
            <input
              type="range"
              min="1000"
              max="18000"
              step="500"
              value={priceRange}
              onChange={(e) => {
                const val = Number(e.target.value);
                setPriceRange(val);
                analytics.filterUsed('price_max', val);
              }}
              className="w-full accent-stone-900 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-stone-400">
              <span>₹1,000</span>
              <span>₹18,000</span>
            </div>
          </div>

          {/* Sizes */}
          {allSizes.length > 0 && (
            <div className="space-y-2 pt-4 border-t border-stone-100">
              <h4 className="text-xs uppercase font-bold text-stone-900 tracking-wider">
                Sizes
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {allSizes.map((sz) => {
                  const isSelected = selectedSizes.includes(sz);
                  return (
                    <button
                      key={sz}
                      onClick={() => {
                        const next = isSelected
                          ? selectedSizes.filter((s) => s !== sz)
                          : [...selectedSizes, sz];
                        setSelectedSizes(next);
                        analytics.filterUsed('size', next);
                      }}
                      className={`px-2.5 py-1 text-xs font-medium rounded border transition-colors ${
                        isSelected
                          ? 'bg-stone-900 text-white border-stone-900'
                          : 'bg-stone-50 text-stone-700 border-stone-200 hover:border-stone-400'
                      }`}
                    >
                      {sz}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Color Swatches */}
          <div className="space-y-2 pt-4 border-t border-stone-100">
            <h4 className="text-xs uppercase font-bold text-stone-900 tracking-wider">
              Colors
            </h4>
            <div className="flex flex-wrap gap-2">
              {allColors.slice(0, 8).map((col) => {
                const isSelected = selectedColors.includes(col.name);
                return (
                  <button
                    key={col.name}
                    onClick={() => {
                      const next = isSelected
                        ? selectedColors.filter((c) => c !== col.name)
                        : [...selectedColors, col.name];
                      setSelectedColors(next);
                      analytics.filterUsed('color', next);
                    }}
                    title={col.name}
                    className={`w-6 h-6 rounded-full border-2 p-0.5 flex items-center justify-center transition-all ${
                      isSelected
                        ? 'border-stone-900 scale-110'
                        : 'border-transparent hover:scale-105'
                    }`}
                  >
                    <span
                      className="w-full h-full rounded-full border border-stone-300"
                      style={{ backgroundColor: col.hex }}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Minimum Rating */}
          <div className="space-y-2 pt-4 border-t border-stone-100">
            <h4 className="text-xs uppercase font-bold text-stone-900 tracking-wider">
              Customer Rating
            </h4>
            <div className="space-y-1">
              {[4.8, 4.5, 4.0].map((rating) => (
                <button
                  key={rating}
                  onClick={() => {
                    const next = minRating === rating ? 0 : rating;
                    setMinRating(next);
                    analytics.filterUsed('min_rating', next);
                  }}
                  className={`flex items-center gap-1.5 text-xs w-full py-1 px-1.5 rounded transition-colors ${
                    minRating === rating ? 'bg-stone-200 text-stone-950 font-bold' : 'text-stone-600 hover:bg-stone-100'
                  }`}
                >
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{rating}+ Stars</span>
                </button>
              ))}
            </div>
          </div>

          {/* In Stock Only */}
          <div className="pt-4 border-t border-stone-100">
            <label className="flex items-center gap-2 text-xs text-stone-700 cursor-pointer">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => {
                  setInStockOnly(e.target.checked);
                  analytics.filterUsed('in_stock_only', e.target.checked);
                }}
                className="rounded border-stone-300 text-stone-900 focus:ring-stone-400"
              />
              <span>In Stock Only</span>
            </label>
          </div>
        </aside>

        {/* Product Grid Area */}
        <main className="lg:col-span-3">
          <ProductGrid
            products={filteredProducts}
            listName={pageTitle}
            columns={3}
            emptyMessage="No products match your combination of price, size, or category filters. Try resetting filters to view all goods."
          />
        </main>
      </div>

      {/* Mobile Filter Drawer (Slide-over) */}
      {isFilterDrawerOpen && (
        <div
          className="fixed inset-0 z-50 overflow-hidden lg:hidden"
          role="dialog"
          aria-modal="true"
        >
          <div
            className="fixed inset-0 bg-stone-950/60 backdrop-blur-xs"
            onClick={() => setIsFilterDrawerOpen(false)}
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-xs sm:max-w-sm bg-white shadow-2xl flex flex-col justify-between p-5 overflow-y-auto space-y-6">
              <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                <h3 className="text-base font-bold text-stone-900">Filter Goods</h3>
                <button
                  onClick={() => setIsFilterDrawerOpen(false)}
                  className="p-1 text-stone-400 hover:text-stone-900"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Price */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-stone-900">
                  <span>Max Price</span>
                  <span>₹{priceRange.toLocaleString('en-IN')}</span>
                </div>
                <input
                  type="range"
                  min="1000"
                  max="18000"
                  step="500"
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="w-full accent-stone-900"
                />
              </div>

              {/* Category */}
              {!categorySlug && (
                <div className="space-y-2">
                  <h4 className="text-xs uppercase font-bold text-stone-900">Category</h4>
                  <div className="space-y-1">
                    {CATEGORIES.map((c) => (
                      <label key={c.id} className="flex items-center gap-2 text-xs text-stone-700">
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(c.name)}
                          onChange={(e) => {
                            setSelectedCategories(
                              e.target.checked
                                ? [...selectedCategories, c.name]
                                : selectedCategories.filter((cat) => cat !== c.name)
                            );
                          }}
                          className="rounded text-stone-900"
                        />
                        <span>{c.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Sizes */}
              {allSizes.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs uppercase font-bold text-stone-900">Sizes</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {allSizes.map((sz) => (
                      <button
                        key={sz}
                        onClick={() =>
                          setSelectedSizes(
                            selectedSizes.includes(sz)
                              ? selectedSizes.filter((s) => s !== sz)
                              : [...selectedSizes, sz]
                          )
                        }
                        className={`px-2.5 py-1 text-xs rounded border ${
                          selectedSizes.includes(sz)
                            ? 'bg-stone-900 text-white'
                            : 'bg-stone-100 text-stone-800'
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* In Stock */}
              <div>
                <label className="flex items-center gap-2 text-xs text-stone-700">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="rounded text-stone-900"
                  />
                  <span>In Stock Only</span>
                </label>
              </div>

              {/* Apply / Close */}
              <div className="pt-4 border-t border-stone-200 flex gap-2">
                <button
                  onClick={handleResetFilters}
                  className="w-1/2 py-2.5 text-xs font-semibold text-stone-700 border border-stone-300 rounded-lg hover:bg-stone-100"
                >
                  Reset
                </button>
                <button
                  onClick={() => setIsFilterDrawerOpen(false)}
                  className="w-1/2 py-2.5 text-xs font-semibold bg-stone-900 text-white rounded-lg hover:bg-stone-800"
                >
                  Show ({filteredProducts.length})
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
