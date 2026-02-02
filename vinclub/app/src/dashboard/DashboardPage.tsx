import { useQuery } from 'wasp/client/operations';
import { getDashboardStats, getCave } from 'wasp/client/operations';
import { Link } from 'react-router-dom';
import { Camera, UserPlus } from 'lucide-react';
import { useOfflineStatus } from '../client/hooks/useOfflineStatus';

export default function DashboardPage() {
  const { data, isLoading, error } = useQuery(getDashboardStats);
  const { data: cave } = useQuery(getCave);
  const { isOnline, queuedCount, isSyncing } = useOfflineStatus();

  // Format timestamp for activity feed
  const formatTimestamp = (timestamp: Date) => {
    return new Date(timestamp).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Get sync status text and color
  const getSyncStatus = () => {
    if (!isOnline) {
      return { text: 'Hors ligne', color: 'bg-yellow-500' };
    }
    if (isSyncing) {
      return { text: 'Synchro...', color: 'bg-blue-500 animate-pulse' };
    }
    if (queuedCount > 0) {
      return { text: `En attente (${queuedCount})`, color: 'bg-orange-500' };
    }
    return { text: 'Synchronisé', color: 'bg-green-500' };
  };

  const syncStatus = getSyncStatus();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-6 py-16">
          <div className="animate-pulse space-y-12">
            <div className="h-24 bg-muted/30 rounded" />
            <div className="grid grid-cols-2 gap-8 max-w-xl mx-auto">
              <div className="aspect-[4/3] bg-muted/30 rounded" />
              <div className="aspect-[4/3] bg-muted/30 rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-6 py-16">
          <p className="text-sm text-muted-foreground text-center">
            Erreur lors du chargement des statistiques.
          </p>
        </div>
      </div>
    );
  }

  const stats = data!;
  
  // Calculate consent rate (members with at least one consent type)
  const membersWithConsent = Math.max(stats.members.withEmailConsent, stats.members.withSmsConsent);
  const consentRate = stats.members.total > 0 
    ? Math.round((membersWithConsent / stats.members.total) * 100) 
    : 0;

  // Flash sales revenue (using campaign total revenue as proxy for now)
  const flashSalesRevenue = stats.campaigns.totalRevenue || 0;

  return (
    <div className="min-h-screen bg-background relative">
      {/* Sync Status - Subtle Top Right */}
      <div className="absolute top-4 right-6 flex items-center gap-2 text-xs text-muted-foreground">
        <span className={`w-2 h-2 rounded-full ${syncStatus.color}`} />
        <span>{syncStatus.text}</span>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Cave Logo - Minimal */}
        {cave?.logoUrl && (
          <div className="flex justify-center mb-8">
            <img
              src={cave.logoUrl}
              alt={cave.name}
              className="h-12 w-auto object-contain opacity-80"
            />
          </div>
        )}

        {/* ============================================= */}
        {/* 1. THE SCORECARD - Hero Metrics */}
        {/* ============================================= */}
        <section className="py-12 border-b border-border/30">
          <div className="flex items-end justify-between">
            {/* Left: Active Members */}
            <div className="text-left">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">
                Membres Actifs
              </p>
              <p className="text-3xl sm:text-4xl font-light text-foreground">
                {stats.members.total.toLocaleString()}
              </p>
            </div>

            {/* Center: MRR - The North Star (Massive) */}
            <div className="text-center">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">
                Revenus Récurrents
              </p>
              <p className="text-5xl sm:text-6xl lg:text-7xl font-light text-foreground">
                €{stats.subscriptions.monthlyRecurringRevenue.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground mt-2 font-light">par mois</p>
            </div>

            {/* Right: Flash Sales (30 days) */}
            <div className="text-right">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">
                Ventes Flash
              </p>
              <p className="text-3xl sm:text-4xl font-light text-foreground">
                €{flashSalesRevenue.toLocaleString()}
              </p>
            </div>
          </div>
        </section>

        {/* ============================================= */}
        {/* 2. ACTION COMMAND CARDS - Thumb Rule */}
        {/* ============================================= */}
        <section className="py-16">
          <div className="grid grid-cols-2 gap-6 sm:gap-8 max-w-lg mx-auto">
            {/* Card 1: Vendre une pépite (Daily Drop) */}
            <Link to="/campaigns/new" className="group">
              <div className="aspect-[4/3] flex flex-col items-center justify-center border border-border/30 hover:border-foreground/30 transition-all duration-300">
                <Camera className="h-8 w-8 sm:h-10 sm:w-10 text-muted-foreground group-hover:text-foreground transition-colors mb-4" />
                <span className="text-sm font-medium text-foreground">Vendre une pépite</span>
              </div>
            </Link>

            {/* Card 2: Nouveau Membre (Quick-Add) */}
            <Link to="/members/add" className="group">
              <div className="aspect-[4/3] flex flex-col items-center justify-center border border-border/30 hover:border-foreground/30 transition-all duration-300">
                <UserPlus className="h-8 w-8 sm:h-10 sm:w-10 text-muted-foreground group-hover:text-foreground transition-colors mb-4" />
                <span className="text-sm font-medium text-foreground">Nouveau Membre</span>
              </div>
            </Link>
          </div>
        </section>

        {/* ============================================= */}
        {/* 3. LE FLUX - Timeline Activity */}
        {/* ============================================= */}
        <section className="py-12 border-t border-border/30">
          <h2 className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-8">
            Le Flux
          </h2>
          
          {stats.recentActivity.length > 0 ? (
            <div className="relative pl-6 border-l border-border/50 space-y-6">
              {stats.recentActivity.map((activity) => (
                <div key={activity.id} className="relative">
                  {/* Timeline dot */}
                  <div className="absolute -left-[9px] top-1.5 w-[5px] h-[5px] rounded-full bg-border" />
                  
                  {/* Activity content */}
                  <p className="text-sm font-medium text-foreground">{activity.title}</p>
                  <p className="text-xs font-light text-muted-foreground mt-1">
                    {formatTimestamp(activity.timestamp)}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm font-light text-muted-foreground">
              Aucune activité récente
            </p>
          )}
        </section>

        {/* ============================================= */}
        {/* 4. CONFORMITÉ - Compliance Indicator */}
        {/* ============================================= */}
        <section className="py-8 border-t border-border/30">
          <div className="flex items-center justify-between max-w-lg mx-auto">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-1">
                Conformité
              </p>
              <p className="text-sm font-light text-muted-foreground">
                Prêts à recevoir vos campagnes
              </p>
            </div>
            <p className="text-4xl font-light text-foreground">
              {consentRate}%
            </p>
          </div>
        </section>

        {/* ============================================= */}
        {/* 5. SECONDARY STATS - Minimal Footer */}
        {/* ============================================= */}
        <section className="py-8 border-t border-border/30">
          <div className="flex flex-wrap justify-center gap-x-12 gap-y-4 text-center">
            <div>
              <p className="text-2xl font-light text-foreground">{stats.subscriptions.active}</p>
              <p className="text-xs text-muted-foreground mt-1">Abonnements actifs</p>
            </div>
            <div>
              <p className="text-2xl font-light text-foreground">{stats.campaigns.sent}</p>
              <p className="text-xs text-muted-foreground mt-1">Campagnes envoyées</p>
            </div>
            <div>
              <p className="text-2xl font-light text-foreground">{stats.campaigns.avgOpenRate.toFixed(0)}%</p>
              <p className="text-xs text-muted-foreground mt-1">Taux d'ouverture</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
