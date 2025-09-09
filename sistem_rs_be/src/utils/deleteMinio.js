import minioClient from "../core/config/minio.js";

export const deleteFromMinio = async (filePath) => {
  if (!filePath) return;

  try {
    const objectName = filePath.replace(/^\/?uploads\//, "");
    await minioClient.removeObject("uploads", objectName);

    console.log(`✅ File dihapus dari MinIO: ${objectName}`);
  } catch (err) {
    console.error(`⚠️ Gagal hapus file dari MinIO: ${filePath}`, err);
  }
};