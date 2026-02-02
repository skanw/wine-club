import { type AuthUser } from 'wasp/auth';
import { getOperationsStatus, useQuery } from 'wasp/client/operations';
import DefaultLayout from '../../layout/DefaultLayout';

const OperationsPage = ({ user }: { user: AuthUser }) => {
  const { data, isLoading, error } = useQuery(getOperationsStatus);

  // Format relative time
  const formatRelativeTime = (date: Date | null) => {
    if (!date) return 'Jamais';
    
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return 'À l\'instant';
    if (minutes < 60) return `${minutes}min`;
    if (hours < 24) return `${hours}h`;
    return `${days}j`;
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
      case 'sent':
      case 'synced':
        return 'bg-green-500';
      case 'pending':
      case 'queued':
      case 'sending':
        return 'bg-orange-500';
      case 'failed':
        return 'bg-red-500';
      default:
        return 'bg-muted-foreground';
    }
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
            Opérations
          </h1>
          <p className='mt-2 text-sm font-light text-muted-foreground'>
            Monitoring des webhooks, files d'attente et synchronisation
          </p>
        </div>

        {/* Status Cards */}
        <div className='grid grid-cols-3 gap-6 mb-12'>
          {/* Webhooks Status */}
          <div className='border border-border/30 rounded-lg p-6'>
            <div className='flex items-center justify-between mb-4'>
              <p className='text-xs font-light tracking-[0.2em] uppercase text-muted-foreground'>
                Webhooks
              </p>
              <div className='flex items-center gap-2'>
                <span className={`w-2 h-2 rounded-full ${
                  (data?.webhooks.successRate || 100) >= 95 ? 'bg-green-500' : 'bg-orange-500'
                }`} />
                <span className='text-xs font-light text-muted-foreground'>
                  {isLoading ? '—' : `${data?.webhooks.successRate || 100}%`}
                </span>
              </div>
            </div>
            <p className='text-3xl font-light text-foreground'>
              {isLoading ? '—' : data?.webhooks.totalToday || 0}
            </p>
            <p className='text-xs font-light text-muted-foreground mt-1'>
              événements aujourd'hui
            </p>
          </div>

          {/* Message Queue Status */}
          <div className='border border-border/30 rounded-lg p-6'>
            <div className='flex items-center justify-between mb-4'>
              <p className='text-xs font-light tracking-[0.2em] uppercase text-muted-foreground'>
                Queue SMS/Email
              </p>
              <div className='flex items-center gap-2'>
                <span className={`w-2 h-2 rounded-full ${
                  (data?.messageQueue.queued || 0) > 10 ? 'bg-orange-500' : 'bg-green-500'
                }`} />
                <span className='text-xs font-light text-muted-foreground'>
                  {isLoading ? '—' : `${data?.messageQueue.queued || 0} en attente`}
                </span>
              </div>
            </div>
            <p className='text-3xl font-light text-foreground'>
              {isLoading ? '—' : data?.messageQueue.sent || 0}
            </p>
            <p className='text-xs font-light text-muted-foreground mt-1'>
              messages envoyés
            </p>
          </div>

          {/* Sync Status */}
          <div className='border border-border/30 rounded-lg p-6'>
            <div className='flex items-center justify-between mb-4'>
              <p className='text-xs font-light tracking-[0.2em] uppercase text-muted-foreground'>
                Synchronisation
              </p>
              <div className='flex items-center gap-2'>
                <span className={`w-2 h-2 rounded-full ${
                  (data?.syncStatus.pending || 0) > 0 ? 'bg-orange-500 animate-pulse' : 'bg-green-500'
                }`} />
                <span className='text-xs font-light text-muted-foreground'>
                  {isLoading ? '—' : (data?.syncStatus.pending || 0) > 0 
                    ? `${data?.syncStatus.pending} en attente` 
                    : 'Synchronisé'}
                </span>
              </div>
            </div>
            <p className='text-3xl font-light text-foreground'>
              {isLoading ? '—' : data?.syncStatus.synced || 0}
            </p>
            <p className='text-xs font-light text-muted-foreground mt-1'>
              opérations synchronisées
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className='border-t border-border/30 mb-12' />

        {/* Detailed Stats Grid */}
        <div className='grid grid-cols-2 gap-12'>
          {/* Webhook Logs */}
          <div>
            <h2 className='text-xs font-light tracking-[0.2em] uppercase text-muted-foreground mb-6'>
              Webhooks Récents
            </h2>

            {isLoading ? (
              <div className='py-8 flex justify-center'>
                <div className='w-6 h-6 border-2 border-muted-foreground/20 border-t-muted-foreground rounded-full animate-spin' />
              </div>
            ) : data?.webhooks.recent && data.webhooks.recent.length > 0 ? (
              <div className='space-y-3'>
                {data.webhooks.recent.slice(0, 10).map((log) => (
                  <div
                    key={log.id}
                    className='flex items-center justify-between py-2 hover:bg-accent/20 rounded px-2 -mx-2 transition-colors'
                  >
                    <div className='flex items-center gap-3'>
                      <span className={`w-1.5 h-1.5 rounded-full ${getStatusColor(log.status)}`} />
                      <div>
                        <p className='text-sm font-medium text-foreground'>
                          {log.provider}
                        </p>
                        <p className='text-xs font-light text-muted-foreground'>
                          {log.eventType}
                        </p>
                      </div>
                    </div>
                    <span className='text-xs font-light text-muted-foreground'>
                      {formatRelativeTime(log.createdAt)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className='text-sm font-light text-muted-foreground text-center py-8'>
                Aucun webhook récent
              </p>
            )}
          </div>

          {/* Queue Breakdown */}
          <div>
            <h2 className='text-xs font-light tracking-[0.2em] uppercase text-muted-foreground mb-6'>
              File d'Attente
            </h2>

            {isLoading ? (
              <div className='py-8 flex justify-center'>
                <div className='w-6 h-6 border-2 border-muted-foreground/20 border-t-muted-foreground rounded-full animate-spin' />
              </div>
            ) : (
              <div className='space-y-4'>
                {/* Queue Stats */}
                <div className='space-y-3'>
                  <div className='flex items-center justify-between py-2'>
                    <div className='flex items-center gap-3'>
                      <span className='w-1.5 h-1.5 rounded-full bg-orange-500' />
                      <span className='text-sm text-foreground'>En attente</span>
                    </div>
                    <span className='text-sm font-medium text-foreground'>
                      {data?.messageQueue.queued || 0}
                    </span>
                  </div>

                  <div className='flex items-center justify-between py-2'>
                    <div className='flex items-center gap-3'>
                      <span className='w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse' />
                      <span className='text-sm text-foreground'>En cours d'envoi</span>
                    </div>
                    <span className='text-sm font-medium text-foreground'>
                      {data?.messageQueue.sending || 0}
                    </span>
                  </div>

                  <div className='flex items-center justify-between py-2'>
                    <div className='flex items-center gap-3'>
                      <span className='w-1.5 h-1.5 rounded-full bg-green-500' />
                      <span className='text-sm text-foreground'>Envoyés</span>
                    </div>
                    <span className='text-sm font-medium text-foreground'>
                      {data?.messageQueue.sent || 0}
                    </span>
                  </div>

                  <div className='flex items-center justify-between py-2'>
                    <div className='flex items-center gap-3'>
                      <span className='w-1.5 h-1.5 rounded-full bg-red-500' />
                      <span className='text-sm text-foreground'>Échoués</span>
                    </div>
                    <span className='text-sm font-medium text-foreground'>
                      {data?.messageQueue.failed || 0}
                    </span>
                  </div>
                </div>

                {/* Divider */}
                <div className='border-t border-border/30 my-6' />

                {/* Sync Status */}
                <h3 className='text-xs font-light tracking-[0.2em] uppercase text-muted-foreground mb-4'>
                  Synchronisation Offline
                </h3>

                <div className='space-y-3'>
                  <div className='flex items-center justify-between py-2'>
                    <div className='flex items-center gap-3'>
                      <span className='w-1.5 h-1.5 rounded-full bg-orange-500' />
                      <span className='text-sm text-foreground'>En attente</span>
                    </div>
                    <span className='text-sm font-medium text-foreground'>
                      {data?.syncStatus.pending || 0}
                    </span>
                  </div>

                  <div className='flex items-center justify-between py-2'>
                    <div className='flex items-center gap-3'>
                      <span className='w-1.5 h-1.5 rounded-full bg-green-500' />
                      <span className='text-sm text-foreground'>Synchronisés</span>
                    </div>
                    <span className='text-sm font-medium text-foreground'>
                      {data?.syncStatus.synced || 0}
                    </span>
                  </div>

                  <div className='flex items-center justify-between py-2'>
                    <div className='flex items-center gap-3'>
                      <span className='w-1.5 h-1.5 rounded-full bg-red-500' />
                      <span className='text-sm text-foreground'>Échoués</span>
                    </div>
                    <span className='text-sm font-medium text-foreground'>
                      {data?.syncStatus.failed || 0}
                    </span>
                  </div>
                </div>

                {/* Last Sync */}
                {data?.syncStatus.lastSyncAt && (
                  <p className='text-xs font-light text-muted-foreground mt-4'>
                    Dernière synchronisation: {formatRelativeTime(data.syncStatus.lastSyncAt)}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* System Health Footer */}
        <div className='border-t border-border/30 mt-12 pt-8'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-6'>
              <div className='flex items-center gap-2'>
                <span className='w-2 h-2 rounded-full bg-green-500' />
                <span className='text-sm font-light text-muted-foreground'>Stripe</span>
              </div>
              <div className='flex items-center gap-2'>
                <span className='w-2 h-2 rounded-full bg-green-500' />
                <span className='text-sm font-light text-muted-foreground'>Twilio</span>
              </div>
              <div className='flex items-center gap-2'>
                <span className='w-2 h-2 rounded-full bg-green-500' />
                <span className='text-sm font-light text-muted-foreground'>Base de données</span>
              </div>
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

export default OperationsPage;
