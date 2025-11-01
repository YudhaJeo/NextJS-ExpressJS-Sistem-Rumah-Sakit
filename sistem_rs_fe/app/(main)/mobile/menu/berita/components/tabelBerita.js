import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

export default function TabelBerita({ data, onEdit, onDelete, loading }) {
  const MINIO_URL = process.env.NEXT_PUBLIC_MINIO_URL;

  const imageBodyTemplate = (rowData) => {
    if (!rowData.PRATINJAU) {
      return (
        <div className="flex justify-content-center">
          <span className="text-500">Tidak ada gambar</span>
        </div>
      );
    }
  
    // Hilangkan awalan slash biar gak double slash nanti
    const cleanPath = rowData.PRATINJAU.startsWith("/")
      ? rowData.PRATINJAU.substring(1)
      : rowData.PRATINJAU;
  
    // Gunakan MINIO_URL sebagai base
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
  
  const actionBodyTemplate = (rowData) => (
    <div className="flex gap-2 justify-content-center">
      <button className="p-button p-button-sm" onClick={() => onEdit(rowData)}>
        <i className="pi pi-pencil"></i>
      </button>
      <button
        className="p-button p-button-danger p-button-sm"
        onClick={() => onDelete(rowData)}
      >
        <i className="pi pi-trash"></i>
      </button>
    </div>
  );

  return (
    <DataTable
      value={data}
      loading={loading}
      paginator
      rows={10}
      rowsPerPageOptions={[10, 25, 50, 75, 100, 250, 500, 1000]}
      responsiveLayout="scroll"
    >
      <Column field="IDBERITA" header="ID" style={{ width: "70px" }} />
      <Column field="JUDUL" header="Judul" />
      <Column field="DESKRIPSISINGKAT" header="Deskripsi Singkat" />
      <Column body={imageBodyTemplate} header="Pratinjau" style={{ width: "120px" }} />
      <Column field="URL" header="URL" />
      <Column
        field="CREATED_AT"
        header="Tgl Upload"
        body={(row) => {
          const tanggal = new Date(row.CREATED_AT);
          return tanggal.toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          });
        }}
      />
      <Column body={actionBodyTemplate} header="Aksi" style={{ width: "120px" }} />
    </DataTable>
  );
}
