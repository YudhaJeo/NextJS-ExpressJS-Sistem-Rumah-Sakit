import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";

export default function TabelProfile({ data, onEdit, loading }) {
  const MINIO_URL = process.env.NEXT_PUBLIC_MINIO_URL;

  const imageBodyTemplate = (rowData) => {
    if (!rowData.FOTOLOGO) {
      return (
        <div className="flex justify-content-center">
          <span className="text-500">Tidak ada gambar</span>
        </div>
      );
    }
  
    const cleanPath = rowData.FOTOLOGO.startsWith("/")
      ? rowData.FOTOLOGO.substring(1)
      : rowData.FOTOLOGO;
  
    const imageUrl = `${MINIO_URL}/${cleanPath}`;
  
    return (
      <div className="flex justify-content-center">
        <img
          src={imageUrl}
          alt="preview"
          className="w-4rem h-4rem object-cover border-round shadow-1"
        />
      </div>
    );
  };
  
  const textTemplate = (text) =>
    text && text.length > 100 ? text.slice(0, 100) + "..." : text || "-";

  const actionTemplate = (rowData) => (
    <div className="flex justify-center">
      <Button
        icon="pi pi-pencil"
        className="p-button-rounded p-button-sm p-button-info"
        onClick={() => onEdit(rowData)}
        tooltip="Edit Profil"
      />
    </div>
  );

  return (
    <DataTable
      value={data}
      loading={loading}
      responsiveLayout="scroll"
      className="p-datatable-sm"
      paginator={false}
      >
      <Column header="Aksi" body={actionTemplate} style={{ width: "100px", textAlign: "center" }} />
      <Column header="Logo" body={imageBodyTemplate} style={{ width: "100px", textAlign: "center" }} />
      <Column field="NAMARS" header="Nama Rumah Sakit" style={{ minWidth: "200px" }} />
      <Column field="ALAMAT" header="Alamat" body={(row) => textTemplate(row.ALAMAT)} style={{ minWidth: "250px" }} />
      <Column field="EMAIL" header="Email" style={{ minWidth: "200px" }} />
      <Column field="NOMORHOTLINE" header="Hotline" style={{ minWidth: "120px" }} />
      <Column field="NOTELPAMBULAN" header="Telp Ambulan" style={{ minWidth: "140px" }} />
      <Column field="NOAMBULANWA" header="Ambulan WA" style={{ minWidth: "140px" }} />
      <Column field="DESKRIPSI" header="Deskripsi" body={(row) => textTemplate(row.DESKRIPSI)} style={{ minWidth: "250px" }} />
      <Column field="VISI" header="Visi" body={(row) => textTemplate(row.VISI)} style={{ minWidth: "250px" }} />
      <Column field="MISI" header="Misi" body={(row) => textTemplate(row.MISI)} style={{ minWidth: "250px" }} />
    </DataTable>
  );
}
