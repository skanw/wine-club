import { ForgotPasswordForm } from 'wasp/client/auth';
import { Link, routes } from 'wasp/client/router';
import { AuthPageLayout } from '../../components/AuthPageLayout';

export function RequestPasswordResetPage() {
  return (
    <AuthPageLayout>
      <ForgotPasswordForm />
    </AuthPageLayout>
  );
}
