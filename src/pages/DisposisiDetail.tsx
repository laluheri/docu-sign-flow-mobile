
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
    }
  }, [id, navigate, toast]);
  
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

  if (loading) {
    return <DisposisiLoadingState onBack={handleBack} />;
  }

  if (!disposisiData) {
    return <DisposisiNotFound onBack={handleBack} />;
  }

  // Ensure disposisiId is a number
  const disposisiNumericId = id ? parseInt(id, 10) : 0;

  return (
    <div className="mobile-container">
      <div className="page-content">
        <DisposisiDetailHeader 
          title={disposisiData.dis_things}
          from={disposisiData.dis_from_letter}
          onBack={handleBack}
        />
        
        <div className="mb-6">
          <Button 
            onClick={() => setIsForwardDrawerOpen(true)} 
            className="w-full flex items-center justify-center gap-2 shadow-sm"
          >
            <Send className="h-4 w-4" /> Forward Disposition
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
      </div>

      {isForwardDrawerOpen && (
        <ForwardDisposisiDrawer 
          isOpen={isForwardDrawerOpen}
          onClose={() => setIsForwardDrawerOpen(false)}
          disposisiId={disposisiNumericId}
          skpdGenerate={disposisiData.skpd_generate}
        />
      )}
    </div>
  );
};

export default DisposisiDetail;
