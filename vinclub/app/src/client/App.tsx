import { useEffect, useMemo, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { routes } from 'wasp/client/router';
import { Toaster } from 'react-hot-toast';
import './Main.css';
import CardNav from './components/CardNav/CardNav';
import { demoNavigationitems, marketingNavigationItems } from './components/NavBar/constants';
import {
  transformMarketingNavigation,
  transformDemoNavigation,
  getThemeColors,
} from './components/CardNav/navigationAdapter';
import CookieConsentBanner from './components/cookie-consent/Banner';
import { initWebVitals } from './utils/webVitals';
import { OfflineIndicator } from './components/OfflineIndicator';
import { syncService } from './offline/sync-service';
const logo = '/logo.png';

/**
 * use this component to wrap all child components
 * this is useful for templates, themes, and context
 */
export default function App() {
  const location = useLocation();
  const isMarketingPage = useMemo(() => {
    return location.pathname === '/' || location.pathname.startsWith('/pricing');
  }, [location]);

  const navigationItems = isMarketingPage ? marketingNavigationItems : demoNavigationitems;

  // Get theme colors - recalculate when theme might change
  const [themeColors, setThemeColors] = useState(() => getThemeColors());
  const [themeKey, setThemeKey] = useState(0); // Force recalculation of nav items when theme changes
  
  useEffect(() => {
    // Watch for theme changes by observing class changes on document element
    const observer = new MutationObserver(() => {
      setThemeColors(getThemeColors());
      setThemeKey((prev) => prev + 1); // Trigger nav items recalculation
    });
    
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });
    
    // Also update when component mounts or location changes (in case theme changed)
    setThemeColors(getThemeColors());
    
    return () => observer.disconnect();
  }, [location]);

  // Transform navigation items to CardNav format - recalculate when theme changes
  const cardNavItems = useMemo(() => {
    return isMarketingPage
      ? transformMarketingNavigation(marketingNavigationItems)
      : transformDemoNavigation(demoNavigationitems);
  }, [isMarketingPage, themeKey]);

  const shouldDisplayAppNavBar = useMemo(() => {
    return (
      location.pathname !== routes.LoginRoute.build() && location.pathname !== routes.SignupRoute.build()
    );
  }, [location]);

  const isAdminDashboard = useMemo(() => {
    return location.pathname.startsWith('/admin');
  }, [location]);

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView();
      }
    }
  }, [location]);

  // Initialize Web Vitals tracking
  useEffect(() => {
    initWebVitals();
  }, []);

  // Initialize offline sync service
  useEffect(() => {
    // Process queue on mount if online
    if (navigator.onLine) {
      syncService.processQueue();
    }

    // Set up sync event listeners for notifications
    const unsubscribe = syncService.addListener((event) => {
      if (event.type === 'sync-complete' && event.queuedCount === 0) {
        // All queued actions synced
        console.log('All queued actions synced successfully');
      } else if (event.type === 'action-failed') {
        console.error('Action sync failed:', event.actionId, event.error);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Register service worker (PWA) - Vite PWA plugin handles this automatically in production
  useEffect(() => {
    if ('serviceWorker' in navigator && import.meta.env.PROD) {
      // @ts-ignore - virtual:pwa-register is provided by vite-plugin-pwa at build time
      import('virtual:pwa-register')
        .then(({ registerSW }) => {
          registerSW({
            immediate: true,
            onRegistered(registration: ServiceWorkerRegistration) {
              console.log('Service Worker registered:', registration);
            },
            onRegisterError(error: Error) {
              console.error('Service Worker registration error:', error);
            },
          });
        })
        .catch(() => {
          // Plugin not available, that's fine for dev
          console.log('PWA service worker registration skipped in development');
        });
    }
  }, []);

  return (
    <>
      <OfflineIndicator />
      <div className='min-h-screen bg-background text-foreground'>
        {isAdminDashboard ? (
          <Outlet />
        ) : (
          <>
            {shouldDisplayAppNavBar && (
              <CardNav
                logo={logo}
                logoAlt="VinClub"
                items={cardNavItems}
                baseColor={themeColors.baseColor}
                menuColor={themeColors.menuColor}
                buttonBgColor={themeColors.buttonBgColor}
                buttonTextColor={themeColors.buttonTextColor}
              />
            )}
            <div className={`mx-auto max-w-screen-2xl ${shouldDisplayAppNavBar ? 'pt-[60px]' : ''}`}>
              <Outlet />
            </div>
          </>
        )}
      </div>
      <CookieConsentBanner />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'var(--background)',
            color: 'var(--foreground)',
            border: '1px solid var(--border)',
          },
          success: {
            iconTheme: {
              primary: 'hsl(var(--primary))',
              secondary: 'hsl(var(--primary-foreground))',
            },
          },
          error: {
            iconTheme: {
              primary: 'hsl(var(--destructive))',
              secondary: 'hsl(var(--destructive-foreground))',
            },
          },
        }}
      />
    </>
  );
}
