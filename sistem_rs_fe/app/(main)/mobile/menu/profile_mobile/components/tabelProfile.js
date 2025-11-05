import { Button } from "primereact/button";

export default function TabelProfile({ data, onEdit, loading }) {
  if (loading) return <p>Loading...</p>;
  if (!data || data.length === 0) return <p>Tidak ada data profil.</p>;

  const MINIO_URL = process.env.NEXT_PUBLIC_MINIO_URL;
  const profile = data[0];
  const cleanPath = profile.FOTOLOGO?.startsWith("/")
    ? profile.FOTOLOGO.substring(1)
    : profile.FOTOLOGO;
  const imageUrl = profile.FOTOLOGO ? `${MINIO_URL}/${cleanPath}` : null;

  const textTemplate = (text) =>
    text && text.length > 100 ? text.slice(0, 100) + "..." : text || "-";

  return (
    <div className="p-4">
      <div className="grid">
        {/* Kolom kiri */}
        <div className="col-12 md:col-4">
          <div className="surface-card p-4 shadow-1 border-round">
            <div className="flex flex-column align-items-center">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt="Profil"
                  className="border-circle w-10rem h-10rem mb-4 object-cover shadow-1"
                />
              ) : (
                <div className="w-10rem h-10rem border-circle surface-100 flex align-items-center justify-content-center mb-4 shadow-1">
                  <span className="pi pi-user text-4xl text-500"></span>
                </div>
              )}
              <h3 className="mt-0 mb-2 text-900">{profile.NAMARS || "Nama RS"}</h3>
              <div className="flex flex-column gap-2 w-full mb-4">
                <div className="flex align-items-center gap-2">
                  <i className="pi pi-envelope text-600"></i>
                  <span className="text-600">{profile.EMAIL || "-"}</span>
                </div>
                <div className="flex align-items-center gap-2">
                  <i className="pi pi-phone text-600"></i>
                  <span className="text-600">{profile.NOMORHOTLINE || "-"}</span>
                </div>
              </div>
              <Button
                icon="pi pi-pencil"
                label="Edit Profil"
                className="w-full"
                outlined
                onClick={() => onEdit(profile)}
              />
            </div>
          </div>
        </div>

        {/* Kolom kanan */}
        <div className="col-12 md:col-8">
          <div className="surface-card p-4 shadow-1 border-round">
            <h4 className="text-xl mb-4 mt-0 font-semibold text-900">
              Informasi Rumah Sakit
            </h4>
            <div className="grid">
              <div className="col-12 md:col-6">
                <div className="mb-4">
                  <label className="block text-600 font-medium mb-2">Alamat</label>
                  <p className="mt-0 mb-0 text-900 line-height-3">
                    {textTemplate(profile.ALAMAT)}
                  </p>
                </div>

                <div className="mb-4">
                  <label className="block text-600 font-medium mb-2">Deskripsi</label>
                  <p className="mt-0 mb-0 text-900 line-height-3">
                    {textTemplate(profile.DESKRIPSI)}
                  </p>
                </div>

                <div className="mb-4">
                  <label className="block text-600 font-medium mb-2">
                    Telp Ambulan
                  </label>
                  <p className="mt-0 mb-0 text-900">
                    {profile.NOTELPAMBULAN || "-"}
                  </p>
                </div>

                <div className="mb-4">
                  <label className="block text-600 font-medium mb-2">
                    No. WA Ambulan
                  </label>
                  <p className="mt-0 mb-0 text-900">{profile.NOAMBULANWA || "-"}</p>
                </div>
              </div>

              <div className="col-12 md:col-6">
                <div className="mb-4">
                  <label className="block text-600 font-medium mb-2">Visi</label>
                  <p className="mt-0 mb-0 text-900 line-height-3">
                    {textTemplate(profile.VISI)}
                  </p>
                </div>

                <div className="mb-4">
                  <label className="block text-600 font-medium mb-2">Misi</label>
                  <p className="mt-0 mb-0 text-900 line-height-3">
                    {textTemplate(profile.MISI)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}