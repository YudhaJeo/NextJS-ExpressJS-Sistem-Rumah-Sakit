import express from 'express';
import * as komisiController from '../controllers/komisidokterController.js';
import { verifyToken } from '../middlewares/jwt.js';

const router = express.Router();

router.get('/', komisiController.getAllKomisi);
router.get('/:id', komisiController.getByIdKomisi);
router.post('/', komisiController.createKomisi);
router.put('/:id', komisiController.updateKomisi);
router.delete('/:id', komisiController.removeKomisi);

export default router;
