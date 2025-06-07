
import { MoreHorizontal, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface CustomTemplate {
  id: string;
  name: string;
  foundation_type: string;
  tone_attributes: string[];
  structure_type: string;
  industry_context: string | null;
}

interface CustomTemplateCardProps {
  template: CustomTemplate;
  isSelected: boolean;
  onSelect: (templateId: string) => void;
  onEdit?: (template: CustomTemplate) => void;
  onDelete: (templateId: string) => void;
}

export const CustomTemplateCard = ({ 
  template, 
  isSelected, 
  onSelect, 
  onEdit, 
  onDelete 
}: CustomTemplateCardProps) => {
  const handleSelect = () => {
    onSelect(template.id);
  };

  const getToneDisplay = () => {
    if (template.tone_attributes.length <= 2) {
      return template.tone_attributes.join(", ");
    }
    return `${template.tone_attributes.slice(0, 2).join(", ")} +${template.tone_attributes.length - 2}`;
  };

  return (
    <div className="relative group">
      <div
        onClick={handleSelect}
        className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 hover:bg-mint/5 ${
          isSelected
            ? 'border-neon bg-mint/10 shadow-lg border-l-4 border-l-neon'
            : 'border-slate/20 hover:border-neon/50'
        }`}
      >
        {/* Custom badge */}
        <div className="flex items-start justify-between mb-2">
          <div className="w-3 h-3 rounded-full bg-gradient-to-r from-neon to-mint" />
          <span className="text-xs bg-neon/20 text-midnight px-2 py-1 rounded-full font-medium">
            Custom
          </span>
        </div>

        <div className="space-y-2">
          <div className="font-semibold text-midnight text-sm truncate">
            {template.name}
          </div>
          <div className="text-xs text-slate">
            {getToneDisplay()}
          </div>
          {template.industry_context && (
            <div className="text-xs text-slate/70 italic truncate">
              {template.industry_context}
            </div>
          )}
        </div>
      </div>

      {/* Options menu - visible on hover */}
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 bg-white/80 hover:bg-white/90"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreHorizontal className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-32">
            {onEdit && (
              <DropdownMenuItem onClick={() => onEdit(template)}>
                <Edit className="h-3 w-3 mr-2" />
                Edit
              </DropdownMenuItem>
            )}
            <DropdownMenuItem 
              onClick={() => onDelete(template.id)}
              className="text-red-600 focus:text-red-600"
            >
              <Trash2 className="h-3 w-3 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
