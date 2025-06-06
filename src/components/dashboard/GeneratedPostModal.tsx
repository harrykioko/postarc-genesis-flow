import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Copy, Edit3, Save, X, ExternalLink, Check } from "lucide-react";

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
          <DialogHeader className="pb-4 flex-shrink-0">
            <DialogTitle className="font-heading text-xl text-midnight pr-8">
              {isEditMode ? "Edit Your Post" : "Generated Post"}
            </DialogTitle>
          </DialogHeader>
          
          <div className="flex flex-col min-h-0 flex-1">
            {/* Content Area - Consistent Height for Both Modes */}
            <div className="flex-1 mb-6 min-h-0">
              {isEditMode ? (
                <Textarea
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  className="h-full min-h-[400px] bg-white/80 backdrop-blur-sm border border-white/30 rounded-lg resize-none focus:ring-2 focus:ring-[#00FFC2] focus:border-transparent transition-all duration-200 text-sm leading-relaxed overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent hover:scrollbar-thumb-gray-400"
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

            {/* Action Buttons - Fixed at Bottom */}
            <div className="flex flex-wrap items-center justify-end gap-3 flex-shrink-0">
              {isEditMode ? (
                <>
                  <Button
                    variant="outline"
                    onClick={handleCancel}
                    className="h-11 px-4 border border-gray-300 hover:border-gray-400 bg-white hover:bg-gray-50 text-gray-700 rounded-lg transition-all duration-200 flex items-center gap-2"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSave}
                    className="h-11 px-4 bg-[#00FFC2] hover:bg-[#00FFC2]/90 text-[#0B1C34] font-medium rounded-lg transition-all duration-200 flex items-center gap-2"
                  >
                    <Check className="w-4 h-4" />
                    Save
                  </Button>
                </>
              ) : (
                <Button
                  variant="outline"
                  onClick={handleEdit}
                  className="h-11 px-4 border border-gray-300 hover:border-gray-400 bg-white hover:bg-gray-50 text-gray-700 rounded-lg transition-all duration-200 flex items-center gap-2"
                >
                  <Edit3 className="w-4 h-4" />
                  Edit
                </Button>
              )}
              
              <Button
                variant="outline"
                onClick={handleCopy}
                className="h-11 px-4 bg-gray-100 hover:bg-gray-200 border border-gray-200 text-gray-700 rounded-lg transition-all duration-200 flex items-center gap-2"
              >
                <Copy className="w-4 h-4" />
                Copy
              </Button>
              
              <Button
                onClick={handleShare}
                className="h-11 px-4 bg-[#0077B5] hover:bg-[#0077B5]/90 text-white font-medium rounded-lg transition-all duration-200 flex items-center gap-2"
              >
                <ExternalLink className="w-4 h-4" />
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
            <AlertDialogCancel className="h-11 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 rounded-lg">
              Keep Editing
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmCancel}
              className="h-11 bg-midnight text-white hover:bg-midnight/90 rounded-lg"
            >
              Discard Changes
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
