"use client";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";
import { formatTanggal } from "@/types/dateformat";

const tanggalTemplate = (rowData) => {
  return formatTanggal(rowData.TANGGALRESERVASI);
};

const TabelReservasiPasien = ({ data, loading, onEdit, onDelete }) => {
  return (
    <DataTable
      value={data}
      paginator
      rows={10}
      loading={loading}
      size="small"
      scrollable
    >
      <Column field="NAMALENGKAP" header="Nama Pasien" />
      <Column field="NIK" header="NIK" />
      <Column
        field="TANGGALRESERVASI"
        header="Tanggal Reservasi"
        body={tanggalTemplate}
      />
      <Column field="NAMAPOLI" header="Poli" />
      <Column field="NAMADOKTER" header="Nama Dokter" />
      <Column field="JAMRESERVASI" header="Jam" />
      <Column field="KETERANGAN" header="Keluhan" />
      <Column
        header="Status"
        body={(row) => {
          const status = row.STATUS;
          const severity = () => {
            switch (status) {
              case "Menunggu":
                return "info";
              case "Dikonfirmasi":
                return "success";
              case "Dibatalkan":
                return "danger";
              default:
                return "info";
            }
          };

          return <Tag value={status} severity={severity()} />;
        }}
      />
      <Column
        header="Aksi"
        body={(row) => (
          <div className="flex gap-2">
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
      />
    </DataTable>
  );
};

export default TabelReservasiPasien;
