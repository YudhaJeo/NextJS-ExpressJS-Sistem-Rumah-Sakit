'use client';

import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { formatTanggal } from '@/types/dateformat';

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
      value={data}
      paginator
      rows={10}
      loading={loading}
      size="small"
      scrollable
    >
      <Column field="NAMADOKTER" header="Nama Dokter" />
      <Column field="NAMAPASIEN" header="Nama Pasien" />
      <Column field="NIK" header="NIK" />
      <Column
        field="TANGGAL"
        header="Tanggal Kunjungan"
        body={tanggalTemplate}
      />
      <Column
        field="NILAIKOMISI"
        header="Nilai Komisi"
        body={komisiTemplate}
      />
      <Column field="STATUS" header="Status" />
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