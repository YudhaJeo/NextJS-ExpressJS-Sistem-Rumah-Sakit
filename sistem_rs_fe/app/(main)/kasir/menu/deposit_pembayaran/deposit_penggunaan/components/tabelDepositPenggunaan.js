'use client';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';

const TabelDepositPenggunaan = ({ data, loading, onEdit, onDelete }) => {
  const jumlahPemakaianBodyTemplate = (row) =>
    `Rp ${Number(row.JUMLAH_PEMAKAIAN).toLocaleString('id-ID', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })}`;

  const tanggalPemakaianBodyTemplate = (row) => {
    const date = new Date(row.TANGGALPEMAKAIAN);
    return date.toLocaleString('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <DataTable
      value={data}
      paginator
      rows={10} rowsPerPageOptions={[10, 25, 50, 75, 100, 250, 500, 1000]}
      loading={loading}
      size="small"
      scrollable
      scrollHeight="400px"
    >
      <Column field="NODEPOSIT" header="No Deposit" />
      <Column field="NOINVOICE" header="No Invoice" />
      <Column field="NIK" header="NIK" />
      <Column field="NAMAPASIEN" header="Nama" />
      <Column field="TANGGALPEMAKAIAN" header="Tanggal Pemakaian" body={tanggalPemakaianBodyTemplate} />
      <Column field="JUMLAH_PEMAKAIAN" header="Jumlah Pemakaian" body={jumlahPemakaianBodyTemplate} />
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
        style={{ textAlign: 'center', width: '8rem' }}
      />
    </DataTable>
  );
};

export default TabelDepositPenggunaan;