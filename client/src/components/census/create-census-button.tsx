'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { CensusFormModal } from './census-form-modal';
import { PlusIcon } from '@heroicons/react/24/outline';

interface CreateCensusButtonProps {
  onSuccess?: () => void;
}

export function CreateCensusButton({ onSuccess }: CreateCensusButtonProps) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Button onClick={() => setModalOpen(true)} className="gap-2">
          <PlusIcon className="h-4 w-4" />
          Create Census Project
        </Button>
      </motion.div>

      <CensusFormModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onSuccess={onSuccess}
      />
    </>
  );
}