import { Link as WaspRouterLink, routes } from 'wasp/client/router';
import { Button } from '../../components/ui/button';
import { Gift, CheckCircle2, Clock, TrendingUp } from 'lucide-react';
import SectionTitle from './SectionTitle';

export default function ConciergeOfferSection() {
  return (
    <section id="concierge-offer" className='bg-gradient-to-b from-primary/5 to-background py-16 sm:py-24'>
      <div className='mx-auto max-w-7xl px-6 lg:px-8'>
        <div className='mx-auto max-w-3xl text-center mb-12'>
          <div className='flex justify-center mb-4'>
            <Gift className='h-12 w-12 text-primary' />
          </div>
          <SectionTitle
            title="Vous ne nous croyez pas ? Laissez-nous 'Vendre' Une Bouteille Pour Vous"
            description="Offre irrésistible : Nous téléchargeons manuellement vos 50 meilleurs clients et vous aidons à envoyer une campagne. Si ça ne génère pas de ROI en 24 heures, vous ne payez rien."
          />
        </div>

        {/* Offer details */}
        <div className='max-w-4xl mx-auto'>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-12'>
            <div className='bg-background border-2 border-primary/20 rounded-lg p-6 text-center'>
              <Clock className='h-8 w-8 text-primary mx-auto mb-3' />
              <h3 className='text-lg font-semibold text-foreground mb-2'>15 Minutes</h3>
              <p className='text-sm text-muted-foreground'>
                Un appel de 15 minutes pour comprendre vos besoins et configurer votre compte.
              </p>
            </div>

            <div className='bg-background border-2 border-primary/20 rounded-lg p-6 text-center'>
              <TrendingUp className='h-8 w-8 text-primary mx-auto mb-3' />
              <h3 className='text-lg font-semibold text-foreground mb-2'>1 Campagne</h3>
              <p className='text-sm text-muted-foreground'>
                Nous téléchargeons vos 50 meilleurs clients et vous aidons à envoyer votre première campagne.
              </p>
            </div>

            <div className='bg-background border-2 border-primary/20 rounded-lg p-6 text-center'>
              <CheckCircle2 className='h-8 w-8 text-primary mx-auto mb-3' />
              <h3 className='text-lg font-semibold text-foreground mb-2'>ROI en 24h</h3>
              <p className='text-sm text-muted-foreground'>
                Si la campagne ne génère pas de revenus dans les 24 heures, vous ne payez rien. Garanti.
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className='bg-primary/10 border-2 border-primary/30 rounded-lg p-8 text-center'>
            <h3 className='text-2xl font-bold text-foreground mb-4'>
              Réservez votre Test Concierge de 15 Minutes
            </h3>
            <p className='text-muted-foreground mb-6 max-w-2xl mx-auto'>
              Pas de risque. Pas de pression. Juste une démonstration concrète de comment VinClub peut transformer votre stock dormant en cash.
            </p>
            <Button size='lg' variant='default' className='min-h-[44px] min-w-[250px]' asChild>
              <WaspRouterLink to={routes.SignupRoute.to} search={{ concierge: 'true' }}>
                Réserver mon Test Concierge Gratuit <span aria-hidden='true'>→</span>
              </WaspRouterLink>
            </Button>
            <p className='text-xs text-muted-foreground mt-4'>
              * Si la campagne ne génère pas de ROI dans les 24 heures suivant l'envoi, vous ne payez rien.
            </p>
          </div>

          {/* What you get */}
          <div className='mt-12 bg-muted/30 rounded-lg p-8'>
            <h3 className='text-xl font-semibold text-foreground mb-6 text-center'>
              Ce que vous obtenez avec le Test Concierge
            </h3>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              {[
                'Téléchargement manuel de vos 50 meilleurs clients',
                'Configuration de votre compte VinClub',
                'Création de votre première campagne',
                'Aide à l\'envoi de la campagne',
                'Suivi des résultats en temps réel',
                'Garantie ROI ou remboursement',
              ].map((item, idx) => (
                <div key={idx} className='flex items-start gap-3'>
                  <CheckCircle2 className='h-5 w-5 text-primary mt-0.5 flex-shrink-0' />
                  <span className='text-sm text-foreground'>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

