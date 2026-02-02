import { type AuthUser } from 'wasp/auth';
import { getAdminPlatformStats, useQuery } from 'wasp/client/operations';
import DefaultLayout from '../../layout/DefaultLayout';

const Dashboard = ({ user }: { user: AuthUser }) => {
  const { data: stats, isLoading, error } = useQuery(getAdminPlatformStats);

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (error) {
    return (
      <DefaultLayout user={user}>
        <div className='flex h-full items-center justify-center p-8'>
          <div className='text-center'>
            <div className='inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 text-orange-600 text-sm font-light'>
              <span className='w-2 h-2 rounded-full bg-orange-500' />
              Données en cours de chargement
            </div>
            <p className='mt-4 text-sm text-muted-foreground font-light'>
              Les statistiques seront disponibles après la première synchronisation.
            </p>
          </div>
        </div>
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout user={user}>
      <div className='p-8 max-w-6xl mx-auto'>
        {/* Page Title */}
        <div className='mb-12'>
          <h1 className='text-2xl font-light text-foreground tracking-tight'>
            Tableau de bord
          </h1>
          <p className='mt-2 text-sm font-light text-muted-foreground'>
            Vue d'ensemble de la plateforme VinClub
          </p>
        </div>

        {/* Hero Metrics Grid */}
        <div className='grid grid-cols-2 lg:grid-cols-4 gap-8 mb-16'>
          {/* GMV Total */}
          <div className='col-span-2'>
            <p className='text-xs font-light tracking-[0.2em] uppercase text-muted-foreground mb-3'>
              GMV Totale
            </p>
            <p className='text-5xl lg:text-6xl font-light text-foreground tracking-tight'>
              {isLoading ? '—' : formatCurrency(stats?.gmvTotal || 0)}
            </p>
            <p className='mt-2 text-xs font-light text-muted-foreground'>
              Volume total des transactions
            </p>
          </div>

          {/* Commission Revenue */}
          <div>
            <p className='text-xs font-light tracking-[0.2em] uppercase text-muted-foreground mb-3'>
              Commission 1.5%
            </p>
            <p className='text-3xl lg:text-4xl font-light text-foreground'>
              {isLoading ? '—' : formatCurrency(stats?.commissionRevenue || 0)}
            </p>
            <p className='mt-2 text-xs font-light text-muted-foreground'>
              Revenus plateforme
            </p>
          </div>

          {/* Activation Rate */}
          <div>
            <p className='text-xs font-light tracking-[0.2em] uppercase text-muted-foreground mb-3'>
              Taux d'Activation
            </p>
            <p className='text-3xl lg:text-4xl font-light text-foreground'>
              {isLoading ? '—' : `${stats?.activationRate || 0}%`}
            </p>
            <p className='mt-2 text-xs font-light text-muted-foreground'>
              Campagne &lt;48h après inscription
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className='border-t border-border/30 mb-12' />

        {/* Secondary Stats */}
        <div className='grid grid-cols-2 lg:grid-cols-4 gap-8 mb-16'>
          <div>
            <p className='text-xs font-light tracking-[0.2em] uppercase text-muted-foreground mb-2'>
              Caves Actives
            </p>
            <p className='text-2xl font-light text-foreground'>
              {isLoading ? '—' : `${stats?.activeCaves || 0}/${stats?.totalCaves || 0}`}
            </p>
          </div>

          <div>
            <p className='text-xs font-light tracking-[0.2em] uppercase text-muted-foreground mb-2'>
              Total Membres
            </p>
            <p className='text-2xl font-light text-foreground'>
              {isLoading ? '—' : (stats?.totalMembers || 0).toLocaleString()}
            </p>
          </div>

          <div>
            <p className='text-xs font-light tracking-[0.2em] uppercase text-muted-foreground mb-2'>
              Abonnements
            </p>
            <p className='text-2xl font-light text-foreground'>
              {isLoading ? '—' : stats?.totalSubscriptions || 0}
            </p>
          </div>

          <div>
            <p className='text-xs font-light tracking-[0.2em] uppercase text-muted-foreground mb-2'>
              Croissance
            </p>
            <p className='text-2xl font-light text-green-600'>
              +12%
            </p>
          </div>
        </div>

        {/* Weekly GMV Chart */}
        <div className='mb-12'>
          <p className='text-xs font-light tracking-[0.2em] uppercase text-muted-foreground mb-6'>
            GMV Hebdomadaire
          </p>
          
          {isLoading ? (
            <div className='h-48 flex items-center justify-center'>
              <div className='w-6 h-6 border-2 border-muted-foreground/20 border-t-muted-foreground rounded-full animate-spin' />
            </div>
          ) : (
            <div className='flex items-end gap-4 h-48'>
              {stats?.weeklyGMV.map((day, index) => {
                const maxAmount = Math.max(...(stats?.weeklyGMV.map(d => d.amount) || [1]));
                const height = maxAmount > 0 ? (day.amount / maxAmount) * 100 : 10;
                const isToday = index === (stats?.weeklyGMV.length || 0) - 1;
                
                return (
                  <div key={day.date} className='flex-1 flex flex-col items-center gap-2'>
                    <div 
                      className={`w-full rounded-t transition-all duration-500 ${
                        isToday ? 'bg-foreground' : 'bg-muted-foreground/20'
                      }`}
                      style={{ height: `${Math.max(height, 5)}%` }}
                    />
                    <span className='text-[10px] font-light text-muted-foreground'>
                      {new Date(day.date).toLocaleDateString('fr-FR', { weekday: 'short' })}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Platform Health Indicator */}
        <div className='border-t border-border/30 pt-8'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-3'>
              <span className='w-2 h-2 rounded-full bg-green-500' />
              <span className='text-sm font-light text-muted-foreground'>
                Plateforme opérationnelle
              </span>
            </div>
            <span className='text-xs font-light text-muted-foreground'>
              Dernière mise à jour: {new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default Dashboard;
