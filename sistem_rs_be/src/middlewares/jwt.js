import "dotenv/config";
import * as jose from "jose";
import { datetime, status } from "../utils/general.js";

export const verifyToken = async (req, res, next) => {
  try {
    const header = req.headers["authorization"];

    if (!header || !header.startsWith("Bearer ")) {
      return res.status(401).json({
        status: status.GAGAL,
        message: "Token tidak valid",
        datetime: datetime(),
      });
    }

    const token = header.split(" ")[1];
    const secretKey = new TextEncoder().encode(process.env.JWT_SECRET);

    const { payload } = await jose.jwtVerify(token, secretKey, {
      algorithms: ["HS512"],
    });

    req.user = payload;
    next();
  } catch (err) {
    console.error("JWT error:", err);

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

  //   const token = await generateToken({
  //   id: user.ID,
  //   role: user.ROLE,
  //   email: user.EMAIL
  // });

};