'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { Button } from '../../components/ui/button';
import { SurveyForm } from '../../components/shared/survey-form';
import { voterFormSchema } from '../../lib/survey-schemas';
import { Voter } from '../../lib/types';
import { votersApi } from '../../lib/mock-api';

interface AddVoterFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  voter?: Voter;
  onSuccess?: () => void;
}

export function AddVoterForm({ open, onOpenChange, voter, onSuccess }: AddVoterFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleComplete = async (result: any) => {
    setIsSubmitting(true);
    
    try {
      await votersApi.createVoter(result);
      onSuccess?.();
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to save voter:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {voter ? 'Edit Voter' : 'Add New Voter'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <SurveyForm
            schema={voterFormSchema}
            data={voter ? {
              firstName: voter.firstName,
              lastName: voter.lastName,
              email: voter.email,
              voterId: voter.voterId,
              area: voter.area,
              eligibilityGroup: voter.eligibilityGroup
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