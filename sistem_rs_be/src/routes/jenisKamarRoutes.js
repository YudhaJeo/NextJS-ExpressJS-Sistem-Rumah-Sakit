// src/routes/jenisKamarRoutes.js
import express from 'express';
import { 
    getAllJenisKamar,
    createJenisKamar, 
    updateJenisKamar, 
    deleteJenisKamar 
} from '../controllers/jenisKamarController.js';

const router = express.Router();

router.get('/', getAllJenisKamar);
router.post('/', createJenisKamar);
router.put('/:id', updateJenisKamar);
router.delete('/:id', deleteJenisKamar);

export default router;