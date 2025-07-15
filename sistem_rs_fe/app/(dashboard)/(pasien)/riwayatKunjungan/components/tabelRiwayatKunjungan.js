'use client';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

const TabelRiwayatKunjungan = ({ data, loading }) => {
  const formatTanggal = (tanggal) => {
    if (!tanggal) return "-";
    const tgl = new Date(tanggal);
    return tgl.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <DataTable value={data} paginator rows={10} loading={loading} stripedRows responsiveLayout="scroll">
      <Column field="NAMALENGKAP" header="Nama Pasien" />
      <Column field="NIK" header="NIK" />
      <Column
        field="TANGGALKUNJUNGAN"
        header="Tgl Kunjungan"
        body={(row) => formatTanggal(row.TANGGALKUNJUNGAN)}
      />
      <Column field="KELUHAN" header="Keluhan" />
      <Column field="POLI" header="Poli" />
      <Column field="STATUSKUNJUNGAN" header="Status Kunjungan" />
    </DataTable>
  );
};

export default TabelRiwayatKunjungan;