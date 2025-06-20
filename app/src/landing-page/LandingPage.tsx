import { features, faqs, footerNavigation, testimonials } from './contentSections';
import Hero from './components/Hero';
import Clients from './components/Clients';
import Features from './components/Features';
import Testimonials from './components/Testimonials';
import FAQ from './components/FAQ';
import Footer from './components/Footer';

export default function LandingPage() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#1a1a1a', 
      color: 'white', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>
          🍷 Wine Club SaaS
        </h1>
        <p style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>
          Transform Your Wine Cave Into a Thriving Business
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <a 
            href="/signup"
            style={{
              backgroundColor: '#dc2626',
              color: 'white',
              padding: '1rem 2rem',
              textDecoration: 'none',
              borderRadius: '0.5rem',
              fontSize: '1.1rem'
            }}
          >
            Start Your Wine Business
          </a>
          <a 
            href="/pricing"
            style={{
              backgroundColor: 'transparent',
              color: 'white',
              padding: '1rem 2rem',
              textDecoration: 'none',
              border: '2px solid white',
              borderRadius: '0.5rem',
              fontSize: '1.1rem'
            }}
          >
            View Pricing
          </a>
        </div>
        <div style={{ marginTop: '2rem', fontSize: '1rem', opacity: 0.8 }}>
          ✅ No Setup Fees | ✅ Free 14-Day Trial | ✅ Cancel Anytime
        </div>
      </div>
    </div>
  );
}
