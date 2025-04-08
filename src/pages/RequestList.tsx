
import { useEffect } from "react";
import { documents } from "@/data/mockData";
import DocumentCard from "@/components/DocumentCard";

const RequestList = () => {
  const pendingDocuments = documents.filter(doc => doc.status === 'pending');

  useEffect(() => {
    document.title = "Requests - Document Signing";
  }, []);

  return (
    <div className="mobile-container">
      <div className="page-content">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Document Requests</h1>
          <p className="text-muted-foreground">Documents waiting for your signature</p>
        </div>

        {pendingDocuments.length > 0 ? (
          <div className="flex flex-col gap-4">
            {pendingDocuments.map((doc) => (
              <DocumentCard key={doc.id} document={doc} />
            ))}
          </div>
        ) : (
          <div className="bg-muted/50 p-6 rounded-lg text-center">
            <p className="text-muted-foreground">No pending documents to sign</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RequestList;
