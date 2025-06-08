
import { Button } from "@/components/ui/button";
import { Plus, Lock } from "lucide-react";

interface CreateFirstCustomSectionProps {
  onCreateNew: () => void;
  onUpgrade?: () => void;
  isPro: boolean;
}

export const CreateFirstCustomSection = ({ onCreateNew, onUpgrade, isPro }: CreateFirstCustomSectionProps) => {
  const handleButtonClick = () => {
    if (isPro) {
      onCreateNew();
    } else {
      onUpgrade?.();
    }
  };

  return (
    <div className={`text-center py-6 px-4 rounded-xl border-2 border-dashed transition-all ${
      isPro 
        ? 'bg-gradient-to-br from-slate/5 to-mint/5 border-slate/30 py-8' 
        : 'bg-slate/5 border-slate/20 py-6'
    }`}>
      <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 ${
        isPro 
          ? 'w-16 h-16 mb-4 bg-gradient-to-r from-neon/20 to-mint/20' 
          : 'bg-slate/20'
      }`}>
        {isPro ? (
          <Plus className={isPro ? "w-8 h-8 text-neon" : "w-6 h-6 text-slate"} />
        ) : (
          <Lock className="w-6 h-6 text-slate" />
        )}
      </div>
      
      <h3 className={`font-semibold text-midnight mb-2 ${
        isPro ? 'text-lg' : 'text-base'
      }`}>
        Create Your First Custom Template
      </h3>
      
      <p className={`text-slate mb-4 max-w-md mx-auto ${
        isPro ? 'mb-6 text-base' : 'text-sm mb-4'
      }`}>
        {isPro 
          ? "Design a template that perfectly matches your unique voice and industry expertise."
          : "Upgrade to Pro or Legend to create custom templates tailored to your specific needs."
        }
      </p>

      <Button
        onClick={handleButtonClick}
        className={isPro 
          ? "bg-neon text-midnight hover:bg-neon/90" 
          : "bg-neon text-midnight hover:bg-neon/90"
        }
      >
        {isPro ? (
          <>
            <Plus className="w-4 h-4 mr-2" />
            Create Your First Template
          </>
        ) : (
          <>
            <Lock className="w-4 h-4 mr-2" />
            Upgrade to Pro or Legend
          </>
        )}
      </Button>
    </div>
  );
};
