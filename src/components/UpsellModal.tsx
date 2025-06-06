
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Crown, Check } from "lucide-react";
import { format } from "date-fns";

interface UpsellModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: () => void;
  currentUsage: number;
  limit: number;
  resetDate: string;
}

export const UpsellModal = ({
  isOpen,
  onClose,
  onUpgrade,
  currentUsage,
  limit,
  resetDate,
}: UpsellModalProps) => {
  const formatResetDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMMM do, yyyy");
    } catch {
      return "next month";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden bg-white border-0 rounded-2xl shadow-2xl">
        <div className="p-8 text-center">
          {/* Header Section */}
          <div className="mb-6">
            <div className="w-16 h-16 bg-neon/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Crown className="w-8 h-8 text-neon" />
            </div>
            <DialogHeader>
              <DialogTitle className="text-2xl font-heading font-bold text-midnight mb-2">
                You've reached your monthly limit!
              </DialogTitle>
            </DialogHeader>
            <p className="text-slate text-lg">
              You've used all {currentUsage} of your {limit} free posts this month.
            </p>
          </div>

          {/* Benefits Section */}
          <div className="glass-card p-6 rounded-xl mb-6 bg-gradient-to-br from-neon/10 to-mint/5 border border-neon/20">
            <h3 className="text-xl font-heading font-semibold text-midnight mb-4">
              Upgrade to Pro and get:
            </h3>
            
            <div className="space-y-3 mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 bg-neon rounded-full flex items-center justify-center">
                  <Check className="w-3 h-3 text-midnight" />
                </div>
                <span className="text-midnight font-medium">Unlimited post generations</span>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 bg-neon rounded-full flex items-center justify-center">
                  <Check className="w-3 h-3 text-midnight" />
                </div>
                <span className="text-midnight font-medium">All premium templates</span>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 bg-neon rounded-full flex items-center justify-center">
                  <Check className="w-3 h-3 text-midnight" />
                </div>
                <span className="text-midnight font-medium">Priority support</span>
              </div>
            </div>

            <div className="text-center">
              <div className="text-3xl font-heading font-bold text-midnight">
                $25
                <span className="text-lg font-normal text-slate">/month</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 mb-4">
            <Button 
              onClick={onUpgrade}
              className="w-full btn-neon py-3 text-lg font-semibold rounded-lg"
            >
              Upgrade to Pro - $25/month
            </Button>
            
            <Button 
              onClick={onClose}
              variant="outline"
              className="w-full py-3 text-lg font-medium border-slate/30 text-slate hover:bg-slate/5"
            >
              Maybe later
            </Button>
          </div>

          {/* Footer */}
          <p className="text-sm text-slate">
            Your free quota resets on {formatResetDate(resetDate)}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
