'use client';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';

const TabelPenjualan = ({ data, loading, onProses }) => (
  <DataTable value={data} loading={loading} paginator rows={10}>
    <Column field="IDORDER" header="ID Order" />
    <Column field="NAMAPASIEN" header="Pasien" />
    <Column field="TANGGALPENGAMBILAN" header="Tgl Ambil" />
    <Column field="STATUS_PEMBAYARAN" header="Status Bayar" />
    <Column
      header="Aksi"
      body={(row) => (
        <Button
          label="Proses Penjualan"
          icon="pi pi-shopping-cart"
          size="small"
          onClick={() => onProses(row)}
        />
      )}
    />
  </DataTable>
);

export default TabelPenjualan;