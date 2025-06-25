"use client";

import { Dokumen } from "@/types/dokumen";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";

interface Props {
  data: Dokumen[];
  loading: boolean;
  onDownload: (row: Dokumen) => void;
  onEdit: (row: Dokumen) => void;
  onDelete: (row: Dokumen) => void;
}

const TabelDokumen = ({
  data,
  loading,
  onDownload,
  onEdit,
  onDelete,
}: Props) => {
  return (
    <DataTable
      value={data}
      paginator
      rows={5}
      loading={loading}
      size="small"
      scrollable
    >
      <Column field="NAMALENGKAP" header="Nama Pasien" sortable />
      <Column field="NIK" header="NIK Pasien" sortable />
      <Column field="NAMAFILE" header="Nama File" sortable />
      <Column field="JENISDOKUMEN" header="Jenis Dokumen" sortable />
      <Column
        field="TANGGALUPLOAD"
        header="Tgl Upload"
        body={(row: Dokumen) => {
          const tanggal = new Date(row.TANGGALUPLOAD);
          return tanggal.toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          });
        }}
      />
      <Column
        header="Aksi"
        body={(row: Dokumen) => (
          <div className="flex gap-2">
            <Button
              icon="pi pi-download"
              size="small"
              severity="info"
              aria-label="Download"
              onClick={() => onDownload(row)} // ✅ ini perubahan utama
            />
            <Button
              icon="pi pi-pencil"
              size="small"
              severity="warning"
              onClick={() => onEdit(row)}
            />
            <Button
              icon="pi pi-trash"
              size="small"
              severity="danger"
              onClick={() => onDelete(row)}
            />
          </div>
        )}
        style={{ width: "200px" }}
      />
    </DataTable>
  );
};

export default TabelDokumen;