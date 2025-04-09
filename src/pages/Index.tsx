
import { Outlet } from "react-router-dom";
import BottomNavigation from "@/components/BottomNavigation";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const { logout, user } = useAuth();
  const { toast } = useToast();
  
  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account",
    });
  };

  const displayName = user?.userData?.user_name || user?.userData?.user_username || user?.email || '';
  
  return (
    <div className="min-h-screen">
      <header className="flex items-center justify-between border-b p-4">
        <div>
          <h2 className="font-bold">Document Signing</h2>
          {user && <p className="text-xs text-muted-foreground">{displayName}</p>}
        </div>
        <Button variant="ghost" size="sm" onClick={handleLogout}>
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </header>
      <Outlet />
      <BottomNavigation />
    </div>
  );
};

export default Index;
