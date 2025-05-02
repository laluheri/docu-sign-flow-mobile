
import { useEffect, useState } from "react";
import DocumentCard from "@/components/DocumentCard";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Loader2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { debounce } from "lodash";

interface UserFrom {
  user_name: string;
  user_email: string;
}

interface Document {
  content_id: number;
  content_title: string;
  content_status: string;
  content_create_date: string;
  user_from: number;
  user_to: number;
  user_dari: UserFrom;
}

interface ApiResponse {
  status: boolean;
  desc: number;
  data: {
    data: Document[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

const RequestList = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [filteredDocuments, setFilteredDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [notificationCount, setNotificationCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    document.title = "Requests - Document Signing";
    fetchDocuments(currentPage);
  }, [currentPage]);

  useEffect(() => {
    // Filter documents when search term changes
    if (searchTerm.trim() === "") {
      setFilteredDocuments(documents);
    } else {
      const term = searchTerm.toLowerCase();
      const filtered = documents.filter(doc => 
        doc.content_title.toLowerCase().includes(term) || 
        doc.user_dari?.user_name?.toLowerCase().includes(term)
      );
      setFilteredDocuments(filtered);
    }
  }, [searchTerm, documents]);

  const fetchDocuments = async (page: number) => {
    if (!user?.userData) return;

    setLoading(true);
    try {
      // Build query parameters for the GET request
      const params = new URLSearchParams({
        user_id: user.userData.user_id?.toString() || "",
        user_level_id: user.userData.user_level_id?.toString() || "",
        skpd_generate: user.userData.skpd_generate || "",
        page: page.toString()
      });

      const response = await fetch(`https://ttd.lombokutarakab.go.id/api/getDoc?${params.toString()}`, {
        method: "GET",
        headers: {
          "Accept": "application/json"
        }
      });

      const data: ApiResponse = await response.json();
      
      if (!response.ok || !data.status) {
        throw new Error("Failed to fetch documents");
      }

      setDocuments(data.data.data || []);
      setFilteredDocuments(data.data.data || []);
      setTotalPages(data.data.last_page || 1);
      setNotificationCount(data.desc);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to load documents",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle search input changes with debounce to avoid too many re-renders
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const debouncedHandleSearchChange = debounce(handleSearchChange, 300);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
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
          <h1 className="text-2xl font-bold">Document Requests</h1>
          <p className="text-muted-foreground">
            Documents waiting for your signature 
            {notificationCount > 0 && ` (${notificationCount} unread)`}
          </p>
        </div>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input 
            placeholder="Search documents..." 
            className="pl-10"
            onChange={debouncedHandleSearchChange}
            defaultValue={searchTerm}
          />
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filteredDocuments.length > 0 ? (
          <>
            <div className="flex flex-col gap-4">
              {filteredDocuments.map((doc) => (
                <DocumentCard 
                  key={doc.content_id} 
                  document={{
                    id: doc.content_id,
                    title: doc.content_title,
                    status: doc.content_status === 'active' ? 'pending' : doc.content_status,
                    date: doc.content_create_date,
                    sender: doc.user_dari?.user_name || 'Unknown Sender'
                  }} 
                />
              ))}
            </div>
            {renderPagination()}
          </>
        ) : (
          <div className="bg-muted/50 p-6 rounded-lg text-center">
            <p className="text-muted-foreground">
              {searchTerm ? "No matching documents found" : "No documents found"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RequestList;
