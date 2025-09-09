import minioClient from "../config/minio.js";

export const uploadToMinio = async (file, folder) => {
  return new Promise((resolve, reject) => {
    const ext = file.originalname.split(".").pop().toLowerCase();
    const fileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}.${ext}`;
    const objectName = `${folder}/${fileName}`; 

    minioClient.putObject("uploads", objectName, file.buffer, (err, etag) => {
      if (err) return reject(err);

      const cleanPath = `/uploads/${objectName}`.replace(/\\/g, "/");
      resolve(cleanPath);
    });
  });
};