import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Lock, Key, Mail, CheckCircle2, AlertCircle, Shield } from "lucide-react";
import { toast } from "react-hot-toast";
import api from "@/lib/api";

const AdminAccessDialog = ({ open, onOpenChange }) => {
  const [step, setStep] = useState("check"); // check | password | otp | pin | success
  const [isAdminPinSet, setIsAdminPinSet] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Form data
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  
  // Timer for OTP
  const [otpTimer, setOtpTimer] = useState(0);
  
  useEffect(() => {
    if (open) {
      checkAdminPinStatus();
    } else {
      // Reset state when dialog closes
      resetState();
    }
  }, [open]);
  
  useEffect(() => {
    if (otpTimer > 0) {
      const timer = setTimeout(() => setOtpTimer(otpTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [otpTimer]);
  
  const resetState = () => {
    setStep("check");
    setPassword("");
    setOtp("");
    setPin("");
    setConfirmPin("");
    setOtpTimer(0);
    setLoading(false);
  };
  
  const checkAdminPinStatus = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const { data } = await api.get("/admin/pin/status", {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setIsAdminPinSet(data.isAdminPinSet);
      setStep("password");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to check admin PIN status");
      onOpenChange(false);
    } finally {
      setLoading(false);
    }
  };
  
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!password.trim()) {
      toast.error("Please enter your password");
      return;
    }
    
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const { data } = await api.post("/admin/pin/init", 
        { password },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (data.success) {
        toast.success("OTP sent to admin email!");
        setOtpTimer(600); // 10 minutes
        setStep("otp");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };
  
  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) {
      toast.error("Please enter the 6-digit OTP");
      return;
    }
    
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const { data } = await api.post("/admin/pin/verify-otp",
        { otp },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (data.success) {
        toast.success("OTP verified successfully!");
        setStep("pin");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid or expired OTP");
    } finally {
      setLoading(false);
    }
  };
  
  const handlePinSubmit = async (e) => {
    e.preventDefault();
    
    if (pin.length !== 4 || confirmPin.length !== 4) {
      toast.error("PIN must be exactly 4 digits");
      return;
    }
    
    if (!/^\d{4}$/.test(pin)) {
      toast.error("PIN must contain only numbers");
      return;
    }
    
    if (pin !== confirmPin) {
      toast.error("PINs do not match");
      return;
    }
    
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const { data } = await api.post("/admin/pin/set",
        { pin },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (data.success) {
        toast.success("Admin PIN set successfully!");
        setStep("success");
        setTimeout(() => {
          onOpenChange(false);
        }, 2000);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to set PIN");
    } finally {
      setLoading(false);
    }
  };
  
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Shield className="h-6 w-6 text-primary" />
            {isAdminPinSet ? "Reset Admin PIN" : "Setup Admin PIN"}
          </DialogTitle>
          <DialogDescription>
            {isAdminPinSet 
              ? "Reset your admin PIN to edit or delete documents"
              : "Set up admin PIN to enable document editing and deletion"
            }
          </DialogDescription>
        </DialogHeader>
        
        {/* Loading state */}
        {step === "check" && loading && (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        )}
        
        {/* Step 1: Password Entry */}
        {step === "password" && (
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password" className="flex items-center gap-2">
                <Lock className="h-4 w-4" />
                Enter Your Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your account password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                autoFocus
              />
              <p className="text-sm text-muted-foreground">
                We need to verify your identity before sending the OTP to the admin.
              </p>
            </div>
            
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Verifying..." : "Continue"}
              </Button>
            </div>
          </form>
        )}
        
        {/* Step 2: OTP Entry */}
        {step === "otp" && (
          <form onSubmit={handleOtpSubmit} className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <Mail className="h-5 w-5" />
                <span className="text-sm">OTP sent to admin email</span>
              </div>
              
              <div className="space-y-2">
                <Label className="flex items-center justify-between">
                  <span>Enter 6-digit OTP</span>
                  {otpTimer > 0 && (
                    <span className="text-sm text-primary font-mono">
                      {formatTime(otpTimer)}
                    </span>
                  )}
                </Label>
                
                <div className="flex justify-center">
                  <InputOTP
                    maxLength={6}
                    value={otp}
                    onChange={setOtp}
                    disabled={loading}
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
              </div>
              
              <div className="bg-muted/50 rounded-lg p-3 text-sm text-muted-foreground">
                <p className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                  <span>
                    The OTP has been sent to the admin/owner email. Please contact the admin to get the OTP.
                  </span>
                </p>
              </div>
            </div>
            
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep("password")}
                disabled={loading}
              >
                Back
              </Button>
              <Button type="submit" disabled={loading || otp.length !== 6}>
                {loading ? "Verifying..." : "Verify OTP"}
              </Button>
            </div>
          </form>
        )}
        
        {/* Step 3: PIN Entry */}
        {step === "pin" && (
          <form onSubmit={handlePinSubmit} className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-2 text-green-600 dark:text-green-400">
                <CheckCircle2 className="h-5 w-5" />
                <span className="text-sm font-medium">OTP Verified</span>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="pin" className="flex items-center gap-2">
                  <Key className="h-4 w-4" />
                  Create 4-digit PIN
                </Label>
                <Input
                  id="pin"
                  type="password"
                  placeholder="Enter 4-digit PIN"
                  value={pin}
                  onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  disabled={loading}
                  maxLength={4}
                  autoFocus
                  className={pin.length === 4 && !/^\d{4}$/.test(pin) ? "border-red-500 focus-visible:ring-red-500" : ""}
                />
                {pin.length > 0 && pin.length < 4 && (
                  <p className="text-sm text-muted-foreground">
                    {4 - pin.length} digit{4 - pin.length !== 1 ? 's' : ''} remaining
                  </p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPin">Confirm PIN</Label>
                <Input
                  id="confirmPin"
                  type="password"
                  placeholder="Re-enter 4-digit PIN"
                  value={confirmPin}
                  onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  disabled={loading}
                  maxLength={4}
                  className={
                    confirmPin.length > 0 && pin !== confirmPin
                      ? "border-red-500 focus-visible:ring-red-500"
                      : confirmPin.length === 4 && pin === confirmPin
                      ? "border-green-500 focus-visible:ring-green-500"
                      : ""
                  }
                />
                {confirmPin.length > 0 && pin !== confirmPin && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    PINs do not match
                  </p>
                )}
                {confirmPin.length === 4 && pin === confirmPin && (
                  <p className="text-sm text-green-600 dark:text-green-400 flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    PINs match
                  </p>
                )}
              </div>
              
              <div className="bg-muted/50 rounded-lg p-3 text-sm text-muted-foreground">
                <p>This PIN will be required to edit or delete documents.</p>
              </div>
            </div>
            
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={loading || pin.length !== 4 || confirmPin.length !== 4 || pin !== confirmPin}
              >
                {loading ? "Setting PIN..." : "Set Admin PIN"}
              </Button>
            </div>
          </form>
        )}
        
        {/* Success state */}
        {step === "success" && (
          <div className="py-8 text-center space-y-4">
            <div className="flex justify-center">
              <div className="rounded-full bg-green-100 dark:bg-green-900/20 p-3">
                <CheckCircle2 className="h-12 w-12 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Admin PIN Set Successfully!</h3>
              <p className="text-sm text-muted-foreground mt-1">
                You can now edit and delete documents using this PIN.
              </p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AdminAccessDialog;
