import openSaasBannerWebp from '../../client/static/open-saas-banner.webp';
import { DocsUrl } from '../../shared/common';
import { useScrollAnimation } from '../../client/hooks/useScrollAnimation';

export default function Hero() {
  const heroTitle = useScrollAnimation({ 
    animationClass: 'animate-wine-reveal',
    delay: 200 
  });
  const heroSubtitle = useScrollAnimation({ 
    animationClass: 'animate-fade-in-up',
    delay: 400 
  });
  const heroButtons = useScrollAnimation({ 
    animationClass: 'animate-fade-in-up',
    delay: 600 
  });
  const heroImage = useScrollAnimation({ 
    animationClass: 'animate-wine-pour',
    delay: 800 
  });

  return (
    <div className='relative pt-14 w-full wine-section'>
      <TopGradient />
      <BottomGradient />
      <div className='py-24 sm:py-32'>
        <div className='mx-auto max-w-8xl px-6 lg:px-8'>
          <div className='lg:mb-18 mx-auto max-w-3xl text-center'>
            <h1 
              ref={heroTitle.elementRef}
              className={`text-4xl font-bold text-gray-900 sm:text-6xl dark:text-white scroll-animate-hidden ${heroTitle.className}`}
            >
              Transform Your Wine Cave into a <span className='italic wine-secondary-text'>Thriving</span> Subscription Business
            </h1>
            <p 
              ref={heroSubtitle.elementRef}
              className={`mt-6 mx-auto max-w-2xl text-lg leading-8 text-gray-600 dark:text-white scroll-animate-hidden ${heroSubtitle.className}`}
            >
              Launch your wine subscription platform with automated member management, shipping integration, and personalized recommendations. Perfect for boutique wineries and wine caves.
            </p>
            <div 
              ref={heroButtons.elementRef}
              className={`mt-10 flex items-center justify-center gap-x-6 scroll-animate-hidden ${heroButtons.className}`}
            >
              <a
                href="/signup"
                className='rounded-md wine-gradient-bg px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm wine-hover-lift wine-transition-normal focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-600'
              >
                Start Your Wine Cave <span aria-hidden='true'>🍷</span>
              </a>
              <a
                href="/wine-subscriptions"
                className='rounded-md px-3.5 py-2.5 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-200 hover:ring-2 hover:ring-yellow-300 shadow-sm wine-hover-lift wine-transition-normal focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-600 dark:text-white'
              >
                View Demo <span aria-hidden='true'>→</span>
              </a>
            </div>
          </div>
          <div className='mt-14 flow-root sm:mt-14'>
            <div 
              ref={heroImage.elementRef}
              className={`-m-2 flex justify-center rounded-xl lg:-m-4 lg:rounded-2xl lg:p-4 scroll-animate-hidden ${heroImage.className}`}
            >
              <img
                src={openSaasBannerWebp}
                alt='Wine Club Management Dashboard'
                width={1000}
                height={530}
                loading='lazy'
                className='rounded-md shadow-2xl ring-1 ring-gray-900/10 wine-hover-lift wine-transition-slow'
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TopGradient() {
  return (
    <div
      className='absolute top-0 right-0 -z-10 transform-gpu overflow-hidden w-full blur-3xl sm:top-0'
    aria-hidden='true'
  >
    <div
      className='aspect-[1020/880] w-[55rem] flex-none sm:right-1/4 sm:translate-x-1/2 dark:hidden bg-gradient-to-tr from-yellow-400 to-red-400 opacity-40'
      style={{
        clipPath: 'polygon(80% 20%, 90% 55%, 50% 100%, 70% 30%, 20% 50%, 50% 0)',
      }}
      />
    </div>
  );
}

function BottomGradient() {
  return (
    <div
      className='absolute inset-x-0 top-[calc(100%-40rem)] sm:top-[calc(100%-65rem)] -z-10 transform-gpu overflow-hidden blur-3xl'
    aria-hidden='true'
  >
    <div
      className='relative aspect-[1020/880] sm:-left-3/4 sm:translate-x-1/4 dark:hidden bg-gradient-to-br from-yellow-400 to-red-400 opacity-50 w-[72.1875rem]'
      style={{
        clipPath: 'ellipse(80% 30% at 80% 50%)',
      }}
    />
    </div>
  );
}