'use client';

import { useState, useEffect } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { DataTable } from '../../components/ui/data-table';
import { ElectionFormModal } from './election-form-modal';
import { Election } from '../../lib/types';
import { electionsApi } from '../../lib/mock-api';
import { format } from 'date-fns';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu';
import { EllipsisVerticalIcon, PencilIcon, ChartBarIcon, UsersIcon } from '@heroicons/react/24/outline';

export function ElectionDataTable() {
  const [elections, setElections] = useState<Election[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedElection, setSelectedElection] = useState<Election | undefined>();
  const [editModalOpen, setEditModalOpen] = useState(false);

  const fetchElections = async () => {
    setLoading(true);
    try {
      const response = await electionsApi.getElections();
      if (response.success) {
        setElections(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch elections:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchElections();
  }, []);

  const getStatusColor = (status: Election['status']) => {
    switch (status) {
      case 'upcoming':
        return 'bg-blue-100 text-blue-800';
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const columns: ColumnDef<Election>[] = [
    {
      accessorKey: 'title',
      header: 'Election Title',
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.getValue('status') as Election['status'];
        return (
          <Badge className={getStatusColor(status)}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        );
      },
    },
    {
      id: 'schedule',
      header: 'Schedule',
      cell: ({ row }) => {
        const election = row.original;
        return (
          <div className="text-sm">
            <div>Start: {format(new Date(election.startDate), 'MMM dd, yyyy HH:mm')}</div>
            <div>End: {format(new Date(election.endDate), 'MMM dd, yyyy HH:mm')}</div>
          </div>
        );
      },
    },
    {
      accessorKey: 'isPublic',
      header: 'Visibility',
      cell: ({ row }) => {
        const isPublic = row.getValue('isPublic') as boolean;
        return (
          <Badge variant={isPublic ? 'default' : 'secondary'}>
            {isPublic ? 'Public' : 'Private'}
          </Badge>
        );
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const election = row.original;
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
                  setSelectedElection(election);
                  setEditModalOpen(true);
                }}
              >
                <PencilIcon className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem>
                <ChartBarIcon className="mr-2 h-4 w-4" />
                View Results
              </DropdownMenuItem>
              <DropdownMenuItem>
                <UsersIcon className="mr-2 h-4 w-4" />
                Manage Voters
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <div className="space-y-4">
      <DataTable
        columns={columns}
        data={elections}
        searchKey="title"
        searchPlaceholder="Search elections..."
      />

      <ElectionFormModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        election={selectedElection}
        onSuccess={() => {
          fetchElections();
          setSelectedElection(undefined);
        }}
      />
    </div>
  );
}