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
    <>
      <style jsx global>{`
        /* Reset and base styles */
        .sv_main {
          font-family: inherit !important;
          background: transparent !important;
          border: none !important;
        }

        .sv_container {
          background: transparent !important;
          border: none !important;
          box-shadow: none !important;
          padding: 0 !important;
          margin: 0 !important;
        }

        .sv_body {
          background: transparent !important;
          padding: 0 !important;
        }

        .sv_p_root {
          background: transparent !important;
          border: none !important;
          padding: 0 !important;
        }

        /* Panel styling */
        .sv_qstn_left {
          margin-bottom: 1.5rem !important;
          background: transparent !important;
          border: none !important;
          padding: 0 !important;
        }

        .sv_q_title {
          font-size: 0.875rem !important;
          font-weight: 500 !important;
          color: #374151 !important;
          margin-bottom: 0.5rem !important;
          line-height: 1.25rem !important;
          background: transparent !important;
          border: none !important;
          padding: 0 !important;
        }

        /* Input fields */
        .sv_q_text_root input[type="text"],
        .sv_q_text_root input[type="number"],
        .sv_q_dropdown_control,
        .sv_select_wrapper select {
          width: 100% !important;
          padding: 0.5rem 0.75rem !important;
          border: 1px solid #d1d5db !important;
          border-radius: 0.375rem !important;
          font-size: 0.875rem !important;
          line-height: 1.25rem !important;
          background-color: #ffffff !important;
          color: #374151 !important;
          transition: all 0.15s ease-in-out !important;
          box-sizing: border-box !important;
        }

        .sv_q_text_root input[type="text"]:focus,
        .sv_q_text_root input[type="number"]:focus,
        .sv_q_dropdown_control:focus,
        .sv_select_wrapper select:focus {
          outline: none !important;
          border-color: #3b82f6 !important;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1) !important;
        }

        /* Dropdown specific */
        .sv_q_dropdown_control {
          appearance: none !important;
          background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e") !important;
          background-repeat: no-repeat !important;
          background-position: right 0.75rem center !important;
          background-size: 1rem !important;
          padding-right: 2.5rem !important;
        }

        /* Checkbox and Radio styling */
        .sv_q_checkbox,
        .sv_q_radiogroup {
          display: flex !important;
          flex-direction: column !important;
          gap: 0.5rem !important;
        }

        .sv_q_checkbox_control_item,
        .sv_q_radiogroup_control_item {
          display: flex !important;
          align-items: center !important;
          gap: 0.5rem !important;
          padding: 0.25rem 0 !important;
          margin: 0 !important;
        }

        .sv_q_checkbox_control_item input[type="checkbox"],
        .sv_q_radiogroup_control_item input[type="radio"] {
          width: 1rem !important;
          height: 1rem !important;
          margin: 0 !important;
          margin-right: 0.5rem !important;
        }

        .sv_q_checkbox_control_item label,
        .sv_q_radiogroup_control_item label {
          font-size: 0.875rem !important;
          color: #374151 !important;
          cursor: pointer !important;
          margin: 0 !important;
          line-height: 1.25rem !important;
        }

        /* Boolean/Switch styling */
        .sv_q_boolean {
          display: flex !important;
          align-items: center !important;
          gap: 0.75rem !important;
        }

        .sv_q_boolean label {
          font-size: 0.875rem !important;
          color: #374151 !important;
          order: 2 !important;
        }

        .sv_q_boolean input[type="checkbox"] {
          width: 1rem !important;
          height: 1rem !important;
          order: 1 !important;
        }

        /* Panel headers */
        .sv_p_title {
          font-size: 1.125rem !important;
          font-weight: 600 !important;
          color: #1f2937 !important;
          margin-bottom: 1rem !important;
          padding-bottom: 0.5rem !important;
          border-bottom: 2px solid #e5e7eb !important;
          background: transparent !important;
        }

        /* Navigation/Action buttons */
        .sv_nav {
          display: flex !important;
          justify-content: flex-end !important;
          gap: 0.75rem !important;
          margin-top: 2rem !important;
          padding-top: 1.5rem !important;
          border-top: 1px solid #e5e7eb !important;
        }

        .sv_nav input[type="button"],
        .sv_nav button {
          padding: 0.5rem 1rem !important;
          border-radius: 0.375rem !important;
          font-size: 0.875rem !important;
          font-weight: 500 !important;
          cursor: pointer !important;
          transition: all 0.15s ease-in-out !important;
          border: 1px solid transparent !important;
          background-color: #3b82f6 !important;
          color: white !important;
        }

        .sv_nav input[type="button"]:hover,
        .sv_nav button:hover {
          background-color: #2563eb !important;
        }

        /* Error states */
        .sv_q_errobox {
          color: #dc2626 !important;
          font-size: 0.75rem !important;
          margin-top: 0.25rem !important;
        }

        .sv_qstn_error .sv_q_title {
          color: #dc2626 !important;
        }

        .sv_qstn_error input,
        .sv_qstn_error select {
          border-color: #dc2626 !important;
        }

        /* Multi-select styling */
        .sv_qcbc {
          max-height: 200px !important;
          overflow-y: auto !important;
          border: 1px solid #d1d5db !important;
          border-radius: 0.375rem !important;
          padding: 0.5rem !important;
          background-color: #ffffff !important;
        }

        /* Remove default SurveyJS margins and paddings that might interfere */
        .sv_main * {
          box-sizing: border-box !important;
        }

        .sv_main table {
          width: 100% !important;
          border-collapse: separate !important;
          border-spacing: 0 !important;
        }

        .sv_main td {
          padding: 0 !important;
          vertical-align: top !important;
        }

        /* Responsive */
        @media (max-width: 640px) {
          .sv_nav {
            flex-direction: column !important;
          }
          
          .sv_nav input[type="button"],
          .sv_nav button {
            width: 100% !important;
          }
        }
      `}</style>
      
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
          
          <div className="survey-container">
            <SurveyForm
              schema={settingsFormSchema}
              data={formData}
              onComplete={handleComplete}
            />
          </div>
        </CardContent>
      </Card>
    </>
  );
}