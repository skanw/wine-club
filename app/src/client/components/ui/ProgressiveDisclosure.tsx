import React, { useState, useEffect, ReactNode } from 'react';
import { ChevronRight, Check, AlertCircle, Info } from 'lucide-react';
import { cn } from '../../cn';
import { Card, CardHeader, CardTitle, CardContent } from './EnhancedCard';
import EnhancedButton from './EnhancedButton';

// Progressive Disclosure Types
interface Step {
  id: string;
  title: string;
  description?: string;
  content: ReactNode;
  validation?: () => boolean | Promise<boolean>;
  optional?: boolean;
  icon?: ReactNode;
}

interface ProgressiveStepperProps {
  steps: Step[];
  currentStep?: number;
  onStepChange?: (step: number) => void;
  onComplete?: () => void;
  allowSkip?: boolean;
  showProgress?: boolean;
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

interface ExpandableSectionProps {
  title: string;
  description?: string;
  children: ReactNode;
  defaultExpanded?: boolean;
  icon?: ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error';
  className?: string;
}

interface AccordionProps {
  items: Array<{
    id: string;
    trigger: ReactNode;
    content: ReactNode;
    disabled?: boolean;
  }>;
  type?: 'single' | 'multiple';
  defaultValue?: string | string[];
  onValueChange?: (value: string | string[]) => void;
  className?: string;
}

// Progressive Stepper Component (Principle 2: Progressive Disclosure)
export function ProgressiveStepper({
  steps,
  currentStep = 0,
  onStepChange,
  onComplete,
  allowSkip = false,
  showProgress = true,
  orientation = 'horizontal',
  className
}: ProgressiveStepperProps) {
  const [activeStep, setActiveStep] = useState(currentStep);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [validationErrors, setValidationErrors] = useState<Record<number, string>>({});

  // Handle step navigation
  const handleStepChange = async (stepIndex: number) => {
    if (stepIndex < activeStep || allowSkip) {
      setActiveStep(stepIndex);
      onStepChange?.(stepIndex);
      return;
    }

    // Validate current step before proceeding
    const currentStepData = steps[activeStep];
    if (currentStepData.validation) {
      try {
        const isValid = await currentStepData.validation();
        if (!isValid) {
          setValidationErrors(prev => ({
            ...prev,
            [activeStep]: 'Please complete all required fields'
          }));
          return;
        }
      } catch (error) {
        setValidationErrors(prev => ({
          ...prev,
          [activeStep]: error instanceof Error ? error.message : 'Validation failed'
        }));
        return;
      }
    }

    // Clear validation errors and mark step as completed
    setValidationErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[activeStep];
      return newErrors;
    });
    
