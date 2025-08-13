import express from 'express';
import {
  getAllObatInap,
  getObatInapByRawatInapId,
  insertObatInap,
  deleteObatInap
} from '../controllers/obatInapController.js';

const router = express.Router();

router.get('/', getAllObatInap);
router.get('/rawat_inap/:idRawatInap', getObatInapByRawatInapId);
router.post('/', insertObatInap);
router.delete('/:id', deleteObatInap);

export default router;