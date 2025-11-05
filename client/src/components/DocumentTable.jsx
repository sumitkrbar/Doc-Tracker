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

const DocumentTable = ({ documents }) => {
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
        <p className="text-muted-foreground">No documents found. Add your first document to get started.</p>
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
              <TableHead>Remarks</TableHead>
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
                <TableCell className="max-w-xs truncate">{doc.remarks || "—"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};

export default DocumentTable;
