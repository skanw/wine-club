import { Link, routes } from 'wasp/client/router';
import { LoginForm } from 'wasp/client/auth';
import { AuthPageLayout } from '../../components/AuthPageLayout';

export default function Login() {
  return (
    <AuthPageLayout>
      <LoginForm />
      <br />
      <span className='text-sm font-medium text-gray-900 dark:text-gray-900'>
        Don't have an account yet?{' '}
        <Link to={routes.SignupRoute.to} className='underline'>
          go to signup
        </Link>
        .
      </span>
      <br />
      <span className='text-sm font-medium text-gray-900'>
        Forgot your password?{' '}
        <Link to={routes.RequestPasswordResetRoute.to} className='underline'>
          reset it
        </Link>
        .
      </span>
    </AuthPageLayout>
  );
}
