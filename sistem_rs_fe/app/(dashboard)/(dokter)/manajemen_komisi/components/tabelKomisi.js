"use client";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { formatTanggal } from "@/types/dateformat";

const layananTemplate = (rowData) => {
  return formatTanggal(rowData.TANGGAL_LAYANAN);
};

const pembayaranTemplate = (rowData) => {
  return formatTanggal(rowData.TANGGAL_PEMBAYARAN);
};

const formatRupiah = (value) => {
  if (value == null) return "-";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
};

const formatPersentase = (value) => {
  if (value == null) return "-";
  return `${value}%`;
};

const biayaTemplate = (rowData) => formatRupiah(rowData.BIAYA_LAYANAN);
const komisiTemplate = (rowData) => formatRupiah(rowData.NILAI_KOMISI);
const persentaseTemplate = (rowData) => formatPersentase(rowData.PERSENTASE_KOMISI);

const TabelKomisiDokter = ({ data, loading, onEdit, onDelete }) => {
  return (
    <DataTable
      value={data}
      paginator
      rows={10}
      loading={loading}
      size="small"
      scrollable
    >
      <Column field="NAMADOKTER" header="Nama Dokter" />
      <Column
        field="TANGGAL_LAYANAN"
        header="Tanggal Layanan"
        body={layananTemplate}
      />
      <Column field="NAMA_LAYANAN" header="Nama Layanan" />
      <Column
        field="BIAYA_LAYANAN"
        header="Biaya Layanan"
        body={biayaTemplate}
      />
      <Column
        field="PERSENTASE_KOMISI"
        header="Persentase"
        body={persentaseTemplate}
      />
      <Column
        field="NILAI_KOMISI"
        header="Nilai Komisi"
        body={komisiTemplate}
      />
      <Column field="STATUS" header="Status" />
      <Column
        field="TANGGAL_PEMBAYARAN"
        header="Tanggal Pembayaran"
        body={pembayaranTemplate}
      />
      <Column field="KETERANGAN" header="Keluhan" />
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

export default TabelKomisiDokter;
