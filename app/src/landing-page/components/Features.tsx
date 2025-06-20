import { useStaggeredScrollReveal } from '../../client/hooks/useScrollReveal';
import useScrollReveal from '../../client/hooks/useScrollReveal';
import { useTranslation } from 'react-i18next';

interface Feature {
  name: string;
  description: string;
  icon: string;
  href: string;
};

export default function Features({ features }: { features: Feature[] }) {
  const { t } = useTranslation();
  
  // Use optimized scroll reveals
  const titleReveal = useScrollReveal({ threshold: 0.2 });
  const subtitleReveal = useScrollReveal({ threshold: 0.2, delay: 200 });
  const featureReveals = useStaggeredScrollReveal(features.length, { threshold: 0.15 }, 100);

  return (
    <section 
      id='features' 
      className='relative mx-auto py-luxury-xl px-6 lg:px-8 bg-gradient-to-b from-neutral-ivory to-neutral-cream dark:from-neutral-obsidian dark:to-neutral-charcoal transition-colors duration-500'
    >
      {/* Luxury Content Container */}
      <div className='mx-auto max-w-luxury-content'>
        {/* Section Header with Luxury Typography */}
        <div className='text-center mb-luxury-lg'>
          <div ref={titleReveal.ref} className="hero-reveal mb-6">
            <h2 className='luxury-h2 text-luxury-h2 md:text-luxury-h2 font-luxury text-luxury-gradient'>
              {t('features.title')}{' '}
              <span className='text-champagne-gradient'>{t('features.best')}</span>{' '}
              {t('features.features')}
            </h2>
          </div>
          
          <div ref={subtitleReveal.ref} className="reveal">
            <p className='luxury-lead max-w-3xl mx-auto text-center'>
              {t('features.subtitle')}
            </p>
            <p className="wine-tasting-notes max-w-2xl mx-auto mt-4">
              <span className="text-bordeaux-gradient font-semibold">{t('features.tagline')}</span>
            </p>
          </div>
        </div>
        
        {/* Features Grid with Luxury Cards */}
        <div className='mx-auto max-w-luxury-wide'>
          <dl className='grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12'>
            {features.map((feature, index) => (
              <div 
                key={feature.name} 
                ref={featureReveals[index]?.ref}
                className='card-reveal group relative'
              >
                {/* Luxury Feature Card */}
                <div className="relative p-8 rounded-2xl bg-white/80 dark:bg-neutral-charcoal/80 backdrop-blur-sm border border-champagne-200 dark:border-bordeaux-600 shadow-luxury hover:shadow-luxury-lg transition-all duration-400 hover:transform hover:scale-[1.02] hover:bg-white dark:hover:bg-neutral-charcoal">
                  
                  {/* Premium Icon Container */}
                  <div className='flex items-start space-x-6'>
                    <div className='flex-shrink-0'>
                      <div className='flex h-16 w-16 items-center justify-center bg-luxury-primary rounded-xl shadow-wine group-hover:shadow-champagne transition-all duration-400 group-hover:scale-110 group-hover:rotate-3'>
                        <div className='text-3xl text-white animate-luxury-fade'>{feature.icon}</div>
                      </div>
                    </div>
                    
                    {/* Feature Content */}
                    <div className='flex-1 min-w-0'>
                      <dt className='luxury-h4 mb-3 group-hover:text-bordeaux-600 dark:group-hover:text-champagne-400 transition-colors duration-300'>
                        {feature.name}
                      </dt>
                      <dd className='luxury-body text-neutral-slate dark:text-neutral-pearl group-hover:text-neutral-charcoal dark:group-hover:text-neutral-cream transition-colors duration-300'>
                        {feature.description}
                      </dd>
                    </div>
                  </div>

                  {/* Subtle Gradient Accent */}
                  <div className="absolute inset-x-0 bottom-0 h-1 bg-luxury-primary rounded-b-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-400"></div>
                  
                  {/* Luxury Shimmer Effect on Hover */}
                  <div className="absolute inset-0 luxury-shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-400 rounded-2xl pointer-events-none"></div>
                </div>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* Elegant Wine-themed Decorative Elements */}
      <div className="absolute top-20 left-1/4 wine-bottle-decoration opacity-3 dark:opacity-2 pointer-events-none animate-wine-pour">
        <svg width="40" height="120" viewBox="0 0 40 120" className="text-champagne-400 drop-shadow-luxury">
          <rect x="16" y="0" width="8" height="20" fill="currentColor" rx="2" />
          <rect x="12" y="20" width="16" height="80" fill="currentColor" rx="3" />
          <ellipse cx="20" cy="110" rx="10" ry="8" fill="currentColor" />
        </svg>
      </div>
      
      <div className="absolute bottom-20 right-1/4 wine-bottle-decoration opacity-3 dark:opacity-2 pointer-events-none transform rotate-12 animate-champagne-bubble">
        <svg width="40" height="120" viewBox="0 0 40 120" className="text-bordeaux-400 drop-shadow-luxury">
          <rect x="16" y="0" width="8" height="20" fill="currentColor" rx="2" />
          <rect x="12" y="20" width="16" height="80" fill="currentColor" rx="3" />
          <ellipse cx="20" cy="110" rx="10" ry="8" fill="currentColor" />
        </svg>
      </div>
    </section>
  );
}
