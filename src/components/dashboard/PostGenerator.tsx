
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PostInputSection } from "./PostInputSection";
import { TemplateDropdown } from "./TemplateDropdown";
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
  postToLinkedIn: boolean;
  setPostToLinkedIn: (value: boolean) => void;
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
  postToLinkedIn,
  setPostToLinkedIn,
  isGenerating,
  quota,
  showSpark,
  onGenerate
}: PostGeneratorProps) => {
  return (
    <div className="space-y-6">
      {/* Hero Input Section */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 rounded-xl shadow-lg hover:ring-1 hover:ring-mint/10 transition-all duration-200">
        <CardHeader className="pb-4">
          <CardTitle className="font-heading text-midnight">Create Your Post</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 p-8 pt-0">
          <PostInputSection input={input} setInput={setInput} />
          
          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="flex-1 w-full">
              <TemplateDropdown
                selectedTemplate={selectedTemplate}
                setSelectedTemplate={setSelectedTemplate}
              />
            </div>
            
            <GenerateButton
              onGenerate={onGenerate}
              disabled={!input.trim() || isGenerating}
              isGenerating={isGenerating}
              showSpark={showSpark}
            />
          </div>
        </CardContent>
      </Card>

      {/* Secondary Settings Section */}
      <Card className="bg-white/60 backdrop-blur-sm border-0 rounded-xl shadow-md hover:ring-1 hover:ring-mint/10 transition-all duration-200">
        <CardContent className="p-6">
          <PostSettings
            useEmojis={useEmojis}
            setUseEmojis={setUseEmojis}
            useHashtags={useHashtags}
            setUseHashtags={setUseHashtags}
            postToLinkedIn={postToLinkedIn}
            setPostToLinkedIn={setPostToLinkedIn}
          />
        </CardContent>
      </Card>
    </div>
  );
};
