import { Link as ReactRouterLink } from 'react-router-dom';
import { Link as WaspRouterLink, routes } from 'wasp/client/router';
import { useAuth } from 'wasp/client/auth';
import { useState, Dispatch, SetStateAction } from 'react';
import { Dialog } from '@headlessui/react';
import { BiLogIn } from 'react-icons/bi';
import { AiFillCloseCircle } from 'react-icons/ai';
import { HiBars3 } from 'react-icons/hi2';
import { XMarkIcon } from '@heroicons/react/24/outline';
import DropdownUser from '../../user/DropdownUser';
import { UserMenuItems } from '../../user/UserMenuItems';
import ThemeToggle from './ThemeToggle';
import LanguageSwitcher from './LanguageSwitcher';
import WineLogo from './WineLogo';
import { useTranslation } from 'react-i18next';
import { useIsLandingPage } from '../hooks/useIsLandingPage';
import { cn } from '../cn';
import '../styles/wine-colors.css';
import '../styles/theme-variables.css';

export interface NavigationItem {
  name: string;
  to: string;
}

export default function AppNavbar({ navigationItems }: { navigationItems: NavigationItem[] }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [announcementDismissed, setAnnouncementDismissed] = useState(false);
  const isLandingPage = useIsLandingPage();
  const { t } = useTranslation();

  const { data: user, isLoading: isUserLoading } = useAuth();
  
  return (
    <header
      className={cn('sticky top-0 z-50', {
        'absolute inset-x-0': isLandingPage,
        'shadow-sm border-b border-gray-100/10': !isLandingPage,
      })}
    >
      {/* VP-06: Header consolidation - 32px slim ribbon merges into navbar, dismissible, navbar transparency 80% */}
      {!announcementDismissed && (
        <div className='flex justify-center items-center px-4 w-full h-8 bg-bordeaux-600/80 dark:bg-bordeaux-700/80 text-white text-sm font-medium backdrop-blur-sm'>
          <div className='flex items-center gap-2 max-w-7xl w-full justify-center relative'>
            <span className='hidden sm:inline'>🍷</span>
            <p className='text-center text-xs sm:text-sm'>
              <span className='hidden lg:inline'>{t('hero.subscribeNow')} - {t('hero.title')}!</span>
              <span className='lg:hidden'>{t('hero.subscribeNow')}!</span>
            </p>
            <button
              onClick={() => setAnnouncementDismissed(true)}
              className='absolute right-0 p-1 hover:bg-white/10 rounded-full transition-colors'
              aria-label="Dismiss announcement"
            >
              <XMarkIcon className='h-3 w-3' />
            </button>
          </div>
        </div>
      )}

      {/* VP-06: Main Navigation - Single layer, fixed height 72px, 80% transparency */}
      <nav 
        className={cn(
          'flex items-center justify-between p-6 lg:px-8 backdrop-blur-sm h-18', // h-18 = 72px
          isLandingPage 
            ? 'bg-bordeaux-900/80 dark:bg-bordeaux-900/80' // 80% Bordeaux transparency
            : 'bg-champagne-50/80 dark:bg-bordeaux-900/80' // 80% transparency for other pages
        )}
        aria-label='Global'
      >
        <div className='flex items-center lg:flex-1'>
          <WaspRouterLink
            to={routes.LandingPageRoute.to}
            className='flex items-center -m-1.5 p-1.5 text-bordeaux-900 dark:text-champagne-100 duration-300 ease-in-out hover:text-bordeaux-700 dark:hover:text-champagne-200'
          >
            <WineLogo size="lg" showText={isLandingPage} />
          </WaspRouterLink>
        </div>
        
        <div className='flex lg:hidden'>
          <button
            type='button'
            className='-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-bordeaux-700 dark:text-champagne-100'
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className='sr-only'>Open main menu</span>
            <HiBars3 className='h-6 w-6' aria-hidden='true' />
          </button>
        </div>
        
        <div className='hidden lg:flex lg:gap-x-8'>{renderNavigationItems(navigationItems)}</div>
        
        <div className='hidden lg:flex lg:flex-1 gap-3 justify-end items-center'>
          <LanguageSwitcher className="mr-2" variant="navbar" showLabels={false} />
          <ThemeToggle className="ml-6" />
          <WaspRouterLink to={routes.SubscriptionRoute.to} className="btn-primary">
            {t('subscription.subscribeButton')}
          </WaspRouterLink>
          {isUserLoading ? null : !user ? (
            <WaspRouterLink to={routes.LoginRoute.to} className='text-sm font-semibold leading-6 ml-3'>
              <div className='flex items-center duration-300 ease-in-out text-bordeaux-900 dark:text-champagne-100 hover:text-bordeaux-700 dark:hover:text-champagne-200'>
                {t('navigation.login')} <BiLogIn size='1.1rem' className='ml-1 mt-[0.1rem]' />
              </div>
            </WaspRouterLink>
          ) : (
            <div className='ml-3'>
              <DropdownUser user={user} />
            </div>
          )}
        </div>
      </nav>
      
      <Dialog as='div' className='lg:hidden' open={mobileMenuOpen} onClose={setMobileMenuOpen}>
        <div className='fixed inset-0 z-50' />
        <Dialog.Panel className='fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-champagne-50/95 dark:bg-bordeaux-900/95 backdrop-blur-sm px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-bordeaux-200/20 dark:sm:ring-champagne-200/20'>
          <div className='flex items-center justify-between'>
            <WaspRouterLink to={routes.LandingPageRoute.to} className='-m-1.5 p-1.5'>
              <span className='sr-only'>Wine Club SaaS</span>
              <WineLogo size="lg" />
            </WaspRouterLink>
            <button
              type='button'
              className='-m-2.5 rounded-md p-2.5 text-bordeaux-700 dark:text-champagne-100'
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className='sr-only'>Close menu</span>
              <AiFillCloseCircle className='h-6 w-6' aria-hidden='true' />
            </button>
          </div>
          <div className='mt-6 flow-root'>
            <div className='-my-6 divide-y divide-bordeaux-200/20 dark:divide-champagne-200/20'>
              <div className='space-y-2 py-6'>{renderNavigationItems(navigationItems, setMobileMenuOpen)}</div>
              <div className='py-6'>
                {isUserLoading ? null : !user ? (
                  <WaspRouterLink to={routes.LoginRoute.to}>
                    <div className='flex justify-end items-center duration-300 ease-in-out text-bordeaux-900 dark:text-champagne-100 hover:text-bordeaux-700 dark:hover:text-champagne-200'>
                      {t('navigation.login')} <BiLogIn size='1.1rem' className='ml-1' />
                    </div>
                  </WaspRouterLink>
                ) : (
                  <UserMenuItems user={user} setMobileMenuOpen={setMobileMenuOpen} />
                )}
              </div>
              <div className='py-6 space-y-4'>
                <LanguageSwitcher variant="inline" showLabels={true} />
                <ThemeToggle />
              </div>
            </div>
          </div>
        </Dialog.Panel>
      </Dialog>
    </header>
  );
}

function renderNavigationItems(
  navigationItems: NavigationItem[],
  setMobileMenuOpen?: Dispatch<SetStateAction<boolean>>
) {
  const menuStyles = cn({
    '-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-bordeaux-900 dark:text-champagne-100 hover:bg-bordeaux-100 dark:hover:bg-bordeaux-800':
      !!setMobileMenuOpen,
    'text-sm font-semibold leading-6 text-bordeaux-900 dark:text-champagne-100 duration-300 ease-in-out hover:text-bordeaux-700 dark:hover:text-champagne-200':
      !setMobileMenuOpen,
  });

  return navigationItems.map((item) => {
    return (
      <ReactRouterLink
        to={item.to}
        key={item.name}
        className={menuStyles}
        onClick={setMobileMenuOpen && (() => setMobileMenuOpen(false))}
      >
        {item.name}
      </ReactRouterLink>
    );
  });
} 