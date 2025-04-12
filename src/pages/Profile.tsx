
import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Building, User, Mail, LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Profile = () => {
  const { logout, user } = useAuth();
  const { toast } = useToast();
  
  useEffect(() => {
    document.title = "Profile - Document Signing";
  }, []);
  
  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account",
    });
  };
  
  const userData = user?.userData;
  const displayName = userData?.user_name || userData?.user_username || user?.email || '';
  const initials = displayName ? displayName.substring(0, 2).toUpperCase() : 'US';
  
  return (
    <div className="mobile-container">
      <div className="page-content">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Profile</h1>
          <p className="text-muted-foreground">Your account information</p>
        </div>
        
        <div className="flex flex-col items-center mb-8">
          <Avatar className="h-20 w-20 mb-4">
            <AvatarFallback className="text-lg">{initials}</AvatarFallback>
          </Avatar>
          <h2 className="text-xl font-semibold">{displayName}</h2>
        </div>
        
        {userData && (
          <Card className="mb-6 border-l-4 border-l-blue-500">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">User Information</h2>
              <div className="space-y-3">
                <div className="flex items-center">
                  <Building className="w-5 h-5 mr-3 text-blue-500" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Department</p>
                    <p className="font-medium">{userData.skpd_name || "Not available"}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <User className="w-5 h-5 mr-3 text-blue-500" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Username</p>
                    <p className="font-medium">{userData.user_username || "Not available"}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Mail className="w-5 h-5 mr-3 text-blue-500" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Email</p>
                    <p className="font-medium">{userData.user_email || "Not available"}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        
        <Button 
          variant="destructive" 
          className="w-full" 
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  );
};

export default Profile;
