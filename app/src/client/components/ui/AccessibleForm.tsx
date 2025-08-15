import React, { forwardRef, InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes, ReactNode } from 'react';
import { AlertCircle, Check, Info, Eye, EyeOff } from 'lucide-react';
import { cn } from '../../cn';

// Form Field Types implementing all 7 UI principles
interface FormFieldProps {
  label: string;
  description?: string;
  error?: string;
  success?: string;
  required?: boolean;
  optional?: boolean;
  children: ReactNode;
  className?: string;
  helpText?: string;
  'aria-describedby'?: string;
}

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  description?: string;
  error?: string;
  success?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'filled' | 'outlined';
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  loading?: boolean;
  showPasswordToggle?: boolean;
}

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  description?: string;
  error?: string;
  success?: string;
  resize?: 'none' | 'vertical' | 'horizontal' | 'both';
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  description?: string;
  error?: string;
  success?: string;
  options: Array<{ value: string; label: string; disabled?: boolean }>;
  placeholder?: string;
}

// Form Field Wrapper (Principle 6: Proximity & Principle 7: Alignment)
export function FormField({
  label,
  description,
  error,
  success,
  required = false,
  optional = false,
  children,
  className,
  helpText,
  'aria-describedby': ariaDescribedBy,
  ...props
}: FormFieldProps) {
  const fieldId = React.useId();
  const descriptionId = `${fieldId}-description`;
  const errorId = `${fieldId}-error`;
  const successId = `${fieldId}-success`;
  const helpId = `${fieldId}-help`;

  return (
    <div className={cn('form-field-alignment space-y-2', className)} {...props}>
      {/* Label with hierarchy (Principle 1: Hierarchy) */}
      <div className="group-related flex items-center justify-between">
        <label 
          htmlFor={fieldId}
          className="typography-body-small font-medium text-bordeaux-900"
        >
          {label}
          {required && (
            <span className="text-red-500 ml-1" aria-label="required">*</span>
          )}
          {optional && !required && (
            <span className="text-bordeaux-500 ml-1 font-normal">(optional)</span>
          )}
        </label>
      </div>

      {/* Description (Principle 6: Proximity) */}
      {description && (
        <p 
          id={descriptionId}
          className="typography-body-small text-bordeaux-600"
        >
          {description}
        </p>
      )}

      {/* Form Input */}
      <div className="relative">
        {React.cloneElement(children as React.ReactElement, {
          id: fieldId,
          'aria-describedby': cn(
            description && descriptionId,
            error && errorId,
            success && successId,
            helpText && helpId,
            ariaDescribedBy
          ).trim() || undefined,
          'aria-invalid': error ? 'true' : undefined,
          'aria-required': required ? 'true' : undefined,
        })}
      </div>

      {/* Error Message (Principle 4: Contrast & Principle 5: Accessibility) */}
      {error && (
        <div 
          id={errorId}
          className="flex items-center space-x-2 error-message"
          role="alert"
          aria-live="polite"
        >
          <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Success Message (Principle 4: Contrast) */}
      {success && !error && (
        <div 
          id={successId}
          className="flex items-center space-x-2 success-message"
          role="status"
          aria-live="polite"
        >
          <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {/* Help Text (Principle 6: Proximity) */}
      {helpText && !error && !success && (
        <div 
          id={helpId}
          className="flex items-start space-x-2 text-bordeaux-500"
        >
          <Info className="h-4 w-4 flex-shrink-0 mt-0.5" />
          <span className="typography-body-small">{helpText}</span>
        </div>
      )}
    </div>
  );
}

// Enhanced Input Component (All 7 Principles)
export const AccessibleInput = forwardRef<HTMLInputElement, InputProps>(
  ({
    label,
    description,
    error,
    success,
    size = 'md',
    variant = 'default',
    leftIcon,
    rightIcon,
    loading = false,
    showPasswordToggle = false,
    type = 'text',
    className,
    ...props
  }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const [isFocused, setIsFocused] = React.useState(false);
    
    const isPasswordField = type === 'password';
    const inputType = isPasswordField && showPassword ? 'text' : type;

    // Size styles (Principle 1: Hierarchy)
    const sizeStyles = {
      sm: 'px-3 py-2 text-sm',
      md: 'px-4 py-2.5 text-base',
      lg: 'px-5 py-3 text-lg'
    };

    // Variant styles (Principle 4: Contrast & Principle 3: Consistency)
    const variantStyles = {
      default: 'bg-white border border-bordeaux-300 focus:border-bordeaux-500 focus:ring-bordeaux-500',
      filled: 'bg-champagne-50 border border-champagne-300 focus:border-bordeaux-500 focus:ring-bordeaux-500',
      outlined: 'bg-transparent border-2 border-bordeaux-300 focus:border-bordeaux-500 focus:ring-bordeaux-500'
    };

    // Input classes implementing multiple principles
    const inputClasses = cn(
      // Base styles (Principle 3: Consistency)
      'w-full rounded-lg transition-all duration-200',
      'placeholder:text-bordeaux-400',
      'disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50',
      
      // Focus styles (Principle 5: Accessibility)
      'focus:outline-none focus:ring-2 focus:ring-offset-0',
      
      // Size styles (Principle 1: Hierarchy)
      sizeStyles[size],
      
      // Variant styles (Principle 4: Contrast)
      variantStyles[variant],
      
      // State styles (Principle 4: Contrast)
      error && 'error-field',
      success && 'success-field',
      
      // Icon padding (Principle 6: Proximity)
      leftIcon && 'pl-10',
      (rightIcon || isPasswordField || loading) && 'pr-10',
      
      className
    );

    const inputComponent = (
      <div className="relative">
        {/* Left Icon (Principle 6: Proximity) */}
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-bordeaux-400">{leftIcon}</span>
          </div>
        )}

        {/* Input Element */}
        <input
          ref={ref}
          type={inputType}
          className={inputClasses}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />

        {/* Right Content (Principle 6: Proximity) */}
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center space-x-1">
          {/* Loading Spinner */}
          {loading && (
            <div className="w-4 h-4 border-2 border-bordeaux-300 border-t-bordeaux-600 rounded-full animate-spin" />
          )}

          {/* Password Toggle (Principle 5: Accessibility) */}
          {isPasswordField && showPasswordToggle && !loading && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-bordeaux-400 hover:text-bordeaux-600 focus:outline-none focus:text-bordeaux-600"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          )}

          {/* Right Icon */}
          {rightIcon && !loading && !(isPasswordField && showPasswordToggle) && (
            <span className="text-bordeaux-400">{rightIcon}</span>
          )}
        </div>
      </div>
    );

    // Wrap with FormField if label is provided
    if (label) {
      return (
        <FormField
          label={label}
          description={description}
          error={error}
          success={success}
          required={props.required}
        >
          {inputComponent}
        </FormField>
      );
    }

    return inputComponent;
  }
);
AccessibleInput.displayName = 'AccessibleInput';

// Enhanced Textarea Component
export const AccessibleTextarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({
    label,
    description,
    error,
    success,
    resize = 'vertical',
    className,
    ...props
  }, ref) => {
    const resizeStyles = {
      none: 'resize-none',
      vertical: 'resize-y',
      horizontal: 'resize-x',
      both: 'resize'
    };

    const textareaClasses = cn(
      // Base styles (Principle 3: Consistency)
      'w-full px-4 py-2.5 text-base rounded-lg transition-all duration-200',
      'bg-white border border-bordeaux-300',
      'placeholder:text-bordeaux-400',
      'disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50',
      
      // Focus styles (Principle 5: Accessibility)
      'focus:outline-none focus:ring-2 focus:ring-bordeaux-500 focus:border-bordeaux-500',
      
      // Resize styles
      resizeStyles[resize],
      
      // State styles (Principle 4: Contrast)
      error && 'error-field',
      success && 'success-field',
      
      className
    );

    const textareaComponent = (
      <textarea
        ref={ref}
        className={textareaClasses}
        rows={4}
        {...props}
      />
    );

    // Wrap with FormField if label is provided
    if (label) {
      return (
        <FormField
          label={label}
          description={description}
          error={error}
          success={success}
          required={props.required}
        >
          {textareaComponent}
        </FormField>
      );
    }

    return textareaComponent;
  }
);
AccessibleTextarea.displayName = 'AccessibleTextarea';

// Enhanced Select Component
export const AccessibleSelect = forwardRef<HTMLSelectElement, SelectProps>(
  ({
    label,
    description,
    error,
    success,
    options,
    placeholder,
    className,
    ...props
  }, ref) => {
    const selectClasses = cn(
      // Base styles (Principle 3: Consistency)
      'w-full px-4 py-2.5 text-base rounded-lg transition-all duration-200',
      'bg-white border border-bordeaux-300',
      'disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50',
      
      // Focus styles (Principle 5: Accessibility)
      'focus:outline-none focus:ring-2 focus:ring-bordeaux-500 focus:border-bordeaux-500',
      
      // State styles (Principle 4: Contrast)
      error && 'error-field',
      success && 'success-field',
      
      className
    );

    const selectComponent = (
      <select
        ref={ref}
        className={selectClasses}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </option>
        ))}
      </select>
    );

    // Wrap with FormField if label is provided
    if (label) {
      return (
        <FormField
          label={label}
          description={description}
          error={error}
          success={success}
          required={props.required}
        >
          {selectComponent}
        </FormField>
      );
    }

    return selectComponent;
  }
);
AccessibleSelect.displayName = 'AccessibleSelect';

// Form Group Component (Principle 6: Proximity & Principle 7: Alignment)
export function FormGroup({
  children,
  title,
  description,
  className,
  ...props
}: {
  children: ReactNode;
  title?: string;
  description?: string;
  className?: string;
}) {
  return (
    <fieldset className={cn('form-alignment', className)} {...props}>
      {title && (
        <legend className="typography-h4 text-bordeaux-900 mb-2">
          {title}
        </legend>
      )}
      
      {description && (
        <p className="typography-body text-bordeaux-600 mb-6">
          {description}
        </p>
      )}
      
      <div className="space-y-4">
        {children}
      </div>
    </fieldset>
  );
}

// Form Actions Component (Principle 7: Alignment)
export function FormActions({
  children,
  alignment = 'right',
  className,
  ...props
}: {
  children: ReactNode;
  alignment?: 'left' | 'center' | 'right' | 'between';
  className?: string;
}) {
  const alignmentStyles = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
    between: 'justify-between'
  };

  return (
    <div 
      className={cn(
        'flex items-center space-x-3 pt-6 border-t border-bordeaux-200',
        alignmentStyles[alignment],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
