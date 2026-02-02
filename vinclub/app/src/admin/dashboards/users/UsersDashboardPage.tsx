import { useState } from 'react';
import { type AuthUser } from 'wasp/auth';
import { getCavisteHealthScores, useQuery } from 'wasp/client/operations';
import DefaultLayout from '../../layout/DefaultLayout';

const CavistesPage = ({ user }: { user: AuthUser }) => {
  const [page, setPage] = useState(0);
  const { data, isLoading, error } = useQuery(getCavisteHealthScores, { page, pageSize: 10 });

  // Format relative time
  const formatRelativeTime = (date: Date | null) => {
    if (!date) return 'Jamais';
    
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (hours < 1) return 'À l\'instant';
    if (hours < 24) return `${hours}h`;
    if (days < 7) return `${days}j`;
    return `${Math.floor(days / 7)}sem`;
  };

  // Get health score color
  const getHealthColor = (score: number) => {
    if (score >= 70) return 'bg-green-500';
    if (score >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  // Get health score dots
  const getHealthDots = (score: number) => {
    const dots = Math.ceil(score / 25);
    return Array(4).fill(0).map((_, i) => (
      <span
        key={i}
        className={`w-1.5 h-1.5 rounded-full ${
          i < dots ? getHealthColor(score) : 'bg-muted-foreground/20'
        }`}
      />
    ));
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
            Cavistes
          </h1>
          <p className='mt-2 text-sm font-light text-muted-foreground'>
            {data?.totalCount || 0} caves enregistrées sur la plateforme
          </p>
        </div>

        {/* Summary Stats */}
        <div className='grid grid-cols-3 gap-8 mb-12'>
          <div>
            <p className='text-xs font-light tracking-[0.2em] uppercase text-muted-foreground mb-2'>
              Total Caves
            </p>
            <p className='text-3xl font-light text-foreground'>
              {data?.totalCount || 0}
            </p>
          </div>
          <div>
            <p className='text-xs font-light tracking-[0.2em] uppercase text-muted-foreground mb-2'>
              Score Moyen
            </p>
            <p className='text-3xl font-light text-foreground'>
              {data?.cavistes && data.cavistes.length > 0
                ? Math.round(data.cavistes.reduce((sum, c) => sum + c.healthScore, 0) / data.cavistes.length)
                : 0}
            </p>
          </div>
          <div>
            <p className='text-xs font-light tracking-[0.2em] uppercase text-muted-foreground mb-2'>
              Actives (30j)
            </p>
            <p className='text-3xl font-light text-foreground'>
              {data?.cavistes?.filter(c => c.campaignsLast30Days > 0).length || 0}
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className='border-t border-border/30 mb-8' />

        {/* Table Header */}
        <div className='grid grid-cols-12 gap-4 px-4 py-3 text-xs font-light tracking-[0.15em] uppercase text-muted-foreground/70'>
          <div className='col-span-4'>Cave</div>
          <div className='col-span-2 text-center'>Santé</div>
          <div className='col-span-2 text-center'>Membres</div>
          <div className='col-span-2 text-center'>SMS</div>
          <div className='col-span-2 text-right'>Dernier Drop</div>
        </div>

        {/* Table Body */}
        {isLoading ? (
          <div className='py-16 flex justify-center'>
            <div className='w-6 h-6 border-2 border-muted-foreground/20 border-t-muted-foreground rounded-full animate-spin' />
          </div>
        ) : (
          <div className='divide-y divide-border/30'>
            {data?.cavistes.map((caviste) => (
              <div
                key={caviste.id}
                className='grid grid-cols-12 gap-4 px-4 py-5 hover:bg-accent/30 transition-colors rounded-lg'
              >
                {/* Cave Name */}
                <div className='col-span-4'>
                  <p className='font-medium text-foreground'>{caviste.name}</p>
                  <p className='text-xs font-light text-muted-foreground mt-0.5'>
                    {caviste.subscriberCount} abonnés
                  </p>
                </div>

                {/* Health Score */}
                <div className='col-span-2 flex items-center justify-center gap-1'>
                  {getHealthDots(caviste.healthScore)}
                  <span className='ml-2 text-sm font-light text-muted-foreground'>
                    {caviste.healthScore}
                  </span>
                </div>

                {/* Members */}
                <div className='col-span-2 flex items-center justify-center'>
                  <span className='text-sm font-light text-foreground'>
                    {caviste.memberCount}
                  </span>
                </div>

                {/* SMS Credits */}
                <div className='col-span-2 flex items-center justify-center'>
                  <span className='text-sm font-light text-muted-foreground'>
                    {caviste.smsCreditsUsed}
                  </span>
                </div>

                {/* Last Drop */}
                <div className='col-span-2 flex items-center justify-end'>
                  <span className={`text-sm font-light ${
                    caviste.lastCampaignDate ? 'text-foreground' : 'text-muted-foreground'
                  }`}>
                    {formatRelativeTime(caviste.lastCampaignDate)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && (!data?.cavistes || data.cavistes.length === 0) && (
          <div className='py-16 text-center'>
            <p className='text-sm font-light text-muted-foreground'>
              Aucune cave enregistrée
            </p>
          </div>
        )}

        {/* Pagination */}
        {data && data.totalPages > 1 && (
          <div className='mt-8 flex items-center justify-center gap-4'>
            <button
              onClick={() => setPage(Math.max(0, page - 1))}
              disabled={page === 0}
              className='px-4 py-2 text-sm font-light text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-colors'
            >
              Précédent
            </button>
            <span className='text-sm font-light text-muted-foreground'>
              Page {page + 1} / {data.totalPages}
            </span>
            <button
              onClick={() => setPage(Math.min(data.totalPages - 1, page + 1))}
              disabled={page >= data.totalPages - 1}
              className='px-4 py-2 text-sm font-light text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-colors'
            >
              Suivant
            </button>
          </div>
        )}
      </div>
    </DefaultLayout>
  );
};

export default CavistesPage;
