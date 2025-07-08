import './Main.css';
import './i18n/config'; // Initialize i18n
import AppNavbar from './components/AppNavbar';
import CookieConsentBanner from './components/cookie-consent/Banner';
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
  const { data: user } = useAuth();
  const isLandingPage = useIsLandingPage();

  const shouldDisplayAppNavBar = useMemo(() => {
    return location.pathname !== routes.LoginRoute.build() && location.pathname !== routes.SignupRoute.build();
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
            {shouldDisplayAppNavBar && <AppNavbar />}
            <main className='responsive-container-fluid flex-1'>
              <Outlet />
            </main>
          </>
        )}
      </div>
      <CookieConsentBanner />
    </I18nextProvider>
  );
}
