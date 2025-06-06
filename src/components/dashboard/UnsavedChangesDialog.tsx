
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

interface UnsavedChangesDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const UnsavedChangesDialog = ({ 
  isOpen, 
  onClose, 
  onConfirm 
}: UnsavedChangesDialogProps) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
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
            onClick={onConfirm}
            className="h-11 bg-midnight text-white hover:bg-midnight/90 rounded-lg"
          >
            Discard Changes
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
