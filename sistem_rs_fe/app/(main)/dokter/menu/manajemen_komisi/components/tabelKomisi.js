'use client';

import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { formatTanggal } from '@/types/dateformat';
import { Tag } from "primereact/tag";

const formatRupiah = (value) => {
  if (value == null) return '-';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(value);
};

export const TabelKomisiDokter = ({ data, loading, onEdit, onDelete }) => {
  const tanggalTemplate = (rowData) => formatTanggal(rowData.TANGGALKUNJUNGAN);
  const komisiTemplate = (rowData) => formatRupiah(rowData.NILAIKOMISI);

  return (
    <DataTable
      value={[...(data || [])].sort((a, b) => new Date(b.TANGGALKUNJUNGAN) - new Date(a.TANGGALKUNJUNGAN))}
      paginator
      rows={10} rowsPerPageOptions={[10, 25, 50, 75, 100, 250, 500, 1000]}
      loading={loading}
      size="small"
      scrollable
      sortField="TANGGALKUNJUNGAN"
      sortOrder={-1}  // -1 = descending
    >
      <Column field="NAMADOKTER" header="Nama Dokter" />
      <Column field="NAMAPASIEN" header="Nama Pasien" />
      <Column field="NIK" header="NIK" />
      <Column
        field="TANGGALKUNJUNGAN"
        header="Tanggal Kunjungan"
        body={tanggalTemplate}
        sortable
      />
      <Column
        field="NILAIKOMISI"
        header="Nilai Komisi"
        body={komisiTemplate}
        sortable
      />
      <Column
        header="Status"
        body={(row) => {
          const status = row.STATUS;
          const severity = () => {
            switch (status) {
              case "Sudah Dibayar":
                return "success";
              case "Belum Dibayar":
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
