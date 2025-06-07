
import { Briefcase, Rocket, TrendingUp, Users, DollarSign } from "lucide-react";

interface TemplateIconProps {
  templateId: string;
  className?: string;
}

const iconMap = {
  consultant: Briefcase,
  founder: Rocket,
  vc: TrendingUp,
  sales: DollarSign,
  hr: Users,
};

export const TemplateIcon = ({ templateId, className = "w-5 h-5" }: TemplateIconProps) => {
  const IconComponent = iconMap[templateId as keyof typeof iconMap] || Briefcase;
  
  return <IconComponent className={className} />;
};
