'use client';

import { SettingsForm } from '@/components/settings/settings-form';

export default function SettingsPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">System Settings</h1>
        <p className="text-muted-foreground">
          Manage system-wide configuration, security policies, and preferences
        </p>
      </div>

      <SettingsForm />
    </div>
  );
}