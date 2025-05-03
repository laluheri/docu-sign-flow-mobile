
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface DisposisiDetailHeaderProps {
  title: string;
  from: string;
  onBack: () => void;
}

export const DisposisiDetailHeader = ({ title, from, onBack }: DisposisiDetailHeaderProps) => {
  return (
    <div className="flex items-center mb-6">
      <Button variant="ghost" size="icon" onClick={onBack} className="mr-2">
        <ArrowLeft size={20} />
      </Button>
      <div>
        <h1 className="text-xl font-bold">{title}</h1>
        <p className="text-sm text-muted-foreground">From: {from}</p>
      </div>
    </div>
  );
};
