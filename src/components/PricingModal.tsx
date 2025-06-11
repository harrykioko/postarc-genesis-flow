
import React from 'react';
import { pricingTiers } from '@/components/pricing/pricingData';
import { PricingModalHeader } from '@/components/pricing/PricingModalHeader';
import { UsageAlert } from '@/components/pricing/UsageAlert';
import { PricingCardsGrid } from '@/components/pricing/PricingCardsGrid';
import { PricingModalFooter } from '@/components/pricing/PricingModalFooter';
import { usePricingModal } from '@/components/pricing/hooks/usePricingModal';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthClick?: () => void;
  currentUsage: number;
  limit: number;
  resetDate: string;
}

export const PricingModal = ({ 
  isOpen, 
  onClose, 
  onAuthClick,
  currentUsage, 
  limit, 
  resetDate 
}: PricingModalProps) => {
  const { loading, handleUpgrade, handleFreeSignup } = usePricingModal(onClose);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-slide-up">
        <PricingModalHeader onClose={onClose} />
        
        <UsageAlert 
          currentUsage={currentUsage}
          limit={limit}
          resetDate={resetDate}
        />

        <div className="p-8">
          <PricingCardsGrid
            pricingTiers={pricingTiers}
            loading={loading}
            onFreeSignup={handleFreeSignup}
            onUpgrade={handleUpgrade}
          />
          
          <PricingModalFooter />
        </div>
      </div>
    </div>
  );
};
