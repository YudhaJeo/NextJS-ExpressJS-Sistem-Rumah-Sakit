// src/routes/kamarRoutes.js
import express from 'express';
import {
    getAllKamar, 
    createKamar, 
    updateKamar, 
    deleteKamar
} from '../controllers/kamarController.js';

const router = express.Router();

router.get('/', getAllKamar);
router.post('/', createKamar);
router.put('/:id', updateKamar);
router.delete('/:id', deleteKamar);

export default router;