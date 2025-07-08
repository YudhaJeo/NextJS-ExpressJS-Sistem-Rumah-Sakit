// app/(dashboard)/master/asuransi/components/tabelAgama.js
'use client';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import React from 'react';

const TabelJenis = ({ data, loading, onEdit, onDelete  }) => {
  return (
    <DataTable 
      value={data} 
      paginator rows={5} 
      loading={loading} 
      size="small"
    >
      <Column field="IDJENISKAMAR" header="ID" />
      <Column field="NAMAJENIS" header="Jenis Kamar" />
      
      {/* Format rupiah */}
      <Column
        header="Harga/hari"
        body={(rowData) =>
          new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
          }).format(rowData.HARGA_PER_HARI || 0)
        }
      />

      <Column field="FASILITAS" header="Fasilitas" />
      
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

export default TabelJenis;