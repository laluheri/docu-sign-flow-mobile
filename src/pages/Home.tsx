
import { useEffect } from "react";
import StatsCard from "@/components/StatsCard";
import { FileText, CheckCircle, XCircle, Files } from "lucide-react";
import { getDashboardStats } from "@/data/mockData";

const Home = () => {
  const stats = getDashboardStats();

  useEffect(() => {
    document.title = "Home - TTD Lombok Utara";
  }, []);

  return (
    <div className="mobile-container">
      <div className="page-content">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Overview of your document activities</p>
        </div>

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
