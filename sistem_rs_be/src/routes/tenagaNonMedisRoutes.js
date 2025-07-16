import express from 'express';
import { getAllTenagaNonMedis, getTenagaNonMedisById, createTenagaNonMedis, updateTenagaNonMedis, deleteTenagaNonMedis, } from '../controllers/tenagaNonMedisController.js';
import { upload } from '../middlewares/multer.js';

const router = express.Router();

router.get('/', getAllTenagaNonMedis);
router.get('/:id', getTenagaNonMedisById);  

router.post(
  '/',
  upload.fields([
    { name: 'FOTOPROFIL', maxCount: 1 },
    { name: 'DOKUMENPENDUKUNG', maxCount: 1 },
  ]),
  createTenagaNonMedis
);

router.put(
  '/:id',
  upload.fields([
    { name: 'FOTOPROFIL', maxCount: 1 },
    { name: 'DOKUMENPENDUKUNG', maxCount: 1 },
  ]),
  updateTenagaNonMedis
);

router.delete('/:id', deleteTenagaNonMedis);

export default router;