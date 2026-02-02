import { useState, useMemo } from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { Link as WaspRouterLink, routes } from 'wasp/client/router';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { DollarSign, TrendingUp, Calendar, ArrowLeft } from 'lucide-react';
import Footer from './components/Footer';
import { footerNavigation } from './contentSections';

export default function RevenueCalculatorPage() {
  const [customers, setCustomers] = useState(0);
  const [bottlePrice, setBottlePrice] = useState(25);
  const [monthlyRent, setMonthlyRent] = useState(1500);

  // Transform slider position (0-100) to actual customer count (0-5000)
  const positionToCustomers = (position: number): number => {
    if (position <= 50) {
      return Math.round(position * 20);
    } else {
      return 1000 + Math.round((position - 50) * 80);
    }
  };

  // Transform customer count to slider position
  const customersToPosition = (count: number): number => {
    if (count <= 1000) {
      return count / 20;
    } else {
      return 50 + (count - 1000) / 80;
    }
  };

  // Handle slider change with non-linear mapping
  const handleCustomerSliderChange = (value: number | number[]) => {
    const position = Array.isArray(value) ? value[0] : value;
    const actualCustomers = positionToCustomers(position);
    setCustomers(actualCustomers);
  };

  // Current slider position based on customer count
  const sliderPosition = useMemo(() => customersToPosition(customers), [customers]);

  // Calculations
  const flashSaleRevenue = useMemo(() => Math.round(customers * 0.15 * bottlePrice), [customers, bottlePrice]);
  const subscriptionBase = useMemo(() => Math.round(customers * 0.05 * 29), [customers]);
  const rentCoveragePercent = useMemo(() => {
    if (monthlyRent > 0) {
      return Math.round((flashSaleRevenue / monthlyRent) * 100);
    }
    return 0;
  }, [flashSaleRevenue, monthlyRent]);

  return (
    <div className='bg-background text-foreground min-h-screen'>
      {/* Header */}
      <header className='bg-muted/30 border-b border-border'>
        <div className='mx-auto max-w-7xl px-6 lg:px-8 py-4'>
          <WaspRouterLink to={routes.LandingPageRoute.to} className='inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors'>
            <ArrowLeft className='h-4 w-4' />
            <span>Retour à l'accueil</span>
          </WaspRouterLink>
        </div>
      </header>

      <main className='py-16 sm:py-24'>
        <div className='mx-auto max-w-7xl px-6 lg:px-8'>
          {/* Page Header */}
          <div className='mx-auto max-w-3xl text-center mb-12'>
            <h1 className='text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-4'>
              Le Calculateur "Tueur de Loyer"
            </h1>
            <p className='text-lg text-muted-foreground'>
              Découvrez combien vous pourriez générer avec VinClub. Ajustez les valeurs selon votre situation.
            </p>
          </div>

          <div className='max-w-4xl mx-auto'>
            <Card className='p-8'>
              <CardContent className='space-y-8'>
                {/* Slider 1: Active Customers */}
                <div className='space-y-4'>
                  <div className='flex justify-between items-center'>
                    <Label htmlFor="customers" className='text-lg font-semibold'>
                      Clients Actifs
                    </Label>
                    <span className='text-2xl font-bold text-primary'>{customers.toLocaleString()}</span>
                  </div>
                  <Slider
                    min={0}
                    max={100}
                    step={1}
                    value={sliderPosition}
                    onChange={handleCustomerSliderChange}
                    marks={{
                      0: '0',
                      50: '1000',
                      100: '5000',
                    }}
                    trackStyle={{ backgroundColor: '#7C2D12', height: 6 }}
                    handleStyle={{
                      borderColor: '#7C2D12',
                      height: 24,
                      width: 24,
                      marginLeft: 0,
                      marginTop: -9,
                      backgroundColor: '#7C2D12',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                    }}
                    railStyle={{ backgroundColor: '#F4F4F0', height: 6 }}
                    dotStyle={{
                      display: 'none',
                    }}
                    activeDotStyle={{
                      display: 'none',
                    }}
                  />
                  <p className='text-sm text-muted-foreground'>
                    Nombre de clients dans votre base de données
                  </p>
                </div>

                {/* Slider 2: Average Bottle Price */}
                <div className='space-y-4'>
                  <div className='flex justify-between items-center'>
                    <Label htmlFor="price" className='text-lg font-semibold'>
                      Prix Moyen d'une Bouteille
                    </Label>
                    <span className='text-2xl font-bold text-primary'>€{bottlePrice}</span>
                  </div>
                  <Slider
                    min={10}
                    max={100}
                    step={5}
                    value={bottlePrice}
                    onChange={(value) => setBottlePrice(Array.isArray(value) ? value[0] : value)}
                    trackStyle={{ backgroundColor: '#7C2D12', height: 6 }}
                    handleStyle={{
                      borderColor: '#7C2D12',
                      height: 24,
                      width: 24,
                      marginLeft: -12,
                      marginTop: -9,
                      backgroundColor: '#7C2D12',
                    }}
                    railStyle={{ backgroundColor: '#F4F4F0', height: 6 }}
                  />
                  <p className='text-sm text-muted-foreground'>
                    Prix moyen d'une bouteille que vous vendez
                  </p>
                </div>

                {/* Input: Monthly Rent */}
                <div className='space-y-4'>
                  <Label htmlFor="rent" className='text-lg font-semibold'>
                    Loyer Mensuel (€)
                  </Label>
                  <Input
                    id="rent"
                    type="number"
                    min="0"
                    step="50"
                    value={monthlyRent}
                    onChange={(e) => setMonthlyRent(parseInt(e.target.value) || 0)}
                    className='text-lg'
                  />
                  <p className='text-sm text-muted-foreground'>
                    Votre loyer mensuel ou charges fixes principales
                  </p>
                </div>

                {/* Results */}
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6 pt-8 border-t border-border'>
                  {/* Flash Sale Result */}
                  <div className='bg-green-50 dark:bg-green-950/20 rounded-lg p-6 border-2 border-green-200 dark:border-green-900'>
                    <div className='flex items-center gap-3 mb-3'>
                      <TrendingUp className='h-6 w-6 text-green-600' />
                      <h3 className='text-lg font-semibold text-green-900 dark:text-green-100'>
                        Revenu Vente Flash
                      </h3>
                    </div>
                    <p className='text-3xl font-bold text-green-700 dark:text-green-300 mb-2'>
                      €{flashSaleRevenue.toLocaleString()}
                    </p>
                    <p className='text-sm text-green-700 dark:text-green-300'>
                      Basé sur 15% de conversion (moyenne conservative)
                    </p>
                  </div>

                  {/* Subscription Result */}
                  <div className='bg-primary/10 rounded-lg p-6 border-2 border-primary/20'>
                    <div className='flex items-center gap-3 mb-3'>
                      <Calendar className='h-6 w-6 text-primary' />
                      <h3 className='text-lg font-semibold text-foreground'>
                        Base Récurrente Mensuelle
                      </h3>
                    </div>
                    <p className='text-3xl font-bold text-primary mb-2'>
                      €{subscriptionBase.toLocaleString()}/mois
                    </p>
                    <p className='text-sm text-muted-foreground'>
                      Basé sur 5% d'abonnés à €29/mois
                    </p>
                  </div>
                </div>

                {/* Rent Coverage */}
                {monthlyRent > 0 && (
                  <div className='bg-amber-50 dark:bg-amber-950/20 rounded-lg p-6 border-2 border-amber-200 dark:border-amber-900'>
                    <div className='flex items-center gap-3 mb-2'>
                      <DollarSign className='h-6 w-6 text-amber-600' />
                      <h3 className='text-lg font-semibold text-amber-900 dark:text-amber-100'>
                        Couverture du Loyer
                      </h3>
                    </div>
                    <p className='text-2xl font-bold text-amber-700 dark:text-amber-300'>
                      Une vente flash couvre {rentCoveragePercent > 100 ? '100' : rentCoveragePercent}% de votre loyer
                    </p>
                    {rentCoveragePercent >= 100 && (
                      <p className='text-sm text-amber-700 dark:text-amber-300 mt-2'>
                        Votre loyer est couvert par une seule vente flash !
                      </p>
                    )}
                    <p className='text-sm text-amber-600 dark:text-amber-400 mt-3'>
                      Votre Revenu Mensuel Sécurisé: €{subscriptionBase.toLocaleString()}/mois
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Disclaimer */}
            <p className='text-sm text-muted-foreground text-center mt-6 italic max-w-2xl mx-auto'>
              Ces chiffres sont basés sur des moyennes conservatrices du retail français. Vos fidèles réguliers convertissent probablement plus haut.
            </p>

            {/* CTA */}
            <div className='mt-12 text-center'>
              <Button size='lg' variant='default' className='min-h-[52px] min-w-[280px] text-lg' asChild>
                <WaspRouterLink to={routes.SignupRoute.to} search={{ concierge: 'true' }}>
                  Démarrer mon essai "Zéro Friction" <span aria-hidden='true' className='ml-2'>→</span>
                </WaspRouterLink>
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer footerNavigation={footerNavigation} />
    </div>
  );
}
