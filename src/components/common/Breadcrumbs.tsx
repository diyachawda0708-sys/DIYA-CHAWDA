import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { BreadcrumbItem } from '../../types';
import { useEcommerce } from '../../context/EcommerceContext';

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
  const { navigate } = useEcommerce();

  return (
    <nav aria-label="Breadcrumb" className="py-3 text-xs sm:text-sm text-stone-500">
      <ol className="flex items-center flex-wrap gap-1.5 list-none p-0 m-0">
        <li className="flex items-center">
          <button
            onClick={() => navigate('/')}
            className="text-stone-500 hover:text-stone-900 transition-colors flex items-center gap-1"
            aria-label="Back to Home"
          >
            <Home className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Home</span>
          </button>
        </li>

        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={index} className="flex items-center gap-1.5">
              <ChevronRight className="w-3.5 h-3.5 text-stone-400 shrink-0" aria-hidden="true" />
              {isLast || !item.path ? (
                <span
                  className="font-medium text-stone-900 line-clamp-1 max-w-[200px] sm:max-w-xs"
                  aria-current="page"
                >
                  {item.label}
                </span>
              ) : (
                <button
                  onClick={() => navigate(item.path!)}
                  className="text-stone-500 hover:text-stone-900 transition-colors"
                >
                  {item.label}
                </button>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
