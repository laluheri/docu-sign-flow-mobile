
import { Mail } from "lucide-react";

interface DisposisiEmptyStateProps {
  isSearching: boolean;
}

export const DisposisiEmptyState = ({ isSearching }: DisposisiEmptyStateProps) => {
  return (
    <div className="bg-muted/50 p-6 rounded-lg text-center border border-border shadow-sm">
      <Mail className="h-12 w-12 text-muted-foreground mx-auto mb-2 opacity-50" />
      <p className="text-muted-foreground">
        {isSearching 
          ? "No disposisi matching your search query"
          : "No disposisi items found"}
      </p>
    </div>
  );
};
