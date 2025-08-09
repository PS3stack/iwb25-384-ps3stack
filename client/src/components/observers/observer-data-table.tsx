'use client';

import { useState, useEffect } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { DataTable } from '../../components/ui/data-table';
import { Observer } from '../../lib/types';
import { observersApi } from '../../lib/mock-api';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu';
import { EllipsisVerticalIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

export function ObserverDataTable() {
  const [observers, setObservers] = useState<Observer[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchObservers = async () => {
    setLoading(true);
    try {
      const response = await observersApi.getObservers();
      if (response.success) {
        setObservers(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch observers:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchObservers();
  }, []);

  const columns: ColumnDef<Observer>[] = [
    {
      id: 'name',
      header: 'Name',
      cell: ({ row }) => {
        const observer = row.original;
        return `${observer.firstName} ${observer.lastName}`;
      },
    },
    {
      accessorKey: 'email',
      header: 'Email',
    },
    {
      accessorKey: 'credentials',
      header: 'Credentials',
    },
    {
      id: 'assignedAreas',
      header: 'Assigned Areas',
      cell: ({ row }) => {
        const areas = row.original.assignedAreas;
        if (areas.length === 0) return <span className="text-gray-500">None</span>;
        return (
          <div className="flex flex-wrap gap-1">
            {areas.slice(0, 2).map((area) => (
              <Badge key={area} variant="outline" className="text-xs">
                {area}
              </Badge>
            ))}
            {areas.length > 2 && (
              <Badge variant="outline" className="text-xs">
                +{areas.length - 2} more
              </Badge>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.getValue('status') as Observer['status'];
        return (
          <Badge className={status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        );
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <EllipsisVerticalIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
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
    <DataTable
      columns={columns}
      data={observers}
      searchKey="firstName"
      searchPlaceholder="Search observers..."
    />
  );
}