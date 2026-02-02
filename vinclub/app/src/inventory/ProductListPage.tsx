import { useState } from 'react';
import { useQuery } from 'wasp/client/operations';
import { getPaginatedProducts } from 'wasp/client/operations';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Package, Plus, Upload, Search, Filter } from 'lucide-react';

export default function ProductListPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [regionFilter, setRegionFilter] = useState('');
  const [wineTypeFilter, setWineTypeFilter] = useState('');
  const [stockStatusFilter, setStockStatusFilter] = useState<'all' | 'in_stock' | 'out_of_stock' | 'low_stock'>('all');

  const { data, isLoading, error } = useQuery(getPaginatedProducts, {
    page,
    limit: 20,
    search: search || undefined,
    region: regionFilter || undefined,
    wineType: wineTypeFilter || undefined,
    stockStatus: stockStatusFilter,
  });

  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Erreur lors du chargement des produits.</p>
        </div>
      </div>
    );
  }

  const products = data?.data || [];
  const pagination = data?.pagination || { page: 1, limit: 20, total: 0, totalPages: 1 };

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Inventaire</h1>
          <p className="text-muted-foreground mt-1">
            {pagination.total} produit{pagination.total > 1 ? 's' : ''} au total
          </p>
        </div>
        <div className="flex gap-2">
          <Link to="/inventory/import">
            <Button variant="outline">
              <Upload className="h-4 w-4 mr-2" />
              Importer
            </Button>
          </Link>
          <Link to="/inventory/add">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Ajouter un produit
            </Button>
          </Link>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Filtres</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="search">Recherche</Label>
              <div className="relative mt-2">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Nom, région..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="region">Région</Label>
              <Input
                id="region"
                placeholder="Toutes les régions"
                value={regionFilter}
                onChange={(e) => {
                  setRegionFilter(e.target.value);
                  setPage(1);
                }}
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="wineType">Type de vin</Label>
              <select
                id="wineType"
                value={wineTypeFilter}
                onChange={(e) => {
                  setWineTypeFilter(e.target.value);
                  setPage(1);
                }}
                className="w-full mt-2 p-2 border rounded-md"
              >
                <option value="">Tous les types</option>
                <option value="red">Rouge</option>
                <option value="white">Blanc</option>
                <option value="rosé">Rosé</option>
                <option value="sparkling">Effervescent</option>
              </select>
            </div>
            <div>
              <Label htmlFor="stockStatus">Stock</Label>
              <select
                id="stockStatus"
                value={stockStatusFilter}
                onChange={(e) => {
                  setStockStatusFilter(e.target.value as any);
                  setPage(1);
                }}
                className="w-full mt-2 p-2 border rounded-md"
              >
                <option value="all">Tous</option>
                <option value="in_stock">En stock</option>
                <option value="out_of_stock">Rupture de stock</option>
                <option value="low_stock">Stock faible</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Products List */}
      {products.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Aucun produit trouvé</p>
            <Link to="/inventory/add">
              <Button className="mt-4">
                <Plus className="h-4 w-4 mr-2" />
                Ajouter votre premier produit
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((product) => (
              <Card key={product.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{product.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Millésime:</span>
                    <span>{product.vintage || 'N/A'}</span>
                  </div>
                  {product.region && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Région:</span>
                      <span>{product.region}</span>
                    </div>
                  )}
                  {product.wineType && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Type:</span>
                      <span className="capitalize">{product.wineType}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm font-semibold">
                    <span>Prix:</span>
                    <span>{product.price.toFixed(2)} €</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Stock:</span>
                    <span className={product.stockQuantity === 0 ? 'text-red-600' : product.stockQuantity <= 10 ? 'text-yellow-600' : 'text-green-600'}>
                      {product.stockQuantity}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2">
              <Button
                variant="outline"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Précédent
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {pagination.page} sur {pagination.totalPages}
              </span>
              <Button
                variant="outline"
                onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                disabled={page === pagination.totalPages}
              >
                Suivant
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
