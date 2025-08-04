"use client";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";

const TabelDokumen = ({ data, loading, onDownload, }) => {
  return (
    <DataTable
      value={data}
      paginator
      rows={10}
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
        body={(row) => {
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
        body={(row) => (
          <div className="flex gap-2">
            <Button
              icon="pi pi-download"
              size="small"
              severity="info"
              aria-label="Download"
              onClick={() => onDownload(row)}
            />
          </div>
        )}
      />
    </DataTable>
  );
};

export default TabelDokumen;
