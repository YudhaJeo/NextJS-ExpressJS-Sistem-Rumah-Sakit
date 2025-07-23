// app/(dashboard)/(rawat_inap)/riwayat_inap/components/tabelRiwayatInap.js
'use client';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import React from 'react';
import { useRouter } from 'next/navigation';

const TabelRiwayatInap = ({ data, loading }) => {
  const router = useRouter();

  const formatTanggal = (tanggal) => {
    if (!tanggal) return "-";
    const tgl = new Date(tanggal);
    return tgl.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const formatRupiah = (value) =>
    new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
    }).format(value || 0);

  const actionBody = (rowData) => (
    <Button
      label="Lihat"
      icon="pi pi-eye"
      className="p-button-sm"
      onClick={() => router.push(`/rawat_inap/invoice/${rowData.IDRAWATINAP}`)}
    />
  );

  return (
    <DataTable
      value={data}
      paginator
      rows={10}
      loading={loading}
      size="small"
      scrollable
    >
      <Column 
        field="NAMALENGKAP" 
        header="Pasien" 
      />
      <Column 
        field="NOMORBED" 
        header="Bed" 
      />
      <Column 
        field="TOTALOBAT" 
        header="Total Obat" 
        body={(row) => formatRupiah(row.TOTALOBAT)} 
      />
      <Column 
        field="TOTALTINDAKAN" 
        header="Total Tindakan"
        body={(row) => formatRupiah(row.TOTALTINDAKAN)} 
      />
      <Column 
        field="TOTALKAMAR" 
        header="Total Kamar" 
        body={(row) => formatRupiah(row.TOTALKAMAR)} 
      />
      <Column 
        field="TOTALBIAYA" 
        header="Tagihan Total" 
        body={(row) => formatRupiah(row.TOTALBIAYA)} 
      />
      <Column 
        field="TANGGALMASUK" 
        header="Tanggal Masuk" 
        body={(row) => formatTanggal(row.TANGGALMASUK)} 
      />
      <Column 
        field="TANGGALKELUAR" 
        header="Tanggal Keluar" 
        body={(row) => formatTanggal(row.TANGGALKELUAR)} 
      />
      <Column 
        header="Aksi" 
        body={actionBody} 
        style={{ width: '100px', textAlign: 'center' }} 
      />
    </DataTable>
  );
};

export default TabelRiwayatInap;
