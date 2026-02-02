import { useState } from 'react';
import { type AuthUser } from 'wasp/auth';
import {
  getInventoryTrends,
  getAdminEvinTemplates,
  createEvinTemplate,
  updateEvinTemplate,
  deleteEvinTemplate,
  useQuery,
  useAction,
} from 'wasp/client/operations';
import DefaultLayout from '../../layout/DefaultLayout';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Textarea } from '../../../components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../components/ui/select';
import { Pencil, Trash2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

const TEMPLATE_TYPES = [
  { value: 'arrivage', label: 'Arrivage' },
  { value: 'flash', label: 'Vente Flash' },
  { value: 'box', label: 'Box Mensuelle' },
] as const;

type TemplateType = (typeof TEMPLATE_TYPES)[number]['value'];

interface EvinTemplateRow {
  id: string;
  name: string;
  slug: string;
  body: string;
  type: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const InventoryPage = ({ user }: { user: AuthUser }) => {
  const { data, isLoading, error } = useQuery(getInventoryTrends);
  const { data: templates, isLoading: templatesLoading, refetch: refetchTemplates } = useQuery(getAdminEvinTemplates);
  const createTemplateAction = useAction(createEvinTemplate);
  const updateTemplateAction = useAction(updateEvinTemplate);
  const deleteTemplateAction = useAction(deleteEvinTemplate);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formName, setFormName] = useState('');
  const [formSlug, setFormSlug] = useState('');
  const [formBody, setFormBody] = useState('');
  const [formType, setFormType] = useState<TemplateType>('arrivage');
  const [formIsActive, setFormIsActive] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const openCreate = () => {
    setEditingId(null);
    setFormName('');
    setFormSlug('');
    setFormBody('');
    setFormType('arrivage');
    setFormIsActive(true);
    setModalOpen(true);
  };

  const openEdit = (t: EvinTemplateRow) => {
    setEditingId(t.id);
    setFormName(t.name);
    setFormSlug(t.slug);
    setFormBody(t.body);
    setFormType(t.type as TemplateType);
    setFormIsActive(t.isActive);
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!formName.trim() || !formSlug.trim() || !formBody.trim()) {
      toast.error('Nom, slug et corps sont requis');
      return;
    }
    setSaving(true);
    try {
      if (editingId) {
        await updateTemplateAction({
          id: editingId,
          name: formName.trim(),
          slug: formSlug.trim().toLowerCase().replace(/\s+/g, '_'),
          body: formBody.trim(),
          type: formType,
          isActive: formIsActive,
        });
        toast.success('Template mis à jour');
      } else {
        await createTemplateAction({
          name: formName.trim(),
          slug: formSlug.trim().toLowerCase().replace(/\s+/g, '_'),
          body: formBody.trim(),
          type: formType,
          isActive: formIsActive,
        });
        toast.success('Template créé');
      }
      await refetchTemplates();
      setModalOpen(false);
    } catch (e: any) {
      toast.error(e.message || 'Erreur');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer ce template ?')) return;
    setDeletingId(id);
    try {
      await deleteTemplateAction({ id });
      toast.success('Template supprimé');
      await refetchTemplates();
    } catch (e: any) {
      toast.error(e.message || 'Erreur');
    } finally {
      setDeletingId(null);
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
        <div className='mb-12'>
          <h1 className='text-2xl font-light text-foreground tracking-tight'>
            Inventaire & Tendances
          </h1>
          <p className='mt-2 text-sm font-light text-muted-foreground'>
            Analyse des produits les plus vendus sur la plateforme
          </p>
        </div>

        <div className='grid grid-cols-3 gap-8 mb-12'>
          <div>
            <p className='text-xs font-light tracking-[0.2em] uppercase text-muted-foreground mb-2'>
              Campagnes (30j)
            </p>
            <p className='text-3xl font-light text-foreground'>
              {isLoading ? '—' : data?.totalCampaignsSent || 0}
            </p>
          </div>
          <div>
            <p className='text-xs font-light tracking-[0.2em] uppercase text-muted-foreground mb-2'>
              Rotation Moyenne
            </p>
            <p className='text-3xl font-light text-foreground'>
              {isLoading ? '—' : `${data?.averageRotationDays || 0}j`}
            </p>
          </div>
          <div>
            <p className='text-xs font-light tracking-[0.2em] uppercase text-muted-foreground mb-2'>
              Produits Uniques
            </p>
            <p className='text-3xl font-light text-foreground'>
              {isLoading ? '—' : data?.topPepites?.length || 0}
            </p>
          </div>
        </div>

        <div className='border-t border-border/30 mb-12' />

        <div className='mb-12'>
          <h2 className='text-xs font-light tracking-[0.2em] uppercase text-muted-foreground mb-8'>
            Top Pépites (30 derniers jours)
          </h2>

          {isLoading ? (
            <div className='py-16 flex justify-center'>
              <div className='w-6 h-6 border-2 border-muted-foreground/20 border-t-muted-foreground rounded-full animate-spin' />
            </div>
          ) : data?.topPepites && data.topPepites.length > 0 ? (
            <div className='space-y-1'>
              {data.topPepites.map((product: { productName: string; salesCount: number; averagePrice: number; totalRevenue: number }, index: number) => {
                const maxSales = data.topPepites[0]?.salesCount || 1;
                const barWidth = (product.salesCount / maxSales) * 100;

                return (
                  <div
                    key={product.productName}
                    className='group relative py-4 hover:bg-accent/20 rounded-lg transition-colors'
                  >
                    <div
                      className='absolute inset-y-0 left-0 bg-accent/30 rounded-lg transition-all duration-500'
                      style={{ width: `${barWidth}%` }}
                    />
                    <div className='relative flex items-center justify-between px-4'>
                      <div className='flex items-center gap-6'>
                        <span className='w-8 text-2xl font-light text-muted-foreground/50'>
                          {index + 1}
                        </span>
                        <div>
                          <p className='font-medium text-foreground'>{product.productName}</p>
                          <p className='text-xs font-light text-muted-foreground mt-0.5'>
                            Prix moyen: {formatCurrency(product.averagePrice)}
                          </p>
                        </div>
                      </div>
                      <div className='flex items-center gap-8'>
                        <div className='text-right'>
                          <p className='text-lg font-light text-foreground'>{product.salesCount}</p>
                          <p className='text-xs font-light text-muted-foreground'>ventes</p>
                        </div>
                        <div className='text-right'>
                          <p className='text-lg font-light text-foreground'>
                            {formatCurrency(product.totalRevenue)}
                          </p>
                          <p className='text-xs font-light text-muted-foreground'>CA</p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className='py-16 text-center'>
              <p className='text-sm font-light text-muted-foreground'>
                Aucune donnée de vente disponible
              </p>
              <p className='text-xs font-light text-muted-foreground/70 mt-2'>
                Les statistiques apparaîtront après les premières campagnes
              </p>
            </div>
          )}
        </div>

        {/* Templates Loi Evin */}
        <div className='border-t border-border/30 pt-12'>
          <h2 className='text-xs font-light tracking-[0.2em] uppercase text-muted-foreground mb-8'>
            Templates Loi Evin
          </h2>

          {templatesLoading ? (
            <div className='py-8 flex justify-center'>
              <div className='w-6 h-6 border-2 border-muted-foreground/20 border-t-muted-foreground rounded-full animate-spin' />
            </div>
          ) : (
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              {templates?.map((t: EvinTemplateRow) => (
                <div
                  key={t.id}
                  className='border border-border/30 rounded-lg p-6 hover:border-border/50 transition-colors flex flex-col'
                >
                  <div className='flex items-start justify-between mb-4'>
                    <div>
                      <p className='font-medium text-foreground'>{t.name}</p>
                      <p className='text-xs font-light text-muted-foreground mt-1'>
                        {TEMPLATE_TYPES.find((x) => x.value === t.type)?.label ?? t.type} · {t.slug}
                      </p>
                    </div>
                    <div className='flex items-center gap-2'>
                      <span
                        className={`px-2 py-1 text-[10px] font-light tracking-wider uppercase rounded ${
                          t.isActive ? 'bg-green-500/10 text-green-600' : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {t.isActive ? 'Actif' : 'Inactif'}
                      </span>
                      <Button
                        type='button'
                        variant='ghost'
                        size='icon'
                        className='h-8 w-8'
                        onClick={() => openEdit(t)}
                      >
                        <Pencil className='h-4 w-4' />
                      </Button>
                      <Button
                        type='button'
                        variant='ghost'
                        size='icon'
                        className='h-8 w-8 text-destructive hover:text-destructive'
                        onClick={() => handleDelete(t.id)}
                        disabled={deletingId === t.id}
                      >
                        <Trash2 className='h-4 w-4' />
                      </Button>
                    </div>
                  </div>
                  <p className='text-sm font-light text-muted-foreground leading-relaxed line-clamp-3 flex-1'>
                    {t.body}
                  </p>
                </div>
              ))}

              <button
                type='button'
                onClick={openCreate}
                className='border border-dashed border-border/50 rounded-lg p-6 flex items-center justify-center text-muted-foreground hover:border-border hover:text-foreground transition-colors cursor-pointer'
              >
                <span className='text-sm font-light'>+ Ajouter un template</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal Create/Edit Template */}
      {modalOpen && (
        <div className='fixed inset-0 z-50 flex items-center justify-center'>
          <div className='absolute inset-0 bg-background/80' onClick={() => setModalOpen(false)} />
          <div className='relative bg-card border border-border rounded-lg shadow-lg p-6 w-full max-w-lg mx-4'>
            <h3 className='text-lg font-medium mb-4'>
              {editingId ? 'Modifier le template' : 'Nouveau template Loi Evin'}
            </h3>
            <div className='space-y-4'>
              <div>
                <Label htmlFor='evin-name'>Nom</Label>
                <Input
                  id='evin-name'
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder='Annonce Arrivage'
                  className='mt-1'
                />
              </div>
              <div>
                <Label htmlFor='evin-slug'>Slug (minuscules, underscores)</Label>
                <Input
                  id='evin-slug'
                  value={formSlug}
                  onChange={(e) => setFormSlug(e.target.value)}
                  placeholder='arrivage'
                  className='mt-1'
                />
              </div>
              <div>
                <Label>Type</Label>
                <Select value={formType} onValueChange={(v) => setFormType(v as TemplateType)}>
                  <SelectTrigger className='mt-1'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TEMPLATE_TYPES.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor='evin-body'>Corps (placeholders: [Nom du vin], [Prix], [Cave], etc.)</Label>
                <Textarea
                  id='evin-body'
                  value={formBody}
                  onChange={(e) => setFormBody(e.target.value)}
                  placeholder='[Nom du vin] - [Prix]€.'
                  rows={4}
                  className='mt-1'
                />
              </div>
              <div className='flex items-center gap-2'>
                <input
                  type='checkbox'
                  id='evin-active'
                  checked={formIsActive}
                  onChange={(e) => setFormIsActive(e.target.checked)}
                  className='rounded border-border'
                />
                <Label htmlFor='evin-active'>Actif (visible pour les cavistes)</Label>
              </div>
            </div>
            <div className='flex justify-end gap-2 mt-6'>
              <Button type='button' variant='outline' onClick={() => setModalOpen(false)}>
                Annuler
              </Button>
              <Button type='button' onClick={handleSave} disabled={saving}>
                {saving ? 'Enregistrement...' : editingId ? 'Mettre à jour' : 'Créer'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </DefaultLayout>
  );
};

export default InventoryPage;
