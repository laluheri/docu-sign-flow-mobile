
import { Card, CardContent } from "@/components/ui/card";
import { FileText } from "lucide-react";
import { Link } from "react-router-dom";

interface DocumentCardProps {
  document: {
    id: number;
    title: string;
    sender: string;
    date: string;
    status: string;
  };
}

const DocumentCard = ({ document }: DocumentCardProps) => {
  // Format the date string from API
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (e) {
      return dateString;
    }
  };

  // Define status styling
  const getStatusStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-amber-100 text-amber-700';
      case 'approved':
        return 'bg-green-100 text-green-700';
      case 'rejected':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <Link to={`/requests/${document.id}`}>
      <Card className="hover:border-primary/50 transition-colors cursor-pointer">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="bg-primary/10 p-2 rounded-md mt-1">
              <FileText size={24} className="text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-lg line-clamp-1">{document.title}</h3>
              <div className="flex flex-col gap-1 mt-1">
                <p className="text-sm text-muted-foreground">From: {document.sender}</p>
                <p className="text-sm text-muted-foreground">Date: {formatDate(document.date)}</p>
              </div>
            </div>
            <div className={`flex items-center justify-center px-2 py-1 rounded-full text-xs font-medium mt-1 ${getStatusStyle(document.status)}`}>
              {document.status.charAt(0).toUpperCase() + document.status.slice(1)}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default DocumentCard;
