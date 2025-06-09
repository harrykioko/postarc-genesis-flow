
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Briefcase, Rocket, TrendingUp, DollarSign, Users, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCustomTemplates } from "@/hooks/useCustomTemplates";

interface TemplateDropdownProps {
  selectedTemplate: string;
  setSelectedTemplate: (value: string) => void;
  onCreateCustom: () => void;
  onShowUpgrade?: () => void;
  isPro: boolean;
}

const builtInTemplates = [
  { id: "consultant", name: "Consultant", icon: Briefcase, description: "Professional and authoritative insights" },
  { id: "founder", name: "Founder", icon: Rocket, description: "Entrepreneurial and visionary perspective" },
  { id: "vc", name: "VC", icon: TrendingUp, description: "Investment-focused market analysis" },
  { id: "sales", name: "Sales", icon: DollarSign, description: "Engaging and relationship-building" },
  { id: "hr", name: "HR", icon: Users, description: "People-focused and empathetic" }
];

export const TemplateDropdown = ({ 
  selectedTemplate, 
  setSelectedTemplate, 
  onCreateCustom, 
  onShowUpgrade, 
  isPro 
}: TemplateDropdownProps) => {
  const { templates: customTemplates } = useCustomTemplates();

  // Find the selected template (built-in or custom)
  const selectedBuiltIn = builtInTemplates.find(t => t.id === selectedTemplate);
  const selectedCustom = customTemplates.find(t => `custom-${t.id}` === selectedTemplate);
  
  const getSelectedDisplay = () => {
    if (selectedBuiltIn) {
      const IconComponent = selectedBuiltIn.icon;
      return (
        <div className="flex items-center space-x-2">
          <IconComponent className="w-4 h-4" />
          <span>{selectedBuiltIn.name}</span>
        </div>
      );
    }
    if (selectedCustom) {
      return (
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 rounded bg-gradient-to-r from-mint to-neon/80" />
          <span>{selectedCustom.name}</span>
        </div>
      );
    }
    return "Select a template";
  };

  const handleCreateCustom = () => {
    if (isPro) {
      onCreateCustom();
    } else {
      onShowUpgrade?.();
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="template-select" className="text-base font-semibold">
        Template
      </Label>
      <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
        <SelectTrigger 
          id="template-select" 
          className="h-12 border-slate/20 focus:ring-mint/40 bg-white/90"
        >
          <SelectValue asChild>
            {getSelectedDisplay()}
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="bg-white border-slate/20 shadow-lg">
          {/* Built-in Templates */}
          {builtInTemplates.map((template) => {
            const IconComponent = template.icon;
            return (
              <SelectItem 
                key={template.id} 
                value={template.id}
                className="cursor-pointer hover:bg-mint/10 focus:bg-mint/10"
              >
                <div className="flex items-center space-x-3 py-1">
                  <IconComponent className="w-4 h-4 text-slate" />
                  <div className="flex flex-col">
                    <span className="font-medium">{template.name}</span>
                    <span className="text-xs text-slate/70">{template.description}</span>
                  </div>
                </div>
              </SelectItem>
            );
          })}
          
          {/* Custom Templates */}
          {customTemplates.length > 0 && (
            <>
              <div className="px-2 py-1.5 text-xs font-semibold text-slate/60 border-t border-slate/10 mt-1">
                Custom Templates
              </div>
              {customTemplates.map((template) => (
                <SelectItem 
                  key={`custom-${template.id}`} 
                  value={`custom-${template.id}`}
                  className="cursor-pointer hover:bg-mint/10 focus:bg-mint/10"
                >
                  <div className="flex items-center space-x-3 py-1">
                    <div className="w-4 h-4 rounded bg-gradient-to-r from-mint to-neon/80" />
                    <div className="flex flex-col">
                      <span className="font-medium">{template.name}</span>
                      <span className="text-xs text-slate/70">Custom template</span>
                    </div>
                  </div>
                </SelectItem>
              ))}
            </>
          )}
          
          {/* Create Custom Template Option */}
          <div className="border-t border-slate/10 mt-1">
            <div 
              onClick={handleCreateCustom}
              className="flex items-center space-x-3 py-2 px-2 cursor-pointer hover:bg-mint/10 focus:bg-mint/10 rounded-sm"
            >
              <Plus className="w-4 h-4 text-neon" />
              <div className="flex flex-col">
                <span className="font-medium text-neon">Create Custom Template</span>
                <span className="text-xs text-slate/70">
                  {isPro ? "Build your own template" : "Upgrade to Pro"}
                </span>
              </div>
            </div>
          </div>
        </SelectContent>
      </Select>
    </div>
  );
};
