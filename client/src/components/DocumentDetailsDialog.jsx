import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

const DocumentDetailsDialog = ({ open, onOpenChange, document }) => {
  if (!document) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Document Details</DialogTitle>
          <DialogDescription>Details for {document.owner}</DialogDescription>
        </DialogHeader>

        <div className="grid gap-3 py-4">
          <div>
            <h4 className="text-sm text-muted-foreground">Owner</h4>
            <p className="font-medium">{document.owner}</p>
          </div>

          <div>
            <h4 className="text-sm text-muted-foreground">Phone</h4>
            <p className="font-medium">{document.phone || "N/A"}</p>
          </div>

          <div>
            <h4 className="text-sm text-muted-foreground">Vehicle Number</h4>
            <p className="font-mono font-medium">{document.vehicleNumber}</p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <h4 className="text-sm text-muted-foreground">CF Expiry</h4>
              <p className="font-medium">{document.cf ? format(new Date(document.cf), "PPP") : "N/A"}</p>
            </div>
            <div>
              <h4 className="text-sm text-muted-foreground">NP Expiry</h4>
              <p className="font-medium">{document.np ? format(new Date(document.np), "PPP") : "N/A"}</p>
            </div>
            <div>
              <h4 className="text-sm text-muted-foreground">Auth Expiry</h4>
              <p className="font-medium">{document.auth ? format(new Date(document.auth), "PPP") : "N/A"}</p>
            </div>
          </div>

          <div>
            <h4 className="text-sm text-muted-foreground">Remarks</h4>
            <p className="whitespace-pre-wrap">{document.remarks || "—"}</p>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentDetailsDialog;
