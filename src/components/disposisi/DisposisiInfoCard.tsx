
import { Badge } from "@/components/ui/badge";

interface DisposisiInfoCardProps {
  letterNo: string;
  agendaNo: string | null;
  letterDate: string;
  acceptDate: string;
  type: string;
  status: string;
  department: string;
  instruction: string | null;
  cc: string | null;
  formattedDateFn: (dateString: string) => string;
}

export const DisposisiInfoCard = ({
  letterNo,
  agendaNo,
  letterDate,
  acceptDate,
  type,
  status,
  department,
  instruction,
  cc,
  formattedDateFn
}: DisposisiInfoCardProps) => {
  
  const getTypeStyle = (type: string) => {
    switch (type.toLowerCase()) {
      case 'segera':
        return 'bg-amber-100 text-amber-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case 'dispath':
        return 'bg-green-100 text-green-700';
      case 'process':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="bg-card p-4 rounded-lg border mb-6 space-y-4">
      <div className="grid grid-cols-2 gap-2 text-sm">
        <p className="text-muted-foreground">Letter No:</p>
        <p className="font-medium">{letterNo}</p>
        
        <p className="text-muted-foreground">Agenda No:</p>
        <p className="font-medium">{agendaNo || '-'}</p>
        
        <p className="text-muted-foreground">Date:</p>
        <p className="font-medium">{formattedDateFn(letterDate)}</p>
        
        <p className="text-muted-foreground">Accepted:</p>
        <p className="font-medium">{formattedDateFn(acceptDate)}</p>
        
        <p className="text-muted-foreground">Type:</p>
        <p className="capitalize">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeStyle(type)}`}>
            {type}
          </span>
        </p>
        
        <p className="text-muted-foreground">Status:</p>
        <p className="capitalize">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusStyle(status)}`}>
            {status}
          </span>
        </p>
        
        <p className="text-muted-foreground">Department:</p>
        <p className="font-medium">{department || '-'}</p>
      </div>
      
      {instruction && (
        <div className="pt-2 border-t">
          <p className="text-sm text-muted-foreground mb-1">Instructions:</p>
          <p className="text-sm">{instruction}</p>
        </div>
      )}
      
      {cc && (
        <div className="pt-2 border-t">
          <p className="text-sm text-muted-foreground mb-1">CC:</p>
          <p className="text-sm">{cc}</p>
        </div>
      )}
    </div>
  );
};
