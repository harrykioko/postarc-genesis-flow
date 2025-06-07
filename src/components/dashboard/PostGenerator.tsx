
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PostInputSection } from "./PostInputSection";
import { TemplateSelection } from "./TemplateSelection";
import { PostSettings } from "./PostSettings";
import { GenerateButton } from "./GenerateButton";

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
  return (
    <Card className="bg-white border-0 rounded-xl shadow-lg hover:ring-1 hover:ring-mint/10 transition-all duration-200">
      <CardHeader>
        <CardTitle className="font-heading text-midnight">Create Your Post</CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        <PostInputSection input={input} setInput={setInput} />
        
        <TemplateSelection
          selectedTemplate={selectedTemplate}
          setSelectedTemplate={setSelectedTemplate}
        />
        
        <div className="flex items-center justify-between pt-4 border-t border-slate/10">
          <PostSettings
            useEmojis={useEmojis}
            setUseEmojis={setUseEmojis}
            useHashtags={useHashtags}
            setUseHashtags={setUseHashtags}
          />
          
          <GenerateButton
            onGenerate={onGenerate}
            disabled={!input.trim() || isGenerating}
            isGenerating={isGenerating}
            showSpark={showSpark}
          />
        </div>
      </CardContent>
    </Card>
  );
};
