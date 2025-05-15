
import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Loader2, Mail, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { DisposisiCard } from "@/components/disposisi/DisposisiCard";
import { DisposisiPagination } from "@/components/disposisi/DisposisiPagination";
import { DisposisiEmptyState } from "@/components/disposisi/DisposisiEmptyState";
import { useDisposisiList } from "@/hooks/useDisposisiList";

const DisposisiList = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const userId = user?.userData?.user_id;
  
  const {
    disposisiItems,
    isLoading,
    currentPage,
    totalPages,
    searchQuery,
    notificationCount,
    handlePageChange,
    handleSearchChange,
  } = useDisposisiList(userId);

  useEffect(() => {
    document.title = "Disposisi - TTD Lombok Utara";
  }, []);

  const handleDisposisiClick = (id: number) => {
    navigate(`/disposisi/${id}`);
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
            {searchQuery.trim() === "" && (
              <DisposisiPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </>
        ) : (
          <DisposisiEmptyState isSearching={searchQuery.trim() !== ""} />
        )}
      </div>
    </div>
  );
};

export default DisposisiList;
