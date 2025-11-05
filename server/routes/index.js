import express from 'express';
import { addDocController, getFilteredDocsController, getAllDocsController, getRecentDocsController } from '../controllers/docController.js';
import { registerController, loginController } from '../controllers/userController.js';
import {protect} from '../middleware/auth.js';

const router = express.Router();

router.post('/add-doc', protect, addDocController);
router.get('/get-doc/filter', protect, getFilteredDocsController);
router.get('/get-doc/all', protect, getAllDocsController); // Reusing same controller for all docs
router.get('/get-doc/recent', protect, getRecentDocsController);
router.post('/register', registerController);
router.post('/login', loginController);

export default router;