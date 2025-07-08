import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { routes } from 'wasp/client/router';
import { 
  FaWineBottle, 
  FaHeart, 
  FaUsers, 
  FaAward,
  FaGlobe,
  FaLeaf,
  FaShieldAlt,
  FaStar,
  FaLinkedin,
  FaTwitter,
  FaInstagram
} from 'react-icons/fa';
import Button from '../components/ui/Button';

interface TeamMember {
  name: string;
  role: string;
  bio: string;
  image: string;
  color: string;
}

const AboutPage: React.FC = () => {
  const { t } = useTranslation();

  // Fallback function for translations
  const tFallback = (key: string, fallback: string) => {
    const translation = t(key);
    return translation === key ? fallback : translation;
  };

  const values = [
    {
      icon: <FaHeart className="w-8 h-8" />,
      title: tFallback('about.values.passion.title', 'Passion for Wine'),
      description: tFallback('about.values.passion.description', 'We\'re driven by our love for exceptional wines and the stories behind them'),
      color: 'bg-bordeaux-100 dark:bg-bordeaux-900/30'
    },
    {
      icon: <FaLeaf className="w-8 h-8" />,
      title: tFallback('about.values.sustainability.title', 'Sustainable Practices'),
      description: tFallback('about.values.sustainability.description', 'We partner with wineries committed to environmental stewardship'),
      color: 'bg-champagne-100 dark:bg-champagne-900/30'
    },
    {
      icon: <FaUsers className="w-8 h-8" />,
      title: tFallback('about.values.community.title', 'Community First'),
      description: tFallback('about.values.community.description', 'Building connections through shared appreciation of fine wine'),
      color: 'bg-bordeaux-100 dark:bg-bordeaux-900/30'
    },
    {
      icon: <FaShieldAlt className="w-8 h-8" />,
      title: tFallback('about.values.quality.title', 'Uncompromising Quality'),
      description: tFallback('about.values.quality.description', 'Every wine in our selection meets our rigorous standards'),
      color: 'bg-champagne-100 dark:bg-champagne-900/30'
    }
  ];

  const teamMembers = [
    {
      name: tFallback('about.team.1.name', 'Jean-Pierre Dubois'),
      role: tFallback('about.team.1.role', 'Master Sommelier & Founder'),
      bio: tFallback('about.team.1.bio', 'With over 25 years in the wine industry, Jean-Pierre brings unparalleled expertise in wine selection and curation.'),
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80',
      color: 'var(--wine-red-deep)', // Use CSS custom property
    },
    {
      name: tFallback('about.team.2.name', 'Maria Santos'),
      role: tFallback('about.team.2.role', 'Wine Curator & Operations'),
      bio: tFallback('about.team.2.bio', 'Maria ensures every wine in our collection meets our exacting standards for quality and taste.'),
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80',
      color: 'var(--wine-red-burgundy)', // Use CSS custom property
    },
    {
      name: tFallback('about.team.3.name', 'David Chen'),
      role: tFallback('about.team.3.role', 'Technology & Customer Experience'),
      bio: tFallback('about.team.3.bio', 'David leads our technology initiatives to create seamless experiences for our members.'),
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
      color: 'var(--ui-gray-dark)', // Use CSS custom property
    },
  ];

  const stats = [
    { number: '500+', label: tFallback('about.stats.wines', 'Wines Curated') },
    { number: '50+', label: tFallback('about.stats.regions', 'Wine Regions') },
    { number: '1000+', label: tFallback('about.stats.members', 'Happy Members') },
    { number: '15+', label: tFallback('about.stats.years', 'Years of Excellence') }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-champagne-50 via-white to-bordeaux-50 dark:from-bordeaux-950 dark:via-bordeaux-900 dark:to-bordeaux-950">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-bordeaux-900/20 to-champagne-900/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-bordeaux-900 dark:text-champagne-100 mb-6">
              {tFallback('about.hero.title', 'Our Story')}
            </h1>
            <p className="text-xl text-bordeaux-700 dark:text-champagne-200 max-w-3xl mx-auto mb-8">
              {tFallback('about.hero.subtitle', 'Passionate about bringing the world\'s finest wines to your table')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button to="/pricing" variant="primary" size="lg">
                {tFallback('about.hero.cta', 'Join Our Club')}
              </Button>
              <Button to={routes.ContactRoute?.to || '/contact'} variant="secondary" size="lg">
                {tFallback('about.hero.contact', 'Contact Us')}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-bordeaux-900 dark:text-champagne-100 mb-6">
                {tFallback('about.story.title', 'Our Mission')}
              </h2>
              <p className="text-lg text-bordeaux-700 dark:text-champagne-200 mb-6">
                {tFallback('about.story.paragraph1', 'Founded in 2020, our wine club was born from a simple belief: everyone deserves access to exceptional wines. We started with a small group of wine enthusiasts and have grown into a community of thousands of members who share our passion for quality and discovery.')}
              </p>
              <p className="text-lg text-bordeaux-700 dark:text-champagne-200 mb-6">
                {tFallback('about.story.paragraph2', 'Our team of certified sommeliers and wine experts carefully curates each selection, ensuring that every bottle tells a story and delivers an unforgettable experience. We work directly with winemakers and vineyards around the world to bring you the best wines at the best prices.')}
              </p>
              <p className="text-lg text-bordeaux-700 dark:text-champagne-200">
                {tFallback('about.story.paragraph3', 'Whether you\'re a seasoned collector or just beginning your wine journey, we\'re here to guide you every step of the way. Join us in discovering the world\'s most remarkable wines.')}
              </p>
            </div>
            <div className="relative">
              <div 
                className="w-full h-96 rounded-2xl flex items-center justify-center"
                style={{ backgroundColor: '#8B0000' }}
              >
                <div className="text-white text-3xl font-bold opacity-80 text-center">
                  Wine<br/>Passion
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white dark:bg-bordeaux-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-bordeaux-600 dark:text-champagne-400 mb-2">
                  {stat.number}
                </div>
                <div className="text-bordeaux-700 dark:text-champagne-200 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-bordeaux-900 dark:text-champagne-100 mb-6">
              {tFallback('about.values.title', 'Our Values')}
            </h2>
            <p className="text-xl text-bordeaux-700 dark:text-champagne-200 max-w-3xl mx-auto">
              {tFallback('about.values.subtitle', 'The principles that guide everything we do')}
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-bordeaux-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl text-white">🍷</span>
              </div>
              <h3 className="text-xl font-bold text-bordeaux-900 dark:text-champagne-100 mb-4">
                {tFallback('about.values.quality.title', 'Quality First')}
              </h3>
              <p className="text-bordeaux-700 dark:text-champagne-200">
                {tFallback('about.values.quality.description', 'We never compromise on quality. Every wine in our collection meets our rigorous standards for taste, character, and craftsmanship.')}
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-bordeaux-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl text-white">🌍</span>
              </div>
              <h3 className="text-xl font-bold text-bordeaux-900 dark:text-champagne-100 mb-4">
                {tFallback('about.values.sustainability.title', 'Sustainability')}
              </h3>
              <p className="text-bordeaux-700 dark:text-champagne-200">
                {tFallback('about.values.sustainability.description', 'We partner with wineries that practice sustainable farming and environmentally responsible production methods.')}
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-bordeaux-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl text-white">👥</span>
              </div>
              <h3 className="text-xl font-bold text-bordeaux-900 dark:text-champagne-100 mb-4">
                {tFallback('about.values.community.title', 'Community')}
              </h3>
              <p className="text-bordeaux-700 dark:text-champagne-200">
                {tFallback('about.values.community.description', 'We believe wine is best enjoyed with others. Our community events and tastings bring people together to share their passion.')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-bordeaux-900 dark:text-champagne-100 mb-6">
              {tFallback('about.team.title', 'Meet Our Team')}
            </h2>
            <p className="text-xl text-bordeaux-700 dark:text-champagne-200 max-w-3xl mx-auto">
              {tFallback('about.team.subtitle', 'The passionate experts behind our wine club')}
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div 
                  className="h-48 bg-cover bg-center"
                  style={{ 
                    backgroundImage: `url(${member.image})`,
                    backgroundColor: member.color 
                  }}
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {member.name}
                  </h3>
                  <p className="text-champagne-600 font-medium mb-3">
                    {member.role}
                  </p>
                  <p className="text-gray-600 leading-relaxed">
                    {member.bio}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-bordeaux-900 dark:bg-bordeaux-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-champagne-100 mb-6">
            {tFallback('about.cta.title', 'Ready to Start Your Wine Journey?')}
          </h2>
          <p className="text-xl text-champagne-200 mb-8 max-w-2xl mx-auto">
            {tFallback('about.cta.subtitle', 'Join thousands of wine enthusiasts who have discovered their new favorite wines with us')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button to="/pricing" variant="primary" size="lg">
              {tFallback('about.cta.primary', 'Join Our Club')}
            </Button>
            <Button to={routes.ContactRoute?.to || '/contact'} variant="secondary" size="lg">
              {tFallback('about.cta.secondary', 'Learn More')}
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage; 