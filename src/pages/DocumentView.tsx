import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle, XCircle, FileText, Download, Eye } from "lucide-react";
import SignDialog from "@/components/SignDialog";
import RejectDialog from "@/components/RejectDialog";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

interface UserData {
  user_id: number;
  user_name: string;
  user_email: string;
  user_level_id: number;
  skpd_name: string;
  skpd_generate: string;
  user_username?: string;
  nik?: string;
  user_phone?: string;
  user_status?: string;
  user_check?: string;
  token?: string | null;
  user_kepala_daerah?: string;
  user_create_date?: string;
  user_spesimen?: string | null;
}

interface PasspressData {
  pp_id: number;
  content_id: number;
  user_id: number;
  pp_create_date: string;
  user_ttd: UserData;
}

interface DocumentData {
  content_id: number;
  user_from: number;
  user_to: number;
  content_title: string;
  content_alias: string;
  content_file: string;
  content_file_signed: string | null;
  content_sign_type: string;
  content_desc: string;
  content_status: string;
  uploaded_by: number;
  skpd_generate: string;
  content_create_date: string;
  user_dari: UserData;
  user_tujuan: UserData;
  passpress?: PasspressData[];
}

interface ApiResponseData {
  current_page: number;
  data: DocumentData[];
}

interface ApiResponse {
  status: boolean;
  desc: number;
  data: ApiResponseData;
}

