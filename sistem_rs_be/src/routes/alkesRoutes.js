import express from 'express';
import {
  getAllAlkes,
  insertAlkes,
  updateAlkes,
  deleteAlkes,
} from '../controllers/alkesController.js';

const router = express.Router();

router.get('/', getAllAlkes);
router.post('/', insertAlkes);
router.put('/:id', updateAlkes);
router.delete('/:id', deleteAlkes);

export default router;