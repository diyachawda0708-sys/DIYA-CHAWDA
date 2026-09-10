import React from 'react';
import { Product } from '../../types';
import { ProductCard } from './ProductCard';

interface ProductGridProps {
  products: Product[];
  listName?: string;
  columns?: 2 | 3 | 4;
  emptyMessage?: string;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  listName = 'Product Catalog',
  columns = 4,
  emptyMessage = 'No items found matching your current filter criteria.',
}) => {
  if (products.length === 0) {
    return (
      <div className="py-16 text-center bg-stone-100/60 rounded-xl border border-dashed border-stone-300 p-8 my-6">
        <h4 className="text-base font-semibold text-stone-700">No goods located</h4>
        <p className="text-sm text-stone-500 mt-1 max-w-sm mx-auto">{emptyMessage}</p>
      </div>
    );
  }

  const columnClasses = {
    2: 'grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6',
    3: 'grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6',
    4: 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6',
  };

  return (
    <div className={columnClasses[columns]}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} listName={listName} />
      ))}
    </div>
  );
};
