import { KeyboardEvent } from 'react';

/**
 * ARIA role constants
 */
export const ARIA_ROLES = {
  BUTTON: 'button',
  DIALOG: 'dialog',
  ALERT: 'alert',
  ALERTDIALOG: 'alertdialog',
  NAVIGATION: 'navigation',
  MENU: 'menu',
  MENUITEM: 'menuitem',
  MENUBAR: 'menubar',
  TAB: 'tab',
  TABLIST: 'tablist',
  TABPANEL: 'tabpanel',
  LISTBOX: 'listbox',
  OPTION: 'option',
  COMBOBOX: 'combobox',
  TOOLTIP: 'tooltip',
} as const;

/**
 * Common keyboard keys
 */
export const KEYS = {
  ENTER: 'Enter',
  SPACE: ' ',
  ESCAPE: 'Escape',
  TAB: 'Tab',
  ARROW_UP: 'ArrowUp',
  ARROW_DOWN: 'ArrowDown',
  ARROW_LEFT: 'ArrowLeft',
  ARROW_RIGHT: 'ArrowRight',
  HOME: 'Home',
  END: 'End',
} as const;

/**
 * Interface for ARIA states and properties
 */
export interface AriaAttributes {
  'aria-label'?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
  'aria-expanded'?: boolean;
  'aria-haspopup'?: boolean | 'dialog' | 'menu' | 'listbox' | 'tree' | 'grid';
  'aria-hidden'?: boolean;
  'aria-disabled'?: boolean;
  'aria-selected'?: boolean;
  'aria-checked'?: boolean | 'mixed';
  'aria-current'?: boolean | 'page' | 'step' | 'location' | 'date' | 'time';
  'aria-live'?: 'off' | 'polite' | 'assertive';
  'aria-atomic'?: boolean;
  'aria-relevant'?: 'additions' | 'removals' | 'text' | 'all';
  'aria-controls'?: string;
  'aria-owns'?: string;
  role?: string;
}

/**
 * Helper function to handle keyboard navigation for menu items
 */
export const handleMenuKeyboardNavigation = (
  event: KeyboardEvent,
  items: HTMLElement[],
  currentIndex: number,
  setCurrentIndex: (index: number) => void,
  closeMenu?: () => void
) => {
  switch (event.key) {
    case KEYS.ARROW_DOWN:
      event.preventDefault();
      setCurrentIndex((currentIndex + 1) % items.length);
      items[(currentIndex + 1) % items.length]?.focus();
      break;

    case KEYS.ARROW_UP:
      event.preventDefault();
      setCurrentIndex((currentIndex - 1 + items.length) % items.length);
      items[(currentIndex - 1 + items.length) % items.length]?.focus();
      break;

    case KEYS.HOME:
      event.preventDefault();
      setCurrentIndex(0);
      items[0]?.focus();
      break;

    case KEYS.END:
      event.preventDefault();
      setCurrentIndex(items.length - 1);
      items[items.length - 1]?.focus();
      break;

    case KEYS.ESCAPE:
      event.preventDefault();
      closeMenu?.();
      break;
  }
};

/**
 * Helper function to handle keyboard navigation for tabs
 */
export const handleTabKeyboardNavigation = (
  event: KeyboardEvent,
  tabs: HTMLElement[],
  currentIndex: number,
  setCurrentIndex: (index: number) => void
) => {
  switch (event.key) {
    case KEYS.ARROW_RIGHT:
      event.preventDefault();
      setCurrentIndex((currentIndex + 1) % tabs.length);
      tabs[(currentIndex + 1) % tabs.length]?.focus();
      break;

    case KEYS.ARROW_LEFT:
      event.preventDefault();
      setCurrentIndex((currentIndex - 1 + tabs.length) % tabs.length);
      tabs[(currentIndex - 1 + tabs.length) % tabs.length]?.focus();
      break;

    case KEYS.HOME:
      event.preventDefault();
      setCurrentIndex(0);
      tabs[0]?.focus();
      break;

    case KEYS.END:
      event.preventDefault();
      setCurrentIndex(tabs.length - 1);
      tabs[tabs.length - 1]?.focus();
      break;
  }
};

/**
 * Helper function to handle keyboard navigation for dialog/modal
 */
export const handleDialogKeyboardNavigation = (
  event: KeyboardEvent,
  closeDialog: () => void,
  focusableElements: HTMLElement[],
  currentFocusIndex: number,
  setCurrentFocusIndex: (index: number) => void
) => {
  switch (event.key) {
    case KEYS.ESCAPE:
      event.preventDefault();
      closeDialog();
      break;

    case KEYS.TAB:
      event.preventDefault();
      if (event.shiftKey) {
        // Focus previous element
        setCurrentFocusIndex(
          (currentFocusIndex - 1 + focusableElements.length) % focusableElements.length
        );
        focusableElements[
          (currentFocusIndex - 1 + focusableElements.length) % focusableElements.length
        ]?.focus();
      } else {
        // Focus next element
        setCurrentFocusIndex((currentFocusIndex + 1) % focusableElements.length);
        focusableElements[(currentFocusIndex + 1) % focusableElements.length]?.focus();
      }
      break;
  }
};

/**
 * Helper function to get all focusable elements within a container
 */
export const getFocusableElements = (container: HTMLElement): HTMLElement[] => {
  const focusableSelectors = [
    'button:not([disabled])',
    'a[href]',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
  ].join(',');

  return Array.from(container.querySelectorAll(focusableSelectors));
};

/**
 * Helper function to announce messages to screen readers
 */
export const announceToScreenReader = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.classList.add('sr-only');
  announcement.textContent = message;

  document.body.appendChild(announcement);

  // Remove the announcement after a short delay
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
};

/**
 * Helper function to manage focus trap within a container
 */
export const createFocusTrap = (container: HTMLElement) => {
  const focusableElements = getFocusableElements(container);
  let currentFocusIndex = 0;

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === KEYS.TAB) {
      event.preventDefault();
      currentFocusIndex = event.shiftKey
        ? (currentFocusIndex - 1 + focusableElements.length) % focusableElements.length
        : (currentFocusIndex + 1) % focusableElements.length;
      focusableElements[currentFocusIndex]?.focus();
    }
  };

  container.addEventListener('keydown', handleKeyDown as any);

  return {
    activate: () => {
      focusableElements[0]?.focus();
    },
    deactivate: () => {
      container.removeEventListener('keydown', handleKeyDown as any);
    },
  };
}; 