import express from 'express';
import * as RoleController from '../controllers/roleController.js';

const router = express.Router();

router.get('/tenaga-medis', RoleController.getRolesTenagaMedis);
router.get('/tenaga-non-medis', RoleController.getRolesTenagaNonMedis);
router.get('/', RoleController.getRoles);
router.get('/:id', RoleController.getRole);
router.post('/', RoleController.create);
router.put('/:id', RoleController.update);
router.delete('/:id', RoleController.remove);

export default router;
