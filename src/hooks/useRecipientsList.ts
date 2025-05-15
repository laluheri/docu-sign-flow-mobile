
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

interface Recipient {
  user_id: number;
  user_name: string;
  skpd_name: string;
}

export const useRecipientsList = (disposisiData: any) => {
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchRecipients = async () => {
    if (!disposisiData || !user?.userData?.user_id) return;
    
    const skpdId = disposisiData.skpd_generate;
    const userId = user.userData.user_id;
    
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://ttd.lombokutarakab.go.id/api/nameOnDetail`, 
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: userId,
            skpd_id: skpdId
          })
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch recipients");
      }

      const data = await response.json();
      if (data.status && Array.isArray(data.data)) {
        setRecipients(data.data);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error("Error fetching recipients:", error);
      toast({
        title: "Error",
        description: "Failed to load recipient list",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (disposisiData) {
      fetchRecipients();
    }
  }, [disposisiData, user?.userData?.user_id]); // Add dependencies

  return {
    recipients,
    isLoading,
    fetchRecipients
  };
};
