
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { fetchDisposisiData } from "@/services/disposisiService";
import { DisposisiItem } from "@/components/disposisi/DisposisiCard";

export const useDisposisiList = (userId: number | undefined) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

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
    ? allDisposisiItems.filter((item: DisposisiItem) => {
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

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return {
    disposisiItems,
    allDisposisiItems,
    isLoading,
    currentPage,
    totalPages,
    searchQuery,
    notificationCount,
    handlePageChange,
    handleSearchChange,
  };
};
