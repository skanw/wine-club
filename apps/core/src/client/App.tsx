import './Main.css';
import './i18n/config'; // Initialize i18n

import ModernNavbar from './components/modern/ModernNavbar';
import CookieConsentBanner from './components/cookie-consent/Banner';
import AccessibilityAudit from './components/AccessibilityAudit';
import PerformanceMonitor from './components/PerformanceMonitor';
import { useMemo, useEffect } from 'react';
import { routes } from 'wasp/client/router';
import { Outlet, useLocation } from 'react-router-dom';
import { useAuth } from 'wasp/client/auth';
import { useIsLandingPage } from './hooks/useIsLandingPage';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n/config';

/**
 * use this component to wrap all child components
 * this is useful for templates, themes, and context
 */
export default function App() {
  const location = useLocation();
  const { data: _user } = useAuth();
  const _isLandingPage = useIsLandingPage();

  const shouldDisplayAppNavBar = useMemo(() => {
    const shouldShow = location.pathname !== routes.LoginRoute.to && location.pathname !== routes.SignupRoute.to;
    console.log('App.tsx - shouldDisplayAppNavBar:', shouldShow, 'pathname:', location.pathname);
    return shouldShow;
  }, [location]);

  const isAdminDashboard = useMemo(() => {
    return location.pathname.startsWith('/admin');
  }, [location]);

  // Initialize theme and i18n before any render (CRITICAL: runs before component mounts)
  useEffect(() => {
    // i18n is already initialized in the config file
  }, []);

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView();
      }
    }
  }, [location]);

  return (
    <I18nextProvider i18n={i18n}>
      <div className='app-wrapper min-h-screen-dynamic'>
        {isAdminDashboard ? (
          <Outlet />
        ) : (
          <>
            {shouldDisplayAppNavBar && <ModernNavbar />}
            <main className='responsive-container-fluid flex-1'>
              <Outlet />
            </main>
          </>
        )}
      </div>
      <CookieConsentBanner />
      
      {/* Development Tools - Only show in development */}
      {process.env.NODE_ENV === 'development' && (
        <>
          <AccessibilityAudit />
          <PerformanceMonitor />
        </>
      )}
    </I18nextProvider>
  );
}
