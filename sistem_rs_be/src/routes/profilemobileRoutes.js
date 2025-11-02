import express from 'express';
import { getProfile, updateProfile } from '../controllers/profilemobileController.js';

const router = express.Router();

router.get('/', getProfile);
router.put('/', updateProfile);

export default router;
