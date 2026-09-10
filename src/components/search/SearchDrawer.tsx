import React, { useState, useEffect, useRef } from 'react';
import { useEcommerce } from '../../context/EcommerceContext';
import { analytics } from '../../services/analytics';
import { PRODUCTS, CATEGORIES } from '../../data/products';
import { ARTICLES } from '../../data/articles';
import { Product, Category, Article } from '../../types';
import { Search, X, ArrowRight, Clock, Sparkles, BookOpen } from 'lucide-react';

const POPULAR_SEARCHES = [
  'Waxed Canvas Daypack',
  'Heavyweight Organic Tee',
  'Minimalist RFID Wallet',
  'Full-Grain Weekender',
  'Ceramic Tumbler',
  'French Linen Shirt',
];

// Simple Levenshtein distance for typo tolerance
function levenshteinDistance(a: string, b: string): number {
  const an = a ? a.length : 0;
  const bn = b ? b.length : 0;
  if (an === 0) return bn;
  if (bn === 0) return an;
  const matrix = Array.from({ length: bn + 1 }, (_, i) => [i]);
  for (let j = 0; j <= an; j++) matrix[0][j] = j;

  for (let i = 1; i <= bn; i++) {
    for (let j = 1; j <= an; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }
  return matrix[bn][an];
}

function matchesFuzzy(target: string, query: string): boolean {
  const normTarget = target.toLowerCase();
  const normQuery = query.toLowerCase().trim();
  if (normTarget.includes(normQuery)) return true;

  // Split query into tokens and test distance
  const qWords = normQuery.split(/\s+/);
  const tWords = normTarget.split(/[\s,.-]+/);

  for (const qw of qWords) {
    if (qw.length < 3) continue;
    const hasCloseWord = tWords.some((tw) => {
      if (tw.includes(qw)) return true;
      const maxDistance = qw.length > 5 ? 2 : 1;
      return levenshteinDistance(qw, tw) <= maxDistance;
    });
    if (hasCloseWord) return true;
  }
  return false;
}

export const SearchDrawer: React.FC = () => {
  const { isSearchOpen, setIsSearchOpen, navigate } = useEcommerce();
  const [query, setQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('verve_recent_searches');
      return saved ? JSON.parse(saved) : ['canvas daypack', 'merino trouser'];
    } catch {
      return ['canvas daypack'];
    }
  });

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isSearchOpen]);

  // Compute search results
  const trimmed = query.trim();
  let matchedProducts: Product[] = [];
  let matchedCategories: Category[] = [];
  let matchedArticles: Article[] = [];

  if (trimmed.length > 1) {
    matchedProducts = PRODUCTS.filter((p) => {
      return (
        matchesFuzzy(p.name, trimmed) ||
        matchesFuzzy(p.category, trimmed) ||
        matchesFuzzy(p.collection, trimmed) ||
        p.tags.some((t) => matchesFuzzy(t, trimmed)) ||
        matchesFuzzy(p.shortDescription, trimmed)
      );
    }).slice(0, 6);

    matchedCategories = CATEGORIES.filter(
      (c) => matchesFuzzy(c.name, trimmed) || matchesFuzzy(c.description, trimmed)
    );

    matchedArticles = ARTICLES.filter(
      (a) =>
        matchesFuzzy(a.title, trimmed) ||
        matchesFuzzy(a.excerpt, trimmed) ||
        a.tags.some((t) => matchesFuzzy(t, trimmed))
    ).slice(0, 3);
  }

  // Handle Search Submission
  const handleExecuteSearch = (searchTerm: string) => {
    if (!searchTerm.trim()) return;
    const cleanTerm = searchTerm.trim();

    // Track analytics
    const totalResults = matchedProducts.length + matchedCategories.length + matchedArticles.length;
    analytics.search(cleanTerm, totalResults);

    // Save recent
    const updated = [cleanTerm, ...recentSearches.filter((s) => s.toLowerCase() !== cleanTerm.toLowerCase())].slice(
      0,
      6
    );
    setRecentSearches(updated);
    try {
      localStorage.setItem('verve_recent_searches', JSON.stringify(updated));
    } catch {
      // ignore
    }

    setIsSearchOpen(false);
    navigate(`/shop?q=${encodeURIComponent(cleanTerm)}`);
  };

  if (!isSearchOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden"
      role="dialog"
      aria-modal="true"
      aria-labelledby="search-modal-heading"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-stone-950/70 backdrop-blur-xs transition-opacity duration-200"
        onClick={() => setIsSearchOpen(false)}
      />

      <div className="fixed inset-x-0 top-0 max-h-[85vh] bg-white shadow-2xl border-b border-stone-200 z-50 flex flex-col animate-in slide-in-from-top-4 duration-200">
        {/* Search Input Bar */}
        <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 pt-5 pb-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleExecuteSearch(query);
            }}
            className="relative flex items-center"
          >
            <Search className="w-5 h-5 text-stone-400 absolute left-4" />
            <input
              ref={inputRef}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products, materials, guides (e.g. Daypack, Merino, French Linen)..."
              className="w-full pl-12 pr-12 py-3.5 bg-stone-100/80 hover:bg-stone-100 focus:bg-white border border-stone-300 rounded-xl text-base text-stone-900 placeholder-stone-400 focus:outline-hidden focus:ring-2 focus:ring-stone-900 focus:border-transparent transition-all"
            />
            {query ? (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="absolute right-4 p-1 text-stone-400 hover:text-stone-700"
                aria-label="Clear query"
              >
                <X className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setIsSearchOpen(false)}
                className="absolute right-4 p-1 text-stone-400 hover:text-stone-700 text-xs uppercase font-bold"
                aria-label="Close search"
              >
                ESC
              </button>
            )}
          </form>
        </div>

        {/* Results / Suggestions Container */}
        <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 pb-8 overflow-y-auto flex-1">
          {trimmed.length <= 1 ? (
            /* Idle Suggestions: Popular Searches & Recents */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
              {/* Popular Searches */}
              <div>
                <span className="text-xs uppercase tracking-wider font-bold text-stone-400 flex items-center gap-1.5 mb-3">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  Trending & Popular Searches
                </span>
                <div className="flex flex-wrap gap-2">
                  {POPULAR_SEARCHES.map((term) => (
                    <button
                      key={term}
                      onClick={() => {
                        setQuery(term);
                        handleExecuteSearch(term);
                      }}
                      className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-medium rounded-lg transition-colors text-left"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>

              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs uppercase tracking-wider font-bold text-stone-400 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-stone-400" />
                      Recent Searches
                    </span>
                    <button
                      onClick={() => {
                        setRecentSearches([]);
                        localStorage.removeItem('verve_recent_searches');
                      }}
                      className="text-[11px] text-stone-400 hover:text-stone-700 underline"
                    >
                      Clear
                    </button>
                  </div>
                  <div className="space-y-1">
                    {recentSearches.map((term, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          setQuery(term);
                          handleExecuteSearch(term);
                        }}
                        className="w-full text-left py-1.5 px-2.5 rounded text-xs text-stone-700 hover:bg-stone-100 flex items-center justify-between"
                      >
                        <span>{term}</span>
                        <ArrowRight className="w-3 h-3 text-stone-400" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Active Search Autocomplete Results */
            <div className="py-2 space-y-6">
              {/* Matched Categories */}
              {matchedCategories.length > 0 && (
                <div>
                  <span className="text-xs uppercase tracking-wider font-bold text-stone-400 block mb-2">
                    Categories
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {matchedCategories.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => {
                          setIsSearchOpen(false);
                          navigate(`/shop/${c.slug}`);
                        }}
                        className="px-3 py-1.5 bg-stone-900 text-white rounded-lg text-xs font-semibold hover:bg-stone-800 transition-colors flex items-center gap-1.5"
                      >
                        <span>{c.name}</span>
                        <span className="text-stone-400 text-[10px] font-normal">
                          ({c.itemCount} goods)
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Matched Products */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs uppercase tracking-wider font-bold text-stone-400">
                    Products ({matchedProducts.length})
                  </span>
                  {matchedProducts.length > 0 && (
                    <button
                      onClick={() => handleExecuteSearch(query)}
                      className="text-xs font-semibold text-stone-900 hover:underline flex items-center gap-1"
                    >
                      <span>View all matching products</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {matchedProducts.length === 0 ? (
                  <div className="py-6 text-center text-xs text-stone-500 bg-stone-50 rounded-lg">
                    No products directly matching &quot;{query}&quot;. Try searching for &quot;bag&quot;, &quot;tshirt&quot;, or &quot;wallet&quot;.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {matchedProducts.map((p) => (
                      <div
                        key={p.id}
                        onClick={() => {
                          setIsSearchOpen(false);
                          navigate(`/products/${p.slug}`);
                        }}
                        className="flex items-center gap-3 p-2.5 rounded-xl border border-stone-200/80 hover:border-stone-400 bg-white hover:shadow-xs transition-all cursor-pointer group"
                      >
                        <img
                          src={p.images[0]}
                          alt={p.name}
                          className="w-14 h-14 object-cover rounded-lg bg-stone-100 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <span className="text-[10px] uppercase font-semibold text-stone-400">
                            {p.category}
                          </span>
                          <h4 className="text-xs font-semibold text-stone-900 line-clamp-1 group-hover:text-stone-700">
                            {p.name}
                          </h4>
                          <span className="text-xs font-bold text-stone-900">
                            ₹{p.price.toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Matched Journal Articles */}
              {matchedArticles.length > 0 && (
                <div className="pt-2 border-t border-stone-200">
                  <span className="text-xs uppercase tracking-wider font-bold text-stone-400 flex items-center gap-1.5 mb-3">
                    <BookOpen className="w-3.5 h-3.5" />
                    Articles & Buying Guides ({matchedArticles.length})
                  </span>
                  <div className="space-y-2">
                    {matchedArticles.map((art) => (
                      <div
                        key={art.id}
                        onClick={() => {
                          setIsSearchOpen(false);
                          navigate(`/journal/${art.slug}`);
                        }}
                        className="p-3 bg-stone-50 hover:bg-stone-100 rounded-lg border border-stone-200 transition-colors cursor-pointer flex items-center justify-between"
                      >
                        <div>
                          <span className="text-[10px] uppercase font-semibold text-amber-700">
                            {art.category}
                          </span>
                          <h4 className="text-xs font-semibold text-stone-900 mt-0.5">
                            {art.title}
                          </h4>
                          <p className="text-[11px] text-stone-500 line-clamp-1 mt-0.5">
                            {art.excerpt}
                          </p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-stone-400 shrink-0 ml-2" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
