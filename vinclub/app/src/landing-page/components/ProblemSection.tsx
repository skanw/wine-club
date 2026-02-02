export default function ProblemSection() {
  return (
    <section id="problem" className='bg-background py-24 sm:py-32 lg:py-40'>
      <div className='mx-auto max-w-2xl px-6 lg:px-8'>
        {/* Section Header */}
        <h2 className='text-3xl sm:text-4xl font-bold tracking-tight text-foreground text-center mb-20 sm:mb-28'>
          Votre vin ne devrait pas prendre la poussière en rayon.
        </h2>

        {/* Three Pain Points - Vertical Stack with Massive Spacing */}
        <div className='space-y-20 sm:space-y-28'>
          {/* Le Constat */}
          <div className='text-left'>
            <h3 className='text-2xl font-bold text-foreground mb-4'>
              Le Constat
            </h3>
            <p className='text-lg font-light text-muted-foreground leading-relaxed'>
              Chaque jour où une bouteille rare reste en rayon, c'est du capital immobilisé. Votre trésorerie dort pendant que vos clients attendent sans le savoir.
            </p>
          </div>

          {/* La Friction */}
          <div className='text-left'>
            <h3 className='text-2xl font-bold text-foreground mb-4'>
              La Friction
            </h3>
            <p className='text-lg font-light text-muted-foreground leading-relaxed'>
              Contacter vos 50 meilleurs clients manuellement prend 30 minutes de copier-coller. Résultat ? Vous ne le faites pas.
            </p>
          </div>

          {/* L'Impact */}
          <div className='text-left'>
            <h3 className='text-2xl font-bold text-foreground mb-4'>
              L'Impact
            </h3>
            <p className='text-lg font-light text-muted-foreground leading-relaxed'>
              Des opportunités de ventes perdues et une trésorerie qui dépend uniquement du passage en boutique.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
