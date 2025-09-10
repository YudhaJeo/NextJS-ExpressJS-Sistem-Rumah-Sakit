import express from "express";
import * as RawatJalanController from "../controllers/rawatJalanController.js";
import * as TindakanJalanController from "../controllers/tindakanJalanController.js";
import { upload } from '../middlewares/multerUpload.js';

const router = express.Router();

router.get("/", RawatJalanController.getAllRawatJalan);
router.delete("/:id", RawatJalanController.deleteRawatJalan);
router.post('/', upload.single('FOTORESEP'), RawatJalanController.createRawatJalan);
router.put('/:id', upload.single('FOTORESEP'), RawatJalanController.updateRawatJalan);

router.get("/:id/tindakan", TindakanJalanController.getByRawatJalanId);
router.post("/:id/tindakan", TindakanJalanController.insertTindakanJalan);
router.put("/:id/tindakan/:tindakanId", TindakanJalanController.updateTindakanJalan);
router.delete("/:id/tindakan/:tindakanId", TindakanJalanController.deleteTindakanJalan);

export default router;