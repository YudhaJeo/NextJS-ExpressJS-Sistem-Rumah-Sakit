// app\(dashboard)\(rawat_inap)\rawat_inap\master\tindakan_medis\components\tabelTindakan.js
'use client';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import React from 'react';

const MyTabel = ({ data, loading, onEdit, onDelete  }) => {
  return (
    <DataTable 
      value={data} 
      paginator rows={10} 
      loading={loading} 
      size="small">
      <Column field="IDTINDAKAN" header="ID" />
      <Column field="NAMATINDAKAN" header="Nama Tindakan" />
      <Column
        header="Harga"
        body={(rowData) =>
          new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
          }).format(rowData.HARGA || 0)
        }
      />
      <Column field="KATEGORI" header="Kategori" />
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

export default MyTabel;