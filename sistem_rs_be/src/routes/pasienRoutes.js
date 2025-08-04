import express from 'express';
import { getAllPasien,  createPasien, updatePasien, deletePasien } from '../controllers/pasienController.js';

const router = express.Router();

router.get('/', getAllPasien);
router.post('/', createPasien);
router.put('/:id', updatePasien);
router.delete('/:id', deletePasien);

export default router;