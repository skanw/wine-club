import { forwardRef, HTMLAttributes } from 'react';
import { cn } from '../../cn';

export interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning';
  size?: 'sm' | 'md' | 'lg';
}

const Badge = forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = 'default', size = 'md', ...props }, ref) => {
    const baseClasses = 'inline-flex items-center rounded-full font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-bordeaux-500 focus:ring-offset-2';
    
    const variantClasses = {
      default: 'bg-bordeaux-600 text-white hover:bg-bordeaux-700',
      secondary: 'bg-bordeaux-100 text-bordeaux-900 hover:bg-bordeaux-200',
      destructive: 'bg-red-600 text-white hover:bg-red-700',
      outline: 'border border-bordeaux-200 bg-transparent text-bordeaux-900 hover:bg-bordeaux-50',
      success: 'bg-green-600 text-white hover:bg-green-700',
      warning: 'bg-yellow-600 text-white hover:bg-yellow-700',
    };

    const sizeClasses = {
      sm: 'px-2 py-0.5 text-xs',
      md: 'px-2.5 py-0.5 text-sm',
      lg: 'px-3 py-1 text-sm',
    };

    return (
      <div
        ref={ref}
        className={cn(
          baseClasses,
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...props}
      />
    );
  }
);

Badge.displayName = 'Badge';

export { Badge }; 