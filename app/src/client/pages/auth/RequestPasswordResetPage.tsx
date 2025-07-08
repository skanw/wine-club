import React from 'react';

export function RequestPasswordResetPage() {
  return (
    <div className="auth-page">
      <h1>Request Password Reset</h1>
      {/* TODO: Implement request password reset form */}
      <form>
        <input type="email" placeholder="Email" required />
        <button type="submit">Request Reset</button>
      </form>
      <a href="/login">Back to Login</a>
    </div>
  );
}
