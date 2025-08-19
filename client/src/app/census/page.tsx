'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CreateCensusButton } from '@/components/census/create-census-button';
import { CensusDataTable } from '@/components/census/census-data-table';
import { CensusFormModal } from '@/components/census/census-form-modal';
import { CensusProject } from '@/lib/types/census';

export default function CensusPage() {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<CensusProject | undefined>();

  const handleEdit = (project: CensusProject) => {
    setSelectedProject(project);
    setEditModalOpen(true);
  };

  const handleViewResults = (project: CensusProject) => {
    console.log('View results for:', project);
    // Navigate to results page
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Census Management</h1>
          <p className="text-muted-foreground">
            Create and manage census projects, monitor data collection progress
          </p>
        </div>
        <CreateCensusButton />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>All Census Projects</CardTitle>
            <CardDescription>
              View and manage all census projects including active, completed, and draft projects
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CensusDataTable
              onEdit={handleEdit}
              onViewResults={handleViewResults}
            />
          </CardContent>
        </Card>
      </motion.div>

      <CensusFormModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        project={selectedProject}
        onSuccess={() => {
          setSelectedProject(undefined);
          // Refresh data
        }}
      />
    </div>
  );
}