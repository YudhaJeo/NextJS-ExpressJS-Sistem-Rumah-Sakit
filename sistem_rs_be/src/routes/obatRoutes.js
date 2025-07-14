// src/routes/obatRoutes.js
import express from 'express';

import {
    getAllObat,
} from '../controllers/obatController.js'

const router = express.Router();

router.get('/', getAllObat);

export default router;