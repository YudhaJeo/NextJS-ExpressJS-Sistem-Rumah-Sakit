import express from "express";
import * as LaporanPembayaranController from "../controllers/laporanPembayaranController.js";

const router = express.Router();

router.get("/", LaporanPembayaranController.getLaporanPembayaran);

export default router;