import { useState, useMemo } from 'react';
import { useQuery } from 'wasp/client/operations';
import { getPaginatedMembers, getDashboardStats } from 'wasp/client/operations';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { Users, Mail, MessageSquare, Plus, Phone, FileSpreadsheet, Clock } from 'lucide-react';
import useDebounce from '../client/hooks/useDebounce';
import { useQueuedMembers } from '../client/hooks/useQueuedItems';
import {
  filterQueuedMembers,
  getQueueStatusText,
  getQueueStatusClasses,
  getGhostCardClasses,
  type MemberDisplayItem,
} from '../client/offline/transformers';
import type { QueuedItem } from '../client/hooks/useQueuedItems';

// Helper function to get initials from name
function getInitials(name: string): string {
  const parts = name.trim().split(' ');
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
}

// Type for merged member items (either from server or queued)
type MemberItem = 
  | { isQueued: false; data: MemberDisplayItem }
  | QueuedItem<MemberDisplayItem>;

export default function MembersPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);
  
  const { data, isLoading } = useQuery(getPaginatedMembers, {
    page,
    limit: 20,
    search: debouncedSearch || undefined,
    sort: 'created_at',
    order: 'desc',
  });

  // Get member stats from dashboard query
  const { data: statsData } = useQuery(getDashboardStats);

  // Get queued (offline) members
  const { items: queuedMembers } = useQueuedMembers();

  // Filter queued members by search term
  const filteredQueuedMembers = useMemo(() => {
    return filterQueuedMembers(queuedMembers, debouncedSearch);
  }, [queuedMembers, debouncedSearch]);

  // Merge queued members with server data (queued first, only on page 1)
  const mergedMembers = useMemo((): MemberItem[] => {
    const serverItems: MemberItem[] = (data?.data || []).map((m) => ({
      isQueued: false as const,
      data: {
        id: m.id,
        name: m.name,
        email: m.email,
        phone: m.phone,
        tags: m.tags || [],
        preferredRegion: m.preferredRegion,
        consentEmail: m.consentEmail,
        consentSms: m.consentSms,
        createdAt: new Date(m.createdAt),
      },
    }));

    // Only show queued items on page 1
    if (page === 1) {
      return [...filteredQueuedMembers, ...serverItems];
    }
    return serverItems;
  }, [data, filteredQueuedMembers, page]);

  const stats = statsData?.members || { total: 0, newThisMonth: 0, withEmailConsent: 0, withSmsConsent: 0 };
  
  // Include queued count in display (but not in stats cards)
  const totalWithQueued = stats.total + queuedMembers.length;

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Header with Stats */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Membres</h1>
          <p className="text-muted-foreground mt-1">
            {stats.total} membre{stats.total > 1 ? 's' : ''} au total
            {queuedMembers.length > 0 && (
              <span className="text-yellow-600 dark:text-yellow-400">
                {' '}• {queuedMembers.length} en attente
              </span>
            )}
            {stats.newThisMonth > 0 && ` • +${stats.newThisMonth} ce mois`}
          </p>
        </div>
        <div className="flex gap-2">
          <Link to="/members/add">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Ajouter un membre
            </Button>
          </Link>
          <Link to="/members/import">
            <Button variant="outline">
              <FileSpreadsheet className="h-4 w-4 mr-2" />
              Importer
            </Button>
          </Link>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4" />
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
              <Users className="h-4 w-4" />
              Nouveaux ce mois
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.newThisMonth}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Consentement Email
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.withEmailConsent}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Consentement SMS
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.withSmsConsent}</div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="mb-4">
        <Input
          placeholder="Rechercher par nom, email ou téléphone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-md"
        />
      </div>

      {/* Members Grid */}
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
      ) : mergedMembers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mergedMembers.map((item) => {
            const member = item.data;
            const isQueued = item.isQueued;
            const queuedStatus = isQueued ? item.status : null;

            return (
              <Card
                key={isQueued ? item.queuedId : member.id}
                className={`transition-shadow ${
                  isQueued
                    ? getGhostCardClasses(queuedStatus!)
                    : 'hover:shadow-md'
                }`}
              >
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback className={`${isQueued ? 'bg-yellow-100 text-yellow-800' : 'bg-primary/10 text-primary'}`}>
                        {getInitials(member.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg">
                        {isQueued ? (
                          <span className="text-muted-foreground">{member.name}</span>
                        ) : (
                          <Link
                            to={`/members/${member.id}`}
                            className="hover:text-primary transition-colors"
                          >
                            {member.name}
                          </Link>
                        )}
                      </CardTitle>
                      {isQueued && (
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded mt-1 ${getQueueStatusClasses(queuedStatus!)}`}>
                          <Clock className="h-3 w-3" />
                          {getQueueStatusText(queuedStatus!)}
                        </span>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    <span>{member.phone}</span>
                  </div>
                  {member.email && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      <span className="truncate">{member.email}</span>
                    </div>
                  )}
                  {member.tags && member.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-2">
                      {member.tags.slice(0, 3).map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 text-xs bg-muted rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                      {member.tags.length > 3 && (
                        <span className="px-2 py-1 text-xs bg-muted rounded-full">
                          +{member.tags.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                  <div className="flex gap-2 pt-2">
                    {member.consentEmail && (
                      <span className="px-2 py-1 text-xs bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 rounded">
                        Email
                      </span>
                    )}
                    {member.consentSms && (
                      <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 rounded">
                        SMS
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : stats.total === 0 && queuedMembers.length === 0 ? (
        // Only show empty state when there are NO members at all
        <Card>
          <CardContent className="py-12 text-center">
            <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              Aucun membre pour le moment
            </p>
            <Link to="/members/add">
              <Button variant="outline" className="mt-4">
                <Plus className="h-4 w-4 mr-2" />
                Ajouter votre premier membre
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        // Show charts when members exist but current view is empty (search/pagination)
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Consent Distribution Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Répartition des consentements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Email</span>
                    <span className="font-medium">{stats.withEmailConsent} / {stats.total}</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full transition-all"
                      style={{ width: `${stats.total > 0 ? (stats.withEmailConsent / stats.total) * 100 : 0}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>SMS</span>
                    <span className="font-medium">{stats.withSmsConsent} / {stats.total}</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all"
                      style={{ width: `${stats.total > 0 ? (stats.withSmsConsent / stats.total) * 100 : 0}%` }}
                    />
                  </div>
                </div>
                <div className="pt-2 border-t text-xs text-muted-foreground">
                  <p>Note: Les membres peuvent avoir les deux consentements</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Growth Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Croissance ce mois</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-4xl font-light mb-2">{stats.newThisMonth}</div>
                  <p className="text-sm text-muted-foreground">Nouveaux membres ce mois</p>
                </div>
                {stats.total > 0 && (
                  <div className="pt-4 border-t">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Progression mensuelle</span>
                      <span className="font-medium">
                        {Math.round((stats.newThisMonth / stats.total) * 100)}%
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-3">
                      <div
                        className="bg-primary h-3 rounded-full transition-all"
                        style={{ width: `${Math.min((stats.newThisMonth / stats.total) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Search Info */}
          {search && (
            <Card className="lg:col-span-2">
              <CardContent className="py-6 text-center">
                <p className="text-muted-foreground mb-2">
                  Aucun membre trouvé pour "{search}"
                </p>
                <p className="text-sm text-muted-foreground">
                  Essayez de modifier vos critères de recherche
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Pagination */}
      {data && data.pagination.totalPages > 1 && (
        <div className="flex justify-between items-center mt-6">
          <div className="text-sm text-muted-foreground">
            Page {page} sur {data.pagination.totalPages} • {data.pagination.total} membre{data.pagination.total > 1 ? 's' : ''}
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

