'use client';

import { useState, useEffect } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { DataTable } from '../../components/ui/data-table';
import { Candidate } from '../../lib/types';
import { candidatesApi } from '../../lib/mock-api';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu';
import { EllipsisVerticalIcon, PencilIcon, TrashIcon, AcademicCapIcon } from '@heroicons/react/24/outline';

interface CandidateDataTableProps {
  onEdit?: (candidate: Candidate) => void;
  onManageQualifications?: (candidate: Candidate) => void;
}

export function CandidateDataTable({ onEdit, onManageQualifications }: CandidateDataTableProps) {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCandidates = async () => {
    setLoading(true);
    try {
      const response = await candidatesApi.getCandidates();
      if (response.success) {
        setCandidates(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch candidates:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  const getStatusColor = (status: Candidate['status']) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const columns: ColumnDef<Candidate>[] = [
    {
      id: 'name',
      header: 'Name',
      cell: ({ row }) => {
        const candidate = row.original;
        return `${candidate.firstName} ${candidate.lastName}`;
      },
    },
    {
      accessorKey: 'party',
      header: 'Party',
    },
    {
      accessorKey: 'assignedArea',
      header: 'Assigned Area',
    },
    {
      id: 'qualifications',
      header: 'Qualifications',
      cell: ({ row }) => {
        const qualifications = row.original.qualifications;
        return (
          <div className="flex items-center gap-2">
            <span>{qualifications.length} qualification{qualifications.length !== 1 ? 's' : ''}</span>
          </div>
        );
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.getValue('status') as Candidate['status'];
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
        const candidate = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <EllipsisVerticalIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit?.(candidate)}>
                <PencilIcon className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onManageQualifications?.(candidate)}>
                <AcademicCapIcon className="mr-2 h-4 w-4" />
                Manage Qualifications
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
      data={candidates}
      searchKey="firstName"
      searchPlaceholder="Search candidates..."
    />
  );
}