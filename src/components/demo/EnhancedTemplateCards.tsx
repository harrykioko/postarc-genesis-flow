
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Briefcase, Rocket, Handshake, TrendingUp, Users, Crown } from 'lucide-react';

interface Template {
  id: string;
  name: string;
  description: string;
  icon: any;
  preview: string;
  isPopular?: boolean;
}

interface EnhancedTemplateCardsProps {
  selectedTemplate: string;
  onTemplateSelect: (templateId: string) => void;
}

const templates: Template[] = [
  { 
    id: "Consultant", 
    name: "Consultant", 
    description: "Professional and authoritative tone",
    icon: Briefcase,
    preview: "Share strategic insights with executive-level authority",
    isPopular: true
  },
  { 
    id: "Founder", 
    name: "Founder", 
    description: "Entrepreneurial and visionary",
    icon: Rocket,
    preview: "Tell your startup journey with inspiring authenticity"
  },
  { 
    id: "Sales", 
    name: "Sales", 
    description: "Engaging and relationship-focused",
    icon: Handshake,
    preview: "Build connections with conversational storytelling"
  },
  { 
    id: "VC", 
    name: "VC", 
    description: "Analytical and forward-thinking",
    icon: TrendingUp,
    preview: "Analyze market trends with investor perspective"
  },
  { 
    id: "HR", 
    name: "HR", 
    description: "Empathetic and people-focused",
    icon: Users,
    preview: "Connect with human stories and workplace wisdom"
  },
];

export const EnhancedTemplateCards = ({ selectedTemplate, onTemplateSelect }: EnhancedTemplateCardsProps) => {
  const [hoveredTemplate, setHoveredTemplate] = useState<string | null>(null);

  return (
    <div>
      <Label className="text-base font-semibold mb-3 block">Choose your professional voice</Label>
      <div className="grid gap-3">
        {templates.map((template) => {
          const Icon = template.icon;
          const isSelected = selectedTemplate === template.id;
          const isHovered = hoveredTemplate === template.id;
          
          return (
            <motion.div
              key={template.id}
              onClick={() => onTemplateSelect(template.id)}
              onHoverStart={() => setHoveredTemplate(template.id)}
              onHoverEnd={() => setHoveredTemplate(null)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 ${
                isSelected
                  ? 'border-neon bg-neon/10 shadow-lg shadow-neon/25'
                  : 'border-gray-200 hover:border-neon/50 bg-white/50'
              }`}
            >
              {/* Popular Badge */}
              {template.isPopular && (
                <div className="absolute -top-2 -right-2">
                  <Badge className="bg-neon text-midnight font-medium text-xs px-2 py-1">
                    <Crown className="w-3 h-3 mr-1" />
                    Most Popular
                  </Badge>
                </div>
              )}

              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                  isSelected ? 'bg-neon/20' : 'bg-slate/10'
                }`}>
                  <Icon className={`w-5 h-5 ${isSelected ? 'text-neon' : 'text-slate'}`} />
                </div>
                
                <div className="flex-1">
                  <div className="font-semibold text-midnight">{template.name}</div>
                  <div className="text-sm text-slate">{template.description}</div>
                </div>
              </div>

              {/* Hover Preview */}
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ 
                  height: isHovered || isSelected ? 'auto' : 0,
                  opacity: isHovered || isSelected ? 1 : 0
                }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <p className="text-xs text-slate italic">
                    "{template.preview}"
                  </p>
                </div>
              </motion.div>

              {/* Selection Glow */}
              {isSelected && (
                <motion.div
                  className="absolute inset-0 rounded-lg bg-gradient-to-r from-neon/20 to-transparent"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
