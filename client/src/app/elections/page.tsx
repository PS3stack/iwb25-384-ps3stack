'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { CreateElectionButton } from '../../components/elections/create-election-button';
import { ElectionDataTable } from '../../components/elections/election-data-table';

export default function ElectionsPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Elections</h1>
          <p className="text-muted-foreground">
            Create and manage elections, view schedules, and monitor voting progress
          </p>
        </div>
        <CreateElectionButton />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Elections</CardTitle>
          <CardDescription>
            View and manage all elections including upcoming, active, and completed ones
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ElectionDataTable />
        </CardContent>
      </Card>
    </div>
  );
}