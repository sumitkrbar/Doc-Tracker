import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, AlertCircle } from "lucide-react";
import { toast } from "react-hot-toast";
import api from "@/lib/api";

const PinVerificationDialog = ({ open, onOpenChange, onVerified, action = "this action" }) => {
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (pin.length !== 4) {
      toast.error("PIN must be exactly 4 digits");
      return;
    }
    
    if (!/^\d{4}$/.test(pin)) {
      toast.error("PIN must contain only numbers");
      return;
    }
    
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const { data } = await api.post("/admin/pin/verify",
        { pin },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (data.success) {
        toast.success("PIN verified!");
        setPin("");
        onVerified();
        onOpenChange(false);
      }
    } catch (error) {
      if (error.response?.status === 400 && error.response?.data?.message === "Admin PIN is not set") {
        toast.error("Please set up Admin PIN first from the Admin Access button");
      } else {
        toast.error(error.response?.data?.message || "Invalid PIN");
      }
    } finally {
      setLoading(false);
    }
  };
  
  const handleClose = (isOpen) => {
    if (!isOpen) {
      setPin("");
    }
    onOpenChange(isOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Admin PIN Required
          </DialogTitle>
          <DialogDescription>
            Enter your admin PIN to {action}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="adminPin">4-digit PIN</Label>
            <Input
              id="adminPin"
              type="password"
              placeholder="Enter admin PIN"
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
              disabled={loading}
              maxLength={4}
              autoFocus
            />
          </div>
          
          <div className="bg-muted/50 rounded-lg p-3 text-sm text-muted-foreground">
            <p className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
              <span>
                If you haven't set up an admin PIN yet, click the "Admin Access" button in the header.
              </span>
            </p>
          </div>
          
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleClose(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading || pin.length !== 4}>
              {loading ? "Verifying..." : "Verify PIN"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PinVerificationDialog;
