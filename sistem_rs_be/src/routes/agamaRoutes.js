import express from 'express';
import { getAllAgama, createAgama, updateAgama, deleteAgama } from '../controllers/agamaController.js';

const router = express.Router();

router.get('/', getAllAgama);
router.post('/', createAgama);
router.put('/:id', updateAgama);
router.delete('/:id', deleteAgama);

export default router;
