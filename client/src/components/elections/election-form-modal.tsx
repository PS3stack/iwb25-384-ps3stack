'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { Button } from '../../components/ui/button';
import { SurveyForm } from '../../components/shared/survey-form';
import { electionFormSchema } from '../../lib/survey-schemas';
import { Election } from '../../lib/types';
import { electionsApi } from '../../lib/mock-api';

interface ElectionFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  election?: Election;
  onSuccess?: () => void;
}

export function ElectionFormModal({ open, onOpenChange, election, onSuccess }: ElectionFormModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleComplete = async (result: any) => {
    setIsSubmitting(true);
    
    try {
      if (election) {
        await electionsApi.updateElection(election.id, result);
      } else {
        await electionsApi.createElection(result);
      }
      
      onSuccess?.();
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to save election:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {election ? 'Edit Election' : 'Create New Election'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <SurveyForm
            schema={electionFormSchema}
            data={election ? {
              title: election.title,
              description: election.description,
              startDate: election.startDate,
              endDate: election.endDate,
              eligibilityGroup: election.eligibilityGroup,
              isPublic: election.isPublic
            } : undefined}
            onComplete={handleComplete}
          />
          
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}