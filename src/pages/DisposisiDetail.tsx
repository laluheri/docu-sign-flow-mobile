
import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useDisposisiDetail } from "@/hooks/useDisposisiDetail";
import { DisposisiDetailHeader } from "@/components/disposisi/DisposisiDetailHeader";
import { DisposisiInfoCard } from "@/components/disposisi/DisposisiInfoCard";
import { DisposisiDocumentViewer } from "@/components/disposisi/DisposisiDocumentViewer";
import { DisposisiLoadingState } from "@/components/disposisi/DisposisiLoadingState";
import { DisposisiNotFound } from "@/components/disposisi/DisposisiNotFound";

const DisposisiDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  
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
    </div>
  );
};

export default DisposisiDetail;
