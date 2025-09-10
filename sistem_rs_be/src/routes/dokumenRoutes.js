import express from "express";
import * as DokumenController from "../controllers/dokumenController.js";
import { upload } from "../middlewares/multerUpload.js";

const router = express.Router();

router.get("/", DokumenController.getAllDokumen);
router.post("/", upload.single("file"), DokumenController.createDokumen);
router.put("/:id", upload.single("file"), DokumenController.updateDokumen);
router.delete("/:id", DokumenController.deleteDokumen);
router.get("/download-by-id/:id", DokumenController.downloadById);

export default router;