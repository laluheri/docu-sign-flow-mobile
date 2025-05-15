import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Mail, Search } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";

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
  };
}

interface DisposisiResponse {
  status: boolean;
  desc: number;
  data: {
    current_page: number;
    data: DisposisiItem[];
    last_page: number;
  };
}

const fetchDisposisiData = async (userId: number, page: number = 1): Promise<DisposisiResponse> => {
  const response = await fetch(`https://ttd.lombokutarakab.go.id/api/getDis?user_id=${userId}&page=${page}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch disposisi data');
  }
  
  return response.json();
};

const DisposisiList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const userId = user?.userData?.user_id;
  
  const { data, isLoading, error } = useQuery({
    queryKey: ['disposisi', userId, currentPage],
    queryFn: () => (userId ? fetchDisposisiData(userId, currentPage) : Promise.reject('No user ID')),
    enabled: !!userId,
  });
  
  useEffect(() => {
    if (data?.data?.last_page) {
      setTotalPages(data.data.last_page);
    }
  }, [data]);

  useEffect(() => {
    document.title = "Disposisi - TTD Lombok Utara";
  }, []);
  
  if (error) {
    console.error('Error fetching disposisi data:', error);
    toast({
      title: "Failed to load disposisi data",
      description: error instanceof Error ? error.message : "An unknown error occurred",
      variant: "destructive",
    });
  }
  
  const allDisposisiItems = data?.data?.data || [];
  const notificationCount = data?.desc || 0;

  // Filter disposisi items based on search query
  const disposisiItems = searchQuery.trim() !== "" 
    ? allDisposisiItems.filter(item => {
        const lowerCaseQuery = searchQuery.toLowerCase();
        return (
          item.dis_things.toLowerCase().includes(lowerCaseQuery) ||
          item.dis_from_letter.toLowerCase().includes(lowerCaseQuery) ||
          item.dis_no_letter.toLowerCase().includes(lowerCaseQuery) ||
          (item.dis_instruction && item.dis_instruction.toLowerCase().includes(lowerCaseQuery))
        );
      })
    : allDisposisiItems;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setSearchQuery(""); // Reset search when changing page
  };

  const handleDisposisiClick = (id: number) => {
    navigate(`/disposisi/${id}`);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    return (
      <Pagination className="mt-6">
        <PaginationContent>
          {currentPage > 1 && (
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => handlePageChange(currentPage - 1)} 
                className="cursor-pointer"
              />
            </PaginationItem>
          )}
          
          {Array.from({ length: totalPages }).map((_, index) => {
            const pageNumber = index + 1;
            if (
              pageNumber === 1 ||
              pageNumber === totalPages ||
              (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
            ) {
              return (
                <PaginationItem key={pageNumber}>
                  <PaginationLink
                    isActive={pageNumber === currentPage}
                    onClick={() => handlePageChange(pageNumber)}
                    className="cursor-pointer"
                  >
                    {pageNumber}
                  </PaginationLink>
                </PaginationItem>
              );
            }
            return null;
          })}
          
          {currentPage < totalPages && (
            <PaginationItem>
              <PaginationNext 
                onClick={() => handlePageChange(currentPage + 1)} 
                className="cursor-pointer"
              />
            </PaginationItem>
          )}
        </PaginationContent>
      </Pagination>
    );
  };

  return (
    <div className="mobile-container">
      <div className="page-content">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Disposisi</h1>
          <p className="text-muted-foreground">
            Documents requiring your attention
            {notificationCount > 0 && (
              <Badge variant="secondary" className="ml-2 bg-primary/10 text-primary border-primary/20">
                {notificationCount} unread
              </Badge>
            )}
          </p>
        </div>

        <div className="mb-4 relative">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input 
              type="search" 
              placeholder="Search disposisi..." 
              className="pl-10 shadow-sm" 
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : disposisiItems.length > 0 ? (
          <>
            <div className="flex flex-col gap-4">
              {disposisiItems.map((item) => (
                <DisposisiCard 
                  key={item.dis_id} 
                  item={item} 
                  onClick={() => handleDisposisiClick(item.dis_id)}
                />
              ))}
            </div>
            {searchQuery.trim() === "" && renderPagination()}
          </>
        ) : (
          <div className="bg-muted/50 p-6 rounded-lg text-center border border-border shadow-sm">
            <Mail className="h-12 w-12 text-muted-foreground mx-auto mb-2 opacity-50" />
            <p className="text-muted-foreground">
              {searchQuery.trim() !== "" 
                ? "No disposisi matching your search query"
                : "No disposisi items found"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// Extract DisposisiCard component to keep the main component cleaner
const DisposisiCard = ({ item, onClick }: { item: DisposisiItem; onClick: () => void }) => {
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd MMM yyyy');
    } catch (e) {
      return dateString;
    }
  };

  const getTypeStyle = (type: string) => {
    switch (type.toLowerCase()) {
      case 'segera':
        return 'bg-amber-100 text-amber-700 border border-amber-200';
      default:
        return 'bg-gray-100 text-gray-700 border border-gray-200';
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case 'dispath':
        return 'bg-green-100 text-green-700 border border-green-200';
      default:
        return 'bg-blue-100 text-blue-700 border border-blue-200';
    }
  };

  return (
    <Card className="hover:border-primary/50 transition-colors cursor-pointer shadow-sm" onClick={onClick}>
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className="bg-primary/10 p-2 rounded-md mt-1">
            <Mail size={24} className="text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-lg line-clamp-1">{item.dis_things}</h3>
            <div className="flex flex-col gap-1 mt-1">
              <p className="text-sm text-muted-foreground">From: {item.dis_from_letter}</p>
              <p className="text-sm text-muted-foreground">No: {item.dis_no_letter}</p>
              <p className="text-sm text-muted-foreground">Date: {formatDate(item.dis_date_letter)}</p>
            </div>
          </div>
          <div className="flex flex-col gap-2 items-end">
            <div className={`flex items-center justify-center px-2 py-1 rounded-full text-xs font-medium ${getTypeStyle(item.dis_type)}`}>
              {item.dis_type.charAt(0).toUpperCase() + item.dis_type.slice(1)}
            </div>
            <div className={`flex items-center justify-center px-2 py-1 rounded-full text-xs font-medium ${getStatusStyle(item.dis_status)}`}>
              {item.dis_status.charAt(0).toUpperCase() + item.dis_status.slice(1)}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default DisposisiList;
