
import { ReactNode } from 'react';

interface StatCardProps {
  icon: ReactNode;
  label: string;
  value: string | number;
  subtitle: string;
}

export const StatCard = ({ icon, label, value, subtitle }: StatCardProps) => {
  return (
    <div className="flex items-center justify-between p-3 bg-slate/5 rounded-lg">
      <div className="flex items-center space-x-3">
        <div className="text-neon">
          {icon}
        </div>
        <div>
          <div className="text-xs text-slate font-medium">{label}</div>
          <div className="text-sm font-semibold text-midnight">{value}</div>
          <div className="text-xs text-slate">{subtitle}</div>
        </div>
      </div>
    </div>
  );
};