    setCompletedSteps(prev => new Set([...prev, activeStep]));
    setActiveStep(stepIndex);
    onStepChange?.(stepIndex);
  };

  // Handle next step
  const handleNext = () => {
    if (activeStep < steps.length - 1) {
      handleStepChange(activeStep + 1);
    } else {
      onComplete?.();
    }
  };

  // Handle previous step
  const handlePrevious = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
      onStepChange?.(activeStep - 1);
    }
  };

  // Step indicator styles (Principle 1: Hierarchy)
  const getStepIndicatorStyles = (stepIndex: number) => {
    if (completedSteps.has(stepIndex)) {
      return 'step-number completed bg-bordeaux-600 text-white';
    }
    if (stepIndex === activeStep) {
      return 'step-number active bg-bordeaux-100 text-bordeaux-900 ring-2 ring-bordeaux-500';
    }
    return 'step-number pending bg-gray-100 text-gray-400';
  };

  // Progress bar calculation
  const progressPercentage = ((activeStep + 1) / steps.length) * 100;

  return (
    <div className={cn('progressive-container', className)}>
      {/* Progress Indicator (Principle 1: Hierarchy & Principle 7: Alignment) */}
      {showProgress && (
        <div className="mb-8">
          {/* Progress bar */}
          <div className="mb-4">
            <div className="flex justify-between text-sm font-medium text-bordeaux-700 mb-2">
              <span>Progress</span>
              <span>{Math.round(progressPercentage)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-bordeaux-600 h-2 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>

          {/* Step indicators */}
          <div className={cn(
            'step-indicator',
            orientation === 'vertical' ? 'flex-col space-y-4' : 'flex-row'
          )}>
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <button
                  onClick={() => handleStepChange(index)}
                  disabled={index > activeStep && !allowSkip}
                  className={cn(
                    getStepIndicatorStyles(index),
                    'focus-ring rounded-full',
                    (index <= activeStep || allowSkip) ? 'cursor-pointer hover:scale-110' : 'cursor-not-allowed'
                  )}
                  aria-label={`Step ${index + 1}: ${step.title}`}
                  aria-current={index === activeStep ? 'step' : undefined}
                >
                  {completedSteps.has(index) ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </button>
                
                {orientation === 'horizontal' && index < steps.length - 1 && (
                  <div className={cn(
                    'step-line',
                    completedSteps.has(index) ? 'completed bg-bordeaux-600' : 'pending bg-gray-200'
                  )} />
                )}
                
                <div className="ml-3">
                  <p className="text-sm font-medium text-bordeaux-900">{step.title}</p>
                  {step.description && (
                    <p className="text-xs text-bordeaux-600">{step.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Current Step Content (Principle 2: Progressive Disclosure) */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle hierarchy="secondary">
            {steps[activeStep]?.icon && (
              <span className="inline-flex items-center mr-2">
                {steps[activeStep].icon}
              </span>
            )}
            {steps[activeStep]?.title}
          </CardTitle>
          {steps[activeStep]?.description && (
            <p className="typography-body text-bordeaux-600">
              {steps[activeStep].description}
            </p>
          )}
        </CardHeader>
        
        <CardContent>
          {/* Validation Error (Principle 4: Contrast & Principle 5: Accessibility) */}
          {validationErrors[activeStep] && (
            <div className="status-error p-3 rounded-lg mb-4 flex items-center space-x-2">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span className="text-sm">{validationErrors[activeStep]}</span>
            </div>
          )}
          
          {/* Step Content */}
          <div className="progressive-step active">
            {steps[activeStep]?.content}
          </div>
        </CardContent>
      </Card>

      {/* Navigation Controls (Principle 6: Proximity & Principle 7: Alignment) */}
      <div className="group-actions align-horizontal-between">
        <EnhancedButton
          variant="ghost"
          onClick={handlePrevious}
          disabled={activeStep === 0}
          leftIcon={<ChevronRight className="h-4 w-4 rotate-180" />}
        >
          Previous
        </EnhancedButton>

        <div className="group-actions space-x-3">
          {allowSkip && activeStep < steps.length - 1 && !steps[activeStep].optional && (
            <EnhancedButton
              variant="ghost"
              onClick={() => handleStepChange(activeStep + 1)}
            >
              Skip
            </EnhancedButton>
          )}
          
          <EnhancedButton
            variant="primary"
            onClick={handleNext}
            rightIcon={
              activeStep === steps.length - 1 ? 
                <Check className="h-4 w-4" /> : 
                <ChevronRight className="h-4 w-4" />
            }
            stepNumber={activeStep + 1}
            totalSteps={steps.length}
            isCurrentStep={true}
          >
            {activeStep === steps.length - 1 ? 'Complete' : 'Next'}
          </EnhancedButton>
        </div>
      </div>
    </div>
  );
}

// Expandable Section Component (Principle 2: Progressive Disclosure)
export function ExpandableSection({
  title,
  description,
  children,
  defaultExpanded = false,
  icon,
  variant = 'default',
  className
}: ExpandableSectionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const variantStyles = {
    default: 'border-bordeaux-200',
    success: 'border-green-300 bg-green-50',
    warning: 'border-yellow-300 bg-yellow-50',
    error: 'border-red-300 bg-red-50'
  };

  const variantIcons = {
    default: null,
    success: <Check className="h-4 w-4 text-green-600" />,
    warning: <AlertCircle className="h-4 w-4 text-yellow-600" />,
    error: <AlertCircle className="h-4 w-4 text-red-600" />
  };

  return (
    <div className={cn('expandable-section border rounded-lg', variantStyles[variant], className)}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 text-left focus-ring rounded-lg group-actions align-horizontal-between"
        aria-expanded={isExpanded}
        type="button"
      >
        <div className="group-related">
          <div className="flex items-center space-x-2">
            {icon || variantIcons[variant]}
            <h3 className="typography-h4 text-bordeaux-900">{title}</h3>
          </div>
          {description && (
            <p className="typography-body-small text-bordeaux-600 mt-1">{description}</p>
          )}
        </div>
        
        <ChevronRight 
          className={cn(
            'h-5 w-5 text-bordeaux-400 transition-transform duration-200 expandable-icon',
            isExpanded && 'rotate-90'
          )}
        />
      </button>
      
      <div className={cn(
        'expandable-content overflow-hidden transition-all duration-300 ease-in-out',
        isExpanded ? 'expanded max-h-none pb-4 px-4' : 'max-h-0'
      )}>
        {children}
      </div>
    </div>
  );
}

// Accordion Component (Principle 2: Progressive Disclosure)
export function Accordion({
  items,
  type = 'single',
  defaultValue,
  onValueChange,
  className
}: AccordionProps) {
  const [openItems, setOpenItems] = useState<string[]>(() => {
    if (defaultValue) {
      return Array.isArray(defaultValue) ? defaultValue : [defaultValue];
    }
    return [];
  });

  const handleToggle = (itemId: string) => {
    let newOpenItems: string[];
    
    if (type === 'single') {
      newOpenItems = openItems.includes(itemId) ? [] : [itemId];
    } else {
      newOpenItems = openItems.includes(itemId)
        ? openItems.filter(id => id !== itemId)
        : [...openItems, itemId];
    }
    
    setOpenItems(newOpenItems);
    onValueChange?.(type === 'single' ? newOpenItems[0] || '' : newOpenItems);
  };

  return (
    <div className={cn('space-y-2', className)}>
      {items.map((item) => {
        const isOpen = openItems.includes(item.id);
        
        return (
          <Card key={item.id} variant="outlined" padding="none">
            <button
              onClick={() => !item.disabled && handleToggle(item.id)}
              disabled={item.disabled}
              className={cn(
                'w-full p-4 text-left focus-ring group-actions align-horizontal-between',
                item.disabled && 'opacity-50 cursor-not-allowed'
              )}
              aria-expanded={isOpen}
              type="button"
            >
              <div className="flex-1">{item.trigger}</div>
              <ChevronRight 
                className={cn(
                  'h-5 w-5 text-bordeaux-400 transition-transform duration-200',
                  isOpen && 'rotate-90'
                )}
              />
            </button>
            
            {isOpen && (
              <div className="px-4 pb-4 animate-fade-in-up">
                {item.content}
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
}
