import express from 'express';
import {
  getAllTindakanInap,
  insertTindakanInap,
  updateTindakanInap,
  deleteTindakanInap
} from '../controllers/tindakanInapController.js';

const router = express.Router();

router.get('/', getAllTindakanInap);
router.post('/', insertTindakanInap);
router.put('/:id', updateTindakanInap);
router.delete('/:id', deleteTindakanInap);

export default router;