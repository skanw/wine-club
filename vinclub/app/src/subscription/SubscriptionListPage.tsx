import { useState } from 'react';
import { useQuery } from 'wasp/client/operations';
import { getPaginatedSubscriptions, getDashboardStats } from 'wasp/client/operations';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { Package, DollarSign, Users, CheckCircle2, Pause, XCircle, Calendar } from 'lucide-react';

// Helper function to get initials from name
function getInitials(name: string): string {
  const parts = name.trim().split(' ');
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
}

export default function SubscriptionsPage() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<'active' | 'paused' | 'cancelled' | 'past_due' | undefined>(undefined);

  const { data, isLoading } = useQuery(getPaginatedSubscriptions, {
    page,
    limit: 20,
    status: statusFilter,
    sort: 'created_at',
    order: 'desc',
  });

  // Get subscription stats from dashboard query
  const { data: statsData } = useQuery(getDashboardStats);
  const stats = statsData?.subscriptions || {
    total: 0,
    active: 0,
    paused: 0,
    cancelled: 0,
    monthlyRecurringRevenue: 0,
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3" />
            Actif
          </span>
        );
      case 'paused':
        return (
          <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full flex items-center gap-1">
            <Pause className="h-3 w-3" />
            En pause
          </span>
        );
      case 'cancelled':
        return (
          <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full flex items-center gap-1">
            <XCircle className="h-3 w-3" />
            Annulé
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 text-xs bg-muted rounded-full">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Header with Stats */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Abonnements</h1>
          <p className="text-muted-foreground mt-1">
            {stats.total} abonnement{stats.total > 1 ? 's' : ''} au total • {stats.active} actif{stats.active > 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Package className="h-4 w-4" />
              Total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Actifs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Pause className="h-4 w-4" />
              En pause
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.paused}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Revenus récurrents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              €{stats.monthlyRecurringRevenue.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Par mois</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        <Button
          variant={statusFilter === undefined ? 'default' : 'outline'}
          onClick={() => setStatusFilter(undefined)}
        >
          Tous
        </Button>
        <Button
          variant={statusFilter === 'active' ? 'default' : 'outline'}
          onClick={() => setStatusFilter('active')}
        >
          Actifs
        </Button>
        <Button
          variant={statusFilter === 'paused' ? 'default' : 'outline'}
          onClick={() => setStatusFilter('paused')}
        >
          En pause
        </Button>
        <Button
          variant={statusFilter === 'cancelled' ? 'default' : 'outline'}
          onClick={() => setStatusFilter('cancelled')}
        >
          Annulés
        </Button>
      </div>

      {/* Subscriptions Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : data && data.data.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.data.map((subscription) => (
            <Card key={subscription.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {getInitials(subscription.memberName)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg">
                      <Link
                        to={`/members/${subscription.memberId}`}
                        className="hover:text-primary transition-colors"
                      >
                        {subscription.memberName}
                      </Link>
                    </CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  {getStatusBadge(subscription.status)}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Plan</p>
                  <p className="font-medium">{subscription.planName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Montant</p>
                  <p className="text-xl font-bold text-primary">
                    €{subscription.amount.toFixed(2)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {subscription.billingCycle === 'monthly'
                      ? 'Par mois'
                      : subscription.billingCycle === 'quarterly'
                        ? 'Par trimestre'
                        : subscription.billingCycle === 'yearly'
                          ? 'Par an'
                          : subscription.billingCycle}
                  </p>
                </div>
                {subscription.nextBillingDate && subscription.status === 'active' && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground pt-2 border-t">
                    <Calendar className="h-4 w-4" />
                    <span>
                      Prochain paiement :{' '}
                      {new Date(subscription.nextBillingDate).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              {statusFilter ? 'Aucun abonnement avec ce statut' : 'Aucun abonnement pour le moment'}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Pagination */}
      {data && data.pagination.totalPages > 1 && (
        <div className="flex justify-between items-center mt-6">
          <div className="text-sm text-muted-foreground">
            Page {page} sur {data.pagination.totalPages} • {data.pagination.total} abonnement{data.pagination.total > 1 ? 's' : ''}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              Précédent
            </Button>
            <Button
              variant="outline"
              disabled={page >= data.pagination.totalPages}
              onClick={() => setPage(page + 1)}
            >
              Suivant
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

