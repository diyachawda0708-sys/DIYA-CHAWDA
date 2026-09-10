import React from 'react';
import { Star } from 'lucide-react';

interface RatingProps {
  value: number;
  count?: number;
  size?: 'sm' | 'md' | 'lg';
  showCount?: boolean;
}

export const Rating: React.FC<RatingProps> = ({
  value,
  count,
  size = 'sm',
  showCount = true,
}) => {
  const starSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  return (
    <div
      className="inline-flex items-center gap-1.5"
      aria-label={`Rated ${value} out of 5 stars${count ? ` based on ${count} reviews` : ''}`}
    >
      <div className="flex items-center text-amber-500">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${starSizes[size]} ${
              star <= Math.round(value)
                ? 'fill-amber-400 text-amber-400'
                : 'text-stone-300'
            }`}
          />
        ))}
      </div>
      {showCount && (
        <span className={`${textSizes[size]} font-medium text-stone-600`}>
          {value.toFixed(1)}
          {count !== undefined && (
            <span className="text-stone-400 font-normal ml-0.5">({count})</span>
          )}
        </span>
      )}
    </div>
  );
};
