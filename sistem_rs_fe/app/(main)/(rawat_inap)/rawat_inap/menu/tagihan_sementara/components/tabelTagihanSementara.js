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

  return (
    <DataTable
      value={data}
      paginator
      rows={10}
      loading={loading}
      size="small"
      scrollable
    >
      <Column field="NAMALENGKAP" header="Pasien" />
      <Column field="NOMORBED" header="Bed" />
      <Column
        field="TOTAL_OBAT"
        header="Total Obat"
        body={(row) => formatRupiah(row.TOTAL_OBAT)}
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