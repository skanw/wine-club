import { useParams } from 'react-router-dom';
import { useQuery } from 'wasp/client/operations';
import { getCampaignById } from 'wasp/client/operations';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';

export default function CampaignDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading } = useQuery(getCampaignById, { id: id! });

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  if (!data) {
    return <div>Campagne introuvable</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{data.name}</h1>
      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Statistiques</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Envoyés : {data.statistics.sentCount}</p>
            <p>Livrés : {data.statistics.deliveredCount}</p>
            <p>Ouverts : {data.statistics.openedCount}</p>
            <p>Cliqués : {data.statistics.clickedCount}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

