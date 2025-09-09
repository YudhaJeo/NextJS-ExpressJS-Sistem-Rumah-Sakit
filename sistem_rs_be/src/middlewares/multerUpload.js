import multer from "multer";

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedTypes = [".jpg", ".jpeg", ".png", ".pdf"];
  const ext = file.originalname.split(".").pop().toLowerCase();
  if (allowedTypes.includes("." + ext)) cb(null, true);
  else cb(new Error("Hanya file gambar (.jpg, .jpeg, .png) dan PDF yang diizinkan!"), false);
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});