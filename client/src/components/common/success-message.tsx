'use client';

import { motion } from 'framer-motion';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircleIcon } from '@heroicons/react/24/outline';

interface SuccessMessageProps {
  message: string;
  autoHide?: boolean;
  duration?: number;
  onHide?: () => void;
}

export function SuccessMessage({ 
  message, 
  autoHide = true, 
  duration = 3000,
  onHide 
}: SuccessMessageProps) {
  React.useEffect(() => {
    if (autoHide && onHide) {
      const timer = setTimeout(onHide, duration);
      return () => clearTimeout(timer);
    }
  }, [autoHide, duration, onHide]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
    >
      <Alert className="border-green-200 bg-green-50">
        <CheckCircleIcon className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-800">
          {message}
        </AlertDescription>
      </Alert>
    </motion.div>
  );
}