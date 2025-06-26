//tabelReservasi
"use client";

import { Reservasi } from "../../../../../types/reservasi";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { formatTanggal, formatJam } from "@/types/dateformat";
import { Tag } from "primereact/tag";

interface Props {
  data: Reservasi[];
  loading: boolean;
  onEdit: (row: Reservasi) => void;
  onDelete: (row: Reservasi) => void;
}
const tanggalTemplate = (rowData: Reservasi) => {
  return formatTanggal(rowData.TANGGALRESERVASI);
};

// Format Jam
const jamTemplate = (rowData: Reservasi) => {
  return formatJam(rowData.JAMRESERVASI);
};

const TabelReservasiPasien = ({ data, loading, onEdit, onDelete }: Props) => {
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
      <Column field="POLI" header="Poli" />
      <Column field="NAMADOKTER" header="Nama Dokter" />
      <Column
        field="TANGGALRESERVASI"
        header="Tanggal Reservasi "
        body={tanggalTemplate}
      />
      <Column field="JAMRESERVASI" header="Jam Reservasi" body={jamTemplate} />
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

      <Column field="KETERANGAN" header="Keterangan" />
      <Column
        header="Aksi"
        body={(row: Reservasi) => (
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
