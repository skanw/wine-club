import React, { forwardRef } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '../../cn';

// Enhanced button variant types implementing UI principles
export type ButtonVariant = 
  | 'primary'           // High contrast, maximum hierarchy
  | 'secondary'         // Medium contrast, secondary hierarchy  
  | 'ghost'            // Low contrast, subtle interactions
  | 'outline'          // Accessible outline for secondary actions
  | 'destructive'      // High contrast red for dangerous actions
  | 'success'          // Green for positive actions
  | 'warning'          // Orange for caution actions

export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type ButtonIntent = 'default' | 'progressive' | 'critical' | 'subtle';

// Base button props with accessibility features
interface BaseButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  intent?: ButtonIntent;
  loading?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  className?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  style?: React.CSSProperties;
  
  // Accessibility props
  'aria-label'?: string;
  'aria-describedby'?: string;
  'aria-expanded'?: boolean;
  'aria-pressed'?: boolean;
  role?: string;
  
  // Progressive disclosure props
  stepNumber?: number;
  totalSteps?: number;
  isCurrentStep?: boolean;
  
  // Loading and feedback
  loadingText?: string;
  successText?: string;
  errorText?: string;
}

// Button element props
interface ButtonElementProps extends BaseButtonProps, 
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof BaseButtonProps> {
  as?: 'button';
  href?: never;
  to?: never;
}

// Link element props
interface LinkElementProps extends BaseButtonProps, 
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof BaseButtonProps | 'aria-current'> {
  as?: 'a';
  href: string;
  to?: never;
  'aria-current'?: boolean | "true" | "false" | "date" | "time" | "location" | "page" | "step";
}

// Router Link props
interface RouterLinkProps extends BaseButtonProps, 
  Omit<React.ComponentProps<typeof Link>, keyof BaseButtonProps | 'to' | 'aria-current'> {
  as?: 'link';
  to: string;
  href?: never;
  'aria-current'?: boolean | "true" | "false" | "date" | "time" | "location" | "page" | "step";
}

export type EnhancedButtonProps = ButtonElementProps | LinkElementProps | RouterLinkProps;

// Variant styles implementing contrast and hierarchy principles
const variantStyles = {
  primary: 'contrast-high bg-bordeaux-900 hover:bg-bordeaux-800 text-white shadow-lg hover:shadow-xl focus-ring border-transparent',
  secondary: 'contrast-medium bg-champagne-100 hover:bg-champagne-200 text-bordeaux-900 border-champagne-300 hover:border-champagne-400 focus-ring',
  ghost: 'contrast-low bg-transparent hover:bg-bordeaux-50 text-bordeaux-700 hover:text-bordeaux-900 border-transparent focus-ring',
  outline: 'bg-transparent border-2 border-bordeaux-300 hover:border-bordeaux-400 text-bordeaux-700 hover:text-bordeaux-900 hover:bg-bordeaux-50 focus-ring',
  destructive: 'bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-xl focus:ring-red-500 border-transparent',
  success: 'bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl focus:ring-green-500 border-transparent',
  warning: 'bg-yellow-600 hover:bg-yellow-700 text-white shadow-lg hover:shadow-xl focus:ring-yellow-500 border-transparent'
};

// Size styles implementing hierarchy principle
const sizeStyles = {
  xs: 'px-2 py-1 text-xs radius-small',
  sm: 'px-3 py-2 text-sm radius-small',
  md: 'px-4 py-2.5 text-base radius-medium',
  lg: 'px-6 py-3 text-lg radius-medium',
  xl: 'px-8 py-4 text-xl radius-large'
};

// Intent styles for different interaction contexts
const intentStyles = {
  default: 'interactive-element',
  progressive: 'interactive-element relative overflow-hidden',
  critical: 'interactive-subtle animate-pulse',
  subtle: 'interactive-subtle'
};

