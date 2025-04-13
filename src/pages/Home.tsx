
import { useEffect } from "react";
import StatsCard from "@/components/StatsCard";
import { FileText, CheckCircle, XCircle, Files, Clock, User, PenSquare, Ban } from "lucide-react";
import { getDashboardStats, recentActivities } from "@/data/mockData";
import { format, parseISO } from "date-fns";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

const Home = () => {
  const stats = getDashboardStats();

  useEffect(() => {
    document.title = "Home - TTD Lombok Utara";
  }, []);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'signed':
        return <CheckCircle size={16} className="text-green-500" />;
      case 'rejected':
        return <Ban size={16} className="text-red-500" />;
      case 'received':
        return <FileText size={16} className="text-blue-500" />;
      case 'updated':
        return <PenSquare size={16} className="text-amber-500" />;
      default:
        return <Clock size={16} className="text-gray-500" />;
    }
  };

  const getActivityText = (activity: typeof recentActivities[0]) => {
    switch (activity.type) {
      case 'signed':
        return <span><span className="font-medium">{activity.user}</span> signed <span className="font-medium">{activity.documentTitle}</span></span>;
      case 'rejected':
        return <span><span className="font-medium">{activity.user}</span> rejected <span className="font-medium">{activity.documentTitle}</span></span>;
      case 'received':
        return <span>Received <span className="font-medium">{activity.documentTitle}</span> from <span className="font-medium">{activity.user}</span></span>;
      case 'updated':
        return <span><span className="font-medium">{activity.user}</span> updated <span className="font-medium">{activity.documentTitle}</span></span>;
      default:
        return 'Activity recorded';
    }
  };

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
          {recentActivities.length > 0 ? (
            <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Activity</TableHead>
                    <TableHead className="text-right">Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentActivities.map((activity) => (
                    <TableRow key={activity.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="flex-shrink-0">
                            {getActivityIcon(activity.type)}
                          </div>
                          <div>
                            {getActivityText(activity)}
                            {activity.department && (
                              <div className="text-xs text-muted-foreground">
                                {activity.department}
                              </div>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right text-sm text-muted-foreground">
                        {format(parseISO(activity.date), 'MMM d, h:mm a')}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="bg-muted/50 p-6 rounded-lg text-center">
              <Clock size={40} className="mx-auto text-muted-foreground" />
              <p className="text-muted-foreground mt-2">No recent activities to display</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
