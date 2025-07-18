'use client';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';

const TabelPembayaran = ({ data, loading, onEdit, onDelete }) => {
  const tanggalBodyTemplate = (row) => {
    const tgl = new Date(row.TANGGALBAYAR);
    return tgl.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const jumlahBodyTemplate = (row) => {
    return `Rp ${Number(row.JUMLAHBAYAR).toLocaleString('id-ID', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })}`;
  };

  const keteranganBodyTemplate = (row) => {
    return row.KETERANGAN && row.KETERANGAN.trim() !== '' ? row.KETERANGAN : '-';
  };

  return (
    <DataTable
      value={data}
      paginator
      rows={10}
      loading={loading}
      size="small"
      scrollable
    >
      <Column field="NOPEMBAYARAN" header="No Pembayaran" />
      <Column field="NOINVOICE" header="No Invoice" />
      <Column field="NIK" header="NIK" />
      <Column field="NAMAPASIEN" header="Nama Pasien" />
      <Column field="ASURANSI" header="Asuransi" />
      <Column field="METODEPEMBAYARAN" header="Metode" />
      <Column field="JUMLAHBAYAR" header="Jumlah Bayar" body={jumlahBodyTemplate} />
      <Column field="TANGGALBAYAR" header="Tanggal Bayar" body={tanggalBodyTemplate} />
      <Column field="KETERANGAN" header="Keterangan" body={keteranganBodyTemplate} />
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

export default TabelPembayaran;