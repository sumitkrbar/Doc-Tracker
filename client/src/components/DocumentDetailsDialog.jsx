import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import { Trash2, Edit, CalendarIcon, Save, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "react-hot-toast";
import PinVerificationDialog from "@/components/PinVerificationDialog";
import { useDocuments } from "@/contexts/DocumentContext";

const DIR_OPTIONS = ["RC", "NP", "PP", "SLD"];

const DocumentDetailsDialog = ({ open, onOpenChange, document }) => {
  const [showPinDialog, setShowPinDialog] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [pendingAction, setPendingAction] = useState(null); // 'edit' | 'delete'
  const { deleteDocument, updateDocument } = useDocuments();

  const [editFormData, setEditFormData] = useState({
    owner: "",
    phone: "",
    vehicleNumber: "",
      dor: undefined,
      chasisNumber: "",
    cf: undefined,
    np: undefined,
    auth: undefined,
    remarks: "",
      dir: [],
  });

  if (!document) return null;

    const toggleDirOption = (option) => {
      setEditFormData((prev) => ({
        ...prev,
        dir: prev.dir.includes(option)
          ? prev.dir.filter((item) => item !== option)
          : [...prev.dir, option],
      }));
    };

  const handleEditClick = () => {
    setPendingAction("edit");
    setShowPinDialog(true);
  };

  const handleDeleteClick = () => {
    setShowConfirmDialog(true);
  };

  const handleConfirmDelete = () => {
    setShowConfirmDialog(false);
    setPendingAction("delete");
    setShowPinDialog(true);
  };

  const handlePinVerified = async () => {
    if (pendingAction === "delete") {
      await performDelete();
    } else if (pendingAction === "edit") {
      enterEditMode();
    }
    setPendingAction(null);
  };

  const performDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteDocument(document.id || document._id);
      toast.success("Document deleted successfully!");
      onOpenChange(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete document");
    } finally {
      setIsDeleting(false);
    }
  };

  const enterEditMode = () => {
    setEditFormData({
      owner: document.owner || "",
      phone: document.phone || "",
      vehicleNumber: document.vehicleNumber || "",
        dor: document.dor ? new Date(document.dor) : undefined,
        chasisNumber: document.chasisNumber || "",
      cf: document.cf ? new Date(document.cf) : undefined,
      np: document.np ? new Date(document.np) : undefined,
      auth: document.auth ? new Date(document.auth) : undefined,
      remarks: document.remarks || "",
        dir: document.dir || [],
    });
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditFormData({
      owner: "",
      phone: "",
      vehicleNumber: "",
        dor: undefined,
        chasisNumber: "",
      cf: undefined,
      np: undefined,
      auth: undefined,
      remarks: "",
        dir: [],
    });
  };

  const handleSaveEdit = async () => {
    if (!editFormData.owner || !editFormData.vehicleNumber) {
      toast.error("Owner and Vehicle Number are required.");
      return;
    }

    setIsSaving(true);
    try {
      await updateDocument(document.id || document._id, {
        owner: editFormData.owner,
        phone: editFormData.phone ? Number(editFormData.phone) : undefined,
        vehicleNumber: editFormData.vehicleNumber,
          dor: editFormData.dor,
          chasisNumber: editFormData.chasisNumber,
        cf: editFormData.cf,
        np: editFormData.np,
        auth: editFormData.auth,
        remarks: editFormData.remarks,
          dir: editFormData.dir,
      });
      toast.success("Document updated successfully!");
      setIsEditing(false);
      onOpenChange(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update document");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isEditing ? "Edit Document" : "Document Details"}</DialogTitle>
            <DialogDescription>
              {isEditing ? "Update the document details below" : `Details for ${document.owner}`}
            </DialogDescription>
          </DialogHeader>

          {isEditing ? (
            // Edit Mode
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="owner">Owner *</Label>
                  <Input
                    id="owner"
                    value={editFormData.owner}
                    onChange={(e) => setEditFormData({ ...editFormData, owner: e.target.value })}
                    placeholder="Owner name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={editFormData.phone}
                    onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                    placeholder="Phone number"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="vehicleNumber">Vehicle Number *</Label>
                <Input
                  id="vehicleNumber"
                  value={editFormData.vehicleNumber}
                  readOnly
                  disabled
                  placeholder="ABC-1234"
                  required
                />
                <p className="text-xs text-muted-foreground">Vehicle number cannot be changed.</p>
              </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dor">Date of Registration</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !editFormData.dor && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          <span className="block whitespace-normal">
                            {editFormData.dor ? format(editFormData.dor, "PPP") : "Pick date"}
                          </span>
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={editFormData.dor}
                          onSelect={(date) => setEditFormData({ ...editFormData, dor: date })}
                          initialFocus
                          className="rounded-lg border"
                          captionLayout="dropdown"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="chasisNumber">Chasis Number</Label>
                    <Input
                      id="chasisNumber"
                      value={editFormData.chasisNumber}
                      onChange={(e) => setEditFormData({ ...editFormData, chasisNumber: e.target.value })}
                      placeholder="Enter chasis number"
                    />
                  </div>
                </div>

              <div className="grid grid-cols-3 gap-4">
                {["cf", "np", "auth"].map((field) => (
                  <div key={field} className="space-y-2">
                    <Label>{field.toUpperCase()} Expiry</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !editFormData[field] && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          <span className="block whitespace-normal">
                            {editFormData[field] ? format(editFormData[field], "PPP") : "Pick date"}
                          </span>
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={editFormData[field]}
                          onSelect={(date) => setEditFormData({ ...editFormData, [field]: date })}
                          initialFocus
                          className="rounded-lg border"
                          captionLayout="dropdown"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                ))}
              </div>

                <div className="space-y-2">
                  <Label>Documents in Record</Label>
                  <div className="grid grid-cols-2 gap-3 p-4 border rounded-lg">
                    {DIR_OPTIONS.map((option) => (
                      <div key={option} className="flex items-center space-x-2">
                        <Checkbox
                          id={`dir-edit-${option}`}
                          checked={editFormData.dir.includes(option)}
                          onCheckedChange={() => toggleDirOption(option)}
                        />
                        <label
                          htmlFor={`dir-edit-${option}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                        >
                          {option}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

              <div className="space-y-2">
                <Label htmlFor="remarks">Remarks</Label>
                <Textarea
                  id="remarks"
                  value={editFormData.remarks}
                  onChange={(e) => setEditFormData({ ...editFormData, remarks: e.target.value })}
                  placeholder="Additional notes..."
                  rows={3}
                />
              </div>
            </div>
          ) : (
            // View Mode
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Owner</h4>
                  <p className="text-base font-semibold">{document.owner}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Vehicle Number</h4>
                  <p className="text-base font-mono font-semibold">{document.vehicleNumber}</p>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Phone</h4>
                <p className="text-base font-semibold">{document.phone || "N/A"}</p>
              </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Date of Registration</h4>
                    <p className="text-base font-semibold">{document.dor ? format(new Date(document.dor), "dd MMM yyyy") : "N/A"}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Chasis Number</h4>
                    <p className="text-base font-mono font-semibold">{document.chasisNumber || "N/A"}</p>
                  </div>
                </div>

              <div className="border-t pt-4">
                <h4 className="text-sm font-semibold text-foreground mb-3">Expiry Dates</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-muted/30 p-3 rounded-lg">
                    <h5 className="text-xs font-medium text-muted-foreground mb-1">CF Expiry</h5>
                    <p className="text-sm font-semibold">{document.cf ? format(new Date(document.cf), "dd MMM yyyy") : "N/A"}</p>
                  </div>
                  <div className="bg-muted/30 p-3 rounded-lg">
                    <h5 className="text-xs font-medium text-muted-foreground mb-1">NP Expiry</h5>
                    <p className="text-sm font-semibold">{document.np ? format(new Date(document.np), "dd MMM yyyy") : "N/A"}</p>
                  </div>
                  <div className="bg-muted/30 p-3 rounded-lg">
                    <h5 className="text-xs font-medium text-muted-foreground mb-1">Auth Expiry</h5>
                    <p className="text-sm font-semibold">{document.auth ? format(new Date(document.auth), "dd MMM yyyy") : "N/A"}</p>
                  </div>
                </div>
              </div>

                <div className="border-t pt-4">
                  <h4 className="text-sm font-semibold text-foreground mb-3">Documents in Record</h4>
                  {document.dir && document.dir.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {document.dir.map((doc) => (
                        <span key={doc} className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                          {doc}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No documents recorded</p>
                  )}
                </div>

              <div className="border-t pt-4">
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Remarks</h4>
                <div className="bg-muted/30 p-3 rounded-lg">
                  <p className="text-sm whitespace-pre-wrap">{document.remarks || "No remarks added"}</p>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2">
            {isEditing ? (
              <>
                <Button 
                  variant="outline" 
                  onClick={handleCancelEdit}
                  disabled={isSaving}
                  className="gap-2"
                >
                  <X className="h-4 w-4" />
                  Cancel
                </Button>
                <Button 
                  onClick={handleSaveEdit}
                  disabled={isSaving}
                  className="gap-2"
                >
                  <Save className="h-4 w-4" />
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </>
            ) : (
              <>
                <Button 
                  variant="outline"
                  onClick={handleEditClick}
                  disabled={isDeleting}
                  className="gap-2"
                >
                  <Edit className="h-4 w-4" />
                  Edit
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={handleDeleteClick}
                  disabled={isDeleting}
                  className="gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  {isDeleting ? "Deleting..." : "Delete"}
                </Button>
                <Button onClick={() => onOpenChange(false)}>Close</Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the document for <strong>{document.owner}</strong> ({document.vehicleNumber}).
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <PinVerificationDialog
        open={showPinDialog}
        onOpenChange={setShowPinDialog}
        onVerified={handlePinVerified}
        action={pendingAction === "delete" ? "delete this document" : "edit this document"}
      />
    </>
  );
};

export default DocumentDetailsDialog;
