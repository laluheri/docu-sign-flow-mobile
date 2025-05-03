
import { Loader2 } from "lucide-react";

export const DisposisiLoadingState = () => {
  return (
    <div className="mobile-container">
      <div className="page-content flex items-center justify-center min-h-[70vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    </div>
  );
};
