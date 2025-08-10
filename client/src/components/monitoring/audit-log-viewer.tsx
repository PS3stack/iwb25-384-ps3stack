'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { DataTable } from '../../components/ui/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { AuditLog } from '../../lib/types';
import { auditLogsApi } from '../../lib/mock-api';
import { format } from 'date-fns';
import { Badge } from '../../components/ui/badge';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

export function AuditLogViewer() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    action: '',
    resource: '',
    dateFrom: '',
    dateTo: ''
  });

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const response = await auditLogsApi.getAuditLogs(filters);
      if (response.success) {
        setLogs(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch audit logs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleSearch = () => {
    fetchLogs();
  };

  const getActionColor = (action: string) => {
    if (action.includes('CREATE')) return 'bg-green-100 text-green-800';
    if (action.includes('UPDATE')) return 'bg-blue-100 text-blue-800';
    if (action.includes('DELETE')) return 'bg-red-100 text-red-800';
    return 'bg-gray-100 text-gray-800';
  };

  const columns: ColumnDef<AuditLog>[] = [
    {
      accessorKey: 'timestamp',
      header: 'Timestamp',
      cell: ({ row }) => {
        const timestamp = row.getValue('timestamp') as string;
        return format(new Date(timestamp), 'MMM dd, yyyy HH:mm:ss');
      },
    },
    {
      accessorKey: 'userName',
      header: 'User',
    },
    {
      accessorKey: 'action',
      header: 'Action',
      cell: ({ row }) => {
        const action = row.getValue('action') as string;
        return (
          <Badge className={getActionColor(action)}>
            {action.replace('_', ' ').toLowerCase().replace(/^./, action[0])}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'resource',
      header: 'Resource',
    },
    {
      accessorKey: 'resourceId',
      header: 'Resource ID',
    },
    {
      id: 'details',
      header: 'Details',
      cell: ({ row }) => {
        const details = row.original.details;
        return (
          <div className="max-w-xs truncate">
            {JSON.stringify(details)}
          </div>
        );
      },
    },
    {
      accessorKey: 'ipAddress',
      header: 'IP Address',
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Audit Log Viewer</CardTitle>
        <CardDescription>
          View and search through all system activities and changes
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filters */}
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-48">
            <Input
              placeholder="Search actions..."
              value={filters.action}
              onChange={(e) => setFilters(prev => ({ ...prev, action: e.target.value }))}
            />
          </div>
          <Select
            value={filters.resource}
            onValueChange={(value) => setFilters(prev => ({ ...prev, resource: value }))}
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Resource type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Resources</SelectItem>
              <SelectItem value="elections">Elections</SelectItem>
              <SelectItem value="candidates">Candidates</SelectItem>
              <SelectItem value="observers">Observers</SelectItem>
              <SelectItem value="voters">Voters</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleSearch} className="flex items-center gap-2">
            <MagnifyingGlassIcon className="h-4 w-4" />
            Search
          </Button>
        </div>

        {/* Data Table */}
        <DataTable
          columns={columns}
          data={logs}
          searchKey="action"
          searchPlaceholder="Search audit logs..."
        />
      </CardContent>
    </Card>
  );
}