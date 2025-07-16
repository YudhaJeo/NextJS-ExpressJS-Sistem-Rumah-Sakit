import express from 'express';
import { getAllTenagaMedis, getTenagaMedisById, createTenagaMedis, updateTenagaMedis, deleteTenagaMedis, } from '../controllers/tenagaMedisController.js';
import { upload } from '../middlewares/multer.js';

const router = express.Router();

router.get('/', getAllTenagaMedis);
router.get('/:id', getTenagaMedisById);

router.post(
  '/',
  upload.fields([
    { name: 'FOTOPROFIL', maxCount: 1 },
    { name: 'DOKUMENPENDUKUNG', maxCount: 1 },
  ]),
  createTenagaMedis
);

router.put(
  '/:id',
  upload.fields([
    { name: 'FOTOPROFIL', maxCount: 1 },
    { name: 'DOKUMENPENDUKUNG', maxCount: 1 },
  ]),
  updateTenagaMedis
);

router.delete('/:id', deleteTenagaMedis);

export default router;