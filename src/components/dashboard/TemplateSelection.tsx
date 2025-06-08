import { useState } from "react";
import { CustomTemplateWizard } from "@/components/CustomTemplateWizard";
import { BuiltInTemplateGrid } from "@/components/templates/BuiltInTemplateGrid";
import { CustomTemplateSection } from "@/components/templates/CustomTemplateSection";
import { CreateFirstCustomSection } from "@/components/templates/CreateFirstCustomSection";
import { PricingModal } from "@/components/PricingModal";
import { useCustomTemplates } from "@/hooks/useCustomTemplates";
import { useQuota } from "@/hooks/useQuota";

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
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const { templates: customTemplates, loading: loadingTemplates, deleteTemplate, refreshTemplates } = useCustomTemplates();
  const { plan, currentUsage, totalQuota, resetDate } = useQuota();

  // Check if user has access to custom templates (Pro or Legend)
  const isPro = plan === 'pro' || plan === 'legend';

  const handleCreateCustomClick = () => {
    if (isPro) {
      setShowCustomWizard(true);
    } else {
      setShowUpgradeModal(true);
    }
  };

  const handleUpgradeClick = () => {
    setShowUpgradeModal(true);
  };

  const handleCustomTemplateSelect = (templateId: string) => {
    setSelectedTemplate(`custom-${templateId}`);
  };

  const handleTemplateCreated = () => {
    refreshTemplates();
  };

  const handleUpgradeModalClose = () => {
    setShowUpgradeModal(false);
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
            onUpgrade={handleUpgradeClick}
            loading={loadingTemplates}
            isPro={isPro}
          />
        ) : !loadingTemplates ? (
          <CreateFirstCustomSection
            onCreateNew={handleCreateCustomClick}
            onUpgrade={handleUpgradeClick}
            isPro={isPro}
          />
        ) : null}
      </div>

      {/* Custom Template Wizard - Only for Pro/Legend users */}
      {isPro && (
        <CustomTemplateWizard
          isOpen={showCustomWizard}
          onClose={() => setShowCustomWizard(false)}
          onTemplateCreated={handleTemplateCreated}
          onShowUpgrade={() => setShowUpgradeModal(true)}
        />
      )}

      {/* Upgrade Modal */}
      <PricingModal
        isOpen={showUpgradeModal}
        onClose={handleUpgradeModalClose}
        currentUsage={currentUsage}
        limit={totalQuota}
        resetDate={resetDate}
      />
    </>
  );
};
