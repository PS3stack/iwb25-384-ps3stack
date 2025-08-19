'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SurveyForm } from '@/components/shared/survey-form';
import { settingsFormSchema } from '@/lib/survey-schemas';
import { SystemSettings } from '@/lib/types';
import { settingsApi } from '@/lib/mock-api';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircleIcon } from '@heroicons/react/24/outline';

export function SettingsForm() {
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await settingsApi.getSettings();
        if (response.success) {
          setSettings(response.data);
        } else {
          setError('Failed to load settings');
        }
      } catch (error) {
        console.error('Failed to fetch settings:', error);
        setError('Failed to load settings');
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleComplete = async (result: any) => {
    try {
      setError(null);
      
      const updatedSettings: SystemSettings = {
        general: {
          organizationName: result.organizationName || 'University Election Commission',
          timezone: result.timezone || 'UTC-5',
          language: result.language || 'en',
          dateFormat: result.dateFormat || 'MM/DD/YYYY'
        },
        security: {
          sessionTimeout: result.sessionTimeout || 30,
          passwordPolicy: {
            minLength: result.minLength || 8,
            requireSpecialChars: result.requireSpecialChars !== false,
            requireNumbers: result.requireNumbers !== false,
            requireUppercase: result.requireUppercase !== false
          },
          twoFactorEnabled: result.twoFactorEnabled === true
        },
        notifications: {
          emailNotifications: result.emailNotifications !== false,
          smsNotifications: result.smsNotifications === true,
          pushNotifications: result.pushNotifications !== false,
          notificationRoles: Array.isArray(result.notificationRoles) ? result.notificationRoles : ['admin', 'observer']
        }
      };

      const response = await settingsApi.updateSettings(updatedSettings);
      if (response.success) {
        setSettings(response.data);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        setError('Failed to save settings');
      }
    } catch (error) {
      console.error('Failed to save settings:', error);
      setError('Failed to save settings');
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>System Settings</CardTitle>
          <CardDescription>Loading settings...</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!settings && error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>System Settings</CardTitle>
          <CardDescription>Error loading settings</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <Alert variant="destructive">
            <AlertDescription>
              {error}. Please refresh the page and try again.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  // Prepare form data with safe defaults
  const formData = settings ? {
    // General settings
    organizationName: settings.general?.organizationName || 'University Election Commission',
    timezone: settings.general?.timezone || 'UTC-5',
    language: settings.general?.language || 'en',
    dateFormat: settings.general?.dateFormat || 'MM/DD/YYYY',
    
    // Security settings
    sessionTimeout: settings.security?.sessionTimeout || 30,
    minLength: settings.security?.passwordPolicy?.minLength || 8,
    requireSpecialChars: settings.security?.passwordPolicy?.requireSpecialChars !== false,
    requireNumbers: settings.security?.passwordPolicy?.requireNumbers !== false,
    requireUppercase: settings.security?.passwordPolicy?.requireUppercase !== false,
    twoFactorEnabled: settings.security?.twoFactorEnabled === true,
    
    // Notification settings
    emailNotifications: settings.notifications?.emailNotifications !== false,
    smsNotifications: settings.notifications?.smsNotifications === true,
    pushNotifications: settings.notifications?.pushNotifications !== false,
    notificationRoles: settings.notifications?.notificationRoles || ['admin', 'observer']
  } : {};

  return (
    <Card>
      <CardHeader>
        <CardTitle>System Settings</CardTitle>
        <CardDescription>
          Configure general system settings, security policies, and notification preferences
        </CardDescription>
      </CardHeader>
      <CardContent>
        {saveSuccess && (
          <Alert className="mb-4">
            <CheckCircleIcon className="h-4 w-4" />
            <AlertDescription>
              Settings have been saved successfully!
            </AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>
              {error}
            </AlertDescription>
          </Alert>
        )}
        
        <SurveyForm
          schema={settingsFormSchema}
          data={formData}
          onComplete={handleComplete}
        />
      </CardContent>
    </Card>
  );
}