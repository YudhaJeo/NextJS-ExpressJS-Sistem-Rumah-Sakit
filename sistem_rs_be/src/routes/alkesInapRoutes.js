import express from 'express';
import {
  getAllAlkesInap,
  getAlkesInapByRawatInapId,
  insertAlkesInap,
  deleteAlkesInap
} from '../controllers/alkesInapController.js';

const router = express.Router();

router.get('/', getAllAlkesInap);
router.get('/rawat_inap/:idRawatInap', getAlkesInapByRawatInapId);
router.post('/', insertAlkesInap);
router.delete('/:id', deleteAlkesInap);

export default router;