// Enhanced UI Components implementing 7 Essential UI Design Principles
// Exports for the improved Wine Club SaaS design system

// Enhanced core components
export { default as EnhancedButton } from './EnhancedButton';
export type { EnhancedButtonProps, ButtonVariant, ButtonSize, ButtonIntent } from './EnhancedButton';

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './EnhancedCard';

// Progressive disclosure components
export { 
  ProgressiveStepper, 
  ExpandableSection, 
  Accordion 
} from './ProgressiveDisclosure';

// Accessible form components
export { 
  FormField,
  AccessibleInput,
  AccessibleTextarea,
  AccessibleSelect,
  FormGroup,
  FormActions
} from './AccessibleForm';

// Legacy components (maintain compatibility)
export { default as Button } from './Button';
export type { ButtonProps } from './Button';

export { Badge } from './Badge';
export type { BadgeProps } from './Badge';

// Re-export original Card for backward compatibility
export { 
  Card as OriginalCard, 
  CardHeader as OriginalCardHeader,
  CardTitle as OriginalCardTitle,
  CardDescription as OriginalCardDescription,
  CardContent as OriginalCardContent,
  CardFooter as OriginalCardFooter
} from './Card';
