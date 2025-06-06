
import { Button } from "@/components/ui/button";
import { Loader2, ChevronUp, ChevronDown } from "lucide-react";

interface ViewAllButtonProps {
  showAllPosts: boolean;
  loadingAll: boolean;
  onViewAllClick: () => void;
}

export const ViewAllButton = ({ showAllPosts, loadingAll, onViewAllClick }: ViewAllButtonProps) => {
  return (
    <div className="flex justify-center pt-4">
      <Button 
        variant="outline" 
        onClick={onViewAllClick}
        disabled={loadingAll}
        className="bg-white/60 backdrop-blur-sm border-neon/30 text-neon hover:bg-neon/10 hover:border-neon/50 transition-all duration-200"
      >
        {loadingAll ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Loading...
          </>
        ) : showAllPosts ? (
          <>
            <ChevronUp className="w-4 h-4 mr-2" />
            Show Less
          </>
        ) : (
          <>
            <ChevronDown className="w-4 h-4 mr-2" />
            View All History
          </>
        )}
      </Button>
    </div>
  );
};
