/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { EcommerceProvider, useEcommerce } from './context/EcommerceContext';
import { AnnouncementBar } from './components/common/AnnouncementBar';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { ToastContainer } from './components/common/ToastContainer';
import { CartDrawer } from './components/cart/CartDrawer';
import { SearchDrawer } from './components/search/SearchDrawer';
import { ProductQuickViewModal } from './components/product/ProductQuickViewModal';
import { AnalyticsInspector } from './components/analytics/AnalyticsInspector';

import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { JournalListPage } from './pages/JournalListPage';
import { ArticleDetailPage } from './pages/ArticleDetailPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderConfirmationPage } from './pages/OrderConfirmationPage';
import { WishlistPage } from './pages/WishlistPage';
import { AccountPage } from './pages/AccountPage';

import { Activity } from 'lucide-react';

const AppContent: React.FC = () => {
  const { currentPath, setIsAnalyticsOpen } = useEcommerce();

  // Router parser
  const renderRoute = () => {
    // 1. Home
    if (currentPath === '/' || currentPath === '') {
      return <HomePage />;
    }

    // 2. Product Detail: /products/:slug
    if (currentPath.startsWith('/products/')) {
      const slug = currentPath.replace('/products/', '').split('?')[0];
      return <ProductDetailPage slug={slug} />;
    }

    // 3. Shop by Category: /shop/:categorySlug
    if (currentPath.startsWith('/shop/')) {
      const categorySlug = currentPath.replace('/shop/', '').split('?')[0];
      return <ShopPage categorySlug={categorySlug} />;
    }

    // 4. Shop All or Search Query: /shop or /shop?q=...
    if (currentPath.startsWith('/shop')) {
      let query: string | undefined = undefined;
      if (currentPath.includes('q=')) {
        const parts = currentPath.split('q=');
        if (parts[1]) {
          query = decodeURIComponent(parts[1].split('&')[0]);
        }
      }
      return <ShopPage searchQuery={query} />;
    }

    // 5. Collections: /collections/:slug
    if (currentPath.startsWith('/collections/')) {
      const collectionSlug = currentPath.replace('/collections/', '').split('?')[0];
      return <ShopPage collectionSlug={collectionSlug} />;
    }

    // 6. Journal / Content Article Detail: /journal/:slug
    if (currentPath.startsWith('/journal/')) {
      const slug = currentPath.replace('/journal/', '').split('?')[0];
      return <ArticleDetailPage slug={slug} />;
    }

    // 7. Journal List: /journal
    if (currentPath === '/journal') {
      return <JournalListPage />;
    }

    // 8. Checkout: /checkout
    if (currentPath === '/checkout') {
      return <CheckoutPage />;
    }

    // 9. Order Confirmation: /order-confirmation/:id
    if (currentPath.startsWith('/order-confirmation/')) {
      const orderId = currentPath.replace('/order-confirmation/', '');
      return <OrderConfirmationPage orderId={orderId} />;
    }

    // 10. Wishlist / Saved Goods
    if (currentPath === '/wishlist') {
      return <WishlistPage />;
    }

    // 11. Account / Customer Retention Portal
    if (currentPath === '/account') {
      return <AccountPage />;
    }

    // Fallback: Default to Shop
    return <ShopPage />;
  };

  const isCheckout = currentPath === '/checkout';

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-stone-900 font-sans antialiased selection:bg-stone-900 selection:text-white">
      {/* Top Banner (except on pure checkout) */}
      {!isCheckout && <AnnouncementBar />}

      {/* Primary Sticky Header */}
      {!isCheckout && <Header />}

      {/* Main Content Area */}
      <main className="flex-1">
        {renderRoute()}
      </main>

      {/* Footer */}
      {!isCheckout && <Footer />}

      {/* Global Drawers and Modals */}
      <CartDrawer />
      <SearchDrawer />
      <ProductQuickViewModal />
      <AnalyticsInspector />
      <ToastContainer />

      {/* Floating GA4 DataLayer Inspector Trigger */}
      <button
        type="button"
        onClick={() => setIsAnalyticsOpen(true)}
        className="fixed bottom-4 left-4 z-40 px-3 py-2 bg-stone-900/90 hover:bg-stone-900 text-white rounded-full shadow-lg border border-stone-700 flex items-center gap-2 text-xs font-mono backdrop-blur-xs transition-all hover:scale-105 cursor-pointer"
        title="Open Live GA4 DataLayer & Telemetry Stream"
      >
        <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
        <span className="hidden sm:inline">GA4 Telemetry</span>
      </button>
    </div>
  );
};

export default function App() {
  return (
    <EcommerceProvider>
      <AppContent />
    </EcommerceProvider>
  );
}
