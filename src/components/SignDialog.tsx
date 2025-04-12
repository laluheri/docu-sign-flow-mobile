
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

interface SignDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  documentId?: string | number;
  userId?: string | number;
}

const SignDialog = ({ isOpen, onClose, onConfirm, documentId, userId }: SignDialogProps) => {
  const [passphrase, setPassphrase] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!passphrase.trim()) {
      toast({
        title: "Error",
        description: "Please enter your passphrase",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Call the signature API
      const apiUrl = `https://ttd.lombokutarakab.go.id/api/ttd?user_id=${userId}&content_id=${documentId}&passphrase=${encodeURIComponent(passphrase)}`;
      console.log("Calling signature API:", apiUrl);
      
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "Accept": "application/json"
        }
      });
      
      const data = await response.json();
      
      if (!response.ok || !data.status) {
        // Use the desc field from the API response if available
        throw new Error(data.desc || data.message || "Failed to sign document");
      }
      
      // Success - use the desc field for success message
      toast({
        title: "Success",
        description: data.desc || "Document has been signed successfully",
      });
      
      onConfirm();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to sign document",
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
            <DialogTitle>Sign Document</DialogTitle>
            <DialogDescription>
              Please enter your signature passphrase to complete the signing process.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <Label htmlFor="passphrase" className="block mb-2">
              Signature Passphrase
            </Label>
            <Input
              id="passphrase"
              type="password"
              value={passphrase}
              onChange={(e) => setPassphrase(e.target.value)}
              placeholder="Enter your passphrase"
              className="w-full"
              autoComplete="current-password"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Signing..." : "Sign Document"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SignDialog;
