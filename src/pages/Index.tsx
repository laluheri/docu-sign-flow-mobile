
import { Outlet } from "react-router-dom";
import BottomNavigation from "@/components/BottomNavigation";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const Index = () => {
  const { user } = useAuth();
  
  const displayName = user?.userData?.user_name || user?.userData?.user_username || user?.email || '';
  const initials = displayName ? displayName.substring(0, 2).toUpperCase() : 'US';
  
  return (
    <div className="min-h-screen">
      <header className="flex items-center justify-between border-b p-4">
        <div>
          <h2 className="font-bold">TTD Lombok Utara</h2>
        </div>
        {user && (
          <div className="flex items-center">
            <div className="text-right mr-2 hidden sm:block">
              <p className="text-sm font-medium">{displayName}</p>
              <p className="text-xs text-muted-foreground">{user?.userData?.skpd_name || ''}</p>
            </div>
            <Avatar className="h-8 w-8">
              <AvatarFallback className="text-xs">{initials}</AvatarFallback>
            </Avatar>
          </div>
        )}
      </header>
      <Outlet />
      <BottomNavigation />
    </div>
  );
};

export default Index;
