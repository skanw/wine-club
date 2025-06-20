import { ResetPasswordForm } from 'wasp/client/auth';
import { Link, routes } from 'wasp/client/router';
import { AuthPageLayout } from '../../components/AuthPageLayout';

export function PasswordResetPage() {
  return (
    <AuthPageLayout>
      <ResetPasswordForm />
      <br />
      <span className='text-sm font-medium text-gray-900'>
        If everything is okay, <Link to={routes.LoginRoute.to}>go to login</Link>
      </span>
    </AuthPageLayout>
  );
}
