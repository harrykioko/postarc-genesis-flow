
import { Sparkles, Crown, Zap } from "lucide-react";
import { PricingTier } from "./types";

export const pricingTiers: PricingTier[] = [
  {
    id: 'free',
    name: 'Free',
    price: '$0',
    period: 'forever',
    quota: '5 posts/month',
    icon: Sparkles,
    features: [
      '5 posts per month',
      '5 basic templates',
      'Copy & share to LinkedIn',
      '7-day post history'
    ],
    limitations: [
      'No post editing',
      'Limited templates', 
      'Basic support only'
    ],
    cta: 'Get Started',
    popular: false,
    disabled: true
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '$9',
    period: 'per month',
    quota: '15 posts/month',
    icon: Crown,
    features: [
      '15 posts per month',
      'All premium templates',
      'Full post editing',
      'Unlimited post history',
      'Priority support',
      'Save drafts'
    ],
    cta: 'Start Pro',
    popular: true,
    stripeTier: 'pro'
  },
  {
    id: 'legend',
    name: 'Legend',
    price: '$25',
    period: 'per month',
    quota: 'Unlimited posts',
    icon: Zap,
    features: [
      'Unlimited posts',
      'Advanced analytics',
      'Content calendar',
      'Team features',
      'Priority support',
      'Custom templates',
      'API access'
    ],
    cta: 'Go Legend',
    popular: false,
    stripeTier: 'legend'
  }
];
