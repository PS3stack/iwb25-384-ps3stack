'use client';

import React from 'react';
import { LoginForm } from '@/components/forms/login-form';

export default function AdminLoginPage() {
  return (
    <LoginForm
      title="Admin Portal"
      redirectPath="/admin"
      allowedRoles={['admin']}
    />
  );
}