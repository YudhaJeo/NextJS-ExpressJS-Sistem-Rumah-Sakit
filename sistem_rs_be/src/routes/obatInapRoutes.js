import express from 'express';
import {
  getAllObatInap,
  insertObatInap,
  updateObatInap,
  deleteObatInap
} from '../controllers/obatInapController.js';

const router = express.Router();

router.get('/', getAllObatInap);
router.post('/', insertObatInap);
router.put('/:id', updateObatInap);
router.delete('/:id', deleteObatInap);

export default router;