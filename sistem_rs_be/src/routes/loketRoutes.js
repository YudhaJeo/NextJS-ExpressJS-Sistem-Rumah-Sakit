import express from 'express';
import * as LoketController from '../controllers/loketController.js';
import { verifyToken } from '../middlewares/jwt.js';

const router = express.Router();

router.get('/', LoketController.getAllLoket);
router.post('/', LoketController.createLoket);
router.put('/:id', LoketController.updateLoket);
router.delete('/:id', LoketController.deleteLoket);

export default router;