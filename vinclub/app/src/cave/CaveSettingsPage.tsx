import { useState, useEffect } from 'react';
import { useQuery, useAction } from 'wasp/client/operations';
import { getCave, updateCave, uploadCaveLogo } from 'wasp/client/operations';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { toast } from 'react-hot-toast';
import { Loader2, Upload, Save } from 'lucide-react';
import { uploadFileWithPresignedUrl } from '../file-upload/fileUploading';

export default function CaveSettingsPage() {
  const { data: cave, isLoading: isLoadingCave } = useQuery(getCave);
  const updateCaveAction = useAction(updateCave);
  const uploadLogoAction = useAction(uploadCaveLogo);

  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  useEffect(() => {
    if (cave) {
      setFormData({
        name: cave.name || '',
        address: cave.address || '',
        phone: cave.phone || '',
        email: cave.email || '',
      });
      setLogoPreview(cave.logoUrl);
    }
  }, [cave]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      await updateCaveAction(formData);
      toast.success('Informations de la cave mises à jour');
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de la mise à jour');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/svg+xml'];
    if (!allowedTypes.includes(file.type.toLowerCase())) {
      toast.error('Type de fichier non supporté. Utilisez JPEG, PNG, WebP ou SVG.');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Le fichier est trop volumineux. Taille maximale: 5MB');
      return;
    }

    setIsUploadingLogo(true);

    try {
      // Get presigned URL
      const { s3UploadUrl, s3UploadFields } = await uploadLogoAction({
        fileName: file.name,
        fileType: file.type,
      });

      // Upload to S3
      await uploadFileWithPresignedUrl({
        file: file as any,
        s3UploadUrl,
        s3UploadFields,
      });

      // Refresh cave data to get new logo URL
      window.location.reload();
      
      toast.success('Logo téléchargé avec succès');
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors du téléchargement du logo');
    } finally {
      setIsUploadingLogo(false);
    }
  };

  if (isLoadingCave) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-3xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Paramètres de la cave</h1>
        <p className="text-muted-foreground mt-1">
          Gérez les informations et le logo de votre cave
        </p>
      </div>

      {/* Logo Upload */}
      <Card>
        <CardHeader>
          <CardTitle>Logo</CardTitle>
          <CardDescription>
            Téléchargez le logo de votre cave (JPEG, PNG, WebP ou SVG, max 5MB)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {logoPreview && (
            <div className="flex items-center space-x-4">
              <img
                src={logoPreview}
                alt="Logo de la cave"
                className="h-24 w-24 object-contain border rounded-lg p-2"
              />
              <div>
                <p className="text-sm font-medium">Logo actuel</p>
                <p className="text-xs text-muted-foreground">
                  Le logo apparaîtra sur votre tableau de bord
                </p>
              </div>
            </div>
          )}

          <div>
            <Label htmlFor="logo-upload">Nouveau logo</Label>
            <Input
              id="logo-upload"
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp,image/svg+xml"
              onChange={handleLogoUpload}
              disabled={isUploadingLogo}
              className="mt-2"
            />
            {isUploadingLogo && (
              <div className="flex items-center space-x-2 mt-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Téléchargement en cours...</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Cave Information */}
      <Card>
        <CardHeader>
          <CardTitle>Informations de la cave</CardTitle>
          <CardDescription>
            Modifiez les informations de votre cave
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <Label htmlFor="name">Nom de la cave *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                placeholder="Ma Cave"
              />
            </div>

            <div>
              <Label htmlFor="address">Adresse</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="123 Rue de la Paix, Paris"
              />
            </div>

            <div>
              <Label htmlFor="phone">Téléphone</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+33123456789"
              />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="contact@macave.fr"
              />
            </div>

            <div className="flex gap-2">
              <Button type="submit" disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Enregistrement...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Enregistrer
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
