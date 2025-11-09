import express from 'express';
import { addDocController, getFilteredDocsController, getAllDocsController, getRecentDocsController } from '../controllers/docController.js';
import { registerController,verifyOtpController ,loginController } from '../controllers/userController.js';
import { 
  checkAdminPinStatus,
  initAdminPinSetup,
  verifyAdminOtp,
  setAdminPin,
  verifyAdminPin
} from '../controllers/adminPinController.js';
import {protect} from '../middleware/auth.js';

const router = express.Router();

router.post('/add-doc', protect, addDocController);
router.get('/get-doc/filter', protect, getFilteredDocsController);
router.get('/get-doc/all', protect, getAllDocsController); // Reusing same controller for all docs
router.get('/get-doc/recent', protect, getRecentDocsController);
router.post('/register', registerController);
router.post('/verify-otp', verifyOtpController);
router.post('/login', loginController);

router.get('/admin/pin/status', protect, checkAdminPinStatus);

// 2) Start pin setup/reset: verify password & send OTP to owner
router.post('/admin/pin/init', protect, initAdminPinSetup);

// 3) Verify OTP that owner received
router.post('/admin/pin/verify-otp', protect, verifyAdminOtp);

// 4) Set / reset the PIN after OTP is correct
router.post('/admin/pin/set', protect, setAdminPin);

// 5) When performing Edit/Delete -> verify PIN
router.post('/admin/pin/verify', protect, verifyAdminPin);

export default router;