
import { Card, CardContent } from "@/components/ui/card";
import { Document } from "@/data/mockData";
import { FileText } from "lucide-react";
import { Link } from "react-router-dom";

interface DocumentCardProps {
  document: Document;
}

const DocumentCard = ({ document }: DocumentCardProps) => {
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
                <p className="text-sm text-muted-foreground">Date: {new Date(document.date).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="flex items-center justify-center px-2 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-medium mt-1">
              Pending
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default DocumentCard;
