
import { format } from "date-fns";
import { Mail } from "lucide-react";
import { Card } from "@/components/ui/card";

export interface DisposisiItem {
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

interface DisposisiCardProps {
  item: DisposisiItem;
  onClick: () => void;
}

export const DisposisiCard = ({ item, onClick }: DisposisiCardProps) => {
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
