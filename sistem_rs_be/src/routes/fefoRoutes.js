import express from 'express';
import * as FefoController from '../controllers/fefoController.js';

const router = express.Router();

router.get('/', FefoController.index);
router.put('/:id', FefoController.updateStok);
router.delete('/:id', FefoController.destroy);

export default router;