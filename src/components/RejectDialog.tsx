
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

interface RejectDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  documentId?: string;
}

const RejectDialog = ({ isOpen, onClose, onConfirm, documentId }: RejectDialogProps) => {
  const [reason, setReason] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!reason.trim()) {
      toast({
        title: "Error",
        description: "Please provide a reason for rejection",
        variant: "destructive"
      });
      return;
    }

    if (!documentId) {
      toast({
        title: "Error",
        description: "Document ID is missing",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Call the API to reject the document
      const apiUrl = `https://ttd.lombokutarakab.go.id/api/ttd?content_id=${documentId}&reason=${encodeURIComponent(reason)}`;
      
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "Accept": "application/json"
        }
      });
      
      const responseData = await response.json();
      
      if (!responseData.status) {
        throw new Error(responseData.desc || "Failed to reject document");
      }
      
      toast({
        title: "Success",
        description: "Document has been rejected successfully",
      });
      
      onConfirm();
    } catch (error) {
      toast({
        title: "Rejection Failed",
        description: error instanceof Error ? error.message : "Failed to reject document",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Reject Document</DialogTitle>
            <DialogDescription>
              Please provide a reason why you are rejecting this document.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <Label htmlFor="reason" className="block mb-2">
              Reason for Rejection
            </Label>
            <Textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Enter your reason for rejecting this document"
              className="w-full min-h-[100px]"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" variant="destructive" disabled={isLoading}>
              {isLoading ? "Rejecting..." : "Reject Document"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RejectDialog;
