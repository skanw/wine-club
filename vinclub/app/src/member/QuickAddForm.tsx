import { useState, useEffect } from 'react';
import { createMemberOffline } from '../client/offline/offline-operations';
import { isOnline } from '../client/offline/offline-operations';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Checkbox } from '../components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { toast } from 'react-hot-toast';

export default function QuickAddForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [online, setOnline] = useState(isOnline());
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    preferredRegion: '',
    tags: [] as string[],
    consentEmail: false,
    consentSms: false,
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

  // Normalize phone number to E.164 format
  const normalizePhone = (phone: string): string => {
    let normalized = phone.trim().replace(/\s+/g, '');
    
    // Remove common formatting
    normalized = normalized.replace(/[().-]/g, '');
    
    // If starts with 0, replace with +33 (France)
    if (normalized.startsWith('0') && normalized.length === 10) {
      normalized = '+33' + normalized.substring(1);
    }
    
    // If doesn't start with +, try to add country code
    if (!normalized.startsWith('+')) {
      // If looks like French number (10 digits), add +33
      if (/^\d{10}$/.test(normalized)) {
        normalized = '+33' + normalized.substring(1);
      } else if (/^\d{9}$/.test(normalized)) {
        // 9 digits, likely French mobile without leading 0
        normalized = '+33' + normalized;
      } else {
        // Try to infer - if it's just digits, assume it needs +
        if (/^\d+$/.test(normalized)) {
          normalized = '+' + normalized;
        }
      }
    }
    
    return normalized;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Normalize phone number before submission
      const normalizedPhone = normalizePhone(formData.phone);
      
      // Validate phone format client-side for better UX
      if (!/^\+[1-9]\d{1,14}$/.test(normalizedPhone)) {
        toast.error('Format de téléphone invalide. Utilisez le format international (ex: +33612345678)');
        setLoading(false);
        return;
      }

      const result = await createMemberOffline({
        ...formData,
        phone: normalizedPhone,
        email: formData.email || null, // Convert empty string to null
        preferredRegion: formData.preferredRegion || null,
        tags: formData.tags,
        sendWelcomeMessage: false,
      });

      if (result.queued) {
        toast.success('Membre en attente de synchronisation. Il sera ajouté lorsque la connexion sera rétablie.');
        // Don't navigate away - let user see the queued status
        // Reset form for next entry
        setFormData({
          name: '',
          email: '',
          phone: '',
          preferredRegion: '',
          tags: [],
          consentEmail: false,
          consentSms: false,
        });
      } else {
      toast.success('Membre ajouté avec succès !');
      navigate('/members');
      }
    } catch (error: any) {
      // Extract error message more reliably from Wasp errors
      let errorMessage = 'Échec de l\'ajout du membre';
      
      if (error?.message) {
        errorMessage = error.message;
      } else if (error?.data?.message) {
        errorMessage = error.data.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      } else if (error?.error?.message) {
        errorMessage = error.error.message;
      }
      
      toast.error(errorMessage);
      console.error('Member creation error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Ajout rapide de membre</CardTitle>
          <CardDescription>Ajoutez un nouveau membre à votre cave</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Nom *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                placeholder="Jean Dupont"
              />
            </div>

            <div>
              <Label htmlFor="phone">Téléphone *</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
                placeholder="+33612345678 ou 0612345678"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Format: international (+33612345678) ou français (0612345678)
              </p>
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="jean@example.com"
              />
            </div>

            <div>
              <Label htmlFor="region">Région préférée</Label>
              <Input
                id="region"
                value={formData.preferredRegion}
                onChange={(e) => setFormData({ ...formData, preferredRegion: e.target.value })}
                placeholder="Bordeaux"
              />
            </div>

            <div className="space-y-2">
              <Label>Consentement *</Label>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="consentEmail"
                  checked={formData.consentEmail}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, consentEmail: checked === true })
                  }
                />
                <Label htmlFor="consentEmail" className="font-normal">
                  Consentement email
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="consentSms"
                  checked={formData.consentSms}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, consentSms: checked === true })
                  }
                />
                <Label htmlFor="consentSms" className="font-normal">
                  Consentement SMS
                </Label>
              </div>
            </div>

            {!online && (
              <div className="rounded-md bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-3 mb-4">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  ⚠️ Mode hors ligne : Le membre sera ajouté lorsque la connexion sera rétablie.
                </p>
              </div>
            )}

            <div className="flex gap-2">
              <Button type="submit" disabled={loading}>
                {loading ? 'Ajout en cours...' : online ? 'Créer le membre' : 'Mettre en file d\'attente'}
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate('/members')}>
                Annuler
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

