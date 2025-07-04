import { UseFormReturn } from 'react-hook-form';

export interface StepProps {
  form: UseFormReturn<any>;
  onNext: (data: any) => void;
  onPrevious?: () => void;
  canGoBack?: boolean;
  isLastStep?: boolean;
  defaultValues?: Record<string, any>;
}
