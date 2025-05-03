
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface DisposisiNotFoundProps {
  onBack: () => void;
}

export const DisposisiNotFound = ({ onBack }: DisposisiNotFoundProps) => {
  return (
    <div className="mobile-container">
      <div className="page-content">
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="icon" onClick={onBack} className="mr-2">
            <ArrowLeft size={20} />
          </Button>
          <h1 className="text-xl font-bold">Disposisi Not Found</h1>
        </div>
        <div className="bg-muted/50 p-6 rounded-lg text-center">
          <p className="text-muted-foreground">The disposisi document you're looking for doesn't exist or you don't have permission to view it.</p>
          <Button className="mt-4" onClick={onBack}>Go Back</Button>
        </div>
      </div>
    </div>
  );
};
