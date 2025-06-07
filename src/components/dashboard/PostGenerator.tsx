
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Sparkles } from "lucide-react";
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

interface PostGeneratorProps {
  input: string;
  setInput: (value: string) => void;
  selectedTemplate: string;
  setSelectedTemplate: (value: string) => void;
  useEmojis: boolean;
  setUseEmojis: (value: boolean) => void;
  useHashtags: boolean;
  setUseHashtags: (value: boolean) => void;
  isGenerating: boolean;
  quota: { used: number; total: number };
  showSpark: boolean;
  onGenerate: () => void;
}

const builtInTemplates: Template[] = [
  { id: "consultant", name: "Consultant", description: "Professional and authoritative insights" },
  { id: "founder", name: "Founder", description: "Entrepreneurial and visionary perspective" },
  { id: "vc", name: "VC", description: "Investment-focused market analysis" },
  { id: "sales", name: "Sales", description: "Engaging and relationship-building" },
  { id: "hr", name: "HR", description: "People-focused and empathetic" },
];

export const PostGenerator = ({
  input,
  setInput,
  selectedTemplate,
  setSelectedTemplate,
  useEmojis,
  setUseEmojis,
  useHashtags,
  setUseHashtags,
  isGenerating,
  quota,
  showSpark,
  onGenerate
}: PostGeneratorProps) => {
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
      <Card className="bg-white border-0 rounded-xl shadow-lg hover:ring-1 hover:ring-mint/10 transition-all duration-200">
        <CardHeader>
          <CardTitle className="font-heading text-midnight">Create Your Post</CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          <div>
            <Label htmlFor="post-input" className="text-base font-semibold">
              Enter a topic or paste a URL
            </Label>
            <Input
              id="post-input"
              placeholder="e.g., 'AI in professional services' or paste an article URL"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="mt-2 border-slate/20 focus:ring-mint/40"
              aria-label="Post topic input"
            />
          </div>
          
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
          
          <div className="flex items-center justify-between pt-4 border-t border-slate/10">
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-2">
                <Switch
                  id="emojis"
                  checked={useEmojis}
                  onCheckedChange={setUseEmojis}
                  className="data-[state=checked]:bg-mint"
                  aria-label="Include emojis toggle"
                />
                <Label htmlFor="emojis">Include emojis</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="hashtags"
                  checked={useHashtags}
                  onCheckedChange={setUseHashtags}
                  className="data-[state=checked]:bg-mint"
                  aria-label="Include hashtags toggle"
                />
                <Label htmlFor="hashtags">Include hashtags</Label>
              </div>
            </div>
            
            <div className="relative">
              <Button
                onClick={onGenerate}
                disabled={!input.trim() || isGenerating}
                className="bg-neon text-midnight hover:bg-neon/90 px-6 transform hover:scale-105 active:scale-110 transition-transform duration-100"
                aria-label="Generate post content"
              >
                {isGenerating ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-midnight/30 border-t-midnight rounded-full animate-spin" />
                    <span>Generating...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-4 h-4" />
                    <span>Generate</span>
                  </div>
                )}
              </Button>
              
              {showSpark && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 text-lg animate-spark-float pointer-events-none">
                  ✨
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Custom Template Wizard */}
      <CustomTemplateWizard
        isOpen={showCustomWizard}
        onClose={() => setShowCustomWizard(false)}
        onTemplateCreated={handleTemplateCreated}
      />
    </>
  );
};
