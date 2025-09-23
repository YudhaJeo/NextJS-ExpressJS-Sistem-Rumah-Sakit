import express from 'express';
import * as RoleController from '../controllers/roleController.js';

const router = express.Router();

router.get('/tenaga-medis', RoleController.getRolesTenagaMedis);
router.get('/tenaga-non-medis', RoleController.getRolesTenagaNonMedis);
router.get('/', RoleController.getRoles);
router.get('/:id', RoleController.getRole);

export default router;