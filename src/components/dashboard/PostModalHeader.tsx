
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface PostModalHeaderProps {
  isEditMode: boolean;
}

export const PostModalHeader = ({ isEditMode }: PostModalHeaderProps) => {
  return (
    <DialogHeader className="pb-4 flex-shrink-0">
      <DialogTitle className="font-heading text-xl text-midnight pr-8">
        {isEditMode ? "Edit Your Post" : "Generated Post"}
      </DialogTitle>
    </DialogHeader>
  );
};
