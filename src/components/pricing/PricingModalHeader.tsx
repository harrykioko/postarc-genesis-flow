
import React from 'react';
import { X } from 'lucide-react';

interface PricingModalHeaderProps {
  onClose: () => void;
}

export const PricingModalHeader = ({ onClose }: PricingModalHeaderProps) => {
  return (
    <div className="relative p-6 border-b border-slate/10">
      <button
        onClick={onClose}
        className="absolute right-4 top-4 p-2 hover:bg-gray-100 rounded-full transition-colors focus-enhanced"
        aria-label="Close modal"
      >
        <X className="w-5 h-5 text-slate" />
      </button>
      <div className="text-center">
        <h2 className="text-3xl font-heading font-bold text-midnight mb-2">
          Simple, transparent pricing
        </h2>
        <p className="text-slate text-lg">
          Start free and upgrade when you're ready to scale your thought leadership
        </p>
      </div>
    </div>
  );
};
