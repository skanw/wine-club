export default function SolutionSection() {
  return (
    <section id="solution" className='bg-muted/20 py-24 sm:py-32 lg:py-40'>
      <div className='mx-auto max-w-7xl px-6 lg:px-8'>
        {/* Section Header - Narrow Width */}
        <div className='mx-auto max-w-2xl text-center mb-20 sm:mb-28'>
          <h2 className='text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-6'>
            Une intelligence de vente qui tient dans votre poche.
          </h2>
          <p className='text-lg font-light text-muted-foreground'>
            Le "Side-Car" de votre cave.
          </p>
        </div>

        {/* Three Solution Features - Left-Aligned Grid */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16 max-w-5xl mx-auto'>
          {/* Ventes Flash */}
          <div className='text-left pb-8 border-b border-border md:border-b-0 md:pb-0'>
            <h3 className='text-xl font-bold text-foreground mb-4'>
              Ventes Flash
            </h3>
            <p className='text-base font-light text-muted-foreground leading-relaxed'>
              Prenez une photo, ciblez vos "Amateurs de Bourgogne" et envoyez. Un seul clic pour 50 clients notifiés.
            </p>
          </div>

          {/* Abonnements Automatisés */}
          <div className='text-left pb-8 border-b border-border md:border-b-0 md:pb-0'>
            <h3 className='text-xl font-bold text-foreground mb-4'>
              Abonnements Automatisés
            </h3>
            <p className='text-base font-light text-muted-foreground leading-relaxed'>
              Sécurisez votre loyer avec des revenus récurrents, même pendant les mois creux. Votre trésorerie devient prévisible.
            </p>
          </div>

          {/* Facturation Intelligente */}
          <div className='text-left'>
            <h3 className='text-xl font-bold text-foreground mb-4'>
              Facturation Intelligente
            </h3>
            <p className='text-base font-light text-muted-foreground leading-relaxed'>
              Nous gérons les paiements Stripe, les relances automatiques et la complexité de la TVA mixte française.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
