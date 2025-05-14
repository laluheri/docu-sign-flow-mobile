
import React from "react";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
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
  formattedDateFn,
}: DisposisiInfoCardProps) => {

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
    <Card className="p-4 mb-6 shadow-sm">
      <div className="flex flex-wrap gap-2 mb-3">
        <Badge className={getTypeStyle(type)}>
          {type}
        </Badge>
        <Badge className={getStatusStyle(status)}>
          {status}
        </Badge>
      </div>

      <div className="space-y-3">
        <InfoItem label="Letter Number" value={letterNo} />
        <InfoItem label="Agenda Number" value={agendaNo || "-"} />
        <InfoItem label="Letter Date" value={formattedDateFn(letterDate)} />
        <InfoItem label="Acceptance Date" value={formattedDateFn(acceptDate)} />
        <InfoItem label="Department" value={department} />

        <Separator />

        {instruction && (
          <div>
            <h4 className="text-sm font-semibold mb-1">Instructions</h4>
            <p className="text-sm px-3 py-2 bg-muted/50 rounded-md border border-border">
              {instruction}
            </p>
          </div>
        )}

        {cc && (
          <div>
            <h4 className="text-sm font-semibold mb-1">CC</h4>
            <p className="text-sm text-muted-foreground">{cc}</p>
          </div>
        )}
      </div>
    </Card>
  );
};

const InfoItem = ({ label, value }: { label: string; value: string }) => (
  <div>
    <p className="text-xs text-muted-foreground">{label}</p>
    <p className="text-sm font-medium">{value}</p>
  </div>
);
