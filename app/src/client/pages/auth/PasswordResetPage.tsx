import React from 'react';

export function PasswordResetPage() {
  return (
    <div className="auth-page">
      <h1>Reset Password</h1>
      {/* TODO: Implement password reset form */}
      <form>
        <input type="email" placeholder="Email" required />
        <button type="submit">Send Reset Link</button>
      </form>
      <a href="/login">Back to Login</a>
    </div>
  );
}
