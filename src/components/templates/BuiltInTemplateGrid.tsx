
import { TemplateIcon } from "./TemplateIcon";

interface Template {
  id: string;
  name: string;
  description: string;
}

interface BuiltInTemplateGridProps {
  templates: Template[];
  selectedTemplate: string;
  onSelect: (templateId: string) => void;
}

export const BuiltInTemplateGrid = ({ templates, selectedTemplate, onSelect }: BuiltInTemplateGridProps) => {
  return (
    <div>
      <h3 className="text-lg font-semibold text-midnight mb-4">Choose Your Style</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((template) => (
          <div
            key={template.id}
            onClick={() => onSelect(template.id)}
            className={`p-4 rounded-xl cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 ${
              selectedTemplate === template.id
                ? 'bg-gradient-to-br from-mint/20 to-neon/10 border-2 border-neon shadow-lg'
                : 'bg-white border-2 border-slate/20 hover:border-neon/50'
            }`}
            role="button"
            tabIndex={0}
            aria-label={`Select ${template.name} template`}
          >
            <div className="flex items-center space-x-3 mb-2">
              <div className={`p-2 rounded-lg ${
                selectedTemplate === template.id 
                  ? 'bg-neon/20' 
                  : 'bg-slate/10'
              }`}>
                <TemplateIcon 
                  templateId={template.id} 
                  className={`w-5 h-5 ${
                    selectedTemplate === template.id 
                      ? 'text-midnight' 
                      : 'text-slate'
                  }`} 
                />
              </div>
              <div className="font-semibold text-midnight">{template.name}</div>
            </div>
            <div className="text-sm text-slate leading-relaxed">
              {template.description}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
