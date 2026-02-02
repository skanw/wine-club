import { Link as WaspRouterLink, routes } from 'wasp/client/router';
import { Package, ArrowLeft } from 'lucide-react';
import { Button } from '../../components/ui/button';

export default function AbonnementsPage() {
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
              <Package className="h-12 w-12 text-vintage-wine" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-vintage-wine">Abonnements</h1>
              <p className="text-primary-descriptor text-vintage-wine mt-2">
                Box de vin mensuelles
              </p>
            </div>
          </div>

          <div className="prose max-w-none">
            <h2 className="text-2xl font-semibold text-vintage-wine mt-8 mb-4">Fonctionnalités principales</h2>
            <ul className="space-y-3 text-primary-descriptor text-vintage-wine">
              <li className="flex items-start">
                <span className="text-gold-foil mr-2">✓</span>
                <span>Gestion complète des abonnements mensuels</span>
              </li>
              <li className="flex items-start">
                <span className="text-gold-foil mr-2">✓</span>
                <span>Création et personnalisation de box de vin</span>
              </li>
              <li className="flex items-start">
                <span className="text-gold-foil mr-2">✓</span>
                <span>Suivi des expéditions et livraisons</span>
              </li>
              <li className="flex items-start">
                <span className="text-gold-foil mr-2">✓</span>
                <span>Gestion des paiements récurrents</span>
              </li>
              <li className="flex items-start">
                <span className="text-gold-foil mr-2">✓</span>
                <span>Historique des commandes et abonnements</span>
              </li>
            </ul>

            <h2 className="text-2xl font-semibold text-vintage-wine mt-8 mb-4">Avantages</h2>
            <p className="text-primary-descriptor text-vintage-wine">
              Simplifiez la gestion de vos abonnements de box de vin. Créez des offres attractives, 
              gérez les expéditions et offrez une expérience premium à vos abonnés.
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






