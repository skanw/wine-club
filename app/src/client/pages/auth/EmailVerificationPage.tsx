import { VerifyEmailForm } from 'wasp/client/auth';
import { Link, routes } from 'wasp/client/router';
import { AuthPageLayout } from '../../components/AuthPageLayout';

export function EmailVerificationPage() {
  return (
    <AuthPageLayout>
      <VerifyEmailForm />
      <br />
      <span className='text-sm font-medium text-gray-900'>
        If everything is okay, <Link to={routes.LoginRoute.to} className='underline'>go to login</Link>
      </span>
    </AuthPageLayout>
  );
}
