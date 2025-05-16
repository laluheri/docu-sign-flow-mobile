
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { RecipientList } from "./RecipientList";
import { useRecipientsList } from "@/hooks/useRecipientsList";

interface ForwardDisposisiDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  disposisiId: number;
  skpdGenerate: string | number;
}

export const ForwardDisposisiDrawer = ({
  isOpen,
  onClose,
  disposisiId,
  skpdGenerate
}: ForwardDisposisiDrawerProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedRecipient, setSelectedRecipient] = useState<number | null>(null);
  const [instruction, setInstruction] = useState("");
  const [passphrase, setPassphrase] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Fetch recipients to get the selected recipient's name
  const { recipients } = useRecipientsList({ skpd_generate: skpdGenerate });
  
  const selectedRecipientData = recipients.find(r => r.user_id === selectedRecipient);

  const handleRecipientSelect = (userId: number) => {
    setSelectedRecipient(userId);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedRecipient === null) {
      toast({
        title: "Error",
        description: "Please select a recipient",
        variant: "destructive",
      });
      return;
    }
    
    if (!passphrase) {
      toast({
        title: "Error",
        description: "Please enter your passphrase",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    try {
      if (!disposisiId || !user?.userData?.user_id) {
        throw new Error("Missing required data");
      }
      
      const response = await fetch("https://ttd.lombokutarakab.go.id/api/forwardDisposisi", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          dis_id: disposisiId,
          user_id: user.userData.user_id,
          recipients: [selectedRecipient], // Send as array with single recipient
          instruction,
          passphrase
        }),
      });

      const data = await response.json();
      
      if (!response.ok || !data.status) {
        throw new Error(data.desc || "Failed to forward disposition");
      }

      toast({
        title: "Success",
        description: "Disposition has been forwarded successfully",
      });
      
      onClose();
      
      // Reload page after 1.5 seconds
      setTimeout(() => {
        window.location.href = "/disposisi";
      }, 1500);
    } catch (error) {
      console.error("Error forwarding disposition:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to forward disposition",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex justify-center items-end sm:items-center">
      <div className="bg-background rounded-t-lg sm:rounded-lg w-full max-w-md max-h-[85vh] overflow-hidden flex flex-col shadow-xl animate-in fade-in slide-in-from-bottom">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Forward Disposition</h2>
            <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
              &times;
            </Button>
          </div>
        </div>
        
        <div className="p-4 overflow-y-auto flex-1">
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Select Recipient</h3>
                <RecipientList
                  skpdGenerate={skpdGenerate}
                  selectedRecipient={selectedRecipient}
                  onRecipientSelect={handleRecipientSelect}
                />
                {selectedRecipientData ? (
                  <p className="text-xs text-primary mt-1">
                    Selected recipient: <span className="font-medium">{selectedRecipientData.user_name}</span>
                  </p>
                ) : (
                  <p className="text-xs text-muted-foreground mt-1">
                    No recipient selected
                  </p>
                )}
              </div>
              
              <div>
                <label htmlFor="instruction" className="text-sm font-medium block mb-1">
                  Instruction (optional)
                </label>
                <textarea
                  id="instruction"
                  value={instruction}
                  onChange={(e) => setInstruction(e.target.value)}
                  className="w-full min-h-[100px] p-2 border rounded-md"
                  placeholder="Add instructions for the recipient..."
                />
              </div>
              
              <div>
                <label htmlFor="passphrase" className="text-sm font-medium block mb-1">
                  Your Passphrase
                </label>
                <input
                  id="passphrase"
                  type="password"
                  value={passphrase}
                  onChange={(e) => setPassphrase(e.target.value)}
                  className="w-full p-2 border rounded-md"
                  required
                  placeholder="Enter your passphrase"
                />
              </div>
            </div>
          
            <div className="mt-6 flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting || selectedRecipient === null}>
                {isSubmitting ? (
                  <>
                    <span className="animate-spin mr-2">⏳</span>
                    Forwarding...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Forward
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
