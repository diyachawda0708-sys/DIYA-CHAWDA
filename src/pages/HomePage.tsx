import React from 'react';
import { useEcommerce } from '../context/EcommerceContext';
import { PRODUCTS, CATEGORIES, COLLECTIONS, REVIEWS } from '../data/products';
import { ARTICLES } from '../data/articles';
import { ProductCard } from '../components/product/ProductCard';
import { SEOHead } from '../components/seo/SEOHead';
import { Rating } from '../components/common/Rating';
import {
  ArrowRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  Compass,
  CheckCircle2,
  BookOpen,
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { navigate } = useEcommerce();

  const newArrivals = PRODUCTS.filter((p) => p.newArrival).slice(0, 4);
  const bestSellers = PRODUCTS.filter((p) => p.bestSeller).slice(0, 4);
  const featuredArticles = ARTICLES.slice(0, 3);

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      <SEOHead
        title="Sustainable Everyday Carry, Minimalist Apparel & Accessories"
        description="Shop VERVE Modern Goods. Mindfully crafted organic cotton tees, weatherproof waxed canvas daypacks, and vegetable-tanned leather carry engineered for longevity."
        canonicalPath="/"
      />

      {/* Hero Section */}
      <section
        id="hero-section"
        aria-label="Hero Introduction"
        className="relative overflow-hidden bg-stone-900 text-stone-100 min-h-[560px] sm:min-h-[640px] flex items-center"
      >
        {/* Background Image with Dark Vignette Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1800&auto=format&fit=crop"
            alt="Minimalist artisanal lifestyle carry and apparel"
            className="w-full h-full object-cover object-center opacity-40 filter brightness-90"
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-950/70 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="max-w-2xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-semibold tracking-wide text-amber-300 border border-white/10">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Architectural Spring/Summer Collection Live</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
              Everyday carry engineered for mindful permanence.
            </h1>

            <p className="text-base sm:text-lg text-stone-300 leading-relaxed max-w-xl font-normal">
              Heavyweight GOTS-certified organic cotton, Japanese Kurashiki waxed canvas, and vegetable-tanned Tuscan leather. Calibrated for daily resilience and effortless reduction.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <button
                id="hero-primary-cta"
                onClick={() => navigate('/collections/new-arrivals')}
                className="px-7 py-3.5 bg-stone-100 hover:bg-white text-stone-900 text-sm font-semibold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>Explore New Arrivals</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                id="hero-secondary-cta"
                onClick={() => navigate('/collections/best-sellers')}
                className="px-7 py-3.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 text-sm font-semibold rounded-xl backdrop-blur-xs transition-colors flex items-center justify-center cursor-pointer"
              >
                <span>Shop Best Sellers</span>
              </button>
            </div>

            {/* Social Trust Metrics */}
            <div className="pt-6 border-t border-white/15 flex flex-wrap items-center gap-6 text-xs text-stone-300">
              <div className="flex items-center gap-2">
                <Rating value={4.9} count={1240} size="sm" />
                <span className="text-stone-300 font-medium">Verified Buyers</span>
              </div>
              <div className="flex items-center gap-1.5 text-stone-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>100% Carbon Neutral Delivery</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Value Proposition Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 sm:p-8 bg-white rounded-2xl border border-stone-200 shadow-xs">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-stone-100 text-stone-900 shrink-0">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-900">Functional Minimalism</h3>
              <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                Every stitch, pocket, and closure is engineered around ergonomic utility. Zero superfluous detailing.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-stone-100 text-stone-900 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-900">Lifetime Craftsmanship</h3>
              <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                Built to outlive fast-fashion cycles. If seams or hardware ever fail under normal transit, we repair them free.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-stone-100 text-stone-900 shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-900">Frictionless Delivery</h3>
              <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                Free express shipping on all orders over ₹1,499. Backed by our 14-day hassle-free doorstep returns.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Category Discovery Grid */}
      <section id="category-discovery" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs uppercase tracking-widest text-stone-500 font-bold">
              Architectural Domains
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
              Explore by Category
            </h2>
          </div>
          <button
            onClick={() => navigate('/shop')}
            className="text-xs sm:text-sm font-semibold text-stone-900 hover:text-stone-600 flex items-center gap-1 cursor-pointer"
          >
            <span>View All Catalog</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {CATEGORIES.map((category) => (
            <div
              key={category.id}
              onClick={() => navigate(`/shop/${category.slug}`)}
              className="group relative h-80 rounded-2xl overflow-hidden bg-stone-900 cursor-pointer shadow-xs border border-stone-200"
            >
              <img
                src={category.image}
                alt={category.name}
                loading="lazy"
                className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105 opacity-80 group-hover:opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/30 to-transparent" />

              <div className="absolute inset-x-0 bottom-0 p-5 space-y-1">
                <span className="text-[11px] uppercase tracking-wider text-amber-300 font-bold">
                  {category.itemCount} Items
                </span>
                <h3 className="text-xl font-bold text-white group-hover:text-stone-100 transition-colors">
                  {category.name}
                </h3>
                <p className="text-xs text-stone-300 line-clamp-2 leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {category.description}
                </p>
                <div className="pt-2 flex items-center gap-1 text-xs font-semibold text-white">
                  <span>Browse Category</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Best Sellers Section */}
      <section id="best-sellers-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs uppercase tracking-widest text-amber-700 font-bold">
              Community Favorites
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
              Our Most Coveted Icons
            </h2>
          </div>
          <button
            onClick={() => navigate('/collections/best-sellers')}
            className="text-xs sm:text-sm font-semibold text-stone-900 hover:text-stone-600 flex items-center gap-1 cursor-pointer"
          >
            <span>View All ({PRODUCTS.filter((p) => p.bestSeller).length})</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {bestSellers.map((product) => (
            <ProductCard key={product.id} product={product} listName="Homepage Best Sellers" />
          ))}
        </div>
      </section>

      {/* Featured Collection Banner: Minimalist Travel */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-stone-950 text-white min-h-[440px] flex items-center shadow-xl">
          <img
            src="https://images.unsplash.com/photo-1503220317375-aaad61436b1b?q=80&w=1600&auto=format&fit=crop"
            alt="Minimalist Travel Collection luggage and accessories"
            className="absolute inset-0 w-full h-full object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-950/80 to-transparent" />

          <div className="relative z-10 max-w-xl p-8 sm:p-14 space-y-4">
            <span className="text-xs uppercase tracking-widest text-amber-300 font-bold">
              Curated Edit
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white leading-tight">
              The Minimalist Travel Collection
            </h2>
            <p className="text-sm sm:text-base text-stone-300 leading-relaxed font-normal">
              Ultralight packable textiles, carry-on compliant full-grain weekenders, and crease-resistant merino trousers engineered for frictionless airport transit.
            </p>
            <div className="pt-2">
              <button
                onClick={() => navigate('/collections/minimalist-travel')}
                className="px-6 py-3.5 bg-white text-stone-900 hover:bg-stone-100 font-semibold text-sm rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
              >
                <span>Discover Travel Edit</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* New Arrivals Section */}
      <section id="new-arrivals-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs uppercase tracking-widest text-stone-500 font-bold">
              Just Released
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
              New Arrivals
            </h2>
          </div>
          <button
            onClick={() => navigate('/collections/new-arrivals')}
            className="text-xs sm:text-sm font-semibold text-stone-900 hover:text-stone-600 flex items-center gap-1 cursor-pointer"
          >
            <span>View All New ({PRODUCTS.filter((p) => p.newArrival).length})</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {newArrivals.map((product) => (
            <ProductCard key={product.id} product={product} listName="Homepage New Arrivals" />
          ))}
        </div>
      </section>

      {/* Social Proof & Customer Reviews */}
      <section id="social-proof-section" className="bg-stone-100/70 py-16 border-y border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-xs uppercase tracking-widest text-stone-500 font-bold">
              Verified Experience
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
              Trusted by Discerning Commuters
            </h2>
            <div className="flex items-center justify-center gap-2 pt-1">
              <Rating value={4.9} count={1240} size="md" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {REVIEWS.slice(0, 3).map((review) => {
              const reviewedProduct = PRODUCTS.find((p) => p.id === review.productId);
              return (
                <div
                  key={review.id}
                  className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-xs flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <Rating value={review.rating} showCount={false} size="sm" />
                    <h3 className="text-sm font-bold text-stone-900">
                      &quot;{review.title}&quot;
                    </h3>
                    <p className="text-xs text-stone-600 leading-relaxed">
                      {review.comment}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-[11px]">
                    <div>
                      <span className="font-bold text-stone-900 block">{review.author}</span>
                      <span className="text-emerald-700 font-medium">Verified Buyer</span>
                    </div>
                    {reviewedProduct && (
                      <button
                        onClick={() => navigate(`/products/${reviewedProduct.slug}`)}
                        className="text-stone-400 hover:text-stone-900 transition-colors underline"
                      >
                        {reviewedProduct.name.split(' ')[0]} {reviewedProduct.name.split(' ')[1]}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Editorial / Buying Guides Section */}
      <section id="editorial-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs uppercase tracking-widest text-stone-500 font-bold">
              Content & Research
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
              The VERVE Journal
            </h2>
          </div>
          <button
            onClick={() => navigate('/journal')}
            className="text-xs sm:text-sm font-semibold text-stone-900 hover:text-stone-600 flex items-center gap-1 cursor-pointer"
          >
            <span>Read All Articles</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredArticles.map((article) => (
            <div
              key={article.id}
              onClick={() => navigate(`/journal/${article.slug}`)}
              className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-stone-200/80 hover:border-stone-300 shadow-xs hover:shadow-md transition-all cursor-pointer"
            >
              <div className="relative aspect-video overflow-hidden bg-stone-100">
                <img
                  src={article.coverImage}
                  alt={article.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute top-3 left-3 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-white/95 text-stone-900 rounded-md backdrop-blur-xs">
                  {article.category}
                </span>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-1.5">
                  <span className="text-[11px] text-stone-400 font-medium">
                    {article.date} • {article.readTime}
                  </span>
                  <h3 className="text-base font-bold text-stone-900 group-hover:text-stone-700 transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed">
                    {article.excerpt}
                  </p>
                </div>

                <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs font-semibold text-stone-900">
                  <span>Read Guide</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
