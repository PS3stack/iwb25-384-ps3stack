'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import Papa from 'papaparse';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { CloudArrowUpIcon, DocumentTextIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

interface CSVUploaderProps {
  onDataParsed: (data: any[]) => void;
  expectedHeaders?: string[];
  title?: string;
  description?: string;
  sampleData?: Record<string, string>;
}

export function CSVUploader({
  onDataParsed,
  expectedHeaders,
  title = "Upload CSV File",
  description = "Drop your CSV file here or click to browse",
  sampleData
}: CSVUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [uploadedData, setUploadedData] = useState<any[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
      setErrors(['Please upload a valid CSV file']);
      return;
    }

    setIsUploading(true);
    setErrors([]);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setIsUploading(false);
        
        if (results.errors.length > 0) {
          setErrors(results.errors.map(error => error.message));
          return;
        }

        const data = results.data as any[];
        
        // Validate headers if expected headers are provided
        if (expectedHeaders && data.length > 0) {
          const actualHeaders = Object.keys(data[0]);
          const missingHeaders = expectedHeaders.filter(header => 
            !actualHeaders.includes(header)
          );
          
          if (missingHeaders.length > 0) {
            setErrors([
              `Missing required columns: ${missingHeaders.join(', ')}`
            ]);
            return;
          }
        }

        setUploadedData(data);
        onDataParsed(data);
      },
      error: (error) => {
        setIsUploading(false);
        setErrors([error.message]);
      }
    });
  }, [expectedHeaders, onDataParsed]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.ms-excel': ['.csv']
    },
    maxFiles: 1
  });

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div
            {...getRootProps()}
            className={`
              border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
              ${isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-gray-400'}
              ${isUploading ? 'pointer-events-none opacity-50' : ''}
            `}
          >
            <input {...getInputProps()} />
            <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            {isDragActive ? (
              <p className="text-primary font-medium">Drop the CSV file here...</p>
            ) : (
              <div>
                <p className="text-gray-600 mb-2">
                  {isUploading ? 'Processing file...' : 'Drag & drop a CSV file here, or click to select'}
                </p>
                <Button variant="outline" type="button" disabled={isUploading}>
                  {isUploading ? 'Processing...' : 'Browse Files'}
                </Button>
              </div>
            )}
          </div>

          {errors.length > 0 && (
            <Alert className="mt-4" variant="destructive">
              <ExclamationTriangleIcon className="h-4 w-4" />
              <AlertDescription>
                <ul className="list-disc list-inside">
                  {errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          {uploadedData.length > 0 && (
            <Alert className="mt-4">
              <DocumentTextIcon className="h-4 w-4" />
              <AlertDescription>
                Successfully processed {uploadedData.length} records.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {sampleData && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">CSV Format Guide</CardTitle>
            <CardDescription>Your CSV file should include these columns:</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 rounded-md p-3">
              <code className="text-sm">
                {Object.keys(sampleData).join(', ')}
              </code>
            </div>
            <div className="mt-3 text-sm text-gray-600">
              <p className="font-medium">Example row:</p>
              <div className="bg-gray-50 rounded-md p-2 mt-1">
                <code className="text-xs">
                  {Object.values(sampleData).join(', ')}
                </code>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}