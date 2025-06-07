
import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { PostModalHeader } from "./PostModalHeader";
import { PostModalContent } from "./PostModalContent";
import { PostModalActions } from "./PostModalActions";
import { UnsavedChangesDialog } from "./UnsavedChangesDialog";

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
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedContent, setEditedContent] = useState("");
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  // Early return if no post - prevents any access to undefined properties
  if (!post) return null;

  // Now we can safely access post properties
  const originalContent = post.fullText || post.preview;

  // Reset states when modal opens with new content
  useEffect(() => {
    if (isOpen && originalContent) {
      setEditedContent(originalContent);
      setIsEditMode(false);
    }
  }, [isOpen, originalContent]);

  const hasChanges = editedContent !== originalContent;
  const currentContent = editedContent;
  const characterCount = currentContent.length;

  const handleEdit = () => {
    setIsEditMode(true);
  };

  const handleSave = () => {
    setIsEditMode(false);
    // TODO: Here we would save the edited content to the database
    // This will be implemented when backend integration is ready
  };

  const handleCancel = () => {
    if (hasChanges) {
      setShowConfirmDialog(true);
    } else {
      setIsEditMode(false);
    }
  };

  const handleConfirmCancel = () => {
    setEditedContent(originalContent);
    setIsEditMode(false);
    setShowConfirmDialog(false);
  };

  const handleClose = () => {
    if (isEditMode && hasChanges) {
      setShowConfirmDialog(true);
    } else {
      onClose();
    }
  };

  const handleCopy = () => {
    onCopy(currentContent);
  };

  const handleShare = () => {
    const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.origin)}&summary=${encodeURIComponent(currentContent)}`;
    window.open(linkedinUrl, '_blank', 'width=600,height=400');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      handleClose();
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent 
          className="max-w-2xl max-h-[80vh] md:max-h-[80vh] sm:max-h-[85vh] bg-white/80 backdrop-blur-md border border-white/30 rounded-xl shadow-xl overflow-hidden transition-all duration-300"
          onKeyDown={handleKeyDown}
        >
          <PostModalHeader isEditMode={isEditMode} modalType="preview" />
          
          <div className="flex flex-col min-h-0 flex-1">
            {/* Post Meta */}
            <div className="flex items-center justify-between mb-4 flex-shrink-0">
              <div className="flex items-center space-x-2">
                {post.template && (
                  <Badge variant="outline" className="text-xs border-neon/30 text-neon">
                    {post.template}
                  </Badge>
                )}
                <span className="text-xs text-slate">{post.date}</span>
              </div>
            </div>

            <PostModalContent
              isEditMode={isEditMode}
              currentContent={currentContent}
              editedContent={editedContent}
              onContentChange={setEditedContent}
            />

            {/* Character Count & Status - Fixed at Bottom */}
            <div className="flex items-center justify-between mb-6 text-xs flex-shrink-0">
              <div className="flex items-center gap-3">
                <span className="text-slate font-medium">
                  {characterCount} characters
                </span>
                {hasChanges && !isEditMode && (
                  <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200 text-xs px-2 py-1">
                    Edited
                  </Badge>
                )}
              </div>
            </div>

            <PostModalActions
              isEditMode={isEditMode}
              onEdit={handleEdit}
              onSave={handleSave}
              onCancel={handleCancel}
              onCopy={handleCopy}
              onShare={handleShare}
            />
          </div>
        </DialogContent>
      </Dialog>

      <UnsavedChangesDialog
        isOpen={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        onConfirm={handleConfirmCancel}
      />
    </>
  );
};
