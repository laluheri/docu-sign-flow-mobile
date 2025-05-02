import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface DisposisiItem {
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
    // ... other user fields
  };
}

interface DisposisiResponse {
  status: boolean;
  desc: number;
  data: {
    current_page: number;
    data: DisposisiItem[];
    // ... pagination fields
  };
}

const fetchDisposisiData = async (userId: number): Promise<DisposisiResponse> => {
  const response = await fetch(`https://ttd.lombokutarakab.go.id/api/getDis?user_id=${userId}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch disposisi data');
  }
  
  return response.json();
};

const DisposisiList = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const userId = user?.userData?.user_id;
  
  const { data, isLoading, error } = useQuery({
    queryKey: ['disposisi', userId],
    queryFn: () => (userId ? fetchDisposisiData(userId) : Promise.reject('No user ID')),
    enabled: !!userId,
  });
  
  if (error) {
    console.error('Error fetching disposisi data:', error);
    toast({
      title: "Failed to load disposisi data",
      description: error instanceof Error ? error.message : "An unknown error occurred",
      variant: "destructive",
    });
  }
  
  const disposisiItems = data?.data?.data || [];
  
  return (
    <div className="container p-4 mx-auto space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Disposisi</CardTitle>
          <CardDescription>
            List of disposisi items requiring your attention
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex flex-col space-y-3">
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                </div>
              ))}
            </div>
          ) : disposisiItems.length > 0 ? (
            <Table>
              <TableCaption>A list of your recent disposisi items.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>No. Letter</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>From</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {disposisiItems.map((item) => (
                  <TableRow key={item.dis_id}>
                    <TableCell className="font-medium">{item.dis_no_letter}</TableCell>
                    <TableCell>{item.dis_things}</TableCell>
                    <TableCell>{item.dis_from_letter}</TableCell>
                    <TableCell>
                      {format(new Date(item.dis_date_letter), 'dd MMM yyyy')}
                    </TableCell>
                    <TableCell>
                      <Badge variant={item.dis_type === "segera" ? "destructive" : "outline"}>
                        {item.dis_type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={item.dis_status === "dispath" ? "secondary" : "default"}>
                        {item.dis_status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No disposisi items found
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DisposisiList;
