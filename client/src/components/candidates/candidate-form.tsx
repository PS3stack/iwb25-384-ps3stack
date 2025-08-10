'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { Button } from '../../components/ui/button';
import { SurveyForm } from '../../components/shared/survey-form';
import { candidateFormSchema } from '../../lib/survey-schemas';
import { Candidate } from '../../lib/types';
import { candidatesApi } from '../../lib/mock-api';

interface CandidateFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  candidate?: Candidate;
  onSuccess?: () => void;
}

export function CandidateForm({ open, onOpenChange, candidate, onSuccess }: CandidateFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleComplete = async (result: any) => {
    setIsSubmitting(true);
    
    try {
      await candidatesApi.createCandidate(result);
      onSuccess?.();
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to save candidate:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {candidate ? 'Edit Candidate' : 'Add New Candidate'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <SurveyForm
            schema={candidateFormSchema}
            data={candidate ? {
              firstName: candidate.firstName,
              lastName: candidate.lastName,
              party: candidate.party,
              assignedArea: candidate.assignedArea,
              biography: candidate.biography
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