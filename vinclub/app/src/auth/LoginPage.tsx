import { Link as WaspRouterLink, routes } from 'wasp/client/router';
import { LoginForm } from 'wasp/client/auth';
import { AuthPageLayout } from './AuthPageLayout';

export default function Login() {
  return (
    <AuthPageLayout>
      <LoginForm />
      <br />
      <span className='text-sm font-medium text-gray-900 dark:text-gray-900'>
        Vous n'avez pas encore de compte ?{' '}
        <WaspRouterLink to={routes.SignupRoute.to} className='underline'>
          créer un compte
        </WaspRouterLink>
        .
      </span>
      <br />
      <span className='text-sm font-medium text-gray-900'>
        Mot de passe oublié ?{' '}
        <WaspRouterLink to={routes.RequestPasswordResetRoute.to} className='underline'>
          réinitialiser
        </WaspRouterLink>
        .
      </span>
    </AuthPageLayout>
  );
}
