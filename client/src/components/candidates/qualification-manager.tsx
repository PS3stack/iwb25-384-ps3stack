'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { DataTable } from '../../components/ui/data-table';
import { SurveyForm } from '../../components/shared/survey-form';
import { qualificationFormSchema } from '../../lib/survey-schemas';
import { Qualification } from '../../lib/types';
import { qualificationsApi } from '../../lib/mock-api';
import { ColumnDef } from '@tanstack/react-table';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Badge } from '../../components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu';
import { EllipsisVerticalIcon } from '@heroicons/react/24/outline';

export function QualificationManager() {
  const [qualifications, setQualifications] = useState<Qualification[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [selectedQualification, setSelectedQualification] = useState<Qualification | undefined>();

  const fetchQualifications = async () => {
    setLoading(true);
    try {
      const response = await qualificationsApi.getQualifications();
      if (response.success) {
        setQualifications(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch qualifications:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQualifications();
  }, []);

  const handleFormComplete = async (result: any) => {
    try {
      if (selectedQualification) {
        // Update logic would go here
      } else {
        await qualificationsApi.createQualification(result);
      }
      
      await fetchQualifications();
      setFormOpen(false);
      setSelectedQualification(undefined);
    } catch (error) {
      console.error('Failed to save qualification:', error);
    }
  };

  const columns: ColumnDef<Qualification>[] = [
    {
      accessorKey: 'title',
      header: 'Title',
    },
    {
      accessorKey: 'description',
      header: 'Description',
      cell: ({ row }) => {
        const description = row.getValue('description') as string;
        return description.length > 100 ? `${description.substring(0, 100)}...` : description;
      },
    },
    {
      id: 'requirements',
      header: 'Requirements',
      cell: ({ row }) => {
        const requirements = row.original.requirements;
        return (
          <div className="flex flex-wrap gap-1">
            {requirements.slice(0, 2).map((req, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {req}
              </Badge>
            ))}
            {requirements.length > 2 && (
              <Badge variant="outline" className="text-xs">
                +{requirements.length - 2} more
              </Badge>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: 'isRequired',
      header: 'Required',
      cell: ({ row }) => {
        const isRequired = row.getValue('isRequired') as boolean;
        return (
          <Badge variant={isRequired ? 'default' : 'secondary'}>
            {isRequired ? 'Required' : 'Optional'}
          </Badge>
        );
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const qualification = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <EllipsisVerticalIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => {
                  setSelectedQualification(qualification);
                  setFormOpen(true);
                }}
              >
                <PencilIcon className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-600">
                <TrashIcon className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Qualifications</CardTitle>
              <CardDescription>Manage candidate qualification requirements</CardDescription>
            </div>
            <Button onClick={() => setFormOpen(true)}>
              <PlusIcon className="mr-2 h-4 w-4" />
              Add Qualification
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={qualifications}
            searchKey="title"
            searchPlaceholder="Search qualifications..."
          />
        </CardContent>
      </Card>

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedQualification ? 'Edit Qualification' : 'Add New Qualification'}
            </DialogTitle>
          </DialogHeader>
          
          <SurveyForm
            schema={qualificationFormSchema}
            data={selectedQualification ? {
              title: selectedQualification.title,
              description: selectedQualification.description,
              requirements: selectedQualification.requirements,
              isRequired: selectedQualification.isRequired
            } : undefined}
            onComplete={handleFormComplete}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}