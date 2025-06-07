
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Sparkles, Loader2, RotateCcw, ChevronDown, ChevronRight, ThumbsUp, Edit3 } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import type { TemplateWizardData } from "../CustomTemplateWizard";
import { buildSystemPromptFromChoices, generateTemplateNameSuggestions } from "@/utils/templatePromptBuilder";

interface TemplatePreviewStepProps {
  wizardData: TemplateWizardData;
  onNameChange: (name: string) => void;
  onTemplateCreated: () => void;
}

export const TemplatePreviewStep = ({ wizardData, onNameChange, onTemplateCreated }: TemplatePreviewStepProps) => {
  const { toast } = useToast();
  const { session } = useAuth();
  const [testTopic, setTestTopic] = useState("Customer retention strategies for SaaS companies");
  const [previewContent, setPreviewContent] = useState("");
  const [isGeneratingPreview, setIsGeneratingPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [customSystemPrompt, setCustomSystemPrompt] = useState("");
  const [previewCharCount, setPreviewCharCount] = useState(0);
  const [hasGeneratedPreview, setHasGeneratedPreview] = useState(false);

  // Generate system prompt and suggest names when component mounts
  useEffect(() => {
    const generatedPrompt = buildSystemPromptFromChoices(wizardData);
    setCustomSystemPrompt(generatedPrompt);
    
    if (!wizardData.name) {
      const suggestions = generateTemplateNameSuggestions(wizardData);
      onNameChange(suggestions[0] || "My Custom Template");
    }
  }, [wizardData, onNameChange]);

  // Update character count when preview content changes
  useEffect(() => {
    setPreviewCharCount(previewContent.length);
  }, [previewContent]);

  const generatePreview = async () => {
    if (!testTopic.trim()) {
      toast({
        title: "Topic required",
        description: "Please enter a topic to test your template.",
        variant: "destructive",
      });
      return;
    }

    setIsGeneratingPreview(true);
    try {
      console.log("🧪 Testing custom template with real AI generation");
      
      const response = await fetch(`https://obmrbvozmozvvxirrils.supabase.co/functions/v1/generate-post`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session?.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic: testTopic.trim(),
          template: 'custom',
          customSystemPrompt: customSystemPrompt,
          hasEmojis: false,
          hasHashtags: false
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || data.message || 'Failed to generate preview');
      }

      setPreviewContent(data.post || data.content || "");
      setHasGeneratedPreview(true);
      
      toast({
        title: "Preview generated! ✨",
        description: "Your custom template is working with real AI.",
      });

    } catch (error: any) {
      console.error('🚨 Preview generation error:', error);
      
      let errorMessage = "Failed to generate preview. Please try again.";
      if (error.message?.includes("quota")) {
        errorMessage = "You've reached your generation limit. Please upgrade or try again later.";
      } else if (error.message?.includes("topic")) {
        errorMessage = "Please try a different topic or make it more specific.";
      }
      
      toast({
        title: "Preview failed",
        description: errorMessage,
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
          system_prompt: customSystemPrompt
        },
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
      });

      if (error) throw error;

      toast({
        title: "Template created successfully! 🎉",
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

  const sampleTopics = [
    "Customer retention strategies for SaaS companies",
    "Remote team management best practices",
    "AI implementation in small businesses",
    "Building company culture during rapid growth",
    "Lessons learned from a failed product launch"
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-semibold text-midnight mb-2">
          Test & save your template
        </h3>
        <p className="text-slate">
          Test your template with real AI generation, then save it for future use
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
          <h4 className="font-medium text-midnight mb-3">Test your template with real AI:</h4>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="test-topic" className="text-sm font-medium">
                Test Topic:
              </Label>
              <Input
                id="test-topic"
                value={testTopic}
                onChange={(e) => setTestTopic(e.target.value)}
                className="mt-2 border-slate/20 focus:ring-mint/40"
                placeholder="Enter a topic to test..."
              />
              
              {/* Sample topics */}
              <div className="mt-2">
                <p className="text-xs text-slate mb-2">Try these topics:</p>
                <div className="flex flex-wrap gap-1">
                  {sampleTopics.map((topic, index) => (
                    <button
                      key={index}
                      onClick={() => setTestTopic(topic)}
                      className="text-xs px-2 py-1 bg-slate/10 text-slate rounded hover:bg-mint/20 hover:text-midnight transition-colors"
                    >
                      {topic}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={generatePreview}
                disabled={!testTopic.trim() || isGeneratingPreview}
                className="bg-neon text-midnight hover:bg-neon/90"
              >
                {isGeneratingPreview ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Testing...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Test Template
                  </>
                )}
              </Button>
              
              {previewContent && (
                <Button
                  variant="outline"
                  onClick={generatePreview}
                  disabled={isGeneratingPreview}
                  className="flex items-center space-x-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Regenerate</span>
                </Button>
              )}
            </div>

            {previewContent && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">Generated Preview:</Label>
                  <span className="text-xs text-slate">
                    {previewCharCount} characters
                  </span>
                </div>
                <Textarea
                  value={previewContent}
                  readOnly
                  className="min-h-[200px] border-slate/20 bg-slate/5 text-sm"
                />
                
                {hasGeneratedPreview && (
                  <div className="flex items-center justify-center space-x-3 pt-2">
                    <div className="flex items-center text-sm text-slate">
                      <ThumbsUp className="w-4 h-4 mr-1 text-mint" />
                      Template is working!
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Advanced Settings */}
        <Collapsible open={showAdvanced} onOpenChange={setShowAdvanced}>
          <CollapsibleTrigger asChild>
            <Button variant="outline" className="w-full justify-between">
              <span className="flex items-center">
                <Edit3 className="w-4 h-4 mr-2" />
                Advanced Settings
              </span>
              {showAdvanced ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-3 mt-3">
            <div>
              <Label className="text-sm font-medium">Custom System Prompt:</Label>
              <Textarea
                value={customSystemPrompt}
                onChange={(e) => setCustomSystemPrompt(e.target.value)}
                className="mt-2 min-h-[120px] border-slate/20 text-sm"
                placeholder="Edit the AI instructions for your template..."
              />
              <p className="text-xs text-slate mt-1">
                Advanced: Customize how the AI generates content with your template
              </p>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Save Template */}
        <div className="flex justify-center pt-4">
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
              <>
                <Sparkles className="w-5 h-5 mr-2" />
                Save Template
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
