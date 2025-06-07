
import { Button } from "@/components/ui/button";
import { Plus, Lock } from "lucide-react";

interface CreateFirstCustomSectionProps {
  onCreateNew: () => void;
  isPro: boolean;
}

export const CreateFirstCustomSection = ({ onCreateNew, isPro }: CreateFirstCustomSectionProps) => {
  return (
    <div className="text-center py-8 px-4 bg-gradient-to-br from-slate/5 to-mint/5 rounded-xl border-2 border-dashed border-slate/30">
      <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
        isPro 
          ? 'bg-gradient-to-r from-neon/20 to-mint/20' 
          : 'bg-slate/20'
      }`}>
        {isPro ? (
          <Plus className="w-8 h-8 text-neon" />
        ) : (
          <Lock className="w-8 h-8 text-slate" />
        )}
      </div>
      
      <h3 className="text-lg font-semibold text-midnight mb-2">
        Create Your First Custom Template
      </h3>
      
      <p className="text-slate mb-6 max-w-md mx-auto">
        {isPro 
          ? "Design a template that perfectly matches your unique voice and industry expertise."
          : "Upgrade to Pro to create custom templates tailored to your specific needs."
        }
      </p>

      <Button
        onClick={onCreateNew}
        disabled={!isPro}
        className={isPro 
          ? "bg-neon text-midnight hover:bg-neon/90" 
          : "bg-slate/20 text-slate cursor-not-allowed"
        }
      >
        <Plus className="w-4 h-4 mr-2" />
        {isPro ? "Create Your First Template" : "Upgrade to Pro"}
      </Button>
    </div>
  );
};
