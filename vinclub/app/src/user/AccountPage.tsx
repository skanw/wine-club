import { getCustomerPortalUrl, useQuery } from 'wasp/client/operations';
import { Link as WaspRouterLink, routes } from 'wasp/client/router';
import type { User } from 'wasp/entities';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Separator } from '../components/ui/separator';
import { SubscriptionStatus, parsePaymentPlanId, prettyPaymentPlanName } from '../payment/plans';

export default function AccountPage({ user }: { user: User }) {
  return (
    <div className='mt-10 px-6'>
      <Card className='mb-4 lg:m-8'>
        <CardHeader>
          <CardTitle className='text-base font-semibold leading-6 text-foreground'>
            Informations du compte
          </CardTitle>
        </CardHeader>
        <CardContent className='p-0'>
          <div className='space-y-0'>
            {!!user.email && (
              <div className='py-4 px-6'>
                <div className='grid grid-cols-1 sm:grid-cols-3 sm:gap-4'>
                  <dt className='text-sm font-medium text-muted-foreground'>Adresse email</dt>
                  <dd className='mt-1 text-sm text-foreground sm:col-span-2 sm:mt-0'>{user.email}</dd>
                </div>
              </div>
            )}
            {!!user.username && (
              <>
                <Separator />
                <div className='py-4 px-6'>
                  <div className='grid grid-cols-1 sm:grid-cols-3 sm:gap-4'>
                    <dt className='text-sm font-medium text-muted-foreground'>Nom d'utilisateur</dt>
                    <dd className='mt-1 text-sm text-foreground sm:col-span-2 sm:mt-0'>{user.username}</dd>
                  </div>
                </div>
              </>
            )}
            <Separator />
            <div className='py-4 px-6'>
              <div className='grid grid-cols-1 sm:grid-cols-3 sm:gap-4'>
                <dt className='text-sm font-medium text-muted-foreground'>Votre plan</dt>
                <UserCurrentPaymentPlan
                  subscriptionStatus={user.subscriptionStatus as SubscriptionStatus}
                  subscriptionPlan={user.subscriptionPlan}
                  datePaid={user.datePaid}
                  credits={user.credits}
                />
              </div>
            </div>
            <Separator />
            <div className='py-4 px-6'>
              <div className='grid grid-cols-1 sm:grid-cols-3 sm:gap-4'>
                <dt className='text-sm font-medium text-muted-foreground'>À propos</dt>
                <dd className='mt-1 text-sm text-foreground sm:col-span-2 sm:mt-0'>Client VinClub.</dd>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

type UserCurrentPaymentPlanProps = {
  subscriptionPlan: string | null;
  subscriptionStatus: SubscriptionStatus | null;
  datePaid: Date | null;
  credits: number;
};

function UserCurrentPaymentPlan({
  subscriptionPlan,
  subscriptionStatus,
  datePaid,
  credits,
}: UserCurrentPaymentPlanProps) {
  if (subscriptionStatus && subscriptionPlan && datePaid) {
    return (
      <>
        <dd className='mt-1 text-sm text-foreground sm:col-span-1 sm:mt-0'>
          {getUserSubscriptionStatusDescription({ subscriptionPlan, subscriptionStatus, datePaid })}
        </dd>
        {subscriptionStatus !== SubscriptionStatus.Deleted ? <CustomerPortalButton /> : <BuyMoreButton />}
      </>
    );
  }

  return (
    <>
      <dd className='mt-1 text-sm text-foreground sm:col-span-1 sm:mt-0'>Crédits restants : {credits}</dd>
      <BuyMoreButton />
    </>
  );
}

function getUserSubscriptionStatusDescription({
  subscriptionPlan,
  subscriptionStatus,
  datePaid,
}: {
  subscriptionPlan: string;
  subscriptionStatus: SubscriptionStatus;
  datePaid: Date;
}) {
  const planName = prettyPaymentPlanName(parsePaymentPlanId(subscriptionPlan));
  const endOfBillingPeriod = prettyPrintEndOfBillingPeriod(datePaid);
  return prettyPrintStatus(planName, subscriptionStatus, endOfBillingPeriod);
}

function prettyPrintStatus(
  planName: string,
  subscriptionStatus: SubscriptionStatus,
  endOfBillingPeriod: string
): string {
  const statusToMessage: Record<SubscriptionStatus, string> = {
    active: `${planName}`,
    past_due: `Le paiement de votre plan ${planName} est en retard ! Veuillez mettre à jour vos informations de paiement.`,
    cancel_at_period_end: `Votre abonnement au plan ${planName} a été annulé, mais reste actif jusqu'à la fin de la période de facturation actuelle${endOfBillingPeriod}`,
    deleted: `Votre abonnement précédent a été annulé et n'est plus actif.`,
  };
  if (Object.keys(statusToMessage).includes(subscriptionStatus)) {
    return statusToMessage[subscriptionStatus];
  } else {
    throw new Error(`Invalid subscriptionStatus: ${subscriptionStatus}`);
  }
}

function prettyPrintEndOfBillingPeriod(date: Date) {
  const oneMonthFromNow = new Date(date);
  oneMonthFromNow.setMonth(oneMonthFromNow.getMonth() + 1);
  return ': ' + oneMonthFromNow.toLocaleDateString();
}

function BuyMoreButton() {
  return (
    <div className='ml-4 flex-shrink-0 sm:col-span-1 sm:mt-0'>
      <WaspRouterLink
        to={routes.PricingPageRoute.to}
        className='font-medium text-sm text-primary hover:text-primary/80 transition-colors duration-200'
      >
        Acheter plus / Mettre à niveau
      </WaspRouterLink>
    </div>
  );
}

function CustomerPortalButton() {
  const {
    data: customerPortalUrl,
    isLoading: isCustomerPortalUrlLoading,
    error: customerPortalUrlError,
  } = useQuery(getCustomerPortalUrl);

  const handleClick = () => {
    if (customerPortalUrlError) {
      console.error('Error fetching customer portal url');
    }

    if (customerPortalUrl) {
      window.open(customerPortalUrl, '_blank');
    } else {
      console.error('Customer portal URL is not available');
    }
  };

  return (
    <div className='ml-4 flex-shrink-0 sm:col-span-1 sm:mt-0'>
      <Button
        onClick={handleClick}
        disabled={isCustomerPortalUrlLoading}
        variant='outline'
        size='sm'
        className='font-medium text-sm'
      >
        Gérer l'abonnement
      </Button>
    </div>
  );
}
