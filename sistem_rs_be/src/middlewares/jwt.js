// sistem_rs_be\src\middlewares\jwt.js
import "dotenv/config";
import * as jose from "jose";
import { datetime, status } from "../utils/general.js";

export const verifyToken = async (req, res, next) => {
  try {
    const header = req.headers["authorization"];

    if (!header || !header.startsWith("Bearer ")) {
      return res.status(401).json({
        status: status.BAD_REQUEST,
        message: "Token tidak ditemukan",
        datetime: datetime(),
      });
    }

    const token = header.split(" ")[1];
    const secretKey = new TextEncoder().encode(process.env.JWT_SECRET);

    const { payload } = await jose.jwtVerify(token, secretKey, {
      algorithms: ["HS512"], 
    });
    console.log('✅ JWT Payload:', payload);

    req.user = payload;
    next();
  } catch (err) {
    console.error("JWT error:", err);

    if (err.name === "JWTExpired") {
      return res.status(401).json({
        status: status.GAGAL,
        message: "Token expired, silakan login kembali",
        datetime: datetime(),
      });
    }

    if (err.name === "JWTInvalid" || err.name === "JWSInvalid") {
      return res.status(401).json({
        status: status.GAGAL,
        message: "Token tidak valid",
        datetime: datetime(),
      });
    }

    return res.status(500).json({
      status: status.GAGAL,
      message: "Terjadi kesalahan pada server",
      datetime: datetime(),
    });
  }
};