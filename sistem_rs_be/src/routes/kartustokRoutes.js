import express from 'express';
import * as kartustokController from '../controllers/kartustokController.js';

const router = express.Router();

router.get('/', kartustokController.getAll);
router.get('/:id', kartustokController.getById);
router.post('/', kartustokController.create);
router.put('/:id', kartustokController.update);
router.delete('/:id', kartustokController.remove);

export default router;
