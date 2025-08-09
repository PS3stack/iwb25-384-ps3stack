'use client';

import { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu';
import { reportsApi } from '../../lib/mock-api';
import { 
  DocumentArrowDownIcon, 
  DocumentTextIcon, 
  TableCellsIcon, 
  DocumentIcon 
} from '@heroicons/react/24/outline';

interface ReportDownloaderProps {
  electionId: string;
}

export function ReportDownloader({ electionId }: ReportDownloaderProps) {
  const [downloading, setDownloading] = useState<string | null>(null);

  const handleDownload = async (format: 'pdf' | 'csv' | 'excel') => {
    setDownloading(format);
    
    try {
      const response = await reportsApi.generateReport(format, electionId);
      if (response.success) {
        // In a real app, this would trigger an actual download
        window.open(response.data.downloadUrl, '_blank');
      }
    } catch (error) {
      console.error('Failed to generate report:', error);
    } finally {
      setDownloading(null);
    }
  };

  const reportOptions = [
    {
      format: 'pdf' as const,
      label: 'PDF Report',
      description: 'Complete election results with charts and analysis',
      icon: DocumentTextIcon
    },
    {
      format: 'csv' as const,
      label: 'CSV Data',
      description: 'Raw voting data for analysis',
      icon: TableCellsIcon
    },
    {
      format: 'excel' as const,
      label: 'Excel Report',
      description: 'Formatted spreadsheet with pivot tables',
      icon: DocumentIcon
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Download Reports</CardTitle>
        <CardDescription>
          Export election results in various formats for analysis and archival
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-3">
          {reportOptions.map((option) => {
            const Icon = option.icon;
            const isDownloading = downloading === option.format;
            
            return (
              <Button
                key={option.format}
                variant="outline"
                className="h-auto p-4 flex flex-col items-center gap-2"
                onClick={() => handleDownload(option.format)}
                disabled={isDownloading}
              >
                <Icon className="h-8 w-8 text-blue-600" />
                <div className="text-center">
                  <div className="font-medium">
                    {isDownloading ? 'Generating...' : option.label}
                  </div>
                  <div className="text-xs text-gray-600 mt-1">
                    {option.description}
                  </div>
                </div>
              </Button>
            );
          })}
        </div>

        <div className="mt-6">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="w-full">
                <DocumentArrowDownIcon className="mr-2 h-4 w-4" />
                Quick Download
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuItem onClick={() => handleDownload('pdf')}>
                <DocumentTextIcon className="mr-2 h-4 w-4" />
                Download PDF
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDownload('csv')}>
                <TableCellsIcon className="mr-2 h-4 w-4" />
                Download CSV
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDownload('excel')}>
                <DocumentIcon className="mr-2 h-4 w-4" />
                Download Excel
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );
}