import { Link, routes } from 'wasp/client/router';
import { SignupForm } from 'wasp/client/auth';
import { AuthPageLayout } from '../../components/AuthPageLayout';

export function Signup() {
  return (
    <AuthPageLayout>
      <SignupForm />
      <br />
      <span className='text-sm font-medium text-gray-900'>
        I already have an account (
        <Link to={routes.LoginRoute.to} className='underline'>
          go to login
        </Link>
        ).
      </span>
      <br />
    </AuthPageLayout>
  );
}
