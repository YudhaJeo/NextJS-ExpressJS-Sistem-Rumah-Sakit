"use client";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";
import { formatTanggal } from "@/types/dateformat";

const tanggalTemplate = (rowData) => {
  return formatTanggal(rowData.TANGGAL);
};

const TabelKartu = ({ data, loading, onEdit, onDelete }) => {
  return (
    <DataTable
      value={data}
      paginator
      rows={10}
      loading={loading}
      size="small"
      scrollable
    >
      <Column field="NAMAOBAT" header="Nama Obat"/>
      <Column field="NAMAALKES" header="Nama Alat Kesehatan"/>
      <Column
        field="TANGGAL"
        header="Tanggal"
        body={tanggalTemplate}
      />
      <Column field="JENISTRANSAKSI" header="Jenis Transaksi" />
      <Column field="JUMLAHOBAT" header="Jumlah Obat" />
      <Column field="JUMLAHALKES" header="Jumlah Alat Kesehatan" />
      <Column field="SISASTOK" header="Sisa Stok" />
      <Column field="KETERANGAN" header="Keterangan" />
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

export default TabelKartu;
