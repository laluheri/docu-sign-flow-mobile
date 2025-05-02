import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText, Eye, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";

interface DisposisiDetail {
  dis_id: number;
  dis_from_letter: string;
  dis_no_letter: string;
  dis_date_letter: string;
  dis_accept_date: string;
  dis_no_agenda: string | null;
  dis_things: string;
  dis_instruction: string | null;
  dis_cc: string | null;
  dis_from: number;
  dis_to: string;
  dis_file: string;
  dis_status: string;
  dis_type: string;
  skpd_generate: string;
  user_dari_dis: {
    user_id: number;
    user_name: string;
    skpd_name: string;
    // other user fields
  };
  pathDoc: string;
}

const DisposisiDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [disposisiData, setDisposisiData] = useState<DisposisiDetail | null>(null);
  
  useEffect(() => {
    if (!id) {
      toast({
        title: "Error",
        description: "Invalid disposisi ID",
        variant: "destructive"
      });
      navigate("/disposisi");
      return;
    }
    
    fetchDisposisiDetails();
  }, [id]);
  
  useEffect(() => {
    if (disposisiData) {
      document.title = `${disposisiData.dis_things} - Disposisi Detail`;
    } else {
      document.title = "Disposisi Detail";
    }
  }, [disposisiData]);

  const fetchDisposisiDetails = async () => {
    if (!id) return;
    
    setLoading(true);
    try {
      const response = await fetch(`https://ttd.lombokutarakab.go.id/api/detailDis?dis_id=${id}`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch disposisi details");
      }
      
      const data = await response.json();
      
      if (!data || !data.status) {
        throw new Error("Invalid response from server");
      }
      
      setDisposisiData(data.data);
    } catch (error) {
      console.error("Error fetching disposisi details:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to load disposisi details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleBack = () => {
    navigate("/disposisi");
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd MMMM yyyy');
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

  if (!disposisiData) {
    return (
      <div className="mobile-container">
        <div className="page-content">
          <div className="flex items-center mb-6">
            <Button variant="ghost" size="icon" onClick={handleBack} className="mr-2">
              <ArrowLeft size={20} />
            </Button>
            <h1 className="text-xl font-bold">Disposisi Not Found</h1>
          </div>
          <div className="bg-muted/50 p-6 rounded-lg text-center">
            <p className="text-muted-foreground">The disposisi document you're looking for doesn't exist or you don't have permission to view it.</p>
            <Button className="mt-4" onClick={handleBack}>Go Back</Button>
          </div>
        </div>
      </div>
    );
  }

  const getTypeStyle = (type: string) => {
    switch (type.toLowerCase()) {
      case 'segera':
        return 'bg-amber-100 text-amber-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case 'dispath':
        return 'bg-green-100 text-green-700';
      case 'process':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="mobile-container">
      <div className="page-content">
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="icon" onClick={handleBack} className="mr-2">
            <ArrowLeft size={20} />
          </Button>
          <div>
            <h1 className="text-xl font-bold">{disposisiData.dis_things}</h1>
            <p className="text-sm text-muted-foreground">From: {disposisiData.dis_from_letter}</p>
          </div>
        </div>
        
        <div className="bg-card p-4 rounded-lg border mb-6 space-y-4">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <p className="text-muted-foreground">Letter No:</p>
            <p className="font-medium">{disposisiData.dis_no_letter}</p>
            
            <p className="text-muted-foreground">Agenda No:</p>
            <p className="font-medium">{disposisiData.dis_no_agenda || '-'}</p>
            
            <p className="text-muted-foreground">Date:</p>
            <p className="font-medium">{formatDate(disposisiData.dis_date_letter)}</p>
            
            <p className="text-muted-foreground">Accepted:</p>
            <p className="font-medium">{formatDate(disposisiData.dis_accept_date)}</p>
            
            <p className="text-muted-foreground">Type:</p>
            <p className="capitalize">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeStyle(disposisiData.dis_type)}`}>
                {disposisiData.dis_type}
              </span>
            </p>
            
            <p className="text-muted-foreground">Status:</p>
            <p className="capitalize">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusStyle(disposisiData.dis_status)}`}>
                {disposisiData.dis_status}
              </span>
            </p>
            
            <p className="text-muted-foreground">Department:</p>
            <p className="font-medium">{disposisiData.user_dari_dis?.skpd_name || '-'}</p>
          </div>
          
          {disposisiData.dis_instruction && (
            <div className="pt-2 border-t">
              <p className="text-sm text-muted-foreground mb-1">Instructions:</p>
              <p className="text-sm">{disposisiData.dis_instruction}</p>
            </div>
          )}
          
          {disposisiData.dis_cc && (
            <div className="pt-2 border-t">
              <p className="text-sm text-muted-foreground mb-1">CC:</p>
              <p className="text-sm">{disposisiData.dis_cc}</p>
            </div>
          )}
        </div>
        
        {disposisiData.pathDoc && (
          <div className="bg-card p-4 rounded-lg border mb-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <FileText size={18} className="text-primary" />
                <span className="font-medium">Document File</span>
              </div>
              <a 
                href={disposisiData.pathDoc} 
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
                  src={`${disposisiData.pathDoc}#toolbar=0`} 
                  className="w-full h-full rounded border border-muted"
                  title={disposisiData.dis_things}
                />
              </div>
              
              <a 
                href={disposisiData.pathDoc} 
                download
                className="flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium"
              >
                <Download size={16} />
                Download PDF
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DisposisiDetail;
