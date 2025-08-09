'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { Button } from '../../components/ui/button';
import { SurveyForm } from '../../components/shared/survey-form';
import { observerFormSchema } from '../../lib/survey-schemas';
import { Observer } from '../../lib/types';
import { observersApi } from '../../lib/mock-api';

interface AddObserverFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  observer?: Observer;
  onSuccess?: () => void;
}

export function AddObserverForm({ open, onOpenChange, observer, onSuccess }: AddObserverFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleComplete = async (result: any) => {
    setIsSubmitting(true);
    
    try {
      await observersApi.createObserver(result);
      onSuccess?.();
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to save observer:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {observer ? 'Edit Observer' : 'Add New Observer'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <SurveyForm
            schema={observerFormSchema}
            data={observer ? {
              firstName: observer.firstName,
              lastName: observer.lastName,
              email: observer.email,
              phone: observer.phone,
              credentials: observer.credentials,
              assignedAreas: observer.assignedAreas
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