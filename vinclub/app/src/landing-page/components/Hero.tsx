import NotifyMeSection from './NotifyMeSection';

export default function Hero() {
  return (
    <section id="hero" className='relative pt-18 pb-24 sm:pt-24 sm:pb-32 lg:pt-30 lg:pb-40 w-full' style={{ backgroundColor: '#F4F4F0' }}>
      <div className='mx-auto max-w-7xl px-6 lg:px-8'>
        <div className='mx-auto max-w-4xl flex flex-col items-center'>
          {/* Main Headline - Massive, Extra Bold */}
          <h1 className='text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black text-vintage-wine leading-none tracking-[20px] text-center uppercase'>
            Transformez votre stock dorment en revenus
          </h1>
          
          {/* Time Statement - Thinner, Wide Tracking */}
          <p className='mt-6 sm:mt-8 text-xl sm:text-2xl lg:text-3xl font-light text-vintage-wine/60 tracking-widest text-center uppercase'>
            En 30 secondes
          </p>
          
          {/* Subtitle - Light weight */}
          <p className='mt-8 sm:mt-12 max-w-2xl text-lg font-light leading-relaxed text-vintage-wine/70 text-center'>
            Le premier moteur de revenus mobiles pour cavistes. Lancez des abonnements automatisés et vendez vos pépites par SMS.
          </p>
          
          {/* Notify me when ready */}
          <NotifyMeSection compact />
          
          {/* Trust Proof - Single Subtle Line */}
          <p className='mt-8 text-sm font-light text-vintage-wine/50 text-center'>
            Zéro intégration technique requise · Hébergé en Europe
          </p>
        </div>
      </div>
    </section>
  );
}

