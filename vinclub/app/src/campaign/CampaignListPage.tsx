import { useState, useMemo } from 'react';
import { useQuery } from 'wasp/client/operations';
import { getPaginatedCampaigns, getDashboardStats } from 'wasp/client/operations';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Mail, Plus, TrendingUp, Eye, MousePointerClick, DollarSign, Calendar, CheckCircle2, Clock } from 'lucide-react';
import { useQueuedCampaigns } from '../client/hooks/useQueuedItems';
import {
  filterQueuedCampaigns,
  getQueueStatusText,
  getQueueStatusClasses,
  getGhostCardClasses,
  type CampaignDisplayItem,
} from '../client/offline/transformers';
import type { QueuedItem } from '../client/hooks/useQueuedItems';

// Type for merged campaign items (either from server or queued)
type CampaignItem =
  | { isQueued: false; data: CampaignDisplayItem }
  | QueuedItem<CampaignDisplayItem>;

export default function CampaignsPage() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<'draft' | 'scheduled' | 'sending' | 'sent' | 'failed' | undefined>(undefined);
  
  const { data, isLoading } = useQuery(getPaginatedCampaigns, {
    page,
    limit: 20,
    status: statusFilter,
    sort: 'created_at',
    order: 'desc',
  });

  // Get campaign stats from dashboard query
  const { data: statsData } = useQuery(getDashboardStats);

  // Get queued (offline) campaigns
  const { items: queuedCampaigns } = useQueuedCampaigns();

  // Filter queued campaigns by status filter
  const filteredQueuedCampaigns = useMemo(() => {
    return filterQueuedCampaigns(queuedCampaigns, statusFilter);
  }, [queuedCampaigns, statusFilter]);

  // Merge queued campaigns with server data (queued first, only on page 1)
  const mergedCampaigns = useMemo((): CampaignItem[] => {
    const serverItems: CampaignItem[] = (data?.data || []).map((c) => ({
      isQueued: false as const,
      data: {
        id: c.id,
        name: c.name,
        type: c.type,
        status: c.status,
        productName: c.productName,
        productPrice: c.productPrice,
        message: c.message,
        imageUrl: c.imageUrl,
        audience: c.audience,
        channels: c.channels,
        sentCount: c.sentCount,
        deliveredCount: c.deliveredCount,
        openedCount: c.openedCount,
        clickedCount: c.clickedCount,
        createdAt: new Date(c.createdAt),
        sentAt: c.sentAt ? new Date(c.sentAt) : null,
      },
    }));

    // Only show queued items on page 1
    if (page === 1) {
      return [...filteredQueuedCampaigns, ...serverItems];
    }
    return serverItems;
  }, [data, filteredQueuedCampaigns, page]);

  const stats = statsData?.campaigns || { 
    total: 0, 
    sent: 0, 
    draft: 0, 
    totalRevenue: 0, 
    avgOpenRate: 0,
    deliveryRate: 0,
    clickRate: 0,
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'sent':
        return (
          <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3" />
            Envoyée
          </span>
        );
      case 'draft':
        return (
          <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Brouillon
          </span>
        );
      case 'sending':
        return (
          <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
            En cours
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

  const calculateOpenRate = (sent: number, opened: number) => {
    if (sent === 0) return 0;
    return Math.round((opened / sent) * 100 * 100) / 100;
  };

  const calculateClickRate = (sent: number, clicked: number) => {
    if (sent === 0) return 0;
    return Math.round((clicked / sent) * 100 * 100) / 100;
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Header with Stats */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Campagnes</h1>
          <p className="text-muted-foreground mt-1">
            {stats.total} campagne{stats.total > 1 ? 's' : ''} au total
            {queuedCampaigns.length > 0 && (
              <span className="text-yellow-600 dark:text-yellow-400">
                {' '}• {queuedCampaigns.length} en attente
              </span>
            )}
            {' '}• {stats.sent} envoyée{stats.sent > 1 ? 's' : ''}
          </p>
        </div>
        <Link to="/campaigns/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Créer une campagne
          </Button>
        </Link>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Campagnes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              {stats.sent} envoyée{stats.sent > 1 ? 's' : ''} • {stats.draft} brouillon{stats.draft > 1 ? 's' : ''}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Taux de livraison
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.deliveryRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">Messages délivrés</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <MousePointerClick className="h-4 w-4" />
              Taux de clic
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.clickRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">Messages cliqués</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Revenus générés
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€{stats.totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Ventes confirmées</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        <Button
          variant={statusFilter === undefined ? 'default' : 'outline'}
          onClick={() => setStatusFilter(undefined)}
        >
          Toutes
        </Button>
        <Button
          variant={statusFilter === 'sent' ? 'default' : 'outline'}
          onClick={() => setStatusFilter('sent')}
        >
          Envoyées
        </Button>
        <Button
          variant={statusFilter === 'draft' ? 'default' : 'outline'}
          onClick={() => setStatusFilter('draft')}
        >
          Brouillons
        </Button>
        <Button
          variant={statusFilter === 'sending' ? 'default' : 'outline'}
          onClick={() => setStatusFilter('sending')}
        >
          En cours
        </Button>
      </div>

      {/* Campaigns Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
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
      ) : mergedCampaigns.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mergedCampaigns.map((item) => {
            const campaign = item.data;
            const isQueued = item.isQueued;
            const queuedStatus = isQueued ? item.status : null;
            const openRate = calculateOpenRate(campaign.sentCount, campaign.openedCount);
            const clickRate = calculateClickRate(campaign.sentCount, campaign.clickedCount);

            // Queue status badge for queued items
            const getQueuedBadge = () => (
              <span className={`px-2 py-1 text-xs rounded-full flex items-center gap-1 ${getQueueStatusClasses(queuedStatus!)}`}>
                <Clock className="h-3 w-3" />
                {getQueueStatusText(queuedStatus!)}
              </span>
            );

            return (
              <Card
                key={isQueued ? item.queuedId : campaign.id}
                className={`transition-shadow ${
                  isQueued
                    ? getGhostCardClasses(queuedStatus!)
                    : 'hover:shadow-md'
                }`}
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2">
                        {isQueued ? (
                          <span className="text-muted-foreground">{campaign.name}</span>
                        ) : (
                          <Link
                            to={`/campaigns/${campaign.id}`}
                            className="hover:text-primary transition-colors"
                          >
                            {campaign.name}
                          </Link>
                        )}
                      </CardTitle>
                      {isQueued ? getQueuedBadge() : getStatusBadge(campaign.status)}
                    </div>
                    {campaign.imageUrl && !campaign.imageUrl.startsWith('data:') && (
                      <img
                        src={campaign.imageUrl}
                        alt={campaign.productName}
                        className="w-16 h-16 object-cover rounded"
                      />
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="font-medium">{campaign.productName}</p>
                    <p className="text-lg font-bold text-primary">€{campaign.productPrice.toFixed(2)}</p>
                  </div>

                  {!isQueued && campaign.status === 'sent' && campaign.sentCount > 0 && (
                    <div className="grid grid-cols-3 gap-2 pt-2 border-t">
                      <div>
                        <div className="text-xs text-muted-foreground">Envoyés</div>
                        <div className="font-semibold">{campaign.sentCount}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          Ouverture
                        </div>
                        <div className="font-semibold">{openRate}%</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground flex items-center gap-1">
                          <MousePointerClick className="h-3 w-3" />
                          Clics
                        </div>
                        <div className="font-semibold">{clickRate}%</div>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2 border-t">
                    <Calendar className="h-3 w-3" />
                    <span>
                      {isQueued
                        ? item.queuedAt.toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })
                        : campaign.sentAt
                        ? new Date(campaign.sentAt).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })
                        : new Date(campaign.createdAt).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <Mail className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              {statusFilter 
                ? 'Aucune campagne avec ce statut' 
                : (stats.total === 0 && queuedCampaigns.length === 0)
                  ? 'Aucune campagne pour le moment'
                  : 'Aucune campagne trouvée'
              }
            </p>
            {!statusFilter && stats.total === 0 && queuedCampaigns.length === 0 && (
              <Link to="/campaigns/new">
                <Button variant="outline" className="mt-4">
                  <Plus className="h-4 w-4 mr-2" />
                  Créer votre première campagne
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      )}

      {/* Pagination */}
      {data && data.pagination.totalPages > 1 && (
        <div className="flex justify-between items-center mt-6">
          <div className="text-sm text-muted-foreground">
            Page {page} sur {data.pagination.totalPages} • {data.pagination.total} campagne{data.pagination.total > 1 ? 's' : ''}
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

