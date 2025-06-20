import { features, faqs, footerNavigation, testimonials } from './contentSections';
import Hero from './components/Hero';
import Clients from './components/Clients';
import Features from './components/Features';
import Testimonials from './components/Testimonials';
import FAQ from './components/FAQ';
import Footer from './components/Footer';

export default function LandingPage() {
  return (
    <div className='bg-white dark:text-white dark:bg-boxdark-2'>
      <main className='isolate dark:bg-boxdark-2'>
        {/* Hero Section - Full Bleed */}
        <Hero />
        
        {/* Content Sections with 120px Vertical Rhythm */}
        <div className="max-w-luxury-content mx-auto px-16 lg:px-24 space-y-luxury-xl">
          <section className="py-luxury-xl">
            <Clients />
          </section>
          
          <section className="py-luxury-xl">
            <Features features={features} />
          </section>
          
          <section className="py-luxury-xl">
            <Testimonials testimonials={testimonials} />
          </section>
          
          <section className="py-luxury-xl">
            <FAQ faqs={faqs} />
          </section>
        </div>
      </main>
      
      {/* Footer - Full Width */}
      <Footer footerNavigation={footerNavigation} />
    </div>
  );
}
