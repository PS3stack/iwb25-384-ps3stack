'use client';

import { useState, useEffect } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { DataTable } from '../../components/ui/data-table';
import { Voter } from '../../lib/types';
import { votersApi } from '../../lib/mock-api';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu';
import { EllipsisVerticalIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

export function VoterDataTable() {
  const [voters, setVoters] = useState<Voter[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchVoters = async () => {
    setLoading(true);
    try {
      const response = await votersApi.getVoters();
      if (response.success) {
        setVoters(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch voters:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVoters();
  }, []);

  const getStatusColor = (status: Voter['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'voted':
        return 'bg-blue-100 text-blue-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const columns: ColumnDef<Voter>[] = [
    {
      id: 'name',
      header: 'Name',
      cell: ({ row }) => {
        const voter = row.original;
        return `${voter.firstName} ${voter.lastName}`;
      },
    },
    {
      accessorKey: 'email',
      header: 'Email',
    },
    {
      accessorKey: 'voterId',
      header: 'Voter ID',
    },
    {
      accessorKey: 'area',
      header: 'Area',
    },
    {
      accessorKey: 'eligibilityGroup',
      header: 'Group',
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.getValue('status') as Voter['status'];
        return (
          <Badge className={getStatusColor(status)}>
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
      data={voters}
      searchKey="firstName"
      searchPlaceholder="Search voters..."
    />
  );
}