const DocumentView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [documentData, setDocumentData] = useState<DocumentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSignDialogOpen, setIsSignDialogOpen] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  
  const TEST_PDF_URL = "https://spks.or.id/file/publikasi/Test.pdf";
  
  useEffect(() => {
    if (!id || !user?.userData) {
      toast({
        title: "Error",
        description: "Invalid document ID or user not logged in",
        variant: "destructive"
      });
      navigate("/requests");
      return;
    }
    
    fetchDocumentDetails();
  }, [id, user]);
  
  const fetchDocumentDetails = async () => {
    if (!id || !user?.userData) return;
    
    setLoading(true);
    try {
      const params = new URLSearchParams({
        user_id: user.userData.user_id?.toString() || "",
        user_level_id: user.userData.user_level_id?.toString() || "",
        skpd_generate: user.userData.skpd_generate || "",
        content_id: id
      });
      
      const apiUrl = `https://ttd.lombokutarakab.go.id/api/getDoc?${params.toString()}`;
      console.log("Fetching document from:", apiUrl);
      
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "Accept": "application/json"
        }
      });
      
      const responseData: ApiResponse = await response.json();
      
      if (!response.ok || !responseData.status) {
        throw new Error("Failed to fetch document details");
      }
      
      const docDataArray = responseData.data?.data;
      if (!docDataArray || docDataArray.length === 0) {
        throw new Error("Document not found");
      }
      
      const targetDocument = docDataArray.find(doc => doc.content_id.toString() === id);
      
      if (!targetDocument) {
        throw new Error("Document not found in the response");
      }
      
      setDocumentData(targetDocument);
      
      if (targetDocument.content_file) {
        const fileToUse = 
          targetDocument.content_status === 'signed' || 
          targetDocument.content_status === 'approved' 
            ? targetDocument.content_file_signed || targetDocument.content_file
            : targetDocument.content_file;
            
        setPdfUrl(`https://ttd.lombokutarakab.go.id/public/storage/${fileToUse}`);
        console.log("Using PDF URL:", `https://ttd.lombokutarakab.go.id/public/storage/${fileToUse}`);
      } else {
        setPdfUrl(TEST_PDF_URL);
        console.log("Using test PDF URL:", TEST_PDF_URL);
      }
      
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to load document details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    if (documentData) {
      window.document.title = `${documentData.content_title} - Document Signing`;
    } else {
      window.document.title = "Document Details - Document Signing";
    }
  }, [documentData]);
  
  const handleBack = () => {
    navigate("/requests");
  };
  
  const handleSign = () => {
    setIsSignDialogOpen(false);
    
    fetchDocumentDetails();
    
    setTimeout(() => {
      navigate("/requests");
    }, 1000);
  };
  
  const handleReject = () => {
    setIsRejectDialogOpen(false);
    
    fetchDocumentDetails();
    
    setTimeout(() => {
      navigate("/requests");
    }, 1000);
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="mobile-container">
        <div className="page-content flex items-center justify-center min-h-[70vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!documentData) {
    return (
      <div className="mobile-container">
        <div className="page-content">
          <div className="flex items-center mb-6">
            <Button variant="ghost" size="icon" onClick={handleBack} className="mr-2">
              <ArrowLeft size={20} />
            </Button>
            <h1 className="text-xl font-bold">Document Not Found</h1>
          </div>
          <div className="bg-muted/50 p-6 rounded-lg text-center">
            <p className="text-muted-foreground">The document you're looking for doesn't exist or you don't have permission to view it.</p>
            <Button className="mt-4" onClick={handleBack}>Go Back</Button>
          </div>
        </div>
      </div>
    );
  }

  const canSignOrReject = documentData.content_status === 'active' && 
                          documentData.user_to === user?.userData?.user_id;

  return (
    <div className="mobile-container">
      <div className="page-content">
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="icon" onClick={handleBack} className="mr-2">
            <ArrowLeft size={20} />
          </Button>
          <div>
            <h1 className="text-xl font-bold">{documentData.content_title}</h1>
            <p className="text-sm text-muted-foreground">From: {documentData.user_dari?.user_name || 'Unknown Sender'}</p>
          </div>
        </div>
        
        <div className="bg-card p-4 rounded-lg border mb-6 space-y-4">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <p className="text-muted-foreground">Status:</p>
            <p className={`font-medium ${
              documentData.content_status === 'active' ? 'text-amber-600' : 
              documentData.content_status === 'signed' || documentData.content_status === 'approved' ? 'text-green-600' : 
              documentData.content_status === 'rejected' ? 'text-red-600' : ''
            }`}>
              {documentData.content_status === 'active' ? 'Pending' : 
               documentData.content_status === 'approved' ? 'Signed' :
               documentData.content_status.charAt(0).toUpperCase() + documentData.content_status.slice(1)}
            </p>
            
            <p className="text-muted-foreground">Date:</p>
            <p className="font-medium">{formatDate(documentData.content_create_date)}</p>
            
            <p className="text-muted-foreground">Department:</p>
            <p className="font-medium">{documentData.user_dari?.skpd_name || '-'}</p>
            
            <p className="text-muted-foreground">Sign Type:</p>
            <p className="font-medium capitalize">{documentData.content_sign_type}</p>
          </div>
          
          {documentData.content_desc && (
            <div className="pt-2 border-t">
              <p className="text-sm text-muted-foreground mb-1">Description:</p>
              <p className="text-sm">{documentData.content_desc}</p>
            </div>
          )}
        </div>
        
        {pdfUrl && (
          <div className="bg-card p-4 rounded-lg border mb-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <FileText size={18} className="text-primary" />
                <span className="font-medium">Document File</span>
              </div>
              <a 
                href={pdfUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline flex items-center gap-1"
              >
                <Eye size={16} />
                <span className="text-sm">View</span>
              </a>
            </div>
            <div className="bg-muted rounded-lg p-4 flex flex-col items-center justify-center">
              <div className="w-full aspect-[3/4] max-h-96 mb-4">
                <iframe 
                  src={`${pdfUrl}#toolbar=0`} 
                  className="w-full h-full rounded border border-muted"
                  title={documentData.content_title}
                />
              </div>
              
              {canSignOrReject && (
                <div className="flex gap-3 w-full">
                  <Button 
                    className="flex-1 gap-2" 
                    onClick={() => setIsSignDialogOpen(true)}
                  >
                    <CheckCircle size={18} />
                    Sign Document
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
              )}
              
              {documentData.content_status !== 'active' && (
                <a 
                  href={pdfUrl} 
                  download={documentData.content_title}
                  className="flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium"
                >
                  <Download size={16} />
                  Download PDF
                </a>
              )}
            </div>
          </div>
        )}
      </div>
      
      <SignDialog 
        isOpen={isSignDialogOpen} 
        onClose={() => setIsSignDialogOpen(false)}
        onConfirm={handleSign}
        documentId={id}
        userId={user?.userData?.user_id}
      />
      
      <RejectDialog 
        isOpen={isRejectDialogOpen} 
        onClose={() => setIsRejectDialogOpen(false)}
        onConfirm={handleReject}
        documentId={id}
      />
    </div>
  );
};

export default DocumentView;
