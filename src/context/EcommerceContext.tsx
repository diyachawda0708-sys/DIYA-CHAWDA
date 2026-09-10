import React, { createContext, useContext, useEffect, useState, useMemo, ReactNode } from 'react';
import { CartItem, Product, UserOrder } from '../types';
import { PRODUCTS } from '../data/products';
import { analytics } from '../services/analytics';

export const FREE_SHIPPING_THRESHOLD = 1499; // INR ₹1,499 free shipping benchmark

interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'error';
  message: string;
}

interface EcommerceContextType {
  // Routing
  currentPath: string;
  navigate: (path: string) => void;

  // Cart
  cart: CartItem[];
  cartCount: number;
  subtotal: number;
  freeShippingProgress: number; // 0 to 100
  amountToFreeShipping: number;
  isFreeShipping: boolean;
  addToCart: (product: Product, selectedColor: string, selectedSize?: string, quantity?: number) => void;
  updateQuantity: (itemId: string, newQuantity: number) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  moveToWishlist: (itemId: string) => void;

  // Coupons
  appliedCoupon: string | null;
  discountAmount: number;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;

  // Wishlist
  wishlist: string[]; // product IDs
  wishlistProducts: Product[];
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;

  // Recently Viewed
  recentlyViewed: Product[];
  trackViewedProduct: (product: Product) => void;

  // Recommendations
  getRelatedProducts: (product: Product, limit?: number) => Product[];
  getPersonalizedRecommendations: (limit?: number) => Product[];

  // Modals & Drawers
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
  isAnalyticsOpen: boolean;
  setIsAnalyticsOpen: (open: boolean) => void;
  quickViewProduct: Product | null;
  setQuickViewProduct: (product: Product | null) => void;

  // Toast
  toasts: ToastMessage[];
  addToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  removeToast: (id: string) => void;

  // Account & Orders
  userOrders: UserOrder[];
  addOrder: (order: UserOrder) => void;
  currentOrder: UserOrder | null;
  setCurrentOrder: (order: UserOrder | null) => void;
  userEmail: string;
  setUserEmail: (email: string) => void;
}

const EcommerceContext = createContext<EcommerceContextType | undefined>(undefined);

