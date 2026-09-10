import React, { useState, useEffect } from 'react';
import { useEcommerce } from '../../context/EcommerceContext';
import {
  Search,
  ShoppingBag,
  Heart,
  User,
  Menu,
  X,
  Activity,
  ChevronDown,
} from 'lucide-react';
import { CATEGORIES, COLLECTIONS } from '../../data/products';

export const Header: React.FC = () => {
  const {
    currentPath,
    navigate,
    cartCount,
    wishlist,
    setIsCartOpen,
    setIsSearchOpen,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    setIsAnalyticsOpen,
  } = useEcommerce();

  const [isScrolled, setIsScrolled] = useState(false);
  const [shopDropdownOpen, setShopDropdownOpen] = useState(false);
  const [collectionsDropdownOpen, setCollectionsDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path: string) => {
    if (path === '/' && currentPath === '/') return true;
    if (path !== '/' && currentPath.startsWith(path)) return true;
    return false;
  };

  return (
    <header
      id="main-header"
      className={`sticky top-0 z-40 w-full transition-all duration-200 ${
        isScrolled
          ? 'bg-stone-50/95 backdrop-blur-md shadow-xs border-b border-stone-200'
          : 'bg-stone-50 border-b border-stone-200/80'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Mobile Menu Button */}
          <div className="flex items-center lg:hidden">
            <button
              id="mobile-menu-toggle"
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 -ml-2 text-stone-700 hover:text-stone-900 rounded-md focus:outline-hidden focus:ring-2 focus:ring-stone-400"
              aria-label={isMobileMenuOpen ? 'Close Menu' : 'Open Navigation Menu'}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Brand Logo */}
          <div className="flex items-center">
            <button
              id="brand-logo-btn"
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-left focus:outline-hidden group"
              aria-label="VERVE Modern Goods Home"
            >
              <span className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-stone-900 group-hover:text-stone-700 transition-colors">
                VERVE
              </span>
              <span className="hidden sm:inline-block text-[10px] tracking-widest uppercase font-semibold text-stone-500 border border-stone-300 rounded px-1.5 py-0.5 mt-0.5">
                Studio
              </span>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav
            id="desktop-navigation"
            aria-label="Primary Navigation"
            className="hidden lg:flex items-center space-x-1 xl:space-x-2 text-sm font-medium text-stone-700"
          >
            {/* Shop Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setShopDropdownOpen(true)}
              onMouseLeave={() => setShopDropdownOpen(false)}
            >
              <button
                id="nav-shop-link"
                onClick={() => navigate('/shop')}
                className={`flex items-center gap-1 px-3 py-2 rounded-md transition-colors ${
                  isActive('/shop')
                    ? 'text-stone-950 font-semibold'
                    : 'text-stone-600 hover:text-stone-950 hover:bg-stone-100/70'
                }`}
                aria-expanded={shopDropdownOpen}
              >
                <span>Shop</span>
                <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
              </button>

              {shopDropdownOpen && (
                <div className="absolute top-full left-0 w-64 bg-white border border-stone-200 rounded-lg shadow-lg py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                  <div className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-stone-400 border-b border-stone-100">
                    Categories
                  </div>
                  <button
                    onClick={() => {
                      navigate('/shop');
                      setShopDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-sm text-stone-700 hover:bg-stone-50 font-medium"
                  >
                    All Goods (Catalog)
                  </button>
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        navigate(`/shop/${cat.slug}`);
                        setShopDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-sm text-stone-600 hover:bg-stone-50 hover:text-stone-950 flex items-center justify-between"
                    >
                      <span>{cat.name}</span>
                      <span className="text-xs text-stone-400 font-normal">{cat.itemCount} items</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Collections Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setCollectionsDropdownOpen(true)}
              onMouseLeave={() => setCollectionsDropdownOpen(false)}
            >
              <button
                id="nav-collections-link"
                onClick={() => navigate('/collections/best-sellers')}
                className={`flex items-center gap-1 px-3 py-2 rounded-md transition-colors ${
                  isActive('/collections')
                    ? 'text-stone-950 font-semibold'
                    : 'text-stone-600 hover:text-stone-950 hover:bg-stone-100/70'
                }`}
                aria-expanded={collectionsDropdownOpen}
              >
                <span>Collections</span>
                <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
              </button>

              {collectionsDropdownOpen && (
                <div className="absolute top-full left-0 w-64 bg-white border border-stone-200 rounded-lg shadow-lg py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                  <div className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-stone-400 border-b border-stone-100">
                    Curated Edits
                  </div>
                  {COLLECTIONS.map((col) => (
                    <button
                      key={col.id}
                      onClick={() => {
                        navigate(`/collections/${col.slug}`);
                        setCollectionsDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-sm text-stone-700 hover:bg-stone-50 hover:text-stone-950 flex flex-col"
                    >
                      <span className="font-medium">{col.name}</span>
                      <span className="text-[11px] text-stone-500 line-clamp-1">{col.subtitle}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Direct Links */}
            <button
              id="nav-new-link"
              onClick={() => navigate('/collections/new-arrivals')}
              className={`px-3 py-2 rounded-md transition-colors ${
                currentPath === '/collections/new-arrivals'
                  ? 'text-stone-950 font-semibold'
                  : 'text-stone-600 hover:text-stone-950 hover:bg-stone-100/70'
              }`}
            >
              New
            </button>

            <button
              id="nav-bestsellers-link"
              onClick={() => navigate('/collections/best-sellers')}
              className={`px-3 py-2 rounded-md transition-colors ${
                currentPath === '/collections/best-sellers'
                  ? 'text-stone-950 font-semibold'
                  : 'text-stone-600 hover:text-stone-950 hover:bg-stone-100/70'
              }`}
            >
              Best Sellers
            </button>

            <button
              id="nav-journal-link"
              onClick={() => navigate('/journal')}
              className={`px-3 py-2 rounded-md transition-colors ${
                isActive('/journal')
                  ? 'text-stone-950 font-semibold'
                  : 'text-stone-600 hover:text-stone-950 hover:bg-stone-100/70'
              }`}
            >
              Journal
            </button>
          </nav>

          {/* Action Icons (Search, Analytics, Wishlist, Account, Cart) */}
          <div className="flex items-center space-x-1 sm:space-x-3">
            {/* Search Trigger */}
            <button
              id="header-search-btn"
              onClick={() => setIsSearchOpen(true)}
              className="p-2 text-stone-700 hover:text-stone-950 hover:bg-stone-100/80 rounded-full transition-colors relative"
              aria-label="Search products and articles"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Analytics Event Inspector Trigger */}
            <button
              id="header-analytics-inspector-btn"
              onClick={() => setIsAnalyticsOpen(true)}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-amber-900 bg-amber-100/80 hover:bg-amber-200/80 border border-amber-300 rounded-full transition-colors"
              title="Inspect real-time GA4 Ecommerce DataLayer Events"
            >
              <Activity className="w-3.5 h-3.5 text-amber-700 animate-pulse" />
              <span className="hidden md:inline">Analytics</span>
            </button>

            {/* Wishlist */}
            <button
              id="header-wishlist-btn"
              onClick={() => navigate('/wishlist')}
              className="p-2 text-stone-700 hover:text-stone-950 hover:bg-stone-100/80 rounded-full transition-colors relative"
              aria-label={`Wishlist with ${wishlist.length} items`}
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 text-[10px] font-bold bg-stone-800 text-white rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Customer Account */}
            <button
              id="header-account-btn"
              onClick={() => navigate('/account')}
              className="hidden sm:flex p-2 text-stone-700 hover:text-stone-950 hover:bg-stone-100/80 rounded-full transition-colors"
              aria-label="Customer Account and Orders"
            >
              <User className="w-5 h-5" />
            </button>

            {/* Cart Button */}
            <button
              id="header-cart-btn"
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-2 pl-2.5 pr-3 py-1.5 text-stone-900 bg-stone-200/70 hover:bg-stone-300/80 rounded-full transition-all relative font-medium text-xs sm:text-sm"
              aria-label={`Shopping cart with ${cartCount} items`}
            >
              <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 text-stone-900" />
              <span className="font-semibold text-stone-900">{cartCount}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div
          id="mobile-navigation-drawer"
          className="lg:hidden border-t border-stone-200 bg-stone-50 px-4 pt-3 pb-6 space-y-4 animate-in slide-in-from-top duration-200"
        >
          <div className="space-y-1">
            <button
              onClick={() => navigate('/shop')}
              className="w-full text-left px-3 py-2.5 rounded-md text-base font-semibold text-stone-900 hover:bg-stone-200/50"
            >
              All Goods
            </button>
            <div className="pl-4 space-y-1 border-l-2 border-stone-200 ml-3">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => navigate(`/shop/${cat.slug}`)}
                  className="w-full text-left px-2 py-1.5 text-sm text-stone-600 hover:text-stone-950"
                >
                  {cat.name}
                </button>
              ))}
            </div>

            <div className="pt-2">
              <span className="px-3 text-xs font-bold uppercase tracking-wider text-stone-400">
                Collections
              </span>
              <div className="mt-1 space-y-1">
                {COLLECTIONS.map((col) => (
                  <button
                    key={col.id}
                    onClick={() => navigate(`/collections/${col.slug}`)}
                    className="w-full text-left px-3 py-2 rounded-md text-sm font-medium text-stone-700 hover:bg-stone-200/50"
                  >
                    {col.name}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => navigate('/journal')}
              className="w-full text-left px-3 py-2.5 rounded-md text-base font-semibold text-stone-900 hover:bg-stone-200/50"
            >
              Journal & Guides
            </button>
            <button
              onClick={() => navigate('/account')}
              className="w-full text-left px-3 py-2.5 rounded-md text-base font-semibold text-stone-900 hover:bg-stone-200/50 flex items-center justify-between"
            >
              <span>Account & Orders</span>
              <User className="w-4 h-4 text-stone-500" />
            </button>
          </div>

          <div className="pt-4 border-t border-stone-200 flex items-center justify-between text-xs text-stone-500">
            <span>Free shipping over ₹1,499</span>
            <button
              onClick={() => {
                setIsAnalyticsOpen(true);
                setIsMobileMenuOpen(false);
              }}
              className="text-amber-800 underline font-medium flex items-center gap-1"
            >
              <Activity className="w-3.5 h-3.5 text-amber-700" />
              Live Analytics Inspector
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
