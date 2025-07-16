// src\routes\rawatInapRoute.js
import express from 'express';

import {
  getAllRawatInap,
  insertRawatInap,
  updateRawatInap,
  deleteRawatInap
} from '../controllers/rawatInapController.js';

const router = express.Router();

router.get('/', getAllRawatInap);
router.post('/', insertRawatInap);
router.put('/:id', updateRawatInap);
router.delete('/:id', deleteRawatInap);

export default router;
