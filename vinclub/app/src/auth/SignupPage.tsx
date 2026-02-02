import { Link as WaspRouterLink, routes } from 'wasp/client/router';
import { SignupForm } from 'wasp/client/auth';
import { AuthPageLayout } from './AuthPageLayout';

export function Signup() {
  return (
    <AuthPageLayout>
      <SignupForm />
      <br />
      <span className='text-sm font-medium text-gray-900'>
        J'ai déjà un compte (
        <WaspRouterLink to={routes.LoginRoute.to} className='underline'>
          se connecter
        </WaspRouterLink>
        ).
      </span>
      <br />
    </AuthPageLayout>
  );
}
