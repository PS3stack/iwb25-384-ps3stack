'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { AddObserverForm } from '../../components/observers/add-observer-form';
import { ObserverDataTable } from '../../components/observers/observer-data-table';
import { AreaManagement } from '../../components/observers/area-management';
import { CSVUploader } from '../../components/shared/csv-uploader';
import { PlusIcon } from '@heroicons/react/24/outline';

export default function ObserversPage() {
  const [addObserverOpen, setAddObserverOpen] = useState(false);

  const handleDeviceDataParsed = (data: any[]) => {
    console.log('Parsed device data:', data);
    // Handle device import logic here
  };

  const deviceSampleData = {
    deviceId: 'DEVICE001',
    type: 'tablet',
    areaId: 'area1',
    status: 'active'
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Observer Management</h1>
          <p className="text-muted-foreground">
            Manage election observers, assign areas, and configure voting devices
          </p>
        </div>
        <Button onClick={() => setAddObserverOpen(true)}>
          <PlusIcon className="mr-2 h-4 w-4" />
          Add Observer
        </Button>
      </div>

      <Tabs defaultValue="observers" className="space-y-6">
        <TabsList>
          <TabsTrigger value="observers">Observers</TabsTrigger>
          <TabsTrigger value="areas">Areas</TabsTrigger>
          <TabsTrigger value="devices">Devices</TabsTrigger>
        </TabsList>

        <TabsContent value="observers" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Election Observers</CardTitle>
              <CardDescription>
                Manage observer credentials and area assignments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ObserverDataTable />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="areas" className="space-y-6">
          <AreaManagement />
        </TabsContent>

        <TabsContent value="devices" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Device Management</CardTitle>
              <CardDescription>
                Upload and manage voting devices for each area
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CSVUploader
                title="Upload Device List"
                description="Import voting devices from CSV file"
                expectedHeaders={['deviceId', 'type', 'areaId', 'status']}
                sampleData={deviceSampleData}
                onDataParsed={handleDeviceDataParsed}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <AddObserverForm
        open={addObserverOpen}
        onOpenChange={setAddObserverOpen}
        onSuccess={() => {
          // Refresh observer data
        }}
      />
    </div>
  );
}