"use client";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";

const TabelRiwayatKunjungan = ({ data, loading }) => {

  const formatTanggal = (tanggal) => {
    if (!tanggal) return "-";
    const tgl = new Date(tanggal);
    return tgl.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const actionBody = (rowData) => (
    <div className="flex gap-2 justify-center">
      <a
        href={`/pasien/menu/laporan/riwayat_kunjungan/${rowData.NIK}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Button
          icon="pi pi-eye"
          className="p-button-sm"
          tooltip="Lihat Detail"
        />
      </a>
    </div>
  );

  return (
    <>
      <DataTable
        value={data}
        paginator
        rows={10}
        loading={loading}
        stripedRows
        size="small"
        scrollable
        emptyMessage="Belum ada data riwayat kunjungan."
      >
        <Column field="NOREKAMMEDIS" header="No Rekam Medis" />
        <Column field="NIK" header="NIK" />
        <Column field="NAMALENGKAP" header="Nama Pasien" />
        <Column
          field="TANGGAL"
          header="Terakhir Kunjungan"
          body={(r) => formatTanggal(r.TANGGAL)}
        />
        <Column
          header="Aksi"
          body={actionBody}
          style={{ width: "150px", textAlign: "center" }}
        />
      </DataTable>
    </>
  );
};

export default TabelRiwayatKunjungan;