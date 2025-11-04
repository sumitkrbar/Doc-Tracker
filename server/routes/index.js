import express from 'express';
import { addDocController, getFilteredDocsController } from '../controllers/docController.js';
import { registerController, loginController } from '../controllers/userController.js';
import {protect} from '../middleware/auth.js';

const router = express.Router();

router.post('/add-doc', protect, addDocController);
router.get('/get-doc', protect, getFilteredDocsController);
router.post('/register', registerController);
router.post('/login', loginController);

export default router;