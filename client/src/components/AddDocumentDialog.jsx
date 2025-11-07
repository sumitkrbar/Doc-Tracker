import { useState } from "react";
import { useDocuments } from "@/contexts/DocumentContext";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "react-hot-toast";
const AddDocumentDialog = ({ open, onOpenChange }) => {
  const { addDocument } = useDocuments();

  const [formData, setFormData] = useState({
    owner: "",
    phone: "",
    vehicleNumber: "",
    cf: undefined,
    np: undefined,
    auth: undefined,
    remarks: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    console.log("add button clicked");

    e.preventDefault();

    if (!formData.owner || !formData.vehicleNumber) {
      toast.error("Owner and Vehicle Number are required.");
      return;
    }
    console.log("before addDocument");

    setIsSubmitting(true);
    try {
      await addDocument({
        owner: formData.owner,
        phone: formData.phone ? Number(formData.phone) : undefined,
        vehicleNumber: formData.vehicleNumber,
        cf: formData.cf,
        np: formData.np,
        auth: formData.auth,
        remarks: formData.remarks,
      });

      toast.success("Document added — the document has been successfully added to the system.");

      setFormData({
        owner: "",
        phone: "",
        vehicleNumber: "",
        cf: undefined,
        np: undefined,
        auth: undefined,
        remarks: "",
      });

      onOpenChange(false);
    } catch (error) {
      const message = error?.response?.data?.message || error?.message || "Failed to add document";
      toast.error(message);
      console.error("Add document failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Document</DialogTitle>
          <DialogDescription>
            Enter the vehicle documentation details below.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="owner">Owner *</Label>
                <Input
                  id="owner"
                  value={formData.owner}
                  onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
                  placeholder="Owner name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="Phone number"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="vehicleNumber">Vehicle Number *</Label>
              <Input
                id="vehicleNumber"
                value={formData.vehicleNumber}
                onChange={(e) => setFormData({ ...formData, vehicleNumber: e.target.value })}
                placeholder="ABC-1234"
                required
              />
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
                          !formData[field] && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        <span className="block whitespace-normal">{formData[field] ? format(formData[field], "PPP") : "Pick date"}</span>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={formData[field]}
                        onSelect={(date) => setFormData({ ...formData, [field]: date })}
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
              <Label htmlFor="remarks">Remarks</Label>
              <Textarea
                id="remarks"
                value={formData.remarks}
                onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                placeholder="Additional notes..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add Document"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddDocumentDialog;
