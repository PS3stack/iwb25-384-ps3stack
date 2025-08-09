'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { AddVoterForm } from '../../components/voters/add-voter-form';
import { VoterDataTable } from '../../components/voters/voter-data-table';
import { CSVUploader } from '../../components/shared/csv-uploader';
import { votersApi } from '../../lib/mock-api';
import { PlusIcon, CloudArrowUpIcon } from '@heroicons/react/24/outline';

export default function VotersPage() {
  const [addVoterOpen, setAddVoterOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleVoterDataParsed = async (data: any[]) => {
    try {
      // Convert CSV data to proper format and send to API
      const result = await votersApi.importVoters('csv-data-placeholder');
      if (result.success) {
        console.log(`Imported ${result.data.imported} voters`);
        setRefreshTrigger(prev => prev + 1); // Trigger table refresh
      }
    } catch (error) {
      console.error('Failed to import voters:', error);
    }
  };

  const voterSampleData = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    voterId: 'V12345',
    area: 'area1',
    eligibilityGroup: 'student'
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Voter Management</h1>
          <p className="text-muted-foreground">
            Manage voter registration, import voter lists, and track voting status
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <CloudArrowUpIcon className="mr-2 h-4 w-4" />
            Import CSV
          </Button>
          <Button onClick={() => setAddVoterOpen(true)}>
            <PlusIcon className="mr-2 h-4 w-4" />
            Add Voter
          </Button>
        </div>
      </div>

      <Tabs defaultValue="voters" className="space-y-6">
        <TabsList>
          <TabsTrigger value="voters">Voter List</TabsTrigger>
          <TabsTrigger value="import">Import Voters</TabsTrigger>
        </TabsList>

        <TabsContent value="voters" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Registered Voters</CardTitle>
              <CardDescription>
                View and manage all registered voters for elections
              </CardDescription>
            </CardHeader>
            <CardContent>
              <VoterDataTable key={refreshTrigger} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="import" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Import Voters</CardTitle>
              <CardDescription>
                Import voter lists from CSV files with automatic validation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CSVUploader
                title="Upload Voter List"
                description="Import voters from CSV file with automatic validation"
                expectedHeaders={['firstName', 'lastName', 'email', 'voterId', 'area', 'eligibilityGroup']}
                sampleData={voterSampleData}
                onDataParsed={handleVoterDataParsed}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <AddVoterForm
        open={addVoterOpen}
        onOpenChange={setAddVoterOpen}
        onSuccess={() => {
          setRefreshTrigger(prev => prev + 1);
        }}
      />
    </div>
  );
}