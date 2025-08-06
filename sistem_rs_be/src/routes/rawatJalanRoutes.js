import express from 'express';
import * as RawatJalanController from '../controllers/rawatJalanController.js';

const router = express.Router();

router.get('/', RawatJalanController.getAllRawatJalan);
router.post('/', RawatJalanController.createRawatJalan);
router.put('/:id', RawatJalanController.updateRawatJalan);
router.delete('/:id', RawatJalanController.deleteRawatJalan);

export default router;