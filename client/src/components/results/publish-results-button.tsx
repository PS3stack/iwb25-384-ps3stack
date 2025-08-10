'use client';

import { useState } from 'react';
import { Button } from '../../components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog';
import { reportsApi } from '../../lib/mock-api';
import { CheckCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { Alert, AlertDescription } from '../../components/ui/alert';

interface PublishResultsButtonProps {
  electionId: string;
  disabled?: boolean;
}

export function PublishResultsButton({ electionId, disabled }: PublishResultsButtonProps) {
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState(false);

  const handlePublish = async () => {
    setIsPublishing(true);
    
    try {
      const response = await reportsApi.publishResults(electionId);
      if (response.success) {
        setPublishSuccess(true);
        setTimeout(() => {
          setConfirmDialogOpen(false);
          setPublishSuccess(false);
        }, 2000);
      }
    } catch (error) {
      console.error('Failed to publish results:', error);
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <>
      <Button
        onClick={() => setConfirmDialogOpen(true)}
        disabled={disabled}
        className="bg-green-600 hover:bg-green-700"
      >
        <CheckCircleIcon className="mr-2 h-4 w-4" />
        Publish Results
      </Button>

      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ExclamationTriangleIcon className="h-5 w-5 text-amber-500" />
              Confirm Results Publication
            </DialogTitle>
            <DialogDescription>
              This action will make the election results publicly available. 
              Once published, the results cannot be unpublished or modified.
            </DialogDescription>
          </DialogHeader>

          {publishSuccess && (
            <Alert>
              <CheckCircleIcon className="h-4 w-4" />
              <AlertDescription>
                Results have been published successfully!
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Before publishing, ensure:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• All votes have been counted and verified</li>
                <li>• Results have been reviewed by authorized personnel</li>
                <li>• Any disputes have been resolved</li>
                <li>• Legal requirements have been met</li>
              </ul>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setConfirmDialogOpen(false)}
              disabled={isPublishing}
            >
              Cancel
            </Button>
            <Button
              onClick={handlePublish}
              disabled={isPublishing || publishSuccess}
              className="bg-green-600 hover:bg-green-700"
            >
              {isPublishing ? 'Publishing...' : publishSuccess ? 'Published!' : 'Publish Results'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}