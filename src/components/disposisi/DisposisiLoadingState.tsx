
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft } from "lucide-react";

interface DisposisiLoadingStateProps {
  onBack?: () => void;
}

export const DisposisiLoadingState = ({ onBack }: DisposisiLoadingStateProps) => {
  return (
    <div className="mobile-container">
      <div className="page-content">
        <div className="flex items-center mb-6">
          {onBack && (
            <Button variant="ghost" size="icon" onClick={onBack} className="mr-2">
              <ArrowLeft size={20} />
            </Button>
          )}
          <div className="animate-pulse w-3/4">
            <div className="h-6 bg-muted rounded w-full mb-2"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
          </div>
        </div>
        
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-muted rounded w-full"></div>
          <Card className="p-4">
            <div className="space-y-4">
              <div className="h-4 bg-muted rounded w-1/4"></div>
              <div className="h-6 bg-muted rounded w-3/4"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
              <div className="h-6 bg-muted rounded w-full"></div>
              <Separator />
              <div className="h-20 bg-muted rounded w-full"></div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="h-60 bg-muted rounded w-full"></div>
          </Card>
        </div>
      </div>
    </div>
  );
};
