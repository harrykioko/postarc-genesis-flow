
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Copy, Edit3, Save, X, ExternalLink } from "lucide-react";

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
          className="max-w-2xl max-h-[90vh] bg-white/80 backdrop-blur-md border border-white/30 rounded-xl shadow-xl overflow-hidden"
          onKeyDown={handleKeyDown}
        >
          <DialogHeader>
            <DialogTitle className="font-heading text-xl text-midnight pr-8">
              {isEditMode ? "Edit Your Post" : "Generated Post"}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 overflow-y-auto">
            {/* Content Area */}
            <div className="space-y-3">
              {isEditMode ? (
                <Textarea
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  className="min-h-[200px] bg-white/80 backdrop-blur-sm border border-white/30 rounded-lg resize-none focus:ring-2 focus:ring-[#00FFC2] focus:border-transparent"
                  placeholder="Edit your post content..."
                  autoFocus
                />
              ) : (
                <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                  <p className="text-sm text-midnight leading-relaxed whitespace-pre-wrap">
                    {currentContent}
                  </p>
                </div>
              )}

              {/* Character Count & Edited Indicator */}
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                  <span className="text-slate">
                    {characterCount} characters
                  </span>
                  {hasChanges && !isEditMode && (
                    <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">
                      Edited
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-white/20">
              {isEditMode ? (
                <>
                  <Button
                    variant="outline"
                    onClick={handleCancel}
                    className="border-midnight hover:bg-mint hover:text-midnight"
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleSave}
                    className="border-midnight hover:bg-mint hover:text-midnight"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save
                  </Button>
                </>
              ) : (
                <Button
                  variant="outline"
                  onClick={handleEdit}
                  className="border-midnight hover:bg-mint hover:text-midnight"
                >
                  <Edit3 className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              )}
              
              <Button
                variant="outline"
                onClick={handleCopy}
                className="border-midnight hover:bg-mint hover:text-midnight"
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy
              </Button>
              
              <Button
                onClick={handleShare}
                className="bg-[#0A66C2] text-white hover:bg-[#0A66C2]/90"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog for Unsaved Changes */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent className="bg-white border-0 rounded-xl shadow-xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-heading text-midnight">
              Discard Changes?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-slate">
              You have unsaved changes. Are you sure you want to discard them?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-midnight hover:bg-mint hover:text-midnight">
              Keep Editing
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmCancel}
              className="bg-midnight text-white hover:bg-midnight/90"
            >
              Discard Changes
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
