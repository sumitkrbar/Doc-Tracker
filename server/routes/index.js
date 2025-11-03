import express from 'express';
import { addDocController } from '../controllers/addDocController.js';
import { registerController } from '../controllers/userController.js';
import { loginController } from '../controllers/userController.js';
const router = express.Router();

router.post('/add-doc', addDocController);
router.post('/register', registerController);
router.post('/login', loginController);

export default router;