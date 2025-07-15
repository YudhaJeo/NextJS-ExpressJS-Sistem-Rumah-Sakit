// src/routes/tindakanRoutes.js
import express from 'express';

import {
    deleteTindakan,
    getAllTindakan,
    insertTindakan,
    updateTindakan,
} from '../controllers/tindakanController.js'

const router = express.Router();

router.get('/', getAllTindakan);
router.post('/', insertTindakan);
router.put('/:id', updateTindakan);
router.delete('/:id', deleteTindakan);

export default router;