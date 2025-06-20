import { Link as ReactRouterLink } from 'react-router-dom';
import { Link as WaspRouterLink, routes } from 'wasp/client/router';
import { useAuth } from 'wasp/client/auth';
import { useState, Dispatch, SetStateAction } from 'react';
import { Dialog } from '@headlessui/react';
import { BiLogIn } from 'react-icons/bi';
import { AiFillCloseCircle } from 'react-icons/ai';
import { HiBars3 } from 'react-icons/hi2';
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
  const isLandingPage = useIsLandingPage();
  const { t } = useTranslation();

  const { data: user, isLoading: isUserLoading } = useAuth();
  
  return (
    <header
      className={cn('sticky top-0 z-50 bg-opacity-95 backdrop-blur-lg backdrop-filter', {
        'absolute inset-x-0': isLandingPage,
        'shadow border-b border-gray-100/10': !isLandingPage,
      })}
      style={{
        backgroundColor: 'var(--bg-canvas)',
        borderColor: 'var(--accent-light)',
      }}
    >
      {isLandingPage && <WineAnnouncement />}
      <nav className='flex items-center justify-between p-6 lg:px-8' aria-label='Global'>
        <div className='flex items-center lg:flex-1'>
          <WaspRouterLink
            to={routes.LandingPageRoute.to}
            className='flex items-center -m-1.5 p-1.5 text-gray-900 duration-300 ease-in-out hover:text-yellow-500'
          >
            <WineLogo size="lg" showText={isLandingPage} />
          </WaspRouterLink>
        </div>
        
        <div className='flex lg:hidden'>
          <button
            type='button'
            className='-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700 dark:text-white'
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className='sr-only'>Open main menu</span>
            <HiBars3 className='h-6 w-6' aria-hidden='true' />
          </button>
        </div>
        
        <div className='hidden lg:flex lg:gap-x-12'>{renderNavigationItems(navigationItems)}</div>
        
        <div className='hidden lg:flex lg:flex-1 gap-3 justify-end items-center'>
          <LanguageSwitcher className="mr-2" variant="navbar" showLabels={false} />
          <ThemeToggle className="mr-4" />
          <WaspRouterLink to={routes.SubscriptionRoute.to} className="btn-primary">
            {t('subscription.subscribeButton')}
          </WaspRouterLink>
          {isUserLoading ? null : !user ? (
            <WaspRouterLink to={routes.LoginRoute.to} className='text-sm font-semibold leading-6 ml-3'>
              <div className='flex items-center duration-300 ease-in-out text-gray-900 hover:text-yellow-500 dark:text-white'>
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
        <Dialog.Panel className='fixed inset-y-0 right-0 z-50 w-full overflow-y-auto wine-cream-bg dark:text-white dark:bg-boxdark px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10'>
          <div className='flex items-center justify-between'>
            <WaspRouterLink to={routes.LandingPageRoute.to} className='-m-1.5 p-1.5'>
              <span className='sr-only'>Wine Club SaaS</span>
              <WineLogo size="lg" />
            </WaspRouterLink>
            <button
              type='button'
              className='-m-2.5 rounded-md p-2.5 text-gray-700 dark:text-gray-50'
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className='sr-only'>Close menu</span>
              <AiFillCloseCircle className='h-6 w-6' aria-hidden='true' />
            </button>
          </div>
          <div className='mt-6 flow-root'>
            <div className='-my-6 divide-y divide-gray-500/10'>
              <div className='space-y-2 py-6'>{renderNavigationItems(navigationItems, setMobileMenuOpen)}</div>
              <div className='py-6'>
                {isUserLoading ? null : !user ? (
                  <WaspRouterLink to={routes.LoginRoute.to}>
                    <div className='flex justify-end items-center duration-300 ease-in-out text-gray-900 hover:text-yellow-500 dark:text-white'>
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
    '-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50 dark:text-white dark:hover:bg-boxdark-2':
      !!setMobileMenuOpen,
    'text-sm font-semibold leading-6 text-gray-900 duration-300 ease-in-out hover:wine-primary-text dark:text-white':
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

function WineAnnouncement() {
  const { t } = useTranslation();
  
  return (
    <div className='flex justify-center items-center gap-3 p-3 w-full wine-gradient-bg font-semibold text-white text-center z-49'>
      <p className='hidden lg:block hover:opacity-90 hover:drop-shadow'>
        🍷 {t('hero.subscribeNow')} - {t('hero.title')}!
      </p>
      <div className='hidden lg:block self-stretch w-0.5 bg-white'></div>
      <div className='hidden lg:block cursor-pointer rounded-full bg-neutral-700 px-2.5 py-1 text-xs hover:bg-neutral-600 tracking-wider'>
        {t('hero.learnMore')} →
      </div>
      <div className='lg:hidden cursor-pointer rounded-full bg-neutral-700 px-2.5 py-1 text-xs hover:bg-neutral-600 tracking-wider'>
        🍷 {t('hero.subscribeNow')}!
      </div>
    </div>
  );
} 