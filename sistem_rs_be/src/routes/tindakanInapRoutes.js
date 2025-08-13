import express from 'express';
import {
  getAllTindakanInap,
  getTindakanInapByRawatInapId,
  insertTindakanInap,
  deleteTindakanInap
} from '../controllers/tindakanInapController.js';

const router = express.Router();

router.get('/', getAllTindakanInap);
router.get('/rawat_inap/:idRawatInap', getTindakanInapByRawatInapId);
router.post('/', insertTindakanInap);
router.delete('/:id', deleteTindakanInap);

export default router;