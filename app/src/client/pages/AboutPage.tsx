import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '../components/ui/Button';

export default function AboutPage() {
  const { t } = useTranslation();

  // Fallback function for translations
  const tFallback = (key: string, fallback: string) => {
    const translation = t(key);
    return translation === key ? fallback : translation;
  };

  const [_setValues] = useState(() => (_values: any) => {
    // TODO: Implement form handling
  });

  const _values = [
    {
      icon: '🍷',
      title: 'Curated Selection',
      description: 'Expertly chosen wines from boutique producers'
    },
    {
      icon: '🌱',
      title: 'Sustainable',
      description: 'Supporting eco-friendly wine production'
    },
    {
      icon: '👥',
      title: 'Community',
      description: 'Join a community of wine enthusiasts'
    },
    {
      icon: '🛡️',
      title: 'Quality Assured',
      description: 'Every bottle meets our high standards'
    }
  ];

  const _teamMembers = [
    {
      name: tFallback('about.team.1.name', 'Jean-Pierre Dubois'),
      role: tFallback('about.team.1.role', 'Master Sommelier & Founder'),
      bio: tFallback('about.team.1.bio', 'With over 25 years in the wine industry, Jean-Pierre brings unparalleled expertise in wine selection and curation.'),
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80',
      color: '#E9D9A6', // champagne
    },
    {
      name: tFallback('about.team.2.name', 'Maria Santos'),
      role: tFallback('about.team.2.role', 'Wine Curator & Operations'),
      bio: tFallback('about.team.2.bio', 'Maria ensures every wine in our collection meets our exacting standards for quality and taste.'),
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80',
      color: '#DCCB8A', // chablis
    },
    {
      name: tFallback('about.team.3.name', 'David Chen'),
      role: tFallback('about.team.3.role', 'Technology & Customer Experience'),
      bio: tFallback('about.team.3.bio', 'David leads our technology initiatives to create seamless experiences for our members.'),
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
      color: '#6E664C', // grape-seed
    },
  ];

  const _stats = [
    { number: '500+', label: tFallback('about.stats.wines', 'Wines Curated') },
    { number: '50+', label: tFallback('about.stats.regions', 'Wine Regions') },
    { number: '1000+', label: tFallback('about.stats.members', 'Happy Members') },
    { number: '15+', label: tFallback('about.stats.years', 'Years of Excellence') }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-ivory via-shell to-porcelain">
      {/* Background Blurred Shapes */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-champagne rounded-full blur-3xl opacity-20"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-chablis rounded-full blur-3xl opacity-20"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-grape-seed rounded-full blur-3xl opacity-10"></div>
      </div>

      <div className="relative z-10">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-champagne/20 to-chablis/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-cave mb-6">
              {tFallback('about.hero.title', 'Our Story')}
            </h1>
            <p className="text-xl text-grape-seed max-w-3xl mx-auto mb-8">
              {tFallback('about.hero.subtitle', 'Passionate about bringing the world\'s finest wines to your table')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button to="/pricing" variant="primary" size="lg">
                {tFallback('about.hero.cta', 'Join Our Club')}
              </Button>
              <Button to={'/contact'} variant="secondary" size="lg">
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
              <h2 className="text-3xl md:text-4xl font-bold text-cave mb-6">
                {tFallback('about.story.title', 'Our Mission')}
              </h2>
              <p className="text-lg text-grape-seed mb-6">
                {tFallback('about.story.paragraph1', 'Founded in 2020, our wine club was born from a simple belief: everyone deserves access to exceptional wines. We started with a small group of wine enthusiasts and have grown into a community of thousands of members who share our passion for quality and discovery.')}
              </p>
              <p className="text-lg text-grape-seed mb-6">
                {tFallback('about.story.paragraph2', 'Our team of certified sommeliers and wine experts carefully curates each selection, ensuring that every bottle tells a story and delivers an unforgettable experience. We work directly with winemakers and vineyards around the world to bring you the best wines at the best prices.')}
              </p>
              <p className="text-lg text-grape-seed">
                {tFallback('about.story.paragraph3', 'Whether you\'re a seasoned collector or just beginning your wine journey, we\'re here to guide you every step of the way. Join us in discovering the world\'s most remarkable wines.')}
              </p>
            </div>
            <div className="relative">
              <div 
                className="w-full h-96 rounded-hero bg-gradient-to-br from-champagne to-chablis flex items-center justify-center shadow-wc"
              >
                <div className="text-cave text-3xl font-bold opacity-80 text-center">
                  Wine<br/>Passion
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-shell">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {_stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-champagne mb-2">
                  {stat.number}
                </div>
                <div className="text-grape-seed font-medium">
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
            <h2 className="text-3xl md:text-4xl font-bold text-cave mb-6">
              {tFallback('about.values.title', 'Our Values')}
            </h2>
            <p className="text-xl text-grape-seed max-w-3xl mx-auto">
              {tFallback('about.values.subtitle', 'The principles that guide everything we do')}
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-champagne rounded-full flex items-center justify-center mx-auto mb-6 shadow-wc">
                <span className="text-2xl text-cave">🍷</span>
              </div>
              <h3 className="text-xl font-bold text-cave mb-4">
                {tFallback('about.values.quality.title', 'Quality First')}
              </h3>
              <p className="text-grape-seed">
                {tFallback('about.values.quality.description', 'We never compromise on quality. Every wine in our collection meets our rigorous standards for taste, character, and craftsmanship.')}
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-champagne rounded-full flex items-center justify-center mx-auto mb-6 shadow-wc">
                <span className="text-2xl text-cave">🌍</span>
              </div>
              <h3 className="text-xl font-bold text-cave mb-4">
                {tFallback('about.values.sustainability.title', 'Sustainability')}
              </h3>
              <p className="text-grape-seed">
                {tFallback('about.values.sustainability.description', 'We partner with wineries that practice sustainable farming and environmentally responsible production methods.')}
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-champagne rounded-full flex items-center justify-center mx-auto mb-6 shadow-wc">
                <span className="text-2xl text-cave">👥</span>
              </div>
              <h3 className="text-xl font-bold text-cave mb-4">
                {tFallback('about.values.community.title', 'Community')}
              </h3>
              <p className="text-grape-seed">
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
            <h2 className="text-3xl md:text-4xl font-bold text-cave mb-6">
              {tFallback('about.team.title', 'Meet Our Team')}
            </h2>
            <p className="text-xl text-grape-seed max-w-3xl mx-auto">
              {tFallback('about.team.subtitle', 'The passionate experts behind our wine club')}
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {_teamMembers.map((member, index) => (
              <div key={index} className="bg-shell rounded-card shadow-wc overflow-hidden border border-porcelain">
                <div 
                  className="h-48 bg-cover bg-center"
                  style={{ 
                    backgroundImage: `url(${member.image})`,
                    backgroundColor: member.color 
                  }}
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-cave mb-2">
                    {member.name}
                  </h3>
                  <p className="text-champagne font-medium mb-3">
                    {member.role}
                  </p>
                  <p className="text-grape-seed leading-relaxed">
                    {member.bio}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-cave to-grape-seed">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-ivory mb-6">
            {tFallback('about.cta.title', 'Ready to Start Your Wine Journey?')}
          </h2>
          <p className="text-xl text-champagne mb-8 max-w-2xl mx-auto">
            {tFallback('about.cta.subtitle', 'Join thousands of wine enthusiasts who have discovered their new favorite wines with us')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button to="/pricing" variant="primary" size="lg">
              {tFallback('about.cta.primary', 'Join Our Club')}
            </Button>
            <Button to={'/contact'} variant="secondary" size="lg">
              {tFallback('about.cta.secondary', 'Learn More')}
            </Button>
          </div>
        </div>
      </section>
      </div>
    </div>
  );
} 