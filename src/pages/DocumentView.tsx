
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { documents } from "@/data/mockData";
import { ArrowLeft, CheckCircle, XCircle } from "lucide-react";
import SignDialog from "@/components/SignDialog";
import RejectDialog from "@/components/RejectDialog";
import { useToast } from "@/components/ui/use-toast";

const DocumentView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [document, setDocument] = useState(documents.find(doc => doc.id === id));
  const [isSignDialogOpen, setIsSignDialogOpen] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  
  useEffect(() => {
    if (!document) {
      toast({
        title: "Document not found",
        description: "The document you're looking for doesn't exist",
        variant: "destructive"
      });
      navigate("/requests");
      return;
    }
    
    document.title = `${document.title} - Document Signing`;
  }, [document, navigate, toast]);
  
  if (!document) {
    return null;
  }
  
  const handleBack = () => {
    navigate("/requests");
  };
  
  const handleSign = () => {
    // Close dialog and mark as signed
    setIsSignDialogOpen(false);
    
    // In a real app, you would call an API to update the document status
    // For this demo, we'll update our local state
    setTimeout(() => {
      navigate("/requests");
    }, 1000);
  };
  
  const handleReject = () => {
    // Close dialog and mark as rejected
    setIsRejectDialogOpen(false);
    
    // In a real app, you would call an API to update the document status
    // For this demo, we'll update our local state
    setTimeout(() => {
      navigate("/requests");
    }, 1000);
  };

  return (
    <div className="mobile-container">
      <div className="page-content">
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="icon" onClick={handleBack} className="mr-2">
            <ArrowLeft size={20} />
          </Button>
          <div>
            <h1 className="text-xl font-bold">{document.title}</h1>
            <p className="text-sm text-muted-foreground">From: {document.sender}</p>
          </div>
        </div>
        
        <div className="bg-card p-4 rounded-lg border mb-6">
          <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: document.content.replace(/^# (.*$)/gm, '<h1 class="text-xl font-bold mb-4">$1</h1>')
            .replace(/^## (.*$)/gm, '<h2 class="text-lg font-semibold mb-3 mt-4">$1</h2>')
            .replace(/\n/g, '<br />') }} />
        </div>
        
        <div className="flex gap-4 mb-4">
          <Button 
            className="flex-1 gap-2" 
            onClick={() => setIsSignDialogOpen(true)}
          >
            <CheckCircle size={18} />
            Sign
          </Button>
          <Button 
            variant="outline" 
            className="flex-1 gap-2" 
            onClick={() => setIsRejectDialogOpen(true)}
          >
            <XCircle size={18} />
            Reject
          </Button>
        </div>
      </div>
      
      <SignDialog 
        isOpen={isSignDialogOpen} 
        onClose={() => setIsSignDialogOpen(false)}
        onConfirm={handleSign}
      />
      
      <RejectDialog 
        isOpen={isRejectDialogOpen} 
        onClose={() => setIsRejectDialogOpen(false)}
        onConfirm={handleReject}
      />
    </div>
  );
};

export default DocumentView;
