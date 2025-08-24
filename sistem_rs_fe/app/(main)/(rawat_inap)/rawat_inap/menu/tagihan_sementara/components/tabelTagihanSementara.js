'use client';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import React from 'react';

const TabelTagihanSementara = ({ data, loading }) => {
  const formatRupiah = (value) =>
    new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
    }).format(value || 0);
  
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
    <DataTable
      value={data}
      paginator
      rows={10}
      loading={loading}
      size="small"
      scrollable
      sortField="TANGGALMASUK" 
      sortOrder={-1}
    >
      <Column field="NAMALENGKAP" header="Pasien" />
      <Column field="NOMORBED" header="Bed" />
      <Column 
        field="TANGGALMASUK" 
        header="Tanggal Masuk"
        body={(row) => formatTanggal(row.TANGGALMASUK)} 
      />
      <Column
        field="TOTAL_OBAT"
        header="Total Obat"
        body={(row) => formatRupiah(row.TOTAL_OBAT)}
      />
      <Column
        field="TOTAL_ALKES"
        header="Total Alkes"
        body={(row) => formatRupiah(row.TOTAL_ALKES)}
      />
      <Column
        field="TOTAL_TINDAKAN"
        header="Total Tindakan"
        body={(row) => formatRupiah(row.TOTAL_TINDAKAN)}
      />
      <Column
        field="TOTALKAMAR"
        header="Total Kamar"
        body={(row) => formatRupiah(row.TOTALKAMAR)}
      />
      <Column
        field="TOTAL_SEMENTARA"
        header="Tagihan Sementara"
        body={(row) => formatRupiah(row.TOTAL_SEMENTARA)}
      />
    </DataTable>
  );
};

export default TabelTagihanSementara;