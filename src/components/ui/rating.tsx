import React from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RatingProps {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  showCount?: boolean;
  count?: number;
  interactive?: boolean;
  onChange?: (val: number) => void;
  className?: string;
}

export function Rating({
  value,
  max = 5,
  size = 'sm',
  showCount = false,
  count,
  interactive = false,
  onChange,
  className,
}: RatingProps) {
  const sizeMap = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  return (
    <div className={cn('flex items-center gap-1.5', className)}>
      <div className="flex items-center gap-0.5">
        {Array.from({ length: max }).map((_, index) => {
          const filled = index < Math.floor(value);
          const half = !filled && index < value;

          return (
            <button
              type="button"
              key={index}
              disabled={!interactive}
              onClick={() => interactive && onChange && onChange(index + 1)}
              className={cn(
                'focus:outline-none transition-colors',
                interactive ? 'cursor-pointer hover:scale-110 p-0.5' : 'cursor-default'
              )}
            >
              <Star
                className={cn(
                  sizeMap[size],
                  filled
                    ? 'fill-amber-400 text-amber-400'
                    : half
                    ? 'fill-amber-400/50 text-amber-400'
                    : 'fill-transparent text-muted-foreground/30'
                )}
              />
            </button>
          );
        })}
      </div>
      <span className="text-xs font-semibold text-foreground tracking-tight">
        {value.toFixed(1)}
      </span>
      {showCount && count !== undefined && (
        <span className="text-xs text-muted-foreground">({count})</span>
      )}
    </div>
  );
}
