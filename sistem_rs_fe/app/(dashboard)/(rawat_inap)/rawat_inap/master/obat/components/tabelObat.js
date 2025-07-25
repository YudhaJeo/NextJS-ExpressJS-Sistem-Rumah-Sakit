// app\(dashboard)\(rawat_inap)\rawat_inap\master\obat\components\tabelObat.js
'use client';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import React from 'react';

const TabelObat = ({ data, loading, onEdit, onDelete  }) => {
  return (
    <DataTable 
      value={data} 
      paginator rows={10} 
      loading={loading} 
      size="small">
      <Column field="IDOBAT" header="ID" />
      <Column field="NAMAOBAT" header="Nama Obat" />
      <Column field="SATUAN" header="Satuan Obat" />
      <Column field="STOK" header="Stok" />
      <Column
        header="Harga/hari"
        body={(rowData) =>
          new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
          }).format(rowData.HARGA || 0)
        }
      />
      <Column field="KETERANGAN" header="Keterangan" />
      
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