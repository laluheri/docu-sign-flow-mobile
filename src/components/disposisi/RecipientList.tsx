
import { FormControl, FormMessage } from "@/components/ui/form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Check, Loader2 } from "lucide-react";

interface Recipient {
  user_id: number;
  user_name: string;
  skpd_name: string;
}

interface RecipientListProps {
  recipients: Recipient[];
  selectedRecipients: number[];
  isLoading: boolean;
  searchQuery: string;
  onSelectRecipient: (recipientId: number, selected: boolean) => void;
}

export const RecipientList = ({
  recipients,
  selectedRecipients,
  isLoading,
  searchQuery,
  onSelectRecipient,
}: RecipientListProps) => {
  const filteredRecipients = searchQuery.trim() === ""
    ? recipients
    : recipients.filter(recipient => 
        recipient.user_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recipient.skpd_name.toLowerCase().includes(searchQuery.toLowerCase())
      );

  return (
    <FormControl>
      <div className="relative">
        <ScrollArea className="border rounded-md p-2 h-48">
          {isLoading ? (
            <div className="flex justify-center py-4">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : filteredRecipients.length > 0 ? (
            <div className="space-y-2">
              {filteredRecipients.map((recipient) => (
                <div 
                  key={recipient.user_id} 
                  className={`flex items-center p-2 rounded-md ${
                    selectedRecipients.includes(recipient.user_id) 
                      ? 'bg-primary/10 border border-primary/30' 
                      : 'hover:bg-muted/50'
                  }`}
                >
                  <input
                    type="checkbox"
                    id={`recipient-${recipient.user_id}`}
                    value={recipient.user_id}
                    className="mr-2"
                    onChange={(e) => {
                      onSelectRecipient(recipient.user_id, e.target.checked);
                    }}
                    checked={selectedRecipients.includes(recipient.user_id)}
                  />
                  <label 
                    htmlFor={`recipient-${recipient.user_id}`} 
                    className="text-sm flex-1 cursor-pointer"
                  >
                    <span className="font-medium">{recipient.user_name}</span>
                    <br />
                    <span className="text-xs text-muted-foreground">{recipient.skpd_name}</span>
                  </label>
                  {selectedRecipients.includes(recipient.user_id) && (
                    <Check className="h-4 w-4 text-primary" />
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              No recipients found
            </div>
          )}
        </ScrollArea>
      </div>
      <FormMessage />
    </FormControl>
  );
};
