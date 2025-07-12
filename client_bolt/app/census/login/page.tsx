'use client';

import React from 'react';
import { LoginForm } from '@/components/forms/login-form';

export default function CensusLoginPage() {
  return (
    <LoginForm
      title="Census Portal"
      redirectPath="/census"
      allowedRoles={['census_officer']}
    />
  );
}