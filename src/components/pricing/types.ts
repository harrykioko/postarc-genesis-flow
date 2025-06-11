
import { LucideIcon } from 'lucide-react';

export interface PricingTier {
  id: string;
  name: string;
  price: string;
  period: string;
  quota: string;
  icon: LucideIcon;
  features: string[];
  limitations?: string[];
  cta: string;
  popular: boolean;
  disabled?: boolean;
  stripeTier?: string;
  description?: string;
}
