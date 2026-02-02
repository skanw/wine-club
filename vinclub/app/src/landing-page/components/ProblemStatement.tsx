import { Clock, TrendingDown, TrendingUp, CheckCircle2 } from 'lucide-react';

export default function ProblemStatement() {
  return (
    <section id="problem" className='bg-muted/30 py-16 sm:py-24'>
      <div className='mx-auto max-w-7xl px-6 lg:px-8'>
        <div className='mx-auto max-w-2xl text-center'>
          <h2 className='text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-4'>
            Le problème : vos revenus s'échappent à cause de la friction
          </h2>
          <p className='text-lg leading-8 text-muted-foreground mb-12'>
            Une nouvelle arrivée arrive. Vous avez 20 clients qui adoreraient cette bouteille. Mais les notifier prend des heures. Alors souvent, ça ne se fait pas.
          </p>
        </div>

        {/* Current State vs VinClub Solution */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12'>
          {/* Current State - The Problem */}
          <div className='bg-red-50 dark:bg-red-950/20 border-2 border-red-200 dark:border-red-900 rounded-lg p-8'>
            <div className='flex items-center gap-3 mb-4'>
              <TrendingDown className='h-6 w-6 text-red-600' />
              <h3 className='text-xl font-semibold text-red-900 dark:text-red-100'>
                Avant VinClub
              </h3>
            </div>
            <div className='space-y-4'>
              <div className='flex items-start gap-3'>
                <Clock className='h-5 w-5 text-red-600 mt-0.5 flex-shrink-0' />
                <div>
                  <p className='font-medium text-red-900 dark:text-red-100'>30 minutes minimum</p>
                  <p className='text-sm text-red-700 dark:text-red-300'>
                    Pour identifier les clients, trouver leurs contacts, rédiger un message, et l'envoyer via Brevo
                  </p>
                </div>
              </div>
              <div className='flex items-start gap-3'>
                <TrendingDown className='h-5 w-5 text-red-600 mt-0.5 flex-shrink-0' />
                <div>
                  <p className='font-medium text-red-900 dark:text-red-100'>Revenus perdus</p>
                  <p className='text-sm text-red-700 dark:text-red-300'>
                    Les bouteilles restent en rayon, immobilisant votre capital. Les clients ne savent pas que vous avez ce qu'ils cherchent.
                  </p>
                </div>
              </div>
              <div className='flex items-start gap-3'>
                <Clock className='h-5 w-5 text-red-600 mt-0.5 flex-shrink-0' />
                <div>
                  <p className='font-medium text-red-900 dark:text-red-100'>Friction administrative</p>
                  <p className='text-sm text-red-700 dark:text-red-300'>
                    Vous devez aller derrière le comptoir, ouvrir Brevo sur l'ordinateur, perdre votre flux de travail
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* VinClub Solution */}
          <div className='bg-green-50 dark:bg-green-950/20 border-2 border-green-200 dark:border-green-900 rounded-lg p-8'>
            <div className='flex items-center gap-3 mb-4'>
              <TrendingUp className='h-6 w-6 text-green-600' />
              <h3 className='text-xl font-semibold text-green-900 dark:text-green-100'>
                Avec VinClub
              </h3>
            </div>
            <div className='space-y-4'>
              <div className='flex items-start gap-3'>
                <CheckCircle2 className='h-5 w-5 text-green-600 mt-0.5 flex-shrink-0' />
                <div>
                  <p className='font-medium text-green-900 dark:text-green-100'>3 clics, 30 secondes</p>
                  <p className='text-sm text-green-700 dark:text-green-300'>
                    Photo → Sélection audience → Envoi. C'est tout. Depuis votre smartphone, même dans la cave.
                  </p>
                </div>
              </div>
              <div className='flex items-start gap-3'>
                <TrendingUp className='h-5 w-5 text-green-600 mt-0.5 flex-shrink-0' />
                <div>
                  <p className='font-medium text-green-900 dark:text-green-100'>Revenus activés</p>
                  <p className='text-sm text-green-700 dark:text-green-300'>
                    Les clients sont notifiés instantanément. 10% répondent "Mettez-en une de côté". Rotation des stocks multipliée.
                  </p>
                </div>
              </div>
              <div className='flex items-start gap-3'>
                <CheckCircle2 className='h-5 w-5 text-green-600 mt-0.5 flex-shrink-0' />
                <div>
                  <p className='font-medium text-green-900 dark:text-green-100'>Zéro friction</p>
                  <p className='text-sm text-green-700 dark:text-green-300'>
                    Vous restez dans votre flux. Utilisez votre smartphone, une main. Pas besoin d'aller derrière le comptoir.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}


