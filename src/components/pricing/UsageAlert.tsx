
import React from 'react';

interface UsageAlertProps {
  currentUsage: number;
  limit: number;
  resetDate: string;
}

export const UsageAlert = ({ currentUsage, limit, resetDate }: UsageAlertProps) => {
  const formatResetDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return "next month";
    }
  };

  if (currentUsage === 0) return null;

  return (
    <div className="p-6 bg-neon/10 border-b border-slate/10">
      <div className="text-center">
        {currentUsage === limit ? (
          <p className="text-midnight font-medium">
            You've used all <strong>{currentUsage}</strong> of your <strong>{limit}</strong> demo posts. Create an account to keep posting!
          </p>
        ) : (
          <>
            <p className="text-midnight font-medium">
              You've used <strong>{currentUsage}</strong> of your <strong>{limit}</strong> free posts this month.
            </p>
            <p className="text-slate text-sm mt-1">
              Your quota resets on {formatResetDate(resetDate)}
            </p>
          </>
        )}
      </div>
    </div>
  );
};
