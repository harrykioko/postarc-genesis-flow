
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";

interface PostModalContentProps {
  isEditMode: boolean;
  currentContent: string;
  editedContent: string;
  onContentChange: (content: string) => void;
}

export const PostModalContent = ({ 
  isEditMode, 
  currentContent, 
  editedContent, 
  onContentChange 
}: PostModalContentProps) => {
  return (
    <div className="flex-1 mb-6 min-h-0">
      {isEditMode ? (
        <Textarea
          value={editedContent}
          onChange={(e) => onContentChange(e.target.value)}
          className="h-full min-h-[400px] p-6 bg-white/80 backdrop-blur-sm border border-white/30 rounded-lg resize-none focus:ring-2 focus:ring-[#00FFC2] focus:border-transparent transition-all duration-200 text-sm leading-relaxed overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent hover:scrollbar-thumb-gray-400"
          placeholder="Edit your post content..."
          autoFocus
        />
      ) : (
        <div className="h-full min-h-[400px] bg-white/60 backdrop-blur-sm rounded-lg border border-white/20 overflow-hidden">
          <ScrollArea className="h-full w-full p-6">
            <p className="text-sm text-midnight leading-relaxed whitespace-pre-wrap">
              {currentContent}
            </p>
          </ScrollArea>
        </div>
      )}
    </div>
  );
};
