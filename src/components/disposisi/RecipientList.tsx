
import { useRecipientsList } from "@/hooks/useRecipientsList";
import { Check } from "lucide-react";

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
      <div className="text-xs text-muted-foreground px-2 py-1 mb-2 bg-muted/50 rounded">
        Select one recipient only
      </div>
      <ul className="space-y-1">
        {recipients.map((recipient) => (
          <li 
            key={recipient.user_id} 
            onClick={() => onRecipientSelect(recipient.user_id)}
            className={`flex items-center hover:bg-muted p-2 rounded-md cursor-pointer ${
              selectedRecipient === recipient.user_id ? "bg-primary/10 border-l-4 border-primary" : ""
            }`}
          >
            <div className="flex-1">
              <div className="font-medium text-sm">{recipient.user_name}</div>
              <div className="text-xs text-muted-foreground">{recipient.skpd_name}</div>
            </div>
            {selectedRecipient === recipient.user_id && (
              <Check className="h-4 w-4 text-primary ml-2 flex-shrink-0" />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};
