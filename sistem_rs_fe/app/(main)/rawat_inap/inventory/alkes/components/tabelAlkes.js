'use client';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';

const TabelAlkes = ({ data, loading, onEdit, onDelete }) => {
  return (
    <DataTable
      value={data}
      paginator rows={10}
      loading={loading}
      size="small">
      <Column field="IDALKES" header="ID" />
      <Column field="KODEALKES" header="Kode Alkes" />
      <Column field="NAMAALKES" header="Nama Alkes" />
      <Column field="MERKALKES" header="Merek" />
      <Column field="JENISALKES" header="Jenis Alkes" />
      <Column field="STOK" header="Stok" />
      <Column
        header="Harga Beli"
        body={(rowData) =>
          new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
          }).format(rowData.HARGABELI || 0)
        }
      />

      <Column
        header="Harga Jual"
        body={(rowData) =>
          new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
          }).format(rowData.HARGAJUAL || 0)
        }
      />
      <Column field="LOKASI" header="Lokasi" />
      <Column field="DESKRIPSI" header="Deskripsi" />

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
        style={{ width: '150px' }}
      />
    </DataTable>
  );
};

export default TabelAlkes;