import express from 'express';
import * as kalenderController from '../controllers/kalenderController.js';
import { verifyToken } from '../middlewares/jwt.js';

const router = express.Router();

router.get('/', kalenderController.getAllKalender);
router.get('/:id', kalenderController.getByIdKalender);
router.post('/', kalenderController.createKalender);
router.put('/:id', kalenderController.updateKalender);
router.delete('/:id', kalenderController.removeKalender);

export default router;
