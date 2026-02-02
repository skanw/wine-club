import { Link as WaspRouterLink, routes } from 'wasp/client/router';
import { Mail, ArrowLeft } from 'lucide-react';
import { Button } from '../../components/ui/button';

export default function CampagnesMarketingPage() {
  return (
    <div className="min-h-screen bg-[#F4F4F0] py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Button variant="ghost" asChild className="mb-8">
          <WaspRouterLink to={routes.LandingPageRoute.to}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour
          </WaspRouterLink>
        </Button>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-4 bg-vintage-wine/10 rounded-lg">
              <Mail className="h-12 w-12 text-vintage-wine" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-vintage-wine">Campagnes Marketing</h1>
              <p className="text-primary-descriptor text-vintage-wine mt-2">
                SMS et emails automatiques
              </p>
            </div>
          </div>

          <div className="prose max-w-none">
            <h2 className="text-2xl font-semibold text-vintage-wine mt-8 mb-4">Fonctionnalités principales</h2>
            <ul className="space-y-3 text-primary-descriptor text-vintage-wine">
              <li className="flex items-start">
                <span className="text-gold-foil mr-2">✓</span>
                <span>Campagnes email automatisées et personnalisées</span>
              </li>
              <li className="flex items-start">
                <span className="text-gold-foil mr-2">✓</span>
                <span>Envoi de SMS pour notifications importantes</span>
              </li>
              <li className="flex items-start">
                <span className="text-gold-foil mr-2">✓</span>
                <span>Planification et automatisation des envois</span>
              </li>
              <li className="flex items-start">
                <span className="text-gold-foil mr-2">✓</span>
                <span>Suivi des taux d'ouverture et de clic</span>
              </li>
              <li className="flex items-start">
                <span className="text-gold-foil mr-2">✓</span>
                <span>Templates personnalisables</span>
              </li>
            </ul>

            <h2 className="text-2xl font-semibold text-vintage-wine mt-8 mb-4">Avantages</h2>
            <p className="text-primary-descriptor text-vintage-wine">
              Automatisez vos communications avec vos membres. Envoyez des emails et SMS ciblés 
              pour promouvoir vos nouveautés, rappeler les abonnements ou remercier vos clients fidèles.
            </p>
          </div>

          <div className="mt-8">
            <Button size="lg" asChild>
              <WaspRouterLink to={routes.SignupRoute.to}>Commencer maintenant</WaspRouterLink>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}






