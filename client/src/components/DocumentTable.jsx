import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const DocumentTable = ({ documents, loading = false }) => {
  if (loading) {
    return (
      <Card className="p-12 text-center">
        <div className="flex flex-col items-center justify-center gap-4">
          <svg className="animate-spin h-8 w-8 text-muted-foreground" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
          </svg>
          <p className="text-sm text-muted-foreground">Loading documents…</p>
        </div>
      </Card>
    );
  }
  const isExpiringSoon = (date) => {
    if (!date) return false;
    const daysUntilExpiry = Math.ceil((new Date(date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 30 && daysUntilExpiry >= 0;
  };

  const isExpired = (date) => {
    if (!date) return false;
    return new Date(date) < new Date();
  };

  const getExpiryBadge = (date) => {
    if (!date) return null;
    
    if (isExpired(date)) {
      return <Badge variant="destructive">Expired</Badge>;
    }
    if (isExpiringSoon(date)) {
      return <Badge className="bg-warning text-white">Expiring Soon</Badge>;
    }
    return <Badge className="bg-success text-white">Valid</Badge>;
  };

  if (documents.length === 0) {
    return (
      <Card className="p-12 text-center">
        <p className="text-muted-foreground">No documents found. Add document to get started.</p>
      </Card>
    );
  }

  return (
    <Card>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Owner</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Vehicle Number</TableHead>
              <TableHead>CF Expiry</TableHead>
              <TableHead>NP Expiry</TableHead>
              <TableHead>Auth Expiry</TableHead>
              <TableHead className="w-64">Remarks</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {documents.map((doc) => (
              <TableRow key={doc.id}>
                <TableCell className="font-medium">{doc.owner}</TableCell>
                <TableCell>{doc.phone || "N/A"}</TableCell>
                <TableCell className="font-mono">{doc.vehicleNumber}</TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    {doc.cf ? format(new Date(doc.cf), "MMM dd, yyyy") : "N/A"}
                    {getExpiryBadge(doc.cf)}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    {doc.np ? format(new Date(doc.np), "MMM dd, yyyy") : "N/A"}
                    {getExpiryBadge(doc.np)}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    {doc.auth ? format(new Date(doc.auth), "MMM dd, yyyy") : "N/A"}
                    {getExpiryBadge(doc.auth)}
                  </div>
                </TableCell>
                <TableCell className="max-w-[16rem] whitespace-normal">
                  <div className="clamp-2 break-words" title={doc.remarks || ""}>{doc.remarks || "—"}</div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};

export default DocumentTable;
