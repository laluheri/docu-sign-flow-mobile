
import { useRecipientsList } from "@/hooks/useRecipientsList";

interface RecipientListProps {
  skpdGenerate: string | number | undefined;
  selectedRecipients: number[];
  onRecipientToggle: (userId: number) => void;
}

export const RecipientList = ({
  skpdGenerate,
  selectedRecipients,
  onRecipientToggle
}: RecipientListProps) => {
  const { recipients, isLoading } = useRecipientsList({ skpdGenerate });

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
    <div className="border rounded-md divide-y max-h-60 overflow-y-auto">
      {recipients.map((recipient) => (
        <div 
          key={recipient.user_id} 
          className="flex items-center p-2 hover:bg-muted"
        >
          <input 
            type="checkbox" 
            id={`recipient-${recipient.user_id}`}
            checked={selectedRecipients.includes(recipient.user_id)}
            onChange={() => onRecipientToggle(recipient.user_id)}
            className="mr-3 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
          />
          <label 
            htmlFor={`recipient-${recipient.user_id}`}
            className="flex-1 cursor-pointer"
          >
            <div className="text-sm font-medium">{recipient.user_name}</div>
            <div className="text-xs text-muted-foreground">{recipient.skpd_name}</div>
          </label>
        </div>
      ))}
    </div>
  );
};
