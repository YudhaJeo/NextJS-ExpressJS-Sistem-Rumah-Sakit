import express from 'express';
import * as ProfileMobileController from '../controllers/profilemobileController.js';
import { upload } from "../middlewares/multerUpload.js";

const router = express.Router();

router.get('/', ProfileMobileController.getProfile);
router.put("/:id", upload.single("FOTOLOGO"), ProfileMobileController.updateProfile);

export default router;
