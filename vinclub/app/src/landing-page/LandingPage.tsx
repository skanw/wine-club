import FAQ from './components/FAQ';
import Footer from './components/Footer';
import Hero from './components/Hero';
import ProblemSection from './components/ProblemSection';
import SolutionSection from './components/SolutionSection';
import SecuritySection from './components/ComplianceSection';
import ActionSection from './components/AsyncOnboardingSection';
import { faqs, footerNavigation } from './contentSections';

export default function LandingPage() {
  return (
    <div className='bg-background text-foreground'>
      <main className='isolate'>
        <Hero />
        <ProblemSection />
        <SolutionSection />
        <SecuritySection />
        <ActionSection />
        <FAQ faqs={faqs} />
      </main>
      <Footer footerNavigation={footerNavigation} />
    </div>
  );
}

