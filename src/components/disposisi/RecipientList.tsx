
import { useRecipientsList } from "@/hooks/useRecipientsList";
import { Check } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface RecipientListProps {
  skpdGenerate: string | number | undefined;
  selectedRecipient: number | null;
  onRecipientSelect: (userId: number) => void;
}

export const RecipientList = ({
  skpdGenerate,
  selectedRecipient,
  onRecipientSelect
}: RecipientListProps) => {
  const { recipients, isLoading } = useRecipientsList({ skpd_generate: skpdGenerate });

  if (isLoading) {
    return (
      <div className="py-4 flex justify-center">
        <div className="animate-spin rounded-full h-5 w-5 border-2 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (recipients.length === 0) {
    return (
      <div className="text-center p-4 border rounded-md">
        <p className="text-muted-foreground">No recipients available</p>
      </div>
    );
  }

  return (
    <div className="border rounded-md p-2 max-h-60 overflow-y-auto">
      <div className="text-xs font-medium text-muted-foreground px-2 py-1 mb-2 bg-muted/50 rounded">
        Select one recipient only
      </div>
      <RadioGroup 
        value={selectedRecipient?.toString() || ""} 
        onValueChange={(value) => onRecipientSelect(parseInt(value, 10))}
        className="space-y-1"
      >
        {recipients.map((recipient) => (
          <div 
            key={recipient.user_id}
            className={`flex items-center p-2 rounded-md hover:bg-muted ${
              selectedRecipient === recipient.user_id ? "bg-primary/10 border-l-2 border-primary" : ""
            }`}
          >
            <RadioGroupItem 
              value={recipient.user_id.toString()} 
              id={`recipient-${recipient.user_id}`}
              className="mr-2"
            />
            <Label 
              htmlFor={`recipient-${recipient.user_id}`}
              className="flex-1 cursor-pointer"
            >
              <div className="font-medium text-sm">{recipient.user_name}</div>
              <div className="text-xs text-muted-foreground">{recipient.skpd_name}</div>
            </Label>
            {selectedRecipient === recipient.user_id && (
              <Check className="h-4 w-4 text-primary ml-2 flex-shrink-0" />
            )}
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};
