import { useAuth } from 'wasp/client/auth';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';

export default function LandingPage() {
  const { data: user } = useAuth();

  return (
    <div className='min-h-screen-dynamic bg-white'>
      <div className='isolate'>
        {/* Hero Section - Full Bleed */}
        <Hero />
        {/* Content Sections with responsive spacing */}
        <div className="responsive-container-narrow">
          <section className="mt-30 mb-22.5 space-responsive-lg">
            <div>Section Placeholder</div>
          </section>
          <section className="mb-22.5 space-responsive-lg">
            <div>Section Placeholder</div>
          </section>
          <section className="mb-22.5 space-responsive-lg">
            <div>Section Placeholder</div>
          </section>
          <section className="mb-22.5 space-responsive-lg">
            <div>Section Placeholder</div>
          </section>
        </div>
      </div>
      {/* Footer - Full Width */}
      <div>Section Placeholder</div>
    </div>
  );
}
