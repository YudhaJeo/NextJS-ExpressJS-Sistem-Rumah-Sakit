import express from 'express';
import { getAllJenisBangsal,createJenisBangsal, updateJenisBangsal, deleteJenisBangsal } from '../controllers/jenisBangsalController.js';

const router = express.Router();

router.get('/', getAllJenisBangsal);
router.post('/', createJenisBangsal);
router.put('/:id', updateJenisBangsal);
router.delete('/:id', deleteJenisBangsal);

export default router;
