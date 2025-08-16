'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { DataTable } from '../../components/ui/data-table';
import { SurveyForm } from '../../components/shared/survey-form';
import { areaFormSchema } from '../../lib/survey-schemas';
import { Area } from '../../lib/types';
import { areasApi } from '../../lib/mock-api';
import { ColumnDef } from '@tanstack/react-table';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu';
import { EllipsisVerticalIcon } from '@heroicons/react/24/outline';

export function AreaManagement() {
  const [areas, setAreas] = useState<Area[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [selectedArea, setSelectedArea] = useState<Area | undefined>();

  const fetchAreas = async () => {
    setLoading(true);
    try {
      const response = await areasApi.getAreas();
      if (response.success) {
        setAreas(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch areas:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAreas();
  }, []);

  const handleFormComplete = async (result: any) => {
    try {
      if (selectedArea) {
        // Update logic would go here
      } else {
        await areasApi.createArea(result);
      }
      
      await fetchAreas();
      setFormOpen(false);
      setSelectedArea(undefined);
    } catch (error) {
      console.error('Failed to save area:', error);
    }
  };

  const columns: ColumnDef<Area>[] = [
    {
      accessorKey: 'name',
      header: 'Area Name',
    },
    {
      accessorKey: 'code',
      header: 'Code',
    },
    {
      accessorKey: 'capacity',
      header: 'Capacity',
    },
    {
      accessorKey: 'description',
      header: 'Description',
    },
    {
      id: 'devices',
      header: 'Devices',
      cell: ({ row }) => {
        const deviceCount = row.original.devices.length;
        return <span>{deviceCount} device{deviceCount !== 1 ? 's' : ''}</span>;
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const area = row.original;
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
                  setSelectedArea(area);
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
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Area Management</CardTitle>
            <CardDescription>Manage voting areas and their configurations</CardDescription>
          </div>
          <Button onClick={() => setFormOpen(true)}>
            <PlusIcon className="mr-2 h-4 w-4" />
            Add Area
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <DataTable
          columns={columns}
          data={areas}
          searchKey="name"
          searchPlaceholder="Search areas..."
        />
      </CardContent>

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedArea ? 'Edit Area' : 'Add New Area'}
            </DialogTitle>
          </DialogHeader>
          
          <SurveyForm
            schema={areaFormSchema}
            data={selectedArea ? {
              name: selectedArea.name,
              code: selectedArea.code,
              description: selectedArea.description,
              capacity: selectedArea.capacity
            } : undefined}
            onComplete={handleFormComplete}
          />
        </DialogContent>
      </Dialog>
    </Card>
  );
}