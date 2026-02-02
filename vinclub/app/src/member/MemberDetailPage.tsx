import { useParams } from 'react-router-dom';
import { useQuery } from 'wasp/client/operations';
import { getMemberById } from 'wasp/client/operations';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';

export default function MemberDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading } = useQuery(getMemberById, { id: id! });

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  if (!data) {
    return <div>Membre introuvable</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{data.name}</h1>
      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Informations de contact</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Téléphone : {data.phone}</p>
            {data.email && <p>Email : {data.email}</p>}
            {data.preferredRegion && <p>Région préférée : {data.preferredRegion}</p>}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Statistiques</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Abonnements : {data.subscriptionsCount}</p>
            <p>Total dépensé : €{data.totalSpent.toFixed(2)}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

