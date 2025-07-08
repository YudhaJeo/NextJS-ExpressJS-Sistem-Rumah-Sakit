'use client';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';

const statusLabels = {
  BELUM_LUNAS: 'Belum Dibayar',
  LUNAS: 'Sudah Dibayar',
  BATAL: 'Batal',
};

const TabelInvoice = ({ data, loading, onEdit, onDelete }) => {
  const statusBodyTemplate = (row) => {
    return statusLabels[row.STATUS] || row.STATUS;
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
      <Column field="NOINVOICE" header="No Invoice" />
      <Column field="NAMAPASIEN" header="Nama Pasien" />
      <Column
        field="TANGGALINVOICE"
        header="Tgl Invoice"
        body={(row) => {
          const tgl = new Date(row.TANGGALINVOICE);
          return tgl.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          });
        }}
      />
      <Column
        field="TOTALTAGIHAN"
        header="Total Tagihan"
        body={(row) => `Rp ${row.TOTALTAGIHAN.toLocaleString('id-ID')}`}
      />
      <Column field="STATUS" header="Status" body={statusBodyTemplate} />
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

export default TabelInvoice;