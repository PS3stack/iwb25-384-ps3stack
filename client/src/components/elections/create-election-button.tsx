'use client';

import { useState } from 'react';
import { Button } from '../../components/ui/button';
import { ElectionFormModal } from './election-form-modal';
import { PlusIcon } from '@heroicons/react/24/outline';

interface CreateElectionButtonProps {
  onSuccess?: () => void;
}

export function CreateElectionButton({ onSuccess }: CreateElectionButtonProps) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setModalOpen(true)}>
        <PlusIcon className="mr-2 h-4 w-4" />
        Create Election
      </Button>

      <ElectionFormModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onSuccess={onSuccess}
      />
    </>
  );
}