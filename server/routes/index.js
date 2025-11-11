import express from 'express';
import { addDocController, getFilteredDocsController, getAllDocsController, getRecentDocsController , updateDocController, deleteDocController } from '../controllers/docController.js';
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
router.get('/get-doc/all', protect, getAllDocsController); 
router.get('/get-doc/recent', protect, getRecentDocsController);
router.post('/register', registerController);
router.post('/verify-otp', verifyOtpController);
router.post('/login', loginController);

router.get('/admin/pin/status', protect, checkAdminPinStatus);

router.post('/admin/pin/init', protect, initAdminPinSetup);

router.post('/admin/pin/verify-otp', protect, verifyAdminOtp);

router.post('/admin/pin/set', protect, setAdminPin);

router.post('/admin/pin/verify', protect, verifyAdminPin);

router.put('/doc/:docId', protect, updateDocController);
router.delete('/doc/:docId', protect, deleteDocController);

export default router;