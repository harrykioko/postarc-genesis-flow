
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Sparkles, Loader2 } from "lucide-react";
import type { TemplateWizardData } from "../CustomTemplateWizard";

interface TemplatePreviewStepProps {
  wizardData: TemplateWizardData;
  onNameChange: (name: string) => void;
  onTemplateCreated: () => void;
}

export const TemplatePreviewStep = ({ wizardData, onNameChange, onTemplateCreated }: TemplatePreviewStepProps) => {
  const { toast } = useToast();
  const { session } = useAuth();
  const [testTopic, setTestTopic] = useState("Customer retention strategies");
  const [previewContent, setPreviewContent] = useState("");
  const [isGeneratingPreview, setIsGeneratingPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const generatePreview = async () => {
    if (!testTopic.trim()) return;

    setIsGeneratingPreview(true);
    try {
      // This would call the generation function with the custom template
      // For now, we'll show a mock preview
      setPreviewContent(
        `I'll never forget the day we lost our biggest client in month 3. Our churn rate spiked to 12% that quarter, and I knew we had to act fast.\n\nHere's what we learned about customer retention:\n\n1. Early warning signals matter more than exit interviews\n2. Success isn't just onboarding - it's ongoing value delivery\n3. Sometimes the best retention strategy is knowing when to let go\n\nThe result? We reduced churn to 3% and increased customer lifetime value by 40%.\n\nWhat's been your biggest lesson in customer retention?`
      );
    } catch (error) {
      toast({
        title: "Preview failed",
        description: "Could not generate preview. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingPreview(false);
    }
  };

  const saveTemplate = async () => {
    if (!wizardData.name.trim()) {
      toast({
        title: "Template name required",
        description: "Please enter a name for your template.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      const { error } = await supabase.functions.invoke('manage-templates', {
        body: {
          name: wizardData.name,
          foundation_type: wizardData.foundation_type,
          tone_attributes: wizardData.tone_attributes,
          structure_type: wizardData.structure_type,
          industry_context: wizardData.industry_context || null,
        },
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
      });

      if (error) throw error;

      toast({
        title: "Template created successfully!",
        description: "Your custom template is now available in the style selector.",
      });

      onTemplateCreated();
    } catch (error) {
      console.error('Error creating template:', error);
      toast({
        title: "Failed to create template",
        description: "Please try again or contact support if the problem persists.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const getFoundationName = (type: string) => {
    const names = {
      fresh: "Start Fresh",
      consultant: "Professional",
      founder: "Entrepreneurial",
      vc: "Investment-Focused",
      sales: "Data-Driven",
      hr: "People-First"
    };
    return names[type as keyof typeof names] || type;
  };

  const getStructureName = (type: string) => {
    const names = {
      story: "Story Format",
      insight_list: "Insight List",
      problem_solution: "Problem/Solution",
      case_study: "Case Study",
      opinion: "Opinion Piece"
    };
    return names[type as keyof typeof names] || type;
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-semibold text-midnight mb-2">
          Name & preview your template
        </h3>
        <p className="text-slate">
          Give your template a memorable name and test how it works
        </p>
      </div>

      <div className="max-w-2xl mx-auto space-y-6">
        {/* Template Name */}
        <div>
          <Label htmlFor="template-name" className="text-base font-medium">
            Template Name
          </Label>
          <Input
            id="template-name"
            placeholder="e.g., My Leadership Style"
            value={wizardData.name}
            onChange={(e) => onNameChange(e.target.value)}
            className="mt-2 border-slate/20 focus:ring-mint/40"
          />
        </div>

        {/* Template Summary */}
        <div className="bg-mint/10 p-4 rounded-lg">
          <h4 className="font-medium text-midnight mb-2">Your Template Summary:</h4>
          <div className="text-sm text-slate space-y-1">
            <p><span className="font-medium">Foundation:</span> {getFoundationName(wizardData.foundation_type)}</p>
            <p><span className="font-medium">Tone:</span> {wizardData.tone_attributes.join(", ")}</p>
            <p><span className="font-medium">Structure:</span> {getStructureName(wizardData.structure_type)}</p>
            {wizardData.industry_context && (
              <p><span className="font-medium">Industry:</span> {wizardData.industry_context}</p>
            )}
          </div>
        </div>

        {/* Test Your Template */}
        <div className="border border-slate/20 rounded-lg p-4">
          <h4 className="font-medium text-midnight mb-3">Test your template:</h4>
          
          <div className="space-y-3">
            <div>
              <Label htmlFor="test-topic" className="text-sm font-medium">
                Topic:
              </Label>
              <Input
                id="test-topic"
                value={testTopic}
                onChange={(e) => setTestTopic(e.target.value)}
                className="mt-1 border-slate/20 focus:ring-mint/40"
              />
            </div>

            <Button
              onClick={generatePreview}
              disabled={!testTopic.trim() || isGeneratingPreview}
              className="bg-neon text-midnight hover:bg-neon/90"
            >
              {isGeneratingPreview ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate Preview
                </>
              )}
            </Button>

            {previewContent && (
              <div>
                <Label className="text-sm font-medium">Sample Output:</Label>
                <Textarea
                  value={previewContent}
                  readOnly
                  className="mt-2 min-h-[150px] border-slate/20 bg-slate/5"
                />
              </div>
            )}
          </div>
        </div>

        {/* Save Template */}
        <div className="flex justify-center">
          <Button
            onClick={saveTemplate}
            disabled={!wizardData.name.trim() || isSaving}
            className="bg-neon text-midnight hover:bg-neon/90 px-8 py-3 text-lg"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Creating Template...
              </>
            ) : (
              "Save Template"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
