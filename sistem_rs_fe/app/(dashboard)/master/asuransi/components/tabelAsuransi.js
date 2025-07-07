// app/(dashboard)/master/asuransi/components/tabelAsuansi.js
'use client';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import React from 'react';

const TabelAsuransi = ({ data, loading, onEdit, onDelete }) => {
  return (
    <DataTable value={data} paginator rows={5} loading={loading} size="small">
      <Column field="IDASURANSI" header="ID" />
      <Column field="NAMAASURANSI" header="Nama Asuransi" />
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

export default TabelAsuransi;