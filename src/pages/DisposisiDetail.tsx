
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useDisposisiDetail } from "@/hooks/useDisposisiDetail";
import { DisposisiDetailHeader } from "@/components/disposisi/DisposisiDetailHeader";
import { DisposisiInfoCard } from "@/components/disposisi/DisposisiInfoCard";
import { DisposisiDocumentViewer } from "@/components/disposisi/DisposisiDocumentViewer";
import { DisposisiLoadingState } from "@/components/disposisi/DisposisiLoadingState";
import { DisposisiNotFound } from "@/components/disposisi/DisposisiNotFound";
import { ForwardDisposisiDrawer } from "@/components/disposisi/ForwardDisposisiDrawer";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

const DisposisiDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [isForwardDrawerOpen, setIsForwardDrawerOpen] = useState(false);
  
  const { loading, disposisiData, formatDate } = useDisposisiDetail(id);
  
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
  }, [id]);
  
  useEffect(() => {
    if (disposisiData) {
      document.title = `${disposisiData.dis_things} - Disposisi Detail`;
    } else {
      document.title = "Disposisi Detail";
    }
  }, [disposisiData]);

  const handleBack = () => {
    navigate("/disposisi");
  };
  
  const handleForwardDisposisi = async (formData: { recipients: number[], instruction: string, passphrase: string }) => {
    try {
      const response = await fetch("https://ttd.lombokutarakab.go.id/api/forwardDisposisi", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          dis_id: id,
          user_id: user?.userData?.user_id,
          recipients: formData.recipients,
          instruction: formData.instruction,
          passphrase: formData.passphrase
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
      
      setIsForwardDrawerOpen(false);
      
      // Refresh the page or fetch updated data
      setTimeout(() => {
        navigate("/disposisi");
      }, 1500);
      
    } catch (error) {
      console.error("Error forwarding disposition:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to forward disposition",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <DisposisiLoadingState />;
  }

  if (!disposisiData) {
    return <DisposisiNotFound onBack={handleBack} />;
  }

  return (
    <div className="mobile-container">
      <div className="page-content">
        <DisposisiDetailHeader 
          title={disposisiData.dis_things}
          from={disposisiData.dis_from_letter}
          onBack={handleBack}
        />
        
        <div className="mb-4">
          <Button 
            onClick={() => setIsForwardDrawerOpen(true)} 
            className="w-full"
          >
            <Send className="mr-2 h-4 w-4" /> Forward Disposition
          </Button>
        </div>
        
        <DisposisiInfoCard 
          letterNo={disposisiData.dis_no_letter}
          agendaNo={disposisiData.dis_no_agenda}
          letterDate={disposisiData.dis_date_letter}
          acceptDate={disposisiData.dis_accept_date}
          type={disposisiData.dis_type}
          status={disposisiData.dis_status}
          department={disposisiData.user_dari_dis?.skpd_name || '-'}
          instruction={disposisiData.dis_instruction}
          cc={disposisiData.dis_cc}
          formattedDateFn={formatDate}
        />
        
        {disposisiData.pathDoc && (
          <DisposisiDocumentViewer 
            documentUrl={disposisiData.pathDoc}
            documentTitle={disposisiData.dis_things}
          />
        )}
        
        <ForwardDisposisiDrawer 
          isOpen={isForwardDrawerOpen}
          onClose={() => setIsForwardDrawerOpen(false)}
          onForward={handleForwardDisposisi}
          disposisiId={Number(id)}
        />
      </div>
    </div>
  );
};

export default DisposisiDetail;
