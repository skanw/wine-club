import { Link as WaspRouterLink, routes } from 'wasp/client/router';
import { ResetPasswordForm } from 'wasp/client/auth';
import { AuthPageLayout } from '../AuthPageLayout';

export function PasswordResetPage() {
  return (
    <AuthPageLayout>
      <ResetPasswordForm />
      <br />
      <span className='text-sm font-medium text-gray-900'>
        Si tout est correct, <WaspRouterLink to={routes.LoginRoute.to}>se connecter</WaspRouterLink>
      </span>
    </AuthPageLayout>
  );
}
