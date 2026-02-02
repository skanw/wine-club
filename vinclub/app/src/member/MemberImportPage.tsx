import { useState, useEffect } from 'react';
import { useAction } from 'wasp/client/operations';
import { analyzeMembersStructure, importMembersFromFile } from 'wasp/client/operations';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Progress } from '../components/ui/progress';
import { toast } from 'react-hot-toast';
import { CheckCircle2, XCircle, AlertCircle, Loader2, Upload, X } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';

interface ColumnMapping {
  name?: string;
  email?: string;
  phone?: string;
  region?: string;
  tags?: string;
  consentEmail?: string;
  consentSms?: string;
  notes?: string;
  customFields?: Record<string, string>; // columnName -> customFieldName
  [key: string]: string | Record<string, string> | undefined;
}

type ImportStep = 'upload' | 'analyzing' | 'mapping' | 'config' | 'importing' | 'results';

const STANDARD_FIELDS = [
  { value: '__ignore__', label: '-- Ignorer cette colonne --' },
  { value: 'name', label: 'Nom (requis)' },
  { value: 'phone', label: 'Téléphone (requis)' },
  { value: 'email', label: 'Email' },
  { value: 'region', label: 'Région préférée' },
  { value: 'tags', label: 'Tags' },
  { value: 'consentEmail', label: 'Consentement Email' },
  { value: 'consentSms', label: 'Consentement SMS' },
  { value: 'notes', label: 'Notes' },
  { value: 'custom', label: '→ Champ personnalisé' },
] as const;

