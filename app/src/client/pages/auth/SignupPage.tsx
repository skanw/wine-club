import React from 'react';

export function Signup() {
  return (
    <div className="auth-page">
      <h1>Sign Up</h1>
      {/* TODO: Implement signup form */}
      <form>
        <input type="email" placeholder="Email" required />
        <input type="password" placeholder="Password" required />
        <button type="submit">Sign Up</button>
      </form>
      <a href="/login">Already have an account? Login</a>
    </div>
  );
}
