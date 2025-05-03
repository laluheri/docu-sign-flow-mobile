
import { FileText, Eye, Download } from "lucide-react";

interface DisposisiDocumentViewerProps {
  documentUrl: string;
  documentTitle: string;
}

export const DisposisiDocumentViewer = ({ documentUrl, documentTitle }: DisposisiDocumentViewerProps) => {
  if (!documentUrl) return null;

  return (
    <div className="bg-card p-4 rounded-lg border mb-6">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <FileText size={18} className="text-primary" />
          <span className="font-medium">Document File</span>
        </div>
        <a 
          href={documentUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-primary hover:underline flex items-center gap-1"
        >
          <Eye size={16} />
          <span className="text-sm">View</span>
        </a>
      </div>
      <div className="bg-muted rounded-lg p-4 flex flex-col items-center justify-center">
        <div className="w-full aspect-[3/4] max-h-96 mb-4">
          <iframe 
            src={`${documentUrl}#toolbar=0`} 
            className="w-full h-full rounded border border-muted"
            title={documentTitle}
          />
        </div>
        
        <a 
          href={documentUrl} 
          download
          className="flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium"
        >
          <Download size={16} />
          Download PDF
        </a>
      </div>
    </div>
  );
};
