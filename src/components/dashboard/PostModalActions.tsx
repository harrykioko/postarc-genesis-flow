
import { Button } from "@/components/ui/button";
import { Copy, Edit3, Save, X, ExternalLink, Check } from "lucide-react";

interface PostModalActionsProps {
  isEditMode: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onCopy: () => void;
  onShare: () => void;
}

export const PostModalActions = ({
  isEditMode,
  onEdit,
  onSave,
  onCancel,
  onCopy,
  onShare
}: PostModalActionsProps) => {
  return (
    <div className="flex flex-wrap items-center justify-end gap-3 flex-shrink-0">
      {isEditMode ? (
        <>
          <Button
            variant="outline"
            onClick={onCancel}
            className="h-11 px-4 border border-gray-300 hover:border-gray-400 bg-white hover:bg-gray-50 text-gray-700 rounded-lg transition-all duration-200 flex items-center gap-2"
          >
            <X className="w-4 h-4" />
            Cancel
          </Button>
          <Button
            onClick={onSave}
            className="h-11 px-4 bg-[#00FFC2] hover:bg-[#00FFC2]/90 text-[#0B1C34] font-medium rounded-lg transition-all duration-200 flex items-center gap-2"
          >
            <Check className="w-4 h-4" />
            Save
          </Button>
        </>
      ) : (
        <Button
          variant="outline"
          onClick={onEdit}
          className="h-11 px-4 border border-gray-300 hover:border-gray-400 bg-white hover:bg-gray-50 text-gray-700 rounded-lg transition-all duration-200 flex items-center gap-2"
        >
          <Edit3 className="w-4 h-4" />
          Edit
        </Button>
      )}
      
      <Button
        variant="outline"
        onClick={onCopy}
        className="h-11 px-4 bg-gray-100 hover:bg-gray-200 border border-gray-200 text-gray-700 rounded-lg transition-all duration-200 flex items-center gap-2"
      >
        <Copy className="w-4 h-4" />
        Copy
      </Button>
      
      <Button
        onClick={onShare}
        className="h-11 px-4 bg-[#0077B5] hover:bg-[#0077B5]/90 text-white font-medium rounded-lg transition-all duration-200 flex items-center gap-2"
      >
        <ExternalLink className="w-4 h-4" />
        Share
      </Button>
    </div>
  );
};
