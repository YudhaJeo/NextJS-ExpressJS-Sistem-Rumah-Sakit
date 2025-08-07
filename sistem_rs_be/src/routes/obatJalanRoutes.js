import express from 'express';
import {
  getAllObatJalan,
  insertObatJalan,
  updateObatJalan,
  deleteObatJalan
} from '../controllers/obatJalanController.js';

const router = express.Router();

router.get('/', getAllObatJalan);
router.post('/', insertObatJalan);
router.put('/:id', updateObatJalan);
router.delete('/:id', deleteObatJalan);

export default router;