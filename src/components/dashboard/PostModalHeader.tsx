
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface PostModalHeaderProps {
  isEditMode: boolean;
  modalType?: "generated" | "preview";
}

export const PostModalHeader = ({ isEditMode, modalType = "generated" }: PostModalHeaderProps) => {
  const getTitle = () => {
    if (isEditMode) return "Edit Your Post";
    return modalType === "generated" ? "Generated Post" : "Post Preview";
  };

  return (
    <DialogHeader className="pb-4 flex-shrink-0">
      <DialogTitle className="font-heading text-xl text-midnight pr-8">
        {getTitle()}
      </DialogTitle>
    </DialogHeader>
  );
};
