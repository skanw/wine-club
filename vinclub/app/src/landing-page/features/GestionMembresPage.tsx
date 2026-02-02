import { Link as WaspRouterLink, routes } from 'wasp/client/router';
import { Users, ArrowLeft } from 'lucide-react';
import { Button } from '../../components/ui/button';

export default function GestionMembresPage() {
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
              <Users className="h-12 w-12 text-vintage-wine" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-vintage-wine">Gestion des Membres</h1>
              <p className="text-primary-descriptor text-vintage-wine mt-2">
                Base de données complète de vos clients
              </p>
            </div>
          </div>

          <div className="prose max-w-none">
            <h2 className="text-2xl font-semibold text-vintage-wine mt-8 mb-4">Fonctionnalités principales</h2>
            <ul className="space-y-3 text-primary-descriptor text-vintage-wine">
              <li className="flex items-start">
                <span className="text-gold-foil mr-2">✓</span>
                <span>Base de données centralisée de tous vos membres</span>
              </li>
              <li className="flex items-start">
                <span className="text-gold-foil mr-2">✓</span>
                <span>Historique complet des interactions et commandes</span>
              </li>
              <li className="flex items-start">
                <span className="text-gold-foil mr-2">✓</span>
                <span>Gestion des préférences et profils détaillés</span>
              </li>
              <li className="flex items-start">
                <span className="text-gold-foil mr-2">✓</span>
                <span>Recherche et filtres avancés</span>
              </li>
              <li className="flex items-start">
                <span className="text-gold-foil mr-2">✓</span>
                <span>Export de données pour analyses</span>
              </li>
            </ul>

            <h2 className="text-2xl font-semibold text-vintage-wine mt-8 mb-4">Avantages</h2>
            <p className="text-primary-descriptor text-vintage-wine">
              Avec notre système de gestion des membres, vous avez une vue complète sur votre clientèle. 
              Suivez leurs préférences, leurs commandes passées et leurs interactions pour offrir un service personnalisé.
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






