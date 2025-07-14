// src/routes/obatRoutes.js
import express from 'express';

import {
    deleteObat,
    getAllObat,
    insertObat,
    updateObat,
} from '../controllers/obatController.js'

const router = express.Router();

router.get('/', getAllObat);
router.post('/', insertObat);
router.put('/:id', updateObat);
router.delete('/:id', deleteObat);

export default router;