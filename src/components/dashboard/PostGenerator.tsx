
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Sparkles } from "lucide-react";
import { CustomTemplateWizard } from "@/components/CustomTemplateWizard";
import { CreateCustomCard } from "@/components/CreateCustomCard";
import { CustomTemplateCard } from "@/components/CustomTemplateCard";
import { useCustomTemplates } from "@/hooks/useCustomTemplates";

interface Template {
  id: string;
  name: string;
  description: string;
  color: string;
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

const templates: Template[] = [
  { id: "consultant", name: "Consultant", description: "Professional and authoritative tone", color: "bg-blue-500" },
  { id: "founder", name: "Founder", description: "Entrepreneurial and visionary", color: "bg-purple-500" },
  { id: "vc", name: "VC", description: "Investment-focused insights", color: "bg-green-500" },
  { id: "sales", name: "Sales", description: "Engaging and relationship-focused", color: "bg-orange-500" },
  { id: "hr", name: "HR", description: "People and culture focused", color: "bg-pink-500" },
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

  const isCustomTemplateSelected = selectedTemplate.startsWith('custom-');
  const selectedCustomTemplateId = isCustomTemplateSelected ? selectedTemplate.replace('custom-', '') : '';

  return (
    <>
      <Card className="bg-white border-0 rounded-xl shadow-lg hover:ring-1 hover:ring-mint/10 transition-all duration-200">
        <CardHeader>
          <CardTitle className="font-heading text-midnight">Create Your Post</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
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
          
          <div>
            <Label className="text-base font-semibold mb-3 block">Choose your style</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {/* Built-in templates */}
              {templates.map((template) => (
                <div
                  key={template.id}
                  onClick={() => setSelectedTemplate(template.id)}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 hover:bg-mint/5 ${
                    selectedTemplate === template.id
                      ? 'border-neon bg-mint/10 shadow-lg border-l-4 border-l-neon'
                      : 'border-slate/20 hover:border-neon/50'
                  }`}
                  role="button"
                  tabIndex={0}
                  aria-label={`Select ${template.name} template`}
                >
                  <div className={`w-3 h-3 rounded-full ${template.color} mb-2 transition-all duration-120`} />
                  <div className="font-semibold text-midnight text-sm">{template.name}</div>
                  <div className="text-xs text-slate">{template.description}</div>
                </div>
              ))}

              {/* Create Custom Card */}
              <CreateCustomCard
                isPro={isPro}
                onClick={handleCreateCustomClick}
              />

              {/* Custom templates loading state */}
              {loadingTemplates && (
                <div className="p-4 rounded-xl border-2 border-slate/20 bg-slate/5">
                  <div className="text-center space-y-2">
                    <div className="w-4 h-4 border-2 border-slate/30 border-t-slate rounded-full animate-spin mx-auto" />
                    <div className="text-xs text-slate">Loading templates...</div>
                  </div>
                </div>
              )}

              {/* Custom templates */}
              {!loadingTemplates && customTemplates.map((template) => (
                <CustomTemplateCard
                  key={template.id}
                  template={template}
                  isSelected={selectedCustomTemplateId === template.id}
                  onSelect={handleCustomTemplateSelect}
                  onDelete={deleteTemplate}
                />
              ))}
            </div>
          </div>
          
          <div className="flex items-center justify-between pt-4">
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
