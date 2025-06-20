import { features, faqs, footerNavigation, testimonials } from '../../landing-page/contentSections';
import Hero from '../components/Hero';
import Clients from '../components/Clients';
import Features from '../components/Features';
import Testimonials from '../components/Testimonials';
import FAQ from '../components/FAQ';
import Footer from '../components/Footer';

export default function LandingPage() {
  return (
    <div className='bg-white dark:text-white dark:bg-boxdark-2'>
      <main className='isolate dark:bg-boxdark-2'>
        {/* Hero Section - Full Bleed */}
        <Hero />
        
        {/* HH-07: Content Sections with 120px margin-top after hero, 90px between sections */}
        <div className="max-w-luxury-content mx-auto px-16 lg:px-24">
          {/* HH-07: 120px margin-top after hero */}
          <section className="mt-30 mb-22.5"> {/* 120px top, 90px bottom */}
            <Clients />
          </section>
          
          {/* HH-07: 90px between subsequent sections */}
          <section className="mb-22.5"> {/* 90px bottom */}
            <Features features={features} />
          </section>
          
          <section className="mb-22.5"> {/* 90px bottom */}
            <Testimonials testimonials={testimonials} />
          </section>
          
          <section className="mb-22.5"> {/* 90px bottom */}
            <FAQ faqs={faqs} />
          </section>
        </div>
      </main>
      
      {/* Footer - Full Width */}
      <Footer footerNavigation={footerNavigation} />
    </div>
  );
}
