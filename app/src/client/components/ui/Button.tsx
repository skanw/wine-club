import React, { forwardRef } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '../../cn';

// Button variant types
export type ButtonVariant = 'primary' | 'secondary' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

// Base button props
interface BaseButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  className?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  style?: React.CSSProperties;
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
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof BaseButtonProps> {
  as?: 'a';
  href: string;
  to?: never;
}

// Router Link props
interface RouterLinkProps extends BaseButtonProps {
  as?: 'link';
  to: string;
  href?: never;
}

export type ButtonProps = ButtonElementProps | LinkElementProps | RouterLinkProps;

const Button = forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  ButtonProps
>(({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  children,
  className,
  leftIcon,
  rightIcon,
  style,
  as,
  ...props
}, ref) => {
  // Generate class names based on props
  const buttonClasses = cn(
    // Base classes
    'btn-base',
    // Variant classes
    `btn-${variant}`,
    // Size classes
    `btn-${size}`,
    // Loading state
    loading && 'btn-loading',
    // Custom className
    className
  );

  // Render content with icons
  const renderContent = () => (
    <>
      {leftIcon && !loading && (
        <span className="btn-icon btn-icon-scale">{leftIcon}</span>
      )}
      
      {loading ? (
        <span className="sr-only">Loading...</span>
      ) : (
        <span>{children}</span>
      )}
      
      {rightIcon && !loading && (
        <span className="btn-icon">{rightIcon}</span>
      )}
    </>
  );

  // Determine which element to render
  if (as === 'a' || 'href' in props) {
    const { href, ...anchorProps } = props as LinkElementProps;
    return (
      <a
        ref={ref as React.Ref<HTMLAnchorElement>}
        href={href}
        className={buttonClasses}
        style={style}
        aria-disabled={disabled || loading}
        {...anchorProps}
      >
        {renderContent()}
      </a>
    );
  }

  if (as === 'link' || 'to' in props) {
    const { to, ...linkProps } = props as RouterLinkProps;
    return (
      <Link
        ref={ref as React.Ref<HTMLAnchorElement>}
        to={to}
        className={buttonClasses}
        style={style}
        aria-disabled={disabled || loading}
        {...linkProps}
      >
        {renderContent()}
      </Link>
    );
  }

  // Default to button element
  const buttonProps = props as ButtonElementProps;
  return (
    <button
      ref={ref as React.Ref<HTMLButtonElement>}
      type="button"
      className={buttonClasses}
      style={style}
      disabled={disabled || loading}
      aria-disabled={disabled || loading}
      {...buttonProps}
    >
      {renderContent()}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;
