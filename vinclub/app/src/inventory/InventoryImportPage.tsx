import { useState } from 'react';
import { useAction } from 'wasp/client/operations';
import { analyzeInventoryStructure, importInventoryFromFile } from 'wasp/client/operations';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Progress } from '../components/ui/progress';
import { Checkbox } from '../components/ui/checkbox';
import { toast } from 'react-hot-toast';
import { CheckCircle2, XCircle, AlertCircle, Loader2, Package } from 'lucide-react';

interface SheetMapping {
  sheetName: string;
  columns: {
    name?: string;
    vintage?: string;
    region?: string;
    appellation?: string;
    wineType?: string;
    price?: string;
    stockQuantity?: string;
    description?: string;
  };
  confidence: Record<string, number>;
}

type ImportStep = 'upload' | 'analyzing' | 'mapping' | 'config' | 'importing' | 'results';

export default function InventoryImportPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<ImportStep>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [fileData, setFileData] = useState<string>('');
  const [mappings, setMappings] = useState<SheetMapping[]>([]);
  const [sampleRows, setSampleRows] = useState<Array<{ sheetName: string; rows: Array<Record<string, any>> }>>([]);
  const [selectedSheets, setSelectedSheets] = useState<Set<string>>(new Set());
  const [duplicateHandling, setDuplicateHandling] = useState<'skip' | 'update'>('skip');
  const [importProgress, setImportProgress] = useState(0);
  const [importResults, setImportResults] = useState<{
    successful: number;
    failed: number;
    skipped: number;
    errors: Array<{ row: number; sheet: string; reason: string }>;
  } | null>(null);

  const analyzeStructure = useAction(analyzeInventoryStructure);
  const importInventory = useAction(importInventoryFromFile);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    const ext = selectedFile.name.toLowerCase().split('.').pop();
    if (!['csv', 'xlsx', 'xls'].includes(ext || '')) {
      toast.error('Format de fichier non supporté. Utilisez CSV ou Excel (.xlsx, .xls)');
      return;
    }

    setFile(selectedFile);
    
    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = (event.target?.result as string).split(',')[1];
      setFileData(base64);
      
      setStep('analyzing');
      try {
        const result = await analyzeStructure({
          fileData: base64,
          fileName: selectedFile.name,
        });
        
        setMappings(result.mappings);
        setSampleRows(result.sampleRows);
        
        // Select all sheets by default
        const allSheetNames = new Set(result.mappings.map(m => m.sheetName));
        setSelectedSheets(allSheetNames);
        
        setStep('mapping');
      } catch (error: any) {
        toast.error(`Erreur lors de l'analyse: ${error.message}`);
        setStep('upload');
      }
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleImport = async () => {
    if (!file || !fileData) return;

    setStep('importing');
    setImportProgress(0);

    try {
      const columnMappings = mappings
        .filter(m => selectedSheets.has(m.sheetName))
        .map(m => ({
          sheetName: m.sheetName,
          columns: m.columns,
        }));

      const result = await importInventory({
        fileData,
        fileName: file.name,
        columnMappings,
        selectedSheets: Array.from(selectedSheets),
        duplicateHandling,
      });

      setImportResults(result);
      setStep('results');
      setImportProgress(100);

      if (result.successful > 0) {
        toast.success(`${result.successful} produit(s) importé(s) avec succès`);
      }
      if (result.failed > 0) {
        toast.error(`${result.failed} erreur(s) lors de l'import`);
      }
    } catch (error: any) {
      toast.error(`Erreur lors de l'import: ${error.message}`);
      setStep('config');
    }
  };

  const updateMapping = (sheetName: string, field: string, value: string) => {
    setMappings(mappings.map(m => 
      m.sheetName === sheetName
        ? { ...m, columns: { ...m.columns, [field]: value } }
        : m
    ));
  };

  return (
    <div className="container mx-auto p-4 max-w-6xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Importer l'inventaire</h1>
        <p className="text-muted-foreground mt-1">
          Importez vos produits depuis un fichier CSV ou Excel avec plusieurs feuilles
        </p>
      </div>

      {step === 'upload' && (
        <Card>
          <CardHeader>
            <CardTitle>Étape 1: Sélectionner le fichier</CardTitle>
            <CardDescription>
              Téléchargez un fichier CSV ou Excel (.xlsx, .xls) contenant votre inventaire
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="file">Fichier</Label>
              <Input
                id="file"
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleFileSelect}
                className="mt-2"
              />
              <p className="text-sm text-muted-foreground mt-2">
                Formats acceptés: CSV, Excel (.xlsx, .xls). Les fichiers Excel peuvent contenir plusieurs feuilles.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 'analyzing' && (
        <Card>
          <CardContent className="py-12">
            <div className="flex flex-col items-center justify-center space-y-4">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <p className="text-lg">Analyse de la structure du fichier...</p>
              <p className="text-sm text-muted-foreground">
                Détection automatique des colonnes en cours
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 'mapping' && (
        <Card>
          <CardHeader>
            <CardTitle>Étape 2: Vérification des colonnes</CardTitle>
            <CardDescription>
              Vérifiez que les colonnes ont été correctement détectées pour chaque feuille
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {mappings.map((mapping) => (
              <div key={mapping.sheetName} className="border rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">{mapping.sheetName}</h3>
                  <Checkbox
                    checked={selectedSheets.has(mapping.sheetName)}
                    onCheckedChange={(checked) => {
                      const newSelected = new Set(selectedSheets);
                      if (checked) {
                        newSelected.add(mapping.sheetName);
                      } else {
                        newSelected.delete(mapping.sheetName);
                      }
                      setSelectedSheets(newSelected);
                    }}
                  />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <Label>Nom du vin *</Label>
                    <Input
                      value={mapping.columns.name || ''}
                      onChange={(e) => updateMapping(mapping.sheetName, 'name', e.target.value)}
                      placeholder="Colonne pour le nom"
                    />
                    {mapping.confidence.name && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Confiance: {Math.round(mapping.confidence.name * 100)}%
                      </p>
                    )}
                  </div>
                  <div>
                    <Label>Millésime</Label>
                    <Input
                      value={mapping.columns.vintage || ''}
                      onChange={(e) => updateMapping(mapping.sheetName, 'vintage', e.target.value)}
                      placeholder="Colonne pour le millésime"
                    />
                  </div>
                  <div>
                    <Label>Région</Label>
                    <Input
                      value={mapping.columns.region || ''}
                      onChange={(e) => updateMapping(mapping.sheetName, 'region', e.target.value)}
                      placeholder="Colonne pour la région"
                    />
                  </div>
                  <div>
                    <Label>Appellation</Label>
                    <Input
                      value={mapping.columns.appellation || ''}
                      onChange={(e) => updateMapping(mapping.sheetName, 'appellation', e.target.value)}
                      placeholder="Colonne pour l'appellation"
                    />
                  </div>
                  <div>
                    <Label>Type de vin</Label>
                    <Input
                      value={mapping.columns.wineType || ''}
                      onChange={(e) => updateMapping(mapping.sheetName, 'wineType', e.target.value)}
                      placeholder="Colonne pour le type"
                    />
                  </div>
                  <div>
                    <Label>Prix *</Label>
                    <Input
                      value={mapping.columns.price || ''}
                      onChange={(e) => updateMapping(mapping.sheetName, 'price', e.target.value)}
                      placeholder="Colonne pour le prix"
                    />
                    {mapping.confidence.price && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Confiance: {Math.round(mapping.confidence.price * 100)}%
                      </p>
                    )}
                  </div>
                  <div>
                    <Label>Stock</Label>
                    <Input
                      value={mapping.columns.stockQuantity || ''}
                      onChange={(e) => updateMapping(mapping.sheetName, 'stockQuantity', e.target.value)}
                      placeholder="Colonne pour le stock"
                    />
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Input
                      value={mapping.columns.description || ''}
                      onChange={(e) => updateMapping(mapping.sheetName, 'description', e.target.value)}
                      placeholder="Colonne pour la description"
                    />
                  </div>
                </div>

                {/* Preview for this sheet */}
                {sampleRows.find(s => s.sheetName === mapping.sheetName) && (
                  <div className="mt-4">
                    <Label>Aperçu des données ({mapping.sheetName})</Label>
                    <div className="border rounded-lg mt-2 overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200 text-sm">
                        <thead className="bg-gray-50">
                          <tr>
                            {Object.keys(sampleRows.find(s => s.sheetName === mapping.sheetName)?.rows[0] || {}).map((key) => (
                              <th key={key} className="px-3 py-2 text-left text-xs font-medium text-gray-500">
                                {key}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {sampleRows.find(s => s.sheetName === mapping.sheetName)?.rows.slice(0, 3).map((row, idx) => (
                            <tr key={idx}>
                              {Object.values(row).map((val, valIdx) => (
                                <td key={valIdx} className="px-3 py-2 text-xs">
                                  {String(val || '')}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            ))}

            <div className="flex gap-2">
              <Button 
                onClick={() => setStep('config')} 
                disabled={selectedSheets.size === 0 || mappings.some(m => !m.columns.name || !m.columns.price)}
              >
                Continuer
              </Button>
              <Button variant="outline" onClick={() => setStep('upload')}>
                Retour
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 'config' && (
        <Card>
          <CardHeader>
            <CardTitle>Étape 3: Configuration de l'import</CardTitle>
            <CardDescription>
              Configurez comment gérer les doublons
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Feuilles sélectionnées ({selectedSheets.size})</Label>
              <div className="mt-2 space-y-2">
                {Array.from(selectedSheets).map(sheetName => (
                  <div key={sheetName} className="flex items-center space-x-2 text-sm">
                    <Package className="h-4 w-4" />
                    <span>{sheetName}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label>Gestion des doublons</Label>
              <select
                value={duplicateHandling}
                onChange={(e) => setDuplicateHandling(e.target.value as any)}
                className="w-full mt-2 p-2 border rounded-md"
              >
                <option value="skip">Ignorer les doublons</option>
                <option value="update">Mettre à jour les produits existants</option>
              </select>
              <p className="text-sm text-muted-foreground mt-1">
                Les doublons sont détectés par nom + millésime
              </p>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleImport}>
                Lancer l'import
              </Button>
              <Button variant="outline" onClick={() => setStep('mapping')}>
                Retour
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 'importing' && (
        <Card>
          <CardContent className="py-12">
            <div className="flex flex-col items-center justify-center space-y-4">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <p className="text-lg">Import en cours...</p>
              <Progress value={importProgress} className="w-full max-w-md" />
            </div>
          </CardContent>
        </Card>
      )}

      {step === 'results' && importResults && (
        <Card>
          <CardHeader>
            <CardTitle>Résultats de l'import</CardTitle>
            <CardDescription>
              Résumé de l'importation des produits
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 border rounded-lg">
                <div className="flex items-center justify-center space-x-2 text-green-600">
                  <CheckCircle2 className="h-5 w-5" />
                  <span className="text-2xl font-bold">{importResults.successful}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">Importés</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="flex items-center justify-center space-x-2 text-yellow-600">
                  <AlertCircle className="h-5 w-5" />
                  <span className="text-2xl font-bold">{importResults.skipped}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">Ignorés</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="flex items-center justify-center space-x-2 text-red-600">
                  <XCircle className="h-5 w-5" />
                  <span className="text-2xl font-bold">{importResults.failed}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">Erreurs</p>
              </div>
            </div>

            {importResults.errors.length > 0 && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <div className="mt-2 space-y-1">
                    <p className="font-medium">Erreurs détectées:</p>
                    <ul className="list-disc list-inside text-sm space-y-1 max-h-40 overflow-y-auto">
                      {importResults.errors.slice(0, 10).map((error, idx) => (
                        <li key={idx}>
                          {error.sheet} - Ligne {error.row}: {error.reason}
                        </li>
                      ))}
                      {importResults.errors.length > 10 && (
                        <li className="text-muted-foreground">
                          ... et {importResults.errors.length - 10} autres erreurs
                        </li>
                      )}
                    </ul>
                  </div>
                </AlertDescription>
              </Alert>
            )}

            <div className="flex gap-2">
              <Button onClick={() => navigate('/inventory')}>
                Voir les produits
              </Button>
              <Button variant="outline" onClick={() => {
                setStep('upload');
                setFile(null);
                setFileData('');
                setMappings([]);
                setImportResults(null);
              }}>
                Nouvel import
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
