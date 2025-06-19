import { useScrollAnimation, useStaggeredAnimation } from '../../client/hooks/useScrollAnimation';

interface Feature {
  name: string;
  description: string;
  icon: string;
  href: string;
};

export default function Features({ features }: { features: Feature[] }) {
  const featuresTitle = useScrollAnimation({ 
    animationClass: 'animate-wine-swirl',
    delay: 100 
  });
  const featuresSubtitle = useScrollAnimation({ 
    animationClass: 'animate-fade-in-up',
    delay: 300 
  });
  const featureItems = useStaggeredAnimation(features.length, 150, {
    animationClass: 'animate-fade-in-up'
  });

  return (
    <div id='features' className='mx-auto mt-48 max-w-7xl px-6 lg:px-8 wine-section'>
      <div className='mx-auto max-w-2xl text-center'>
        <p 
          ref={featuresTitle.elementRef}
          className={`mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl dark:text-white scroll-animate-hidden ${featuresTitle.className}`}
        >
          The <span className='wine-accent-text'>Best</span> Features
        </p>
        <p 
          ref={featuresSubtitle.elementRef}
          className={`mt-6 text-lg leading-8 text-gray-600 dark:text-white scroll-animate-hidden ${featuresSubtitle.className}`}
        >
          Perfect for Wine Caves.
          <br /> Built for Growth.
        </p>
      </div>
      <div className='mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl'>
        <dl className='grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16'>
          {features.map((feature, index) => (
            <div 
              key={feature.name} 
              ref={featureItems[index]?.elementRef}
              className={`relative pl-16 wine-hover-lift wine-transition-normal scroll-animate-hidden ${featureItems[index]?.className || ''}`}
            >
              <dt className='text-base font-semibold leading-7 text-gray-900 dark:text-white'>
                <div className='absolute left-0 top-0 flex h-10 w-10 items-center justify-center border wine-accent-bg wine-shadow rounded-lg wine-hover-scale wine-transition-normal'>
                  <div className='text-2xl'>{feature.icon}</div>
                </div>
                {feature.name}
              </dt>
              <dd className='mt-2 text-base leading-7 text-gray-600 dark:text-white'>{feature.description}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  )
}
