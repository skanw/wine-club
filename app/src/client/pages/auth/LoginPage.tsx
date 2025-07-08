import React from 'react';

export default function Login() {
  return (
    <div className="auth-page">
      <h1>Login</h1>
      {/* TODO: Implement login form */}
      <form>
        <input type="email" placeholder="Email" required />
        <input type="password" placeholder="Password" required />
        <button type="submit">Login</button>
      </form>
      <a href="/signup">Don't have an account? Sign up</a>
    </div>
  );
}
