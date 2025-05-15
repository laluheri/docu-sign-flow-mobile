
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

export interface DisposisiDetail {
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
  pathDoc?: string;
}

export const useDisposisiDetail = (id: string | undefined) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [disposisiData, setDisposisiData] = useState<DisposisiDetail | null>(null);

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd MMMM yyyy');
    } catch (e) {
      return dateString;
    }
  };

  const fetchDisposisiDetails = async () => {
    if (!id) return;
    
    setLoading(true);
    try {
      const response = await fetch('https://ttd.lombokutarakab.go.id/api/detailDis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ dis_id: id }),
      });
      
      if (!response.ok) {
        throw new Error("Failed to fetch disposisi details");
      }
      
      const data = await response.json();
      
      if (!data || !data.status) {
        throw new Error("Invalid response from server");
      }
      
      setDisposisiData(data.data);

      // Add pathDoc from the top level of the response to the data object
      if (data.pathDoc) {
        setDisposisiData(prev => prev ? { ...prev, pathDoc: data.pathDoc } : null);
      }
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

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }
    
    fetchDisposisiDetails();
  }, [id]);

  return {
    loading,
    disposisiData,
    formatDate
  };
};
