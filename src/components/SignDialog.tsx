
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
}

const SignDialog = ({ isOpen, onClose, onConfirm }: SignDialogProps) => {
  const [passphrase, setPassphrase] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
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
    
    // Simulate API call for signature verification
    setTimeout(() => {
      setIsLoading(false);
      onConfirm();
      toast({
        title: "Success",
        description: "Document has been signed successfully",
      });
    }, 1500);
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
