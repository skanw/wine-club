import './Main.css';
import './i18n/config'; // Initialize i18n
import './styles/wine-scroll-animations.css';
import './styles/micro-interactions.css';
import AppNavbar from './components/AppNavbar';
import CookieConsentBanner from './components/cookie-consent/Banner';
import PageTransition from './components/PageTransition';
import ScrollProgress from './components/ScrollProgress';
import { appNavigationItems } from './components/NavBar/contentSections';
import { landingPageNavigationItems } from '../landing-page/contentSections';
import { useMemo, useEffect } from 'react';
import { routes } from 'wasp/client/router';
import { Outlet, useLocation } from 'react-router-dom';
import { useAuth } from 'wasp/client/auth';
import { useIsLandingPage } from './hooks/useIsLandingPage';
import { getStoredTheme, applyTheme } from './components/ThemeToggle';
import { I18nextProvider } from 'react-i18next';
import i18n, { initializeLanguage } from './i18n/config';

/**
 * use this component to wrap all child components
 * this is useful for templates, themes, and context
 */
export default function App() {
  const location = useLocation();
  const { data: user } = useAuth();
  const isLandingPage = useIsLandingPage();
  const navigationItems = isLandingPage ? landingPageNavigationItems : appNavigationItems;

  const shouldDisplayAppNavBar = useMemo(() => {
    return location.pathname !== routes.LoginRoute.build() && location.pathname !== routes.SignupRoute.build();
  }, [location]);

  const isAdminDashboard = useMemo(() => {
    return location.pathname.startsWith('/admin');
  }, [location]);

  // Initialize theme and i18n before any render (CRITICAL: runs before component mounts)
  useEffect(() => {
    const theme = getStoredTheme();
    applyTheme(theme);
    
    // Initialize i18n language
    initializeLanguage();
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
      <div className='min-h-screen dark:text-white dark:bg-boxdark-2'>
        {/* Scroll Progress Indicator */}
        <ScrollProgress />
        
        {isAdminDashboard ? (
          <Outlet />
        ) : (
          <>
            {shouldDisplayAppNavBar && <AppNavbar navigationItems={navigationItems} />}
            <PageTransition transitionType="pour">
              <div className='mx-auto max-w-7xl sm:px-6 lg:px-8'>
                <Outlet />
              </div>
            </PageTransition>
          </>
        )}
      </div>
      <CookieConsentBanner />
    </I18nextProvider>
  );
}
