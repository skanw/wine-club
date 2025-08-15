import React from 'react';
import { Navigate } from 'react-router-dom';

export default function CreateWineCavePage() {
  // Redirect to the new onboarding flow
  return <Navigate to="/onboarding" replace />;
} 