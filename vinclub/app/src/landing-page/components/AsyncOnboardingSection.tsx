import { Link as WaspRouterLink, routes } from 'wasp/client/router';
import { Button } from '../../components/ui/button';

export default function ActionSection() {
  return (
    <section id="action" className='bg-muted/20 py-24 sm:py-32 lg:py-40'>
      <div className='mx-auto max-w-7xl px-6 lg:px-8'>
        {/* Section Header */}
        <div className='mx-auto max-w-2xl text-center mb-20 sm:mb-28'>
          <h2 className='text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-6'>
            Ne perdez plus de temps en démos inutiles.
          </h2>
          <p className='text-lg font-light text-muted-foreground'>
            Trois étapes et vous vendez.
          </p>
        </div>

        {/* 3-Step Process - Horizontal with Giant Numbers and Connecting Lines */}
        <div className='max-w-4xl mx-auto'>
          {/* Connecting Line (visible on md+) */}
          <div className='hidden md:block relative'>
            <div className='absolute top-16 left-[16.67%] right-[16.67%] h-px bg-border' />
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-8'>
            {/* Step 1 */}
            <div className='relative text-center'>
              <span className='absolute -top-4 left-1/2 -translate-x-1/2 text-[120px] sm:text-[150px] font-black text-foreground/[0.03] leading-none select-none pointer-events-none'>
                1
              </span>
              <div className='relative pt-8'>
                <h3 className='text-lg font-bold text-foreground mb-3'>
                  Remplissez le formulaire
                </h3>
                <p className='text-sm font-light text-muted-foreground'>
                  3 minutes. Pas d'appel.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className='relative text-center'>
              <span className='absolute -top-4 left-1/2 -translate-x-1/2 text-[120px] sm:text-[150px] font-black text-foreground/[0.03] leading-none select-none pointer-events-none'>
                2
              </span>
              <div className='relative pt-8'>
                <h3 className='text-lg font-bold text-foreground mb-3'>
                  Nous configurons pour vous
                </h3>
                <p className='text-sm font-light text-muted-foreground'>
                  Prêt en 24 heures.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className='relative text-center'>
              <span className='absolute -top-4 left-1/2 -translate-x-1/2 text-[120px] sm:text-[150px] font-black text-foreground/[0.03] leading-none select-none pointer-events-none'>
                3
              </span>
              <div className='relative pt-8'>
                <h3 className='text-lg font-bold text-foreground mb-3'>
                  Recevez vos accès et vendez
                </h3>
                <p className='text-sm font-light text-muted-foreground'>
                  Votre première vente en route.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA - Pill Button */}
        <div className='mt-20 sm:mt-28 text-center'>
          <Button size='lg' variant='default' className='rounded-full px-10 py-6 text-base font-medium' asChild>
            <WaspRouterLink to={routes.SignupRoute.to} search={{ concierge: 'true' }}>
              Démarrer mon essai gratuit
            </WaspRouterLink>
          </Button>
        </div>
      </div>
    </section>
  );
}

