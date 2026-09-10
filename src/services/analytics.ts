import { AnalyticsEvent, CartItem, Product } from '../types';

type EventListener = (event: AnalyticsEvent) => void;

class AnalyticsService {
  private events: AnalyticsEvent[] = [];
  private listeners: EventListener[] = [];

  constructor() {
    // Check if window.dataLayer exists or initialize it
    if (typeof window !== 'undefined') {
      window.dataLayer = window.dataLayer || [];
    }
  }

  // Subscribe to real-time events (for UI inspection and integrations)
  public subscribe(listener: EventListener): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  public getEvents(): AnalyticsEvent[] {
    return [...this.events];
  }

  public clearEvents(): void {
    this.events = [];
    this.notifyListeners({
      id: `evt_clear_${Date.now()}`,
      name: 'events_cleared',
      params: {},
      timestamp: new Date().toLocaleTimeString(),
    });
  }

  private track(name: string, params: Record<string, unknown>): void {
    const event: AnalyticsEvent = {
      id: `evt_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      name,
      params,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    };

    // Keep last 100 events in memory
    this.events.unshift(event);
    if (this.events.length > 100) {
      this.events.pop();
    }

    // Push to Google Tag Manager dataLayer if available
    if (typeof window !== 'undefined' && window.dataLayer) {
      window.dataLayer.push({
        event: name,
        ecommerce: params.ecommerce || params,
        ...params,
      });
    }

    // Notify internal subscribers (e.g. Live Debugger UI)
    this.notifyListeners(event);
  }

  private notifyListeners(event: AnalyticsEvent): void {
    this.listeners.forEach((listener) => {
      try {
        listener(event);
      } catch (err) {
        console.error('Analytics listener error:', err);
      }
    });
  }

  // ================= STANDARD GA4 ECOMMERCE EVENTS ================= //

  public pageView(pageTitle: string, pagePath: string): void {
    this.track('page_view', {
      page_title: pageTitle,
      page_location: typeof window !== 'undefined' ? window.location.href : pagePath,
      page_path: pagePath,
    });
  }

  public viewItem(product: Product): void {
    this.track('view_item', {
      currency: product.currency,
      value: product.price,
      items: [
        {
          item_id: product.id,
          item_name: product.name,
          item_category: product.category,
          price: product.price,
          quantity: 1,
        },
      ],
    });
  }

  public selectItem(product: Product, listName = 'Product Grid'): void {
    this.track('select_item', {
      item_list_name: listName,
      items: [
        {
          item_id: product.id,
          item_name: product.name,
          item_category: product.category,
          price: product.price,
        },
      ],
    });
  }

  public viewItemList(items: Product[], listName: string): void {
    this.track('view_item_list', {
      item_list_name: listName,
      items: items.slice(0, 10).map((product, idx) => ({
        item_id: product.id,
        item_name: product.name,
        item_category: product.category,
        price: product.price,
        index: idx + 1,
      })),
    });
  }

  public search(searchTerm: string, resultCount: number): void {
    this.track('search', {
      search_term: searchTerm,
      result_count: resultCount,
    });
  }

  public addToCart(item: CartItem): void {
    this.track('add_to_cart', {
      currency: item.product.currency,
      value: item.product.price * item.quantity,
      items: [
        {
          item_id: item.product.id,
          item_name: item.product.name,
          item_category: item.product.category,
          item_variant: `${item.selectedColor}${item.selectedSize ? ' / ' + item.selectedSize : ''}`,
          price: item.product.price,
          quantity: item.quantity,
        },
      ],
    });
  }

  public removeFromCart(item: CartItem): void {
    this.track('remove_from_cart', {
      currency: item.product.currency,
      value: item.product.price * item.quantity,
      items: [
        {
          item_id: item.product.id,
          item_name: item.product.name,
          item_category: item.product.category,
          price: item.product.price,
          quantity: item.quantity,
        },
      ],
    });
  }

  public viewCart(items: CartItem[], total: number): void {
    this.track('view_cart', {
      currency: 'INR',
      value: total,
      items: items.map((item) => ({
        item_id: item.product.id,
        item_name: item.product.name,
        item_category: item.product.category,
        price: item.product.price,
        quantity: item.quantity,
      })),
    });
  }

  public beginCheckout(items: CartItem[], total: number): void {
    this.track('begin_checkout', {
      currency: 'INR',
      value: total,
      items: items.map((item) => ({
        item_id: item.product.id,
        item_name: item.product.name,
        item_category: item.product.category,
        price: item.product.price,
        quantity: item.quantity,
      })),
    });
  }

  public addShippingInfo(shippingTier: string, total: number): void {
    this.track('add_shipping_info', {
      currency: 'INR',
      value: total,
      shipping_tier: shippingTier,
    });
  }

  public addPaymentInfo(paymentType: string, total: number): void {
    this.track('add_payment_info', {
      currency: 'INR',
      value: total,
      payment_type: paymentType,
    });
  }

  public purchase(orderId: string, items: CartItem[], subtotal: number, tax: number, shipping: number, total: number): void {
    this.track('purchase', {
      transaction_id: orderId,
      currency: 'INR',
      value: total,
      tax: tax,
      shipping: shipping,
      items: items.map((item) => ({
        item_id: item.product.id,
        item_name: item.product.name,
        item_category: item.product.category,
        price: item.product.price,
        quantity: item.quantity,
      })),
    });
  }

  public refund(orderId: string, value: number): void {
    this.track('refund', {
      transaction_id: orderId,
      currency: 'INR',
      value: value,
    });
  }

  public login(method: string): void {
    this.track('login', { method });
  }

  public signUp(method: string): void {
    this.track('sign_up', { method });
  }

  public share(contentType: string, itemId: string): void {
    this.track('share', { content_type: contentType, item_id: itemId });
  }

  public selectPromotion(promoId: string, promoName: string): void {
    this.track('select_promotion', {
      promotion_id: promoId,
      promotion_name: promoName,
    });
  }

  public viewPromotion(promoId: string, promoName: string): void {
    this.track('view_promotion', {
      promotion_id: promoId,
      promotion_name: promoName,
    });
  }

  // ================= CUSTOM ENGAGEMENT & CONVERSION EVENTS ================= //

  public filterUsed(filterType: string, value: unknown): void {
    this.track('filter_used', { filter_type: filterType, filter_value: value });
  }

  public sortUsed(sortBy: string): void {
    this.track('sort_used', { sort_by: sortBy });
  }

  public wishlistAdd(product: Product): void {
    this.track('wishlist_add', {
      item_id: product.id,
      item_name: product.name,
      price: product.price,
      category: product.category,
    });
  }

  public newsletterSignup(location: string): void {
    this.track('newsletter_signup', { location });
  }

  public couponApply(code: string, success: boolean, discountAmount?: number): void {
    this.track('coupon_apply', {
      coupon_code: code,
      success,
      discount_amount: discountAmount || 0,
    });
  }

  public productQuickView(product: Product): void {
    this.track('product_quick_view', {
      item_id: product.id,
      item_name: product.name,
      price: product.price,
    });
  }

  public recommendationClick(product: Product, algorithmType: string): void {
    this.track('recommendation_click', {
      item_id: product.id,
      item_name: product.name,
      recommendation_type: algorithmType,
    });
  }
}

export const analytics = new AnalyticsService();

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}
