
import { Button } from "@/components/ui/button";

interface DemoLimitReachedProps {
  onClose: () => void;
  onPricingClick?: () => void;
  onSignUpClick?: () => void;
}

export const DemoLimitReached = ({ onClose, onPricingClick, onSignUpClick }: DemoLimitReachedProps) => {
  return (
    <div className="glass-card p-4 rounded-lg text-center">
      <h4 className="font-semibold text-midnight mb-2">🎉 Impressed with the results?</h4>
      <p className="text-sm text-slate mb-3">
        Compare our Free and Pro plans to find the perfect fit for your needs.
      </p>
      <Button 
        className="btn-neon w-full" 
        onClick={() => {
          onClose();
          if (onPricingClick) {
            onPricingClick();
          } else {
            onSignUpClick?.();
          }
        }}
      >
        {onPricingClick ? "See Pricing Options" : "Get Started Free - No Credit Card Required"}
      </Button>
    </div>
  );
};
