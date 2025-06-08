
import { Button } from "@/components/ui/button";
import { CustomTemplateCard } from "@/components/CustomTemplateCard";
import { Plus, Lock } from "lucide-react";

interface CustomTemplate {
  id: string;
  name: string;
  foundation_type: string;
  tone_attributes: string[];
  structure_type: string;
  industry_context: string | null;
}

interface CustomTemplateSectionProps {
  templates: CustomTemplate[];
  selectedTemplate: string;
  onSelect: (templateId: string) => void;
  onDelete: (templateId: string) => void;
  onCreateNew: () => void;
  loading?: boolean;
  isPro: boolean;
}

export const CustomTemplateSection = ({ 
  templates, 
  selectedTemplate, 
  onSelect, 
  onDelete, 
  onCreateNew,
  loading,
  isPro
}: CustomTemplateSectionProps) => {
  const selectedCustomTemplateId = selectedTemplate.startsWith('custom-') 
    ? selectedTemplate.replace('custom-', '') 
    : '';

  if (loading) {
    return (
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-midnight">Your Custom Templates</h3>
          <Button 
            onClick={onCreateNew}
            disabled={!isPro}
            className={isPro 
              ? "bg-neon text-midnight hover:bg-neon/90" 
              : "bg-slate/20 text-slate cursor-not-allowed"
            }
            size="sm"
          >
            {isPro ? (
              <Plus className="w-4 h-4 mr-2" />
            ) : (
              <Lock className="w-4 h-4 mr-2" />
            )}
            Create New Template
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-4 rounded-xl border-2 border-slate/20 bg-slate/5">
              <div className="animate-pulse space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-3 h-3 bg-slate/30 rounded-full" />
                  <div className="w-12 h-4 bg-slate/30 rounded" />
                </div>
                <div className="w-full h-4 bg-slate/30 rounded" />
                <div className="w-3/4 h-3 bg-slate/30 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-midnight">Your Custom Templates</h3>
        <div className="text-right">
          <Button 
            onClick={onCreateNew}
            disabled={!isPro}
            className={isPro 
              ? "bg-neon text-midnight hover:bg-neon/90" 
              : "bg-slate/20 text-slate cursor-not-allowed"
            }
            size="sm"
          >
            {isPro ? (
              <Plus className="w-4 h-4 mr-2" />
            ) : (
              <Lock className="w-4 h-4 mr-2" />
            )}
            Create New Template
          </Button>
          {!isPro && (
            <p className="text-xs text-slate mt-1">
              Upgrade to Pro or Legend for custom templates
            </p>
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((template) => (
          <CustomTemplateCard
            key={template.id}
            template={template}
            isSelected={selectedCustomTemplateId === template.id}
            onSelect={onSelect}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
};
