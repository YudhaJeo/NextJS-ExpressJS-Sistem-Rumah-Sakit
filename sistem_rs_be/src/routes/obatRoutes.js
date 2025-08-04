import express from 'express';
import { getAllObat, getObatById, insertObat, updateObat, deleteObat } from '../controllers/obatController.js';

const router = express.Router();

router.get('/', getAllObat);
router.get('/:id', getObatById);
router.post('/', insertObat);
router.put('/:id', updateObat);
router.delete('/:id', deleteObat);

export default router;