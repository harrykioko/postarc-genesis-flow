
import { Label } from "@/components/ui/label";

interface Template {
  id: string;
  name: string;
  description: string;
}

interface DemoTemplateSelectionProps {
  selectedTemplate: string;
  onTemplateSelect: (templateId: string) => void;
}

const templates: Template[] = [
  { id: "Consultant", name: "Consultant", description: "Professional and authoritative tone" },
  { id: "Founder", name: "Founder", description: "Entrepreneurial and visionary" },
  { id: "Sales", name: "Sales", description: "Engaging and relationship-focused" },
  { id: "VC", name: "VC", description: "Analytical and forward-thinking" },
  { id: "HR", name: "HR", description: "Empathetic and people-focused" },
];

export const DemoTemplateSelection = ({ selectedTemplate, onTemplateSelect }: DemoTemplateSelectionProps) => {
  return (
    <div>
      <Label className="text-base font-semibold mb-3 block">Choose your style</Label>
      <div className="grid gap-2">
        {templates.map((template) => (
          <div
            key={template.id}
            onClick={() => onTemplateSelect(template.id)}
            className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
              selectedTemplate === template.id
                ? 'border-neon bg-neon/10'
                : 'border-gray-200 hover:border-neon/50'
            }`}
          >
            <div className="font-semibold text-midnight">{template.name}</div>
            <div className="text-sm text-slate">{template.description}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
