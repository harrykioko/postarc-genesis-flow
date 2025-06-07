
interface WizardProgressBarProps {
  currentStep: number;
  totalSteps: number;
  completedSteps: Set<number>;
  canGoToStep: (step: number) => boolean;
  goToStep: (step: number) => void;
}

export const WizardProgressBar = ({ 
  currentStep, 
  totalSteps, 
  completedSteps, 
  canGoToStep, 
  goToStep 
}: WizardProgressBarProps) => {
  return (
    <div className="px-6 pb-6">
      <div className="flex items-center space-x-2">
        {Array.from({ length: totalSteps }, (_, i) => {
          const stepNumber = i + 1;
          const isCompleted = completedSteps.has(stepNumber);
          const isCurrent = stepNumber === currentStep;
          const isClickable = canGoToStep(stepNumber);
          
          return (
            <div
              key={i}
              onClick={() => isClickable ? goToStep(stepNumber) : undefined}
              className={`h-2 flex-1 rounded-full transition-all duration-300 ${
                isCurrent
                  ? 'bg-neon ring-2 ring-neon/30'
                  : isCompleted
                  ? 'bg-mint'
                  : 'bg-slate/20'
              } ${isClickable ? 'cursor-pointer hover:bg-opacity-80' : ''}`}
            />
          );
        })}
      </div>
      <p className="text-sm text-slate mt-2">
        Step {currentStep} of {totalSteps}
        {currentStep > 1 && " • Click steps to navigate"}
      </p>
    </div>
  );
};
