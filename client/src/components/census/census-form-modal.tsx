'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { SurveyForm } from '@/components/shared/survey-form';
import { censusProjectSchema } from '@/lib/schemas/census-schemas';
import { CensusProject } from '@/lib/types/census';

interface CensusFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project?: CensusProject;
  onSuccess?: () => void;
}

export function CensusFormModal({ 
  open, 
  onOpenChange, 
  project, 
  onSuccess 
}: CensusFormModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleComplete = async (result: any) => {
    setIsSubmitting(true);
    
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Census project data:', result);
      
      onSuccess?.();
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to save census project:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {project ? 'Edit Census Project' : 'Create New Census Project'}
          </DialogTitle>
        </DialogHeader>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          <SurveyForm
            schema={censusProjectSchema}
            data={project ? {
              title: project.title,
              description: project.description,
              startDate: project.startDate,
              endDate: project.endDate,
              targetPopulation: project.targetPopulation,
              isPublic: project.isPublic
            } : undefined}
            onComplete={handleComplete}
          />
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}