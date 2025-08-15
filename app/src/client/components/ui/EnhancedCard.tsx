import { forwardRef, HTMLAttributes, ReactNode } from 'react';
import { cn } from '../../cn';

// Enhanced Card implementing all 7 UI principles
interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outlined' | 'filled';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  spacing?: 'tight' | 'normal' | 'relaxed';
  interactive?: boolean;
  loading?: boolean;
  error?: boolean;
  success?: boolean;
}

interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  spacing?: 'tight' | 'normal' | 'relaxed';
  centered?: boolean;
}

interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  hierarchy?: 'primary' | 'secondary' | 'tertiary';
}

interface CardDescriptionProps extends HTMLAttributes<HTMLParagraphElement> {
  variant?: 'default' | 'muted' | 'small';
}

interface CardContentProps extends HTMLAttributes<HTMLDivElement> {
  spacing?: 'tight' | 'normal' | 'relaxed';
  grouped?: boolean;
}

interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {
  alignment?: 'left' | 'center' | 'right' | 'between' | 'around';
  spacing?: 'tight' | 'normal' | 'relaxed';
}

// Variant styles implementing contrast and hierarchy
const cardVariantStyles = {
  default: 'bg-white border border-bordeaux-200 shadow-sm',
  elevated: 'bg-white border border-bordeaux-200 shadow-lg hover:shadow-xl',
  outlined: 'bg-transparent border-2 border-bordeaux-300',
  filled: 'bg-champagne-50 border border-champagne-200'
};

// Padding styles implementing consistency
const paddingStyles = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
  xl: 'p-12'
};

// Spacing styles implementing proximity
const spacingStyles = {
  tight: 'space-y-2',
  normal: 'space-y-4',
  relaxed: 'space-y-6'
};

// Main Card Component
const EnhancedCard = forwardRef<HTMLDivElement, CardProps>(
  ({ 
    className, 
    variant = 'default',
    padding = 'md',
    spacing = 'normal',
    interactive = false,
    loading = false,
    error = false,
    success = false,
    children,
    ...props 
  }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          // Base styles (Principle 3: Consistency)
          'radius-medium transition-all duration-200',
          
          // Variant styles (Principle 4: Contrast)
          cardVariantStyles[variant],
          
          // State styles (Principle 4: Contrast & Principle 5: Accessibility)
          loading && 'loading-skeleton animate-pulse',
          error && 'border-red-300 bg-red-50',
          success && 'border-green-300 bg-green-50',
          
          // Interactive styles (Principle 2: Progressive Disclosure)
          interactive && 'interactive-element cursor-pointer hover:shadow-md focus-ring',
          
          // Padding (Principle 6: Proximity)
          paddingStyles[padding],
          
          // Spacing (Principle 6: Proximity)
          spacingStyles[spacing],
          
          // Custom className
          className
        )}
        role={interactive ? 'button' : undefined}
        tabIndex={interactive ? 0 : undefined}
        aria-busy={loading}
        aria-invalid={error}
        {...props}
      >
        {loading ? (
          <div className="space-y-4">
            <div className="loading-skeleton h-6 w-3/4 rounded"></div>
            <div className="loading-skeleton h-4 w-full rounded"></div>
            <div className="loading-skeleton h-4 w-2/3 rounded"></div>
          </div>
        ) : (
          children
        )}
      </div>
    );
  }
);
EnhancedCard.displayName = 'EnhancedCard';

