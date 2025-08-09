'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { CandidateForm } from '../../components/candidates/candidate-form';
import { CandidateDataTable } from '../../components/candidates/candidate-data-table';
import { QualificationManager } from '../../components/candidates/qualification-manager';
import { Candidate } from '../../lib/types';
import { PlusIcon } from '@heroicons/react/24/outline';

export default function CandidatesPage() {
  const [candidateFormOpen, setCandidateFormOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | undefined>();

  const handleEdit = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setCandidateFormOpen(true);
  };

  const handleManageQualifications = (candidate: Candidate) => {
    console.log('Manage qualifications for:', candidate);
    // Open qualification assignment modal
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Candidate Management</h1>
          <p className="text-muted-foreground">
            Manage candidates, their qualifications, and area assignments
          </p>
        </div>
        <Button onClick={() => setCandidateFormOpen(true)}>
          <PlusIcon className="mr-2 h-4 w-4" />
          Add Candidate
        </Button>
      </div>

      <Tabs defaultValue="candidates" className="space-y-6">
        <TabsList>
          <TabsTrigger value="candidates">Candidates</TabsTrigger>
          <TabsTrigger value="qualifications">Qualifications</TabsTrigger>
        </TabsList>

        <TabsContent value="candidates" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Election Candidates</CardTitle>
              <CardDescription>
                View and manage all candidates for upcoming elections
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CandidateDataTable
                onEdit={handleEdit}
                onManageQualifications={handleManageQualifications}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="qualifications" className="space-y-6">
          <QualificationManager />
        </TabsContent>
      </Tabs>

      <CandidateForm
        open={candidateFormOpen}
        onOpenChange={setCandidateFormOpen}
        candidate={selectedCandidate}
        onSuccess={() => {
          setSelectedCandidate(undefined);
          // Refresh candidate data
        }}
      />
    </div>
  );
}