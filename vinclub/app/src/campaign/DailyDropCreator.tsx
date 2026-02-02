import { useState, useEffect, useRef } from 'react';
import { useQuery } from 'wasp/client/operations';
import { getEvinTemplates } from 'wasp/client/operations';
import { createCampaignOffline, sendCampaignOffline } from '../client/offline/offline-operations';
import { isOnline } from '../client/offline/offline-operations';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { toast } from 'react-hot-toast';
import { Plus, X, Upload, ShieldCheck } from 'lucide-react';

interface Product {
  name: string;
  price: string;
}

export default function DailyDropCreator() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { data: evinTemplates } = useQuery(getEvinTemplates);
  const [loading, setLoading] = useState(false);
  const [online, setOnline] = useState(isOnline());
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([
    { name: '', price: '' }
  ]);
  const [formData, setFormData] = useState({
    name: '',
    message: '',
    imageUrl: '',
    channels: ['sms'] as ('sms' | 'email')[],
    audience: { type: 'all' as const, value: [] },
    sendImmediately: false,
  });

  // Monitor online status
  useEffect(() => {
    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Convert image file to base64
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Veuillez sélectionner un fichier image');
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('L\'image ne doit pas dépasser 5MB');
      return;
    }

    setImageFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setFormData({ ...formData, imageUrl: '' });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const addProduct = () => {
    setProducts([...products, { name: '', price: '' }]);
  };

  const removeProduct = (index: number) => {
    if (products.length > 1) {
      setProducts(products.filter((_, i) => i !== index));
    }
  };

  const updateProduct = (index: number, field: 'name' | 'price', value: string) => {
    const updated = [...products];
    updated[index] = { ...updated[index], [field]: value };
    setProducts(updated);
  };

  const handleSelectTemplate = (template: { id: string; body: string }) => {
    setSelectedTemplateId(template.id);
    setFormData((prev) => ({ ...prev, message: template.body }));
  };

  const handleMessageChange = (value: string) => {
    setFormData((prev) => ({ ...prev, message: value }));
    if (selectedTemplateId) setSelectedTemplateId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate products
      const validProducts = products.filter(p => p.name.trim() && p.price.trim());
      if (validProducts.length === 0) {
        toast.error('Veuillez ajouter au moins un produit');
        setLoading(false);
        return;
      }

      // Convert image to base64 if present
      let imageUrl = formData.imageUrl;
      if (imageFile && imagePreview) {
        imageUrl = imagePreview; // base64 string
      }

      // For backward compatibility, use first product as primary
      const primaryProduct = validProducts[0];
      // Campaign name is required by the server: use form value or default to product-based name
      const campaignName = formData.name.trim() || `Daily Drop - ${primaryProduct.name}`;

      // Prepare campaign data (templateId lets server substitute placeholders when using a template)
      const campaignData = {
        ...formData,
        name: campaignName,
        imageUrl: imageUrl || undefined,
        productName: primaryProduct.name,
        productPrice: parseFloat(primaryProduct.price),
        products: validProducts.map(p => ({
          name: p.name,
          price: parseFloat(p.price),
        })),
        type: 'daily_drop',
        ...(selectedTemplateId && { templateId: selectedTemplateId }),
      };

      const result = await createCampaignOffline(campaignData);

      if (result.queued) {
        toast.success('Campagne mise en file d\'attente. Elle sera créée lorsque la connexion sera rétablie.');
        // Reset form
        setFormData({
          name: '',
          message: '',
          imageUrl: '',
          channels: ['sms'],
          audience: { type: 'all', value: [] },
          sendImmediately: false,
        });
        setSelectedTemplateId(null);
        setProducts([{ name: '', price: '' }]);
        removeImage();
      } else {
        if (formData.sendImmediately && result.data?.id) {
          await sendCampaignOffline({ id: result.data.id });
          toast.success('Campagne créée et envoyée !');
        } else {
          toast.success('Campagne créée !');
        }
        navigate('/campaigns');
      }
    } catch (error: any) {
      toast.error(error.message || 'Échec de la création de la campagne');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Créer une Daily Drop</CardTitle>
          <CardDescription>Envoyez une notification de nouvelle arrivée à vos membres</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Campaign name (optional; defaults to "Daily Drop - [product name]" if empty) */}
            <div>
              <Label htmlFor="campaign-name" className="text-base font-medium mb-2 block">
                Nom de la campagne (optionnel)
              </Label>
              <Input
                id="campaign-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="ex. Arrivage Chablis mars 2025"
                className="max-w-md"
                maxLength={200}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Si vide, un nom sera généré à partir du premier produit.
              </p>
            </div>

            {/* Products Section */}
            <div>
              <Label className="text-base font-medium mb-4 block">Produits *</Label>
              <div className="space-y-4">
                {products.map((product, index) => (
                  <div key={index} className="flex gap-3 items-start p-4 border border-border rounded-lg">
                    <div className="flex-1 space-y-3">
                      <div>
                        <Label htmlFor={`productName-${index}`} className="text-sm">
                          Nom du produit {index > 0 && `#${index + 1}`}
                        </Label>
                        <Input
                          id={`productName-${index}`}
                          value={product.name}
                          onChange={(e) => updateProduct(index, 'name', e.target.value)}
                          required={index === 0}
                          placeholder="Chablis 2022"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`productPrice-${index}`} className="text-sm">
                          Prix (EUR)
                        </Label>
                        <Input
                          id={`productPrice-${index}`}
                          type="number"
                          step="0.01"
                          value={product.price}
                          onChange={(e) => updateProduct(index, 'price', e.target.value)}
                          required={index === 0}
                          placeholder="24.00"
                          className="mt-1"
                        />
                      </div>
                    </div>
                    {products.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeProduct(index)}
                        className="mt-6"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={addProduct}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter un produit
                </Button>
              </div>
            </div>

            {/* Loi Evin template selector */}
            {evinTemplates && evinTemplates.length > 0 && (
              <div>
                <Label className="text-base font-medium mb-2 block">
                  Modèle conforme Loi Evin
                </Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                  {evinTemplates.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => handleSelectTemplate(t)}
                      className={`text-left p-3 rounded-lg border transition-colors ${
                        selectedTemplateId === t.id
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <span className="font-medium text-sm text-foreground">{t.name}</span>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{t.body}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Message Section */}
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <Label htmlFor="message">Message *</Label>
                {selectedTemplateId && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-green-500/10 text-green-700 dark:text-green-400">
                    <ShieldCheck className="h-3 w-3" />
                    Conforme Loi Evin
                  </span>
                )}
              </div>
              <Textarea
                id="message"
                value={formData.message}
                onChange={(e) => handleMessageChange(e.target.value)}
                required
                maxLength={500}
                placeholder="Fraîcheur et élégance, tout juste arrivé !"
                rows={4}
                className="mt-1"
              />
              <p className="text-sm text-muted-foreground mt-1">
                {formData.message.length}/500 caractères
              </p>
            </div>

            {/* Optional Image Upload */}
            <div>
              <Label className="text-base font-medium mb-2 block">
                Image (optionnel)
              </Label>
              <p className="text-xs text-amber-600 dark:text-amber-500 mb-2">
                Loi Evin : n&apos;utilisez que des images factuelles (produit, cave). Pas de succès social ou attrait sexuel.
              </p>
              {!imagePreview ? (
                <div className="mt-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                    id="image-upload"
                  />
                  <Label
                    htmlFor="image-upload"
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                      <p className="mb-2 text-sm text-muted-foreground">
                        <span className="font-semibold">Cliquez pour télécharger</span> ou glissez-déposez
                      </p>
                      <p className="text-xs text-muted-foreground">PNG, JPG, WEBP jusqu'à 5MB</p>
                    </div>
                  </Label>
                </div>
              ) : (
                <div className="mt-2 relative">
                  <div className="relative w-full h-48 rounded-lg overflow-hidden border border-border">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={removeImage}
                      className="absolute top-2 right-2"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Image sélectionnée. Cliquez sur X pour supprimer.
                  </p>
                </div>
              )}
            </div>

            {/* Offline Warning */}
            {!online && (
              <div className="rounded-md bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-3">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  ⚠️ Mode hors ligne : La campagne sera créée lorsque la connexion sera rétablie.
                  {imagePreview && imagePreview.startsWith('data:image/') && (
                    <span className="block mt-1">📷 L'image sera téléchargée lors de la synchronisation.</span>
                  )}
                </p>
              </div>
            )}

            {/* Submit Buttons */}
            <div className="flex gap-2 pt-4">
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? 'Création...' : online ? 'Créer la campagne' : 'Mettre en file d\'attente'}
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate('/campaigns')}>
                Annuler
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
