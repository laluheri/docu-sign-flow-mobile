
import { useEffect } from "react";
import StatsCard from "@/components/StatsCard";
import { FileText, CheckCircle, XCircle, Files, User, Building, Mail } from "lucide-react";
import { getDashboardStats } from "@/data/mockData";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent } from "@/components/ui/card";

const Home = () => {
  const stats = getDashboardStats();
  const { user } = useAuth();
  const userData = user?.userData;

  useEffect(() => {
    document.title = "Home - Document Signing";
  }, []);

  return (
    <div className="mobile-container">
      <div className="page-content">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Overview of your document activities</p>
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

        <div className="grid grid-cols-2 gap-4 mb-6">
          <StatsCard 
            title="Pending" 
            value={stats.pending} 
            icon={<FileText size={20} className="text-amber-500" />}
            className="border-l-4 border-l-amber-500"
          />
          <StatsCard 
            title="Signed" 
            value={stats.signed} 
            icon={<CheckCircle size={20} className="text-green-500" />}
            className="border-l-4 border-l-green-500"
          />
          <StatsCard 
            title="Rejected" 
            value={stats.rejected} 
            icon={<XCircle size={20} className="text-red-500" />}
            className="border-l-4 border-l-red-500"
          />
          <StatsCard 
            title="Total" 
            value={stats.total} 
            icon={<Files size={20} className="text-blue-500" />}
            className="border-l-4 border-l-blue-500"
          />
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <div className="bg-muted/50 p-6 rounded-lg text-center">
            <FileText size={40} className="mx-auto text-muted-foreground" />
            <p className="text-muted-foreground mt-2">No recent activities to display</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
