
interface StepNavigationProps {
  steps: any[];
  activeStep: number;
  onStepClick: (stepId: number) => void;
}

export const StepNavigation = ({ steps, activeStep, onStepClick }: StepNavigationProps) => (
  <div className="flex items-center space-x-3 pt-6">
    {steps.map((step) => (
      <button
        key={step.id}
        onClick={() => onStepClick(step.id)}
        className={`transition-all duration-300 ${
          activeStep === step.id 
            ? 'w-8 h-2 bg-neon rounded-full' 
            : 'w-2 h-2 bg-gray-300 rounded-full hover:bg-gray-400'
        }`}
        aria-label={`Go to step ${step.id}`}
      />
    ))}
  </div>
);
