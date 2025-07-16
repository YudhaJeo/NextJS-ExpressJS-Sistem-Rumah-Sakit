import express from 'express';
import * as PoliController from '../controllers/poliController.js';

const router = express.Router();

router.get('/', PoliController.getAllPoli);
router.post('/', PoliController.createPoli);
router.put('/:id', PoliController.updatePoli);
router.delete('/:id', PoliController.deletePoli);

export default router;
