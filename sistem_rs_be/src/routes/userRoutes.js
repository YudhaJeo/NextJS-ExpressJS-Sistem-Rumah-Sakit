import express from 'express';
import { getUser, updateUser } from '../controllers/userController.js';
import { verifyToken } from '../middlewares/jwt.js';

const router = express.Router();

router.get('/', verifyToken, getUser);
router.put('/', verifyToken, updateUser);

export default router;
