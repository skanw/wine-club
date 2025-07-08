import React from 'react';

export function EmailVerificationPage() {
  return (
    <div className="auth-page">
      <h1>Email Verification</h1>
      <p>Please check your email and click the verification link to activate your account.</p>
      <a href="/login">Back to Login</a>
    </div>
  );
}
