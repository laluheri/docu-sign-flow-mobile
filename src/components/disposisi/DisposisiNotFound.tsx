
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";

interface DisposisiNotFoundProps {
  onBack: () => void;
}

export const DisposisiNotFound = ({ onBack }: DisposisiNotFoundProps) => {
  return (
    <div className="mobile-container">
      <div className="page-content">
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="icon" onClick={onBack} className="mr-2">
            <Mail size={20} />
          </Button>
          <h1 className="text-xl font-bold">Document Not Found</h1>
        </div>
        
        <div className="bg-muted/50 p-6 rounded-lg text-center border border-border">
          <Mail className="h-12 w-12 text-muted-foreground mx-auto mb-2 opacity-50" />
          <h2 className="text-lg font-medium mb-2">Disposisi Not Found</h2>
          <p className="text-muted-foreground mb-4">
            The disposisi document you're looking for doesn't exist or you don't have permission to view it.
          </p>
          <Button onClick={onBack}>
            Go Back to Disposisi List
          </Button>
        </div>
      </div>
    </div>
  );
};
