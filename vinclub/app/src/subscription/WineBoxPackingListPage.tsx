import { useQuery } from 'wasp/client/operations';
import { getWineBoxes } from 'wasp/client/operations';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';

export default function WineBoxesPage() {
  const { data, isLoading } = useQuery(getWineBoxes, {});

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Liste de préparation des box</h1>

      {isLoading ? (
        <div>Chargement...</div>
      ) : (
        <div>
          <p>Total des box : {data?.totalBoxes}</p>
          <div className="grid gap-4 mt-4">
            {data?.boxes.map((box) => (
              <Card key={box.id}>
                <CardHeader>
                  <CardTitle>{box.memberName}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Plan : {box.planName}</p>
                  <p>Statut : {box.status === 'pending' ? 'En attente' : box.status === 'packed' ? 'Emballé' : box.status === 'shipped' ? 'Expédié' : box.status === 'ready_for_pickup' ? 'Prêt à retirer' : box.status}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

