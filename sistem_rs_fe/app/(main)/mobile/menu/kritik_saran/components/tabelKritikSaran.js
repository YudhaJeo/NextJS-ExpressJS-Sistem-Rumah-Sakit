"use client";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Tag } from "primereact/tag";

const jenisSeverity = {
  pelayanan: "success",
  fasilitas: "info",
  dokter: "warning",
  perawat: "primary",
  lainnya: "danger",
};

export default function TabelKritikSaran({ data, loading }) {
  const jenisBody = (rowData) => {
    const jenis = (rowData.JENIS || "").toLowerCase(); 
    const severity = jenisSeverity[jenis] || "secondary";

    const labelJenis = jenis.charAt(0).toUpperCase() + jenis.slice(1);

    return <Tag value={labelJenis} severity={severity} />;
  };

  const tanggalBody = (row) =>
    new Date(row.CREATED_AT).toLocaleString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <DataTable
      value={data}
      loading={loading}
      paginator
      rows={10}
      rowsPerPageOptions={[10, 25, 50, 75, 100, 250, 500, 1000]}
      responsiveLayout="scroll"
    >
      <Column field="NIK" header="NIK" />
      <Column field="JENIS" header="Jenis" body={jenisBody} />
      <Column field="PESAN" header="Pesan" />
      <Column field="CREATED_AT" header="Tanggal" body={tanggalBody} />
    </DataTable>
  );
}
