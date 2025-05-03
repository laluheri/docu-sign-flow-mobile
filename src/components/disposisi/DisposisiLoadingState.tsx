
import { Loader2 } from "lucide-react";

export const DisposisiLoadingState = ({ message = "Loading..." }: { message?: string }) => {
  return (
    <div className="mobile-container">
      <div className="page-content flex flex-col items-center justify-center min-h-[70vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
        <p className="text-muted-foreground">{message}</p>
      </div>
    </div>
  );
};
