import express from "express";
import * as BeritaController from "../controllers/beritaController.js";
import { upload } from "../middlewares/multerUpload.js";

const router = express.Router();

router.get("/", BeritaController.getAllBerita);
router.post("/", upload.single("file"), BeritaController.createBerita);
router.put("/:id", upload.single("file"), BeritaController.updateBerita);
router.delete("/:id", BeritaController.deleteBerita);

export default router;