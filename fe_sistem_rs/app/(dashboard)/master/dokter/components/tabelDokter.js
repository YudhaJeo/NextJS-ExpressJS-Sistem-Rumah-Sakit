"use client";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { formatTanggal } from "@/types/dateformat"; // pastikan path-nya sesuai

const TableDokter = ({ data, loading, onEdit, onDelete }) => {
  return (
    <DataTable
      value={data}
      paginator
      rows={10}
      loading={loading}
      size="small"
      scrollable
    >
      <Column field="IDDOKTER" header="ID Dokter" />
      <Column field="NAMADOKTER" header="Nama Dokter" />
      <Column field="NAMAPOLI" header="Nama Poli" />
       <Column
        field="JADWALPRAKTEK"
        header="Jadwal Praktek"
        body={(rowData) => formatTanggal(rowData.JADWALPRAKTEK)}
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

export default TableDokter;
