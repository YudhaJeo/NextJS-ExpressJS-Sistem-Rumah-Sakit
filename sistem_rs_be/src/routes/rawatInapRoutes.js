import express from 'express';
import RawatInapController from '../controllers/rawatInapController.js';

const router = express.Router();

router.get('/', RawatInapController.getAll);
router.get('/:id', RawatInapController.getById);
router.post('/', RawatInapController.create);
router.put('/:id', RawatInapController.update);
router.delete('/:id', RawatInapController.delete);

export default router;
