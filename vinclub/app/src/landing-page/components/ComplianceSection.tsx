export default function SecuritySection() {
  return (
    <section id="security" className='bg-background py-24 sm:py-32 lg:py-40'>
      <div className='mx-auto max-w-7xl px-6 lg:px-8'>
        {/* Section Header - Narrow Width, No Icon */}
        <div className='mx-auto max-w-2xl text-center mb-20 sm:mb-28'>
          <h2 className='text-3xl sm:text-4xl font-bold tracking-tight text-foreground'>
            Nous protégeons votre cave, pas seulement vos ventes.
          </h2>
        </div>

        {/* Three Security Pillars - Minimal Left-Aligned Grid */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16 max-w-5xl mx-auto'>
          {/* Indépendance Totale */}
          <div className='text-left pb-8 border-b border-border md:border-b-0 md:pb-0'>
            <h3 className='text-xl font-bold text-foreground mb-4'>
              Indépendance Totale
            </h3>
            <p className='text-base font-light text-muted-foreground leading-relaxed'>
              VinClub fonctionne à côté de votre système actuel. Nous ne demandons jamais vos mots de passe de caisse.
            </p>
          </div>

          {/* Bouclier Juridique */}
          <div className='text-left pb-8 border-b border-border md:border-b-0 md:pb-0'>
            <h3 className='text-xl font-bold text-foreground mb-4'>
              Bouclier Juridique
            </h3>
            <p className='text-base font-light text-muted-foreground leading-relaxed'>
              Gestion automatique du RGPD et modèles pré-validés pour la Loi Evin. Vos campagnes sont conformes par défaut.
            </p>
          </div>

          {/* Sérénité */}
          <div className='text-left'>
            <h3 className='text-xl font-bold text-foreground mb-4'>
              Sérénité
            </h3>
            <p className='text-base font-light text-muted-foreground leading-relaxed'>
              Dormez tranquille. Vos données sont hébergées en Europe et votre conformité est assurée par défaut.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}


