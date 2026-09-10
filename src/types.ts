export interface Product {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  price: number;
  originalPrice?: number;
  currency: string;
  rating: number;
  reviewCount: number;
  badge?: 'Best Seller' | 'New' | 'Sustainable' | 'Limited' | 'Sale';
  category: 'Apparel' | 'Bags' | 'Accessories' | 'Home & Living';
  categorySlug: string;
  collection: string;
  collectionSlug: string;
  tags: string[];
  colors: {
    name: string;
    hex: string;
    imageIndex: number;
  }[];
  sizes?: string[];
  materials: string[];
  inStock: boolean;
  stockCount: number;
  sku: string;
  images: string[];
  benefits: string[];
  specs: { [key: string]: string };
  faqs: { question: string; answer: string }[];
  featured?: boolean;
  bestSeller?: boolean;
  newArrival?: boolean;
  trending?: boolean;
  createdAt: string;
}

export interface Review {
  id: string;
  productId: string;
  author: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  verifiedPurchase: boolean;
  helpfulCount: number;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
  seoTitle: string;
  seoDescription: string;
  image: string;
  itemCount: number;
  featured: boolean;
}

export interface Collection {
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  description: string;
  image: string;
  featured: boolean;
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string[];
  category: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  readTime: string;
  date: string;
  coverImage: string;
  tags: string[];
  relatedProductSlugs: string[];
  relatedCategorySlug: string;
}

export interface CartItem {
  id: string; // unique item id based on product + color + size
  product: Product;
  selectedColor: string;
  selectedSize?: string;
  quantity: number;
}

export interface FilterState {
  category?: string;
  collection?: string;
  minPrice: number;
  maxPrice: number;
  sizes: string[];
  colors: string[];
  materials: string[];
  minRating: number;
  inStockOnly: boolean;
  searchQuery: string;
  sortBy: 'featured' | 'best-selling' | 'price-asc' | 'price-desc' | 'rating-desc' | 'newest';
}

export interface BreadcrumbItem {
  label: string;
  path?: string;
}

export interface UserOrder {
  id: string;
  date: string;
  status: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled' | 'Confirmed';
  items: CartItem[];
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  shippingAddress: {
    fullName?: string;
    firstName?: string;
    lastName?: string;
    addressLine1?: string;
    address?: string;
    apartment?: string;
    city: string;
    state?: string;
    postalCode: string;
    country: string;
    phone?: string;
  };
  paymentMethod?: string;
  trackingNumber?: string;
}

export type Order = UserOrder;

export interface AnalyticsEvent {
  id: string;
  name: string;
  params: Record<string, unknown>;
  timestamp: string;
}
