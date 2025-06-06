
import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { PostModalHeader } from "./PostModalHeader";
import { PostModalContent } from "./PostModalContent";
import { PostModalActions } from "./PostModalActions";
import { UnsavedChangesDialog } from "./UnsavedChangesDialog";

interface GeneratedPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  originalContent: string;
  onCopy: (text: string) => void;
}

export const GeneratedPostModal = ({ 
  isOpen, 
  onClose, 
  originalContent, 
  onCopy 
}: GeneratedPostModalProps) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedContent, setEditedContent] = useState(originalContent);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

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
          <PostModalHeader isEditMode={isEditMode} />
          
          <div className="flex flex-col min-h-0 flex-1">
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
