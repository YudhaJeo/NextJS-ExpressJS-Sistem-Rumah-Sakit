import express from 'express';
import { getUser, updateUser } from '../controllers/profileController.js';
import { verifyToken } from '../middlewares/jwt.js';
import { upload } from '../middlewares/multerUpload.js';

const router = express.Router();

router.get('/', verifyToken, getUser);
router.put('/', verifyToken, upload.single('file'), updateUser);

export default router;