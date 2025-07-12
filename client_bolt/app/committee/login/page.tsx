'use client';

import React from 'react';
import { LoginForm } from '@/components/forms/login-form';

export default function CommitteeLoginPage() {
  return (
    <LoginForm
      title="Committee Portal"
      redirectPath="/committee"
      allowedRoles={['committee', 'observer']}
    />
  );
}