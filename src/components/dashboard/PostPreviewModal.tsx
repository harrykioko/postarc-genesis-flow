
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ClipboardCopy, ExternalLink } from "lucide-react";

interface Post {
  id: string;
  preview: string;
  date: string;
  fullText?: string;
  template?: string;
}

interface PostPreviewModalProps {
  post: Post | null;
  isOpen: boolean;
  onClose: () => void;
  onCopy: (text: string) => void;
}

export const PostPreviewModal = ({ post, isOpen, onClose, onCopy }: PostPreviewModalProps) => {
  if (!post) return null;

  // Use fullText if available, otherwise fall back to preview
  const contentToDisplay = post.fullText || post.preview;

  const handleCopy = () => {
    onCopy(contentToDisplay);
  };

  const handleLinkedInOpen = () => {
    const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.origin)}&summary=${encodeURIComponent(contentToDisplay)}`;
    window.open(linkedinUrl, '_blank', 'width=600,height=400');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] bg-white border-0 rounded-xl shadow-xl">
        <DialogHeader>
          <DialogTitle className="font-heading text-xl text-midnight">Post Preview</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Post Meta */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {post.template && (
                <Badge variant="outline" className="text-xs border-neon/30 text-neon">
                  {post.template}
                </Badge>
              )}
              <span className="text-xs text-slate">{post.date}</span>
            </div>
          </div>

          {/* Post Content */}
          <div className="bg-slate/5 rounded-lg p-4 border border-slate/10">
            <p className="text-sm text-midnight leading-relaxed whitespace-pre-wrap">
              {contentToDisplay}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-3 pt-4">
            <Button
              variant="outline"
              onClick={handleCopy}
              className="border-midnight hover:bg-mint hover:text-midnight"
            >
              <ClipboardCopy className="w-4 h-4 mr-2" />
              Copy to Clipboard
            </Button>
            <Button
              onClick={handleLinkedInOpen}
              className="bg-midnight text-white hover:bg-midnight/90"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Open in LinkedIn
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