const EnhancedButton = forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  EnhancedButtonProps
>(({
  variant = 'primary',
  size = 'md',
  intent = 'default',
  loading = false,
  disabled = false,
  children,
  className,
  leftIcon,
  rightIcon,
  style,
  stepNumber,
  totalSteps,
  isCurrentStep,
  loadingText = 'Loading...',
  as,
  ...props
}, ref) => {
  
  // Generate class names implementing all 7 UI principles
  const buttonClasses = cn(
    // Base classes (Principle 3: Consistency)
    'btn-system',
    'inline-flex items-center justify-center',
    'font-medium border transition-all duration-200',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    'relative overflow-hidden',
    
    // Accessibility classes (Principle 5: Accessibility)
    'focus:outline-none focus:ring-2 focus:ring-offset-2',
    'focus-visible-support',
    
    // Variant styles (Principle 4: Contrast & Principle 1: Hierarchy)
    variantStyles[variant],
    
    // Size styles (Principle 1: Hierarchy)
    sizeStyles[size],
    
    // Intent styles (Principle 2: Progressive Disclosure)
    intentStyles[intent],
    
    // Progressive disclosure indicators
    stepNumber && isCurrentStep && 'ring-2 ring-bordeaux-500',
    
    // Loading state
    loading && 'btn-loading cursor-wait',
    
    // Custom className (Principle 3: Consistency)
    className
  );

  // Render loading spinner (Principle 2: Progressive Disclosure)
  const renderLoadingSpinner = () => (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
    </div>
  );

  // Render step indicator (Principle 2: Progressive Disclosure)
  const renderStepIndicator = () => {
    if (!stepNumber || !totalSteps) return null;
    
    return (
      <span className="sr-only">
        Step {stepNumber} of {totalSteps}
      </span>
    );
  };

  // Render content with proper spacing (Principle 6: Proximity)
  const renderContent = () => (
    <div className="group-actions flex items-center">
      {/* Left icon with proper spacing */}
      {leftIcon && !loading && (
        <span className="group-related -ml-1 mr-2 flex-shrink-0">
          {leftIcon}
        </span>
      )}
      
      {/* Loading state */}
      {loading && renderLoadingSpinner()}
      
      {/* Content with screen reader support */}
      <span className={loading ? 'invisible' : ''}>
        {loading ? loadingText : children}
      </span>
      
      {/* Right icon with proper spacing */}
      {rightIcon && !loading && (
        <span className="group-related ml-2 -mr-1 flex-shrink-0">
          {rightIcon}
        </span>
      )}
      
      {/* Step indicator for screen readers */}
      {renderStepIndicator()}
    </div>
  );

  // Common props for all element types (excluding specific props)
  const { onError, formAction, formEncType, formMethod, formNoValidate, formTarget, type: _, ...restProps } = props as any;
  
  const commonProps = {
    className: buttonClasses,
    style,
    'aria-disabled': disabled || loading,
    'aria-busy': loading,
    'aria-current': isCurrentStep ? ('step' as const) : undefined,
    ...restProps
  };

  // Render anchor element
  if (as === 'a' || 'href' in props) {
    const { href, ...anchorProps } = props as LinkElementProps;
    return (
      <a
        ref={ref as React.Ref<HTMLAnchorElement>}
        href={href}
        {...commonProps}
        {...anchorProps}
      >
        {renderContent()}
      </a>
    );
  }

  // Render router Link element
  if (as === 'link' || 'to' in props) {
    const { to, ...linkProps } = props as RouterLinkProps;
    return (
      <Link
        ref={ref as React.Ref<HTMLAnchorElement>}
        to={to}
        {...commonProps}
        {...linkProps}
      >
        {renderContent()}
      </Link>
    );
  }

  // Default to button element
  const { type = "button", ...buttonProps } = props as ButtonElementProps;
  return (
    <button
      ref={ref as React.Ref<HTMLButtonElement>}
      type={type}
      disabled={disabled || loading}
      {...commonProps}
      {...buttonProps}
    >
      {renderContent()}
    </button>
  );
});

EnhancedButton.displayName = 'EnhancedButton';

export default EnhancedButton;
