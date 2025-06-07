
import { Plus, Lock } from "lucide-react";

interface CreateCustomCardProps {
  isPro: boolean;
  onClick: () => void;
}

export const CreateCustomCard = ({ isPro, onClick }: CreateCustomCardProps) => {
  return (
    <div
      onClick={onClick}
      className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 ${
        isPro
          ? 'border-dashed border-neon/50 hover:border-neon bg-gradient-to-br from-mint/5 to-neon/5 hover:from-mint/10 hover:to-neon/10'
          : 'border-dashed border-slate/30 bg-slate/5 opacity-70'
      }`}
    >
      <div className="text-center space-y-3 py-2">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto ${
          isPro 
            ? 'bg-gradient-to-r from-neon/20 to-mint/20' 
            : 'bg-slate/20'
        }`}>
          {isPro ? (
            <Plus className="w-6 h-6 text-neon" />
          ) : (
            <Lock className="w-6 h-6 text-slate" />
          )}
        </div>
        
        <div>
          <div className={`font-semibold text-sm ${isPro ? 'text-midnight' : 'text-slate'}`}>
            Create Custom
          </div>
          <div className={`text-xs ${isPro ? 'text-neon' : 'text-slate/70'}`}>
            {isPro ? 'Pro Feature' : 'Upgrade to Pro'}
          </div>
        </div>
      </div>
    </div>
  );
};
