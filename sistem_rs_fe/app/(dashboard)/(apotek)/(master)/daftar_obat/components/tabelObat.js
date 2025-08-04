'use client';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';

const TabelObat = ({ data, loading, onEdit, onDelete }) => {
  return (
    <DataTable
      value={data}
      paginator rows={10}
      loading={loading}
      size="small">
      <Column field="IDOBAT" header="ID" />
      <Column field="NAMAOBAT" header="Nama Obat" />
      <Column field="JENISOBAT" header="Jenis Obat" />
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
      <Column field="TGLKADALUARSA" header="Tgl Kadaluarsa" />
      <Column field="NAMASUPPLIER" header="Supplier" />

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

export default TabelObat;