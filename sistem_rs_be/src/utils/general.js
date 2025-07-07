import path from "path";
import { fileURLToPath } from "url";
import multer from "multer";

// for custom helper function globally

const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);

export function datetime() {
  const now = new Date();
  const datetime =
    now.getFullYear() +
    String(now.getMonth() + 1).padStart(2, "0") +
    String(now.getDate()).padStart(2, "0") +
    String(now.getHours()).padStart(2, "0") +
    String(now.getMinutes()).padStart(2, "0") +
    String(now.getSeconds()).padStart(2, "0");

  return datetime;
}

export const status = {
  SUKSES: "00",
  GAGAL: "01",
  PENDING: "02",
  NOT_FOUND: "03",
  BAD_REQUEST: "99",
};

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 1 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image files are allowed!"), false);
    }
    cb(null, true);
  },
});

export const formatDate = () => {
  const date = new Date();
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
};
