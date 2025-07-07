// src/middleware/jwt.js
import "dotenv/config";
import * as jose from "jose";
import { datetime, status } from "../utils/general.js";

export const verifyToken = async (req, res, next) => {
  try {
    const header = req.headers["authorization"];
    const token = header && header.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        status: status.BAD_REQUEST,
        message: "No token provided",
        datetime: datetime(),
      });
    }

    const secretKey = new TextEncoder().encode(process.env.JWT_SECRET);

    const { payload } = await jose.jwtVerify(token, secretKey, {
      algorithms: ["HS512"],
    });

    req.user = payload;
    next();
  } catch (err) {
    console.error(err);

    if (err.code === "ERR_JWT_EXPIRED") {
      return res.status(401).json({
        status: status.GAGAL,
        message: "Token expired, silahkan login kembali",
        datetime: datetime(),
      });
    }

    if (err.code === "ERR_JWS_INVALID") {
      return res.status(401).json({
        status: status.GAGAL,
        message: "Invalid token",
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
