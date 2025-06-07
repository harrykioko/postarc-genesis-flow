
import { useState } from "react";
import { CustomTemplateWizard } from "@/components/CustomTemplateWizard";
import { BuiltInTemplateGrid } from "@/components/templates/BuiltInTemplateGrid";
import { CustomTemplateSection } from "@/components/templates/CustomTemplateSection";
import { CreateFirstCustomSection } from "@/components/templates/CreateFirstCustomSection";
import { useCustomTemplates } from "@/hooks/useCustomTemplates";

interface Template {
  id: string;
  name: string;
  description: string;
}

interface TemplateSelectionProps {
  selectedTemplate: string;
  setSelectedTemplate: (value: string) => void;
}

const builtInTemplates: Template[] = [
  { id: "consultant", name: "Consultant", description: "Professional and authoritative insights" },
  { id: "founder", name: "Founder", description: "Entrepreneurial and visionary perspective" },
  { id: "vc", name: "VC", description: "Investment-focused market analysis" },
  { id: "sales", name: "Sales", description: "Engaging and relationship-building" },
  { id: "hr", name: "HR", description: "People-focused and empathetic" },
];

export const TemplateSelection = ({
  selectedTemplate,
  setSelectedTemplate
}: TemplateSelectionProps) => {
  const [showCustomWizard, setShowCustomWizard] = useState(false);
  const { templates: customTemplates, loading: loadingTemplates, deleteTemplate, refreshTemplates } = useCustomTemplates();

  // For now, assuming Pro status - in real app, get from user context
  const isPro = true; // This should come from user subscription status

  const handleCreateCustomClick = () => {
    if (isPro) {
      setShowCustomWizard(true);
    } else {
      // Show upgrade modal - implementation depends on existing upgrade flow
      console.log("Show upgrade modal");
    }
  };

  const handleCustomTemplateSelect = (templateId: string) => {
    setSelectedTemplate(`custom-${templateId}`);
  };

  const handleTemplateCreated = () => {
    refreshTemplates();
  };

  return (
    <>
      <div className="space-y-8">
        {/* Built-in Templates Section */}
        <BuiltInTemplateGrid
          templates={builtInTemplates}
          selectedTemplate={selectedTemplate}
          onSelect={setSelectedTemplate}
        />

        {/* Custom Templates Section */}
        {customTemplates.length > 0 ? (
          <CustomTemplateSection
            templates={customTemplates}
            selectedTemplate={selectedTemplate}
            onSelect={handleCustomTemplateSelect}
            onDelete={deleteTemplate}
            onCreateNew={handleCreateCustomClick}
            loading={loadingTemplates}
          />
        ) : !loadingTemplates ? (
          <CreateFirstCustomSection
            onCreateNew={handleCreateCustomClick}
            isPro={isPro}
          />
        ) : null}
      </div>

      {/* Custom Template Wizard */}
      <CustomTemplateWizard
        isOpen={showCustomWizard}
        onClose={() => setShowCustomWizard(false)}
        onTemplateCreated={handleTemplateCreated}
      />
    </>
  );
};
