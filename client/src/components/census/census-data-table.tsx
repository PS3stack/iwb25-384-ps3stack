'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DataTable } from '@/components/ui/data-table';
import { CensusProject } from '@/lib/types/census';
import { format } from 'date-fns';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { EllipsisVerticalIcon, PencilIcon, ChartBarIcon, UsersIcon } from '@heroicons/react/24/outline';

interface CensusDataTableProps {
  onEdit?: (project: CensusProject) => void;
  onViewResults?: (project: CensusProject) => void;
}

export function CensusDataTable({ onEdit, onViewResults }: CensusDataTableProps) {
  const [projects, setProjects] = useState<CensusProject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data fetch
    const fetchProjects = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setProjects([
        {
          id: '1',
          title: 'National Population Census 2024',
          description: 'Comprehensive population and housing census',
          startDate: '2024-03-01T00:00:00',
          endDate: '2024-06-30T23:59:59',
          status: 'active',
          isPublic: true,
          targetPopulation: 50000000,
          currentResponses: 12500000,
          completionRate: 25,
          createdAt: '2024-01-15T10:00:00Z',
          updatedAt: '2024-02-20T14:30:00Z'
        },
        {
          id: '2',
          title: 'Economic Survey 2024',
          description: 'Annual economic indicators survey',
          startDate: '2024-01-01T00:00:00',
          endDate: '2024-12-31T23:59:59',
          status: 'completed',
          isPublic: false,
          targetPopulation: 1000000,
          currentResponses: 950000,
          completionRate: 95,
          createdAt: '2023-12-01T09:00:00Z',
          updatedAt: '2024-01-05T16:45:00Z'
        }
      ]);
      setLoading(false);
    };

    fetchProjects();
  }, []);

  const getStatusColor = (status: CensusProject['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'archived':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const columns: ColumnDef<CensusProject>[] = [
    {
      accessorKey: 'title',
      header: 'Project Title',
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue('title')}</div>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.getValue('status') as CensusProject['status'];
        return (
          <Badge className={getStatusColor(status)}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        );
      },
    },
    {
      id: 'progress',
      header: 'Progress',
      cell: ({ row }) => {
        const project = row.original;
        return (
          <div className="space-y-1">
            <div className="text-sm font-medium">
              {project.completionRate}% Complete
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${project.completionRate}%` }}
              />
            </div>
            <div className="text-xs text-gray-500">
              {project.currentResponses.toLocaleString()} / {project.targetPopulation.toLocaleString()}
            </div>
          </div>
        );
      },
    },
    {
      id: 'schedule',
      header: 'Schedule',
      cell: ({ row }) => {
        const project = row.original;
        return (
          <div className="text-sm space-y-1">
            <div>Start: {format(new Date(project.startDate), 'MMM dd, yyyy')}</div>
            <div>End: {format(new Date(project.endDate), 'MMM dd, yyyy')}</div>
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
        const project = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <EllipsisVerticalIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit?.(project)}>
                <PencilIcon className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onViewResults?.(project)}>
                <ChartBarIcon className="mr-2 h-4 w-4" />
                View Results
              </DropdownMenuItem>
              <DropdownMenuItem>
                <UsersIcon className="mr-2 h-4 w-4" />
                Manage Collectors
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <DataTable
        columns={columns}
        data={projects}
        searchKey="title"
        searchPlaceholder="Search census projects..."
        loading={loading}
      />
    </motion.div>
  );
}