export const EcommerceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Navigation
  const [currentPath, setCurrentPath] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return window.location.pathname || '/';
    }
    return '/';
  });

  // Browser history sync
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', path);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    setCurrentPath(path);
    // Track page view event
    analytics.pageView(path, path);
    // Close drawers on navigate
    setIsMobileMenuOpen(false);
    setIsSearchOpen(false);
  };

  // Cart State with localStorage
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('verve_cart');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    // Default initial demonstration item for immediate cart preview
    return [
      {
        id: 'prod_01_Obsidian Black_One Size (20L)',
        product: PRODUCTS[0],
        selectedColor: 'Obsidian Black',
        selectedSize: 'One Size (20L)',
        quantity: 1,
      },
    ];
  });

  useEffect(() => {
    try {
      localStorage.setItem('verve_cart', JSON.stringify(cart));
    } catch {
      // ignore
    }
  }, [cart]);

  // Wishlist State with localStorage
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('verve_wishlist');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return ['prod_02', 'prod_06'];
  });

  useEffect(() => {
    try {
      localStorage.setItem('verve_wishlist', JSON.stringify(wishlist));
    } catch {
      // ignore
    }
  }, [wishlist]);

  // Recently Viewed with localStorage
  const [recentlyViewedSlugs, setRecentlyViewedSlugs] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('verve_recently_viewed');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return ['kyoto-modular-canvas-daypack', 'heavyweight-organic-cotton-tee', 'florence-full-grain-leather-weekender'];
  });

  useEffect(() => {
    try {
      localStorage.setItem('verve_recently_viewed', JSON.stringify(recentlyViewedSlugs));
    } catch {
      // ignore
    }
  }, [recentlyViewedSlugs]);

  const recentlyViewed = useMemo(() => {
    return recentlyViewedSlugs
      .map((slug) => PRODUCTS.find((p) => p.slug === slug))
      .filter((p): p is Product => Boolean(p));
  }, [recentlyViewedSlugs]);

  const trackViewedProduct = (product: Product) => {
    setRecentlyViewedSlugs((prev) => {
      const filtered = prev.filter((slug) => slug !== product.slug);
      return [product.slug, ...filtered].slice(0, 8);
    });
  };

  // Coupons
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>('WELCOME10'); // Pre-seed friendly first-time 10% discount

  // Orders
  const [userOrders, setUserOrders] = useState<UserOrder[]>([
    {
      id: 'VRV-ORD-89241',
      date: 'February 18, 2026',
      status: 'Delivered',
      items: [
        {
          id: 'item_hist_1',
          product: PRODUCTS[1],
          selectedColor: 'Bone Off-White',
          selectedSize: 'L',
          quantity: 2,
        },
        {
          id: 'item_hist_2',
          product: PRODUCTS[5],
          selectedColor: 'Bourbon Amber',
          selectedSize: 'Slim Bifold',
          quantity: 1,
        },
      ],
      subtotal: 5970,
      shipping: 0,
      discount: 597,
      total: 5373,
      shippingAddress: {
        fullName: 'Alex Vance',
        addressLine1: '402 Indiranagar 100ft Road',
        city: 'Bengaluru',
        postalCode: '560038',
        country: 'India',
      },
      trackingNumber: 'DEL-XPRESS-9021841',
    },
  ]);

  const [userEmail, setUserEmail] = useState<string>('guest.shopper@vervegoods.com');

  // Drawers & Modals
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState<boolean>(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Cart Calculations
  const cartCount = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.quantity, 0);
  }, [cart]);

  const subtotal = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  }, [cart]);

  const discountAmount = useMemo(() => {
    if (!appliedCoupon) return 0;
    if (appliedCoupon === 'WELCOME10') {
      return Math.round(subtotal * 0.1);
    }
    if (appliedCoupon === 'VERVE20') {
      return 200;
    }
    if (appliedCoupon === 'FREESHIP') {
      return 0; // Handled in shipping fee
    }
    return 0;
  }, [appliedCoupon, subtotal]);

  const amountToFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const isFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD || appliedCoupon === 'FREESHIP';
  const freeShippingProgress = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));

  // Add to Cart
  const addToCart = (product: Product, selectedColor: string, selectedSize?: string, quantity = 1) => {
    const itemId = `${product.id}_${selectedColor}_${selectedSize || 'default'}`;

    let updatedCart: CartItem[] = [];
    setCart((prev) => {
      const existing = prev.find((item) => item.id === itemId);
      if (existing) {
        updatedCart = prev.map((item) =>
          item.id === itemId ? { ...item, quantity: item.quantity + quantity } : item
        );
      } else {
        const newItem: CartItem = {
          id: itemId,
          product,
          selectedColor,
          selectedSize,
          quantity,
        };
        updatedCart = [...prev, newItem];
      }
      return updatedCart;
    });

    // Fire GA4 Add To Cart Event
    const targetItem: CartItem = {
      id: itemId,
      product,
      selectedColor,
      selectedSize,
      quantity,
    };
    analytics.addToCart(targetItem);

    addToast(`Added ${quantity}× ${product.name} to cart`, 'success');
    setIsCartOpen(true);
  };

  // Update Quantity
  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, quantity: newQuantity } : item))
    );
  };

  // Remove from cart
  const removeFromCart = (itemId: string) => {
    const itemToRemove = cart.find((i) => i.id === itemId);
    if (itemToRemove) {
      analytics.removeFromCart(itemToRemove);
      addToast(`Removed ${itemToRemove.product.name} from cart`, 'info');
    }
    setCart((prev) => prev.filter((i) => i.id !== itemId));
  };

  // Clear cart
  const clearCart = () => {
    setCart([]);
  };

  // Move to Wishlist
  const moveToWishlist = (itemId: string) => {
    const item = cart.find((i) => i.id === itemId);
    if (item) {
      if (!wishlist.includes(item.product.id)) {
        setWishlist((prev) => [...prev, item.product.id]);
        analytics.wishlistAdd(item.product);
      }
      removeFromCart(itemId);
      addToast(`Moved ${item.product.name} to Wishlist`, 'success');
    }
  };

  // Apply Coupon
  const applyCoupon = (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    if (cleanCode === 'WELCOME10') {
      setAppliedCoupon('WELCOME10');
      analytics.couponApply('WELCOME10', true, Math.round(subtotal * 0.1));
      addToast('Coupon WELCOME10 applied: 10% off your entire order!', 'success');
      return { success: true, message: '10% discount applied!' };
    }
    if (cleanCode === 'FREESHIP') {
      setAppliedCoupon('FREESHIP');
      analytics.couponApply('FREESHIP', true, 150);
      addToast('Coupon FREESHIP applied: Free express shipping unlocked!', 'success');
      return { success: true, message: 'Free shipping unlocked!' };
    }
    if (cleanCode === 'VERVE20') {
      setAppliedCoupon('VERVE20');
      analytics.couponApply('VERVE20', true, 200);
      addToast('Coupon VERVE20 applied: ₹200 instant savings!', 'success');
      return { success: true, message: '₹200 discount applied!' };
    }
    analytics.couponApply(cleanCode, false, 0);
    addToast(`Coupon "${cleanCode}" is invalid or expired`, 'error');
    return { success: false, message: 'Invalid coupon code. Try WELCOME10 or FREESHIP' };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    addToast('Coupon removed', 'info');
  };

  // Toggle Wishlist
  const toggleWishlist = (product: Product) => {
    setWishlist((prev) => {
      if (prev.includes(product.id)) {
        addToast(`Removed ${product.name} from Wishlist`, 'info');
        return prev.filter((id) => id !== product.id);
      } else {
        analytics.wishlistAdd(product);
        addToast(`Added ${product.name} to Wishlist`, 'success');
        return [...prev, product.id];
      }
    });
  };

  const isInWishlist = (productId: string) => {
    return wishlist.includes(productId);
  };

  const clearWishlist = () => {
    setWishlist([]);
    addToast('Wishlist cleared', 'info');
  };

  const wishlistProducts = useMemo(() => {
    return wishlist
      .map((id) => PRODUCTS.find((p) => p.id === id))
      .filter((p): p is Product => Boolean(p));
  }, [wishlist]);

  // Current Active Order (e.g. freshly checked out)
  const [currentOrder, setCurrentOrder] = useState<UserOrder | null>(() => {
    return userOrders[0] || null;
  });

  // Recommendations: Rule-based
  const getRelatedProducts = (product: Product, limit = 4): Product[] => {
    return PRODUCTS.filter(
      (p) => p.id !== product.id && (p.category === product.category || p.collection === product.collection)
    ).slice(0, limit);
  };

  const getPersonalizedRecommendations = (limit = 4): Product[] => {
    // If user has viewed bags or apparel, prioritize matching categories, otherwise best sellers
    if (recentlyViewed.length > 0) {
      const preferredCategory = recentlyViewed[0].category;
      const matched = PRODUCTS.filter((p) => p.category === preferredCategory && !recentlyViewedSlugs.includes(p.slug));
      if (matched.length >= limit) return matched.slice(0, limit);
    }
    return PRODUCTS.filter((p) => p.bestSeller).slice(0, limit);
  };

  // Add Order
  const addOrder = (order: UserOrder) => {
    setUserOrders((prev) => [order, ...prev]);
    setCurrentOrder(order);
  };

  return (
    <EcommerceContext.Provider
      value={{
        currentPath,
        navigate,
        cart,
        cartCount,
        subtotal,
        freeShippingProgress,
        amountToFreeShipping,
        isFreeShipping,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        moveToWishlist,
        appliedCoupon,
        discountAmount,
        applyCoupon,
        removeCoupon,
        wishlist,
        wishlistProducts,
        toggleWishlist,
        isInWishlist,
        clearWishlist,
        recentlyViewed,
        trackViewedProduct,
        getRelatedProducts,
        getPersonalizedRecommendations,
        isCartOpen,
        setIsCartOpen,
        isSearchOpen,
        setIsSearchOpen,
        isMobileMenuOpen,
        setIsMobileMenuOpen,
        isAnalyticsOpen,
        setIsAnalyticsOpen,
        quickViewProduct,
        setQuickViewProduct,
        toasts,
        addToast,
        removeToast,
        userOrders,
        addOrder,
        currentOrder,
        setCurrentOrder,
        userEmail,
        setUserEmail,
      }}
    >
      {children}
    </EcommerceContext.Provider>
  );
};

export const useEcommerce = (): EcommerceContextType => {
  const context = useContext(EcommerceContext);
  if (!context) {
    throw new Error('useEcommerce must be used within an EcommerceProvider');
  }
  return context;
};
