'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { LiveTurnoutDashboard } from '../../components/monitoring/live-turnout-dashboard';
import { AuditLogViewer } from '../../components/monitoring/audit-log-viewer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';

export default function MonitoringPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">System Monitoring</h1>
        <p className="text-muted-foreground">
          Monitor real-time election progress, view analytics, and track system activities
        </p>
      </div>

      <Tabs defaultValue="turnout" className="space-y-6">
        <TabsList>
          <TabsTrigger value="turnout">Live Turnout</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="audit">Audit Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="turnout" className="space-y-6">
          <LiveTurnoutDashboard />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Analytics Dashboard</CardTitle>
              <CardDescription>
                Comprehensive election analytics and reporting
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-64 text-gray-500">
                Analytics dashboard coming soon...
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audit" className="space-y-6">
          <AuditLogViewer />
        </TabsContent>
      </Tabs>
    </div>
  );
}