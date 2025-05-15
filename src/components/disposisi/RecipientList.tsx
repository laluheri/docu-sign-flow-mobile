
import { useRecipientsList } from "@/hooks/useRecipientsList";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

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

  // Safe value for the RadioGroup that handles null, undefined, and valid cases
  const safeSelectedValue = selectedRecipient !== null && selectedRecipient !== undefined 
    ? selectedRecipient.toString() 
    : undefined;

  return (
    <div className="border rounded-md p-2 max-h-60 overflow-y-auto">
      <RadioGroup 
        value={safeSelectedValue}
        onValueChange={(value) => onRecipientSelect(parseInt(value, 10))}
        className="space-y-1"
      >
        {recipients.map((recipient) => (
          <div 
            key={recipient.user_id} 
            className="flex items-center hover:bg-muted p-2 rounded-md"
          >
            <RadioGroupItem 
              value={recipient.user_id.toString()} 
              id={`recipient-${recipient.user_id}`}
              className="mr-3"
            />
            <label 
              htmlFor={`recipient-${recipient.user_id}`}
              className="flex-1 cursor-pointer text-sm"
            >
              <div className="font-medium">{recipient.user_name}</div>
              <div className="text-xs text-muted-foreground">{recipient.skpd_name}</div>
            </label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};
