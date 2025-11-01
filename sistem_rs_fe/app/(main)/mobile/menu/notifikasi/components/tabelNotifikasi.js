'use client';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Tag } from 'primereact/tag';

const formatTanggal = (isoString) => {
  if (!isoString) return '-';
  const date = new Date(isoString);
  return date.toLocaleString('id-ID', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

const tanggalBody = (rowData) => formatTanggal(rowData.TANGGALRESERVASI);

const statusBody = (rowData) => {
  const status = rowData.STATUS;
  return (
    <Tag
      value={status ? 'Sudah Dibaca' : 'Belum Dibaca'}
      severity={status ? 'success' : 'danger'}
    />
  );
};

const TabelNotifikasi = ({ data, loading }) => {
  return (
    <DataTable
      value={data}
      paginator
      rows={100}
      rowsPerPageOptions={[10, 25, 50, 75, 100, 250, 500, 1000]}
      loading={loading}
      size="small"
      stripedRows
      sortField="CREATED_AT" 
      sortOrder={-1}
    >
      <Column field="IDNOTIFIKASI" header="ID" />
      <Column field="NIK" header="NIK" />
      <Column field="NAMAPASIEN" header="Pasien" />
      <Column field="TANGGALRESERVASI" header="Tanggal Reservasi" body={tanggalBody} />
      <Column field="NAMAPOLI" header="Nama Poli" />
      <Column field="NAMADOKTER" header="Nama Dokter" />
      <Column field="JUDUL" header="Judul" />
      <Column field="PESAN" header="Pesan" />
      <Column field="STATUS" header="Status" body={statusBody} />
    </DataTable>
  );
};

export default TabelNotifikasi;