// Card Header Component
const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ 
    className, 
    spacing = 'normal',
    centered = false,
    children,
    ...props 
  }, ref) => (
    <div
      ref={ref}
      className={cn(
        // Base styles (Principle 7: Alignment)
        'card-header-group',
        
        // Spacing (Principle 6: Proximity)
        spacingStyles[spacing],
        
        // Alignment (Principle 7: Alignment)
        centered ? 'align-text-center' : 'align-text-left',
        
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
);
CardHeader.displayName = 'CardHeader';

// Card Title Component implementing hierarchy
const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ 
    className, 
    level = 3,
    hierarchy = 'primary',
    children,
    ...props 
  }, ref) => {
    // Hierarchy styles (Principle 1: Hierarchy)
    const hierarchyStyles = {
      primary: level <= 2 ? 'typography-h2' : 'typography-h3',
      secondary: level <= 2 ? 'typography-h3' : 'typography-h4',
      tertiary: 'typography-h4'
    };
    
    const baseClassName = cn(
      // Base styles
      'font-semibold leading-tight tracking-tight',
      
      // Hierarchy styles (Principle 1: Hierarchy)
      hierarchyStyles[hierarchy],
      
      // Color contrast (Principle 4: Contrast)
      'text-bordeaux-900',
      
      className
    );
    
    // Create the appropriate heading element
    switch (level) {
      case 1:
        return <h1 ref={ref as React.Ref<HTMLHeadingElement>} className={baseClassName} {...props}>{children}</h1>;
      case 2:
        return <h2 ref={ref as React.Ref<HTMLHeadingElement>} className={baseClassName} {...props}>{children}</h2>;
      case 3:
        return <h3 ref={ref as React.Ref<HTMLHeadingElement>} className={baseClassName} {...props}>{children}</h3>;
      case 4:
        return <h4 ref={ref as React.Ref<HTMLHeadingElement>} className={baseClassName} {...props}>{children}</h4>;
      case 5:
        return <h5 ref={ref as React.Ref<HTMLHeadingElement>} className={baseClassName} {...props}>{children}</h5>;
      case 6:
        return <h6 ref={ref as React.Ref<HTMLHeadingElement>} className={baseClassName} {...props}>{children}</h6>;
      default:
        return <h3 ref={ref as React.Ref<HTMLHeadingElement>} className={baseClassName} {...props}>{children}</h3>;
    }
  }
);
CardTitle.displayName = 'CardTitle';

// Card Description Component
const CardDescription = forwardRef<HTMLParagraphElement, CardDescriptionProps>(
  ({ 
    className, 
    variant = 'default',
    children,
    ...props 
  }, ref) => {
    // Variant styles (Principle 1: Hierarchy)
    const variantStyles = {
      default: 'typography-body text-bordeaux-600',
      muted: 'typography-body-small text-bordeaux-500',
      small: 'typography-caption text-bordeaux-400'
    };
    
    return (
      <p
        ref={ref}
        className={cn(
          // Variant styles (Principle 1: Hierarchy)
          variantStyles[variant],
          
          className
        )}
        {...props}
      >
        {children}
      </p>
    );
  }
);
CardDescription.displayName = 'CardDescription';

// Card Content Component
const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
  ({ 
    className, 
    spacing = 'normal',
    grouped = false,
    children,
    ...props 
  }, ref) => (
    <div 
      ref={ref} 
      className={cn(
        // Base spacing (Principle 6: Proximity)
        grouped ? 'card-content-group' : spacingStyles[spacing],
        
        className
      )} 
      {...props}
    >
      {children}
    </div>
  )
);
CardContent.displayName = 'CardContent';

// Card Footer Component
const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ 
    className, 
    alignment = 'between',
    spacing = 'normal',
    children,
    ...props 
  }, ref) => {
    // Alignment styles (Principle 7: Alignment)
    const alignmentStyles = {
      left: 'align-horizontal-left',
      center: 'align-horizontal-center',
      right: 'align-horizontal-right',
      between: 'align-horizontal-between',
      around: 'justify-around'
    };
    
    return (
      <div
        ref={ref}
        className={cn(
          // Base styles (Principle 7: Alignment)
          'flex items-center',
          
          // Alignment (Principle 7: Alignment)
          alignmentStyles[alignment],
          
          // Spacing (Principle 6: Proximity)
          spacingStyles[spacing],
          
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
CardFooter.displayName = 'CardFooter';

export { 
  EnhancedCard as Card, 
  CardHeader, 
  CardFooter, 
  CardTitle, 
  CardDescription, 
  CardContent 
};