export default function MemberImportPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<ImportStep>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [fileData, setFileData] = useState<string>('');
  const [mapping, setMapping] = useState<ColumnMapping>({ customFields: {} });
  const [confidence, setConfidence] = useState<Record<string, number>>({});
  const [sampleRows, setSampleRows] = useState<Array<Record<string, any>>>([]);
  const [allColumns, setAllColumns] = useState<string[]>([]);
  const [customFieldNames, setCustomFieldNames] = useState<Record<string, string>>({});
  const [duplicateHandling, setDuplicateHandling] = useState<'skip' | 'update' | 'create'>('skip');
  const [importProgress, setImportProgress] = useState(0);
  const [importResults, setImportResults] = useState<{
    successful: number;
    failed: number;
    skipped: number;
    errors: Array<{ row: number; reason: string }>;
  } | null>(null);

  const analyzeStructure = useAction(analyzeMembersStructure);
  const importMembers = useAction(importMembersFromFile);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // Validate file type
    const ext = selectedFile.name.toLowerCase().split('.').pop();
    if (!['csv', 'xlsx', 'xls'].includes(ext || '')) {
      toast.error('Format de fichier non supporté. Utilisez CSV ou Excel (.xlsx, .xls)');
      return;
    }

    // Validate file size (50MB max - base64 will be ~33% larger, so ~67MB)
    const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
    if (selectedFile.size > MAX_FILE_SIZE) {
      toast.error(`Fichier trop volumineux. Taille maximale: ${(MAX_FILE_SIZE / 1024 / 1024).toFixed(0)}MB. Votre fichier: ${(selectedFile.size / 1024 / 1024).toFixed(1)}MB`);
      return;
    }

    setFile(selectedFile);
    
    // Read file as base64
    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = (event.target?.result as string).split(',')[1];
      
      // Store full file data for import
      setFileData(base64);
      
      // Auto-analyze structure
      // Note: Server-side parsing uses PapaParse with preview option for efficiency
      setStep('analyzing');
      try {
        const result = await analyzeStructure({
          fileData: base64,
          fileName: selectedFile.name,
        });
        
        // Extract all columns from sample rows
        const columns = new Set<string>();
        result.sampleRows.forEach(row => {
          Object.keys(row).forEach(key => columns.add(key));
        });
        setAllColumns(Array.from(columns));
        
        // Initialize mapping with detected columns
        const initialMapping: ColumnMapping = { customFields: {} };
        const initialCustomNames: Record<string, string> = {};
        
        // Set detected mappings
        Object.entries(result.mapping).forEach(([field, column]) => {
          if (column) {
            initialMapping[field] = column;
          }
        });
        
        // Initialize custom field names for unmapped columns
        columns.forEach(col => {
          const isMapped = Object.values(result.mapping).includes(col);
          if (!isMapped && col) {
            initialCustomNames[col] = col; // Default to column name
          }
        });
        
        setMapping(initialMapping);
        setCustomFieldNames(initialCustomNames);
        setConfidence(result.confidence);
        setSampleRows(result.sampleRows);
        setStep('mapping');
      } catch (error: any) {
        toast.error(`Erreur lors de l'analyse: ${error.message}`);
        setStep('upload');
      }
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleColumnMapping = (columnName: string, fieldValue: string) => {
    const newMapping = { ...mapping };
    
    // Remove column from all standard fields
    Object.keys(newMapping).forEach(key => {
      if (key !== 'customFields' && newMapping[key] === columnName) {
        delete newMapping[key];
      }
    });
    
    if (fieldValue === '__ignore__' || fieldValue === '') {
      // Ignore column - do nothing
    } else if (fieldValue === 'custom') {
      // Map to custom field
      if (!newMapping.customFields) {
        newMapping.customFields = {};
      }
      newMapping.customFields[columnName] = customFieldNames[columnName] || columnName;
    } else {
      // Map to standard field
      newMapping[fieldValue] = columnName;
    }
    
    setMapping(newMapping);
  };

  const handleCustomFieldNameChange = (columnName: string, customName: string) => {
    setCustomFieldNames({ ...customFieldNames, [columnName]: customName });
    if (mapping.customFields) {
      setMapping({
        ...mapping,
        customFields: {
          ...mapping.customFields,
          [columnName]: customName,
        },
      });
    }
  };

  const getMappedField = (columnName: string): string => {
    // Check if mapped to standard field
    for (const [field, col] of Object.entries(mapping)) {
      if (field !== 'customFields' && col === columnName) {
        return field;
      }
    }
    // Check if mapped to custom field
    if (mapping.customFields?.[columnName]) {
      return 'custom';
    }
    return '__ignore__';
  };

  const handleImport = async () => {
    if (!file || !fileData) return;

    setStep('importing');
    setImportProgress(0);

    try {
      // Prepare mapping with custom field names
      const finalMapping = {
        ...mapping,
        customFields: Object.fromEntries(
          Object.entries(customFieldNames).map(([col, name]) => [col, name])
        ),
      };

      const result = await importMembers({
        fileData,
        fileName: file.name,
        columnMapping: finalMapping,
        duplicateHandling,
      });

      setImportResults(result);
      setStep('results');
      setImportProgress(100);

      if (result.successful > 0) {
        toast.success(`${result.successful} membre(s) importé(s) avec succès`);
      }
      if (result.failed > 0) {
        toast.error(`${result.failed} erreur(s) lors de l'import`);
      }
    } catch (error: any) {
      toast.error(`Erreur lors de l'import: ${error.message}`);
      setStep('config');
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-6xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Importer des membres</h1>
        <p className="text-muted-foreground mt-1">
          Importez vos clients depuis un fichier CSV ou Excel avec colonnes dynamiques
        </p>
      </div>

      {/* Step 1: File Upload */}
      {step === 'upload' && (
        <Card>
          <CardHeader>
            <CardTitle>Étape 1: Sélectionner le fichier</CardTitle>
            <CardDescription>
              Téléchargez un fichier CSV ou Excel (.xlsx, .xls) contenant vos clients
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-2 border-dashed border-border rounded-lg p-8">
              <input
                id="file"
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleFileSelect}
                className="hidden"
              />
              <Label
                htmlFor="file"
                className="flex flex-col items-center justify-center cursor-pointer"
              >
                <Upload className="h-12 w-12 text-muted-foreground mb-4" />
                <span className="text-lg font-medium mb-2">
                  Cliquez pour télécharger ou glissez-déposez
                </span>
                <span className="text-sm text-muted-foreground">
                  Formats acceptés: CSV, Excel (.xlsx, .xls)
                </span>
              </Label>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Analyzing */}
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

      {/* Step 3: Dynamic Column Mapping */}
      {step === 'mapping' && (
        <Card>
          <CardHeader>
            <CardTitle>Étape 2: Mapper les colonnes</CardTitle>
            <CardDescription>
              Associez chaque colonne de votre fichier à un champ standard ou créez un champ personnalisé
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Standard Fields Section */}
            <div>
              <h3 className="text-sm font-medium mb-4">Champs standards</h3>
              <div className="grid grid-cols-2 gap-4">
                {STANDARD_FIELDS.filter(f => f.value && f.value !== 'custom').map((field) => (
                  <div key={field.value}>
                    <Label>{field.label}</Label>
                    <Select
                      value={typeof mapping[field.value] === 'string' ? (mapping[field.value] as string) || '__none__' : '__none__'}
                      onValueChange={(value) => {
                        setMapping({ ...mapping, [field.value]: value === '__none__' ? undefined : value });
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner une colonne" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="__none__">-- Aucune --</SelectItem>
                        {allColumns.map((col) => (
                          <SelectItem key={col} value={col}>
                            {col}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {confidence[field.value] && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Confiance: {Math.round(confidence[field.value] * 100)}%
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-border/30" />

            {/* All Columns - Dynamic Mapping */}
            <div>
              <h3 className="text-sm font-medium mb-4">Toutes les colonnes</h3>
              <div className="space-y-3">
                {allColumns.map((columnName) => {
                  const mappedField = getMappedField(columnName);
                  const isCustom = mappedField === 'custom';
                  
                  return (
                    <div
                      key={columnName}
                      className="flex items-center gap-3 p-3 border rounded-lg hover:bg-accent/30 transition-colors"
                    >
                      <div className="flex-1">
                        <Label className="text-sm font-medium">{columnName}</Label>
                        {sampleRows[0]?.[columnName] && (
                          <p className="text-xs text-muted-foreground mt-0.5">
                            Exemple: {String(sampleRows[0][columnName]).substring(0, 50)}
                          </p>
                        )}
                      </div>
                      <div className="w-64">
                        <Select
                          value={mappedField}
                          onValueChange={(value) => handleColumnMapping(columnName, value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {STANDARD_FIELDS.map((field) => (
                              <SelectItem key={field.value} value={field.value}>
                                {field.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      {isCustom && (
                        <div className="w-48">
                          <Input
                            value={customFieldNames[columnName] || columnName}
                            onChange={(e) =>
                              handleCustomFieldNameChange(columnName, e.target.value)
                            }
                            placeholder="Nom du champ personnalisé"
                            className="text-sm"
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Preview */}
            {sampleRows.length > 0 && (
              <div className="mt-6">
                <Label>Aperçu des données (premières lignes)</Label>
                <div className="border rounded-lg mt-2 overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        {allColumns.map((key) => (
                          <th key={key} className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                            {key}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {sampleRows.slice(0, 3).map((row, idx) => (
                        <tr key={idx}>
                          {allColumns.map((col) => (
                            <td key={col} className="px-4 py-2 text-sm">
                              {String(row[col] || '')}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <div className="flex gap-2 pt-4">
              <Button
                onClick={() => setStep('config')}
                disabled={!mapping.name || !mapping.phone}
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

      {/* Step 4: Import Configuration */}
      {step === 'config' && (
        <Card>
          <CardHeader>
            <CardTitle>Étape 3: Configuration de l'import</CardTitle>
            <CardDescription>
              Configurez comment gérer les doublons et autres options
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Gestion des doublons</Label>
              <select
                value={duplicateHandling}
                onChange={(e) => setDuplicateHandling(e.target.value as any)}
                className="w-full mt-2 p-2 border rounded-md"
              >
                <option value="skip">Ignorer les doublons</option>
                <option value="update">Mettre à jour les membres existants</option>
                <option value="create">Créer de nouveaux membres (erreur si doublon)</option>
              </select>
              <p className="text-sm text-muted-foreground mt-1">
                Les doublons sont détectés par numéro de téléphone ou email
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

      {/* Step 5: Importing */}
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

      {/* Step 6: Results */}
      {step === 'results' && importResults && (
        <Card>
          <CardHeader>
            <CardTitle>Résultats de l'import</CardTitle>
            <CardDescription>
              Résumé de l'importation des membres
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
                          Ligne {error.row}: {error.reason}
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
              <Button onClick={() => navigate('/members')}>
                Voir les membres
              </Button>
              <Button variant="outline" onClick={() => {
                setStep('upload');
                setFile(null);
                setFileData('');
                setMapping({ customFields: {} });
                setAllColumns([]);
                setCustomFieldNames({});
